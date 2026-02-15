<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Booking;
use App\Models\EventType;
use Carbon\Carbon;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    /**
     * Fetch available slots based on username, event slug, and date
     * Route: GET /{username}/{slug}/available-slots?date=2026-02-20 
     */
    public function availableSlots(Request $request, $userSlug, $eventSlug)
    {
        $request->validate([
            'date' => 'required|date|after_or_equal:today',
        ]);

        $date = $request->date;
    
        // Find user by name
        $user = User::where('user_slug', $userSlug)->firstOrFail();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Host not found'
            ], 404);
        }

        // Find event type by slug for this user
        $eventType = EventType::where('user_id', $user->id)
            ->where('slug', $eventSlug)
            ->where('is_active', true)
            ->with([
                'bookings' => function($query) use ($date) {
                    $query->whereDate('start_datetime', $date)
                          ->whereIn('status', ['scheduled', 'completed']);
                }
            ])
            ->first();

        if (!$eventType) {
            return response()->json([
                'success' => false,
                'message' => 'Event type not found'
            ], 404);
        }
    
        $bookings = $eventType->bookings;
        $slotDuration = $eventType->duration;
    
        // Get day of week for the requested date
        $dayOfWeek = strtolower(Carbon::parse($date)->format('l')); // 'monday', 'tuesday', ...
    
        // Check if date is blocked
        $isDateBlocked = $user->availabilities()
            ->where('is_blocked', true)
            ->where('blocked_date', $date)
            ->exists();
    
        if ($isDateBlocked) {
            return response()->json([
                'message' => 'This date is not available',
                'slots' => []
            ]);
        }
    
        // Get availability rules for this day of week
        $availabilities = $user->availabilities()
            ->where('day_of_week', $dayOfWeek)
            ->where('is_active', true)
            ->where('is_blocked', false)
            ->where(function($query) use ($date) {
                // Either no blocked_date or blocked_date doesn't match requested date
                $query->whereNull('blocked_date')
                      ->orWhere('blocked_date', '!=', $date);
            })
            ->orderBy('start_time')
            ->get();
    
        if ($availabilities->isEmpty()) {
            return response()->json([
                'message' => 'No availability set for this day',
                'slots' => []
            ]);
        }
    
        // Generate slots based on availability windows
        $slots = [];
    
        foreach ($availabilities as $availability) {
            $windowStart = Carbon::parse($date . ' ' . $availability->start_time);
            $windowEnd = Carbon::parse($date . ' ' . $availability->end_time);
            
            $current = $windowStart->copy();
    
            // Generate slots within this availability window
            while ($current->copy()->addMinutes($slotDuration) <= $windowEnd) {
                $slotStart = $current->copy();
                $slotEnd = $current->copy()->addMinutes($slotDuration);
    
                // Check if slot overlaps with any existing booking
                $isBooked = $bookings->contains(function($booking) use ($slotStart, $slotEnd) {
                    // Slot is booked if there's any overlap
                    return !($slotEnd <= $booking->start_datetime || $slotStart >= $booking->end_datetime);
                });
    
                $slots[] = [
                    'start_datetime' => $slotStart->toIso8601String(),
                    'end_datetime' => $slotEnd->toIso8601String(),
                    'start_time' => $slotStart->format('H:i'),
                    'end_time' => $slotEnd->format('H:i'),
                    'status' => $isBooked ? 'booked' : 'available',
                ];
    
                $current->addMinutes($slotDuration);
            }
        }
    
        // Sort slots by start time (in case multiple availability windows)
        usort($slots, function($a, $b) {
            return strcmp($a['start_time'], $b['start_time']);
        });
    
        return response()->json([
            'date' => $date,
            'day_of_week' => $dayOfWeek,
            'event_type' => [
                'id' => $eventType->id,
                'name' => $eventType->name,
                'duration' => $eventType->duration
            ],
            'slots' => $slots
        ]);
    }

    /**
     * Create a new booking
     * Route: POST /{username}/{slug}/book
     */
    public function store(Request $request, $userSlug, $eventSlug)
    {
        $request->validate([
            'start_datetime' => 'required|date|after_or_equal:now',
            'end_datetime' => 'required|date|after:start_datetime',
            'guest_name' => 'required|string|max:255',
            'guest_email' => 'required|email|max:255',
            'guest_phone' => 'nullable|string|max:20',
        ]);

        // Find user by name
        $user = User::where('user_slug', $userSlug)->firstOrFail();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Host not found'
            ], 404);
        }

        // Find event type by slug
        $eventType = EventType::where('user_id', $user->id)
            ->where('slug', $eventSlug)
            ->where('is_active', true)
            ->first();

        if (!$eventType) {
            return response()->json([
                'success' => false,
                'message' => 'Event type not found'
            ], 404);
        }

        $startDatetime = Carbon::parse($request->start_datetime);
        $endDatetime = Carbon::parse($request->end_datetime);
        $date = $startDatetime->format('Y-m-d'); // Extract date for availability check

        // Validate duration matches event type
        $requestedDuration = (int) $startDatetime->diffInMinutes($endDatetime);
        $eventDuration = (int) $eventType->duration;

        if ($requestedDuration !== $eventType->duration) {
            return response()->json([
                'status' => false,
                'message' => "Booking duration must be {$eventType->duration} minutes."
            ], 422);
        }

        // Check if slot falls within host's availability
        $dayOfWeek = strtolower($startDatetime->format('l'));

        // Check if date is blocked
            $isDateBlocked = $user->availabilities()
            ->where('is_blocked', true)
            ->where('blocked_date', $date)
            ->exists();

        if ($isDateBlocked) {
            return response()->json([
                'status' => false,
                'message' => 'This date is not available for booking.'
            ], 422);
        }

        // Check if requested time falls within any availability window
        $startTime = $startDatetime->format('H:i');
        $endTime = $endDatetime->format('H:i');

        $hasAvailability = $user->availabilities()
            ->where('day_of_week', $dayOfWeek)
            ->where('is_active', true)
            ->where('is_blocked', false)
            ->where(function($query) use ($date) {
                $query->whereNull('blocked_date')
                    ->orWhere('blocked_date', '!=', $date);
            })
            ->where('start_time', '<=', $startTime)
            ->where('end_time', '>=', $endTime)
            ->exists();
        
        if (!$hasAvailability) {
            return response()->json([
                'status' => false,
                'message' => 'Selected time slot is outside available hours.'
            ], 422);
        }

        // Check for overlapping booking using relationship
        $conflict = $eventType->bookings()
            ->whereIn('status', ['scheduled', 'completed'])
            ->where(function($query) use ($startDatetime, $endDatetime) {
                $query->whereBetween('start_datetime', [$startDatetime, $endDatetime])
                    ->orWhereBetween('end_datetime', [$startDatetime, $endDatetime])
                    ->orWhere(function($q) use ($startDatetime, $endDatetime) {
                        $q->where('start_datetime', '<=', $startDatetime)
                            ->where('end_datetime', '>=', $endDatetime);
                    });
            })
            ->exists();

        if ($conflict) {
            return response()->json([
                'status' => false,
                'message' => 'Selected slot is already booked.'
            ], 409);
        }

        // Save booking if not conflict
        $booking = Booking::create([
            'event_type_id' => $eventType->id,
            'user_id' => $eventType->user_id,
            'guest_name' => $request->guest_name,
            'guest_email' => $request->guest_email,
            'guest_phone' => $request->guest_phone,
            'start_datetime' => $startDatetime,
            'end_datetime' => $endDatetime,
            'status' => 'scheduled',
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Booking confirmed!',
            'booking' => $booking
        ]);
    }

    // ------------------- PROTECTED METHODS (Host Only) -------------------
    // Get all bookings for authenticated user (host)
    public function index()
    {
        if (!auth()->id()) {
            return response()->json([
                'status' => false,
                'message' => 'User not authenticated'
            ], 401);
        }

        $bookings = Booking::where('user_id', auth()->id())
            ->with('eventType')
            ->orderBy('start_datetime', 'desc')
            ->get();

        return response()->json([
            'status' => true,
            'bookings' => $bookings
        ]);
    }

    //Cancel a booking (host only)
    public function destroy($id)
    {
        $booking = Booking::findOrFail($id);
        
        // Ensure only the host can cancel
        if ($booking->user_id !== auth()->id()) {
            return response()->json([
                'status' => false,
                'message' => 'Unauthorized to cancel this booking.'
            ], 403);
        }

        $booking->delete();

        return response()->json([
            'status' => true,
            'message' => 'Booking cancelled successfully!'
        ]);
    }

    //Update guest details
    public function updateGuestInfo(Request $request, $id)
    {
        // All fields are optional, but at least ONE must be provided
        $request->validate([
            'guest_name' => 'sometimes|required|string|max:255',    // optional, but if present must be valid
            'guest_email' => 'sometimes|required|email|max:255',
            'guest_phone' => 'nullable|string|max:20',
        ]);
    
        $booking = Booking::findOrFail($id);
    
        // Build update array with only provided fields
        $updateData = [];
        
        if ($request->has('guest_name')) {
            $updateData['guest_name'] = $request->guest_name;
        }
        
        if ($request->has('guest_email')) {
            $updateData['guest_email'] = $request->guest_email;
        }
        
        if ($request->has('guest_phone')) {
            $updateData['guest_phone'] = $request->guest_phone;
        }
    
        // Check if at least one field is being updated
        if (empty($updateData)) {
            return response()->json([
                'status' => false,
                'message' => 'No fields provided for update.'
            ], 422);
        }
    
        $booking->update($updateData);
    
        return response()->json([
            'status' => true,
            'message' => 'Guest information updated successfully!',
            'booking' => $booking->fresh() // Reload to get updated data
        ]);
    }

}
