<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\EventType;
use Carbon\Carbon;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    // Funtion to fetch available slots based on event and date
    public function availableSlots(Request $request)
    {
        // Validate input
        $request->validate([
            'event_type_id' => 'required|exists:event_types,id',
            'date' => 'required|date|after_or_equal:today',
        ]);

        $eventTypeId = $request->event_type_id;
        $date = $request->date;
    
        // Fetch event type with host and their availabilities
        $eventType = EventType::with([
            'user.availabilities', // Load host's availability rules
            'bookings' => function($query) use ($date) {
                $query->whereDate('start_datetime', $date)
                      ->whereIn('status', ['scheduled', 'completed']); // Only count confirmed/pending bookings
            }
        ])->findOrFail($eventTypeId);
    
        $host = $eventType->user;
        $bookings = $eventType->bookings;
        $slotDuration = $eventType->duration;
    
        // Get day of week for the requested date
        $dayOfWeek = strtolower(Carbon::parse($date)->format('l')); // 'monday', 'tuesday', ...
    
        // Check if date is blocked
        $isDateBlocked = $host->availabilities()
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
        $availabilities = $host->availabilities()
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
                    'start' => $slotStart->format('H:i'),
                    'end' => $slotEnd->format('H:i'),
                    'start_datetime' => $slotStart->toIso8601String(),
                    'end_datetime' => $slotEnd->toIso8601String(),
                    'status' => $isBooked ? 'booked' : 'available',
                ];
    
                $current->addMinutes($slotDuration);
            }
        }
    
        // Sort slots by start time (in case multiple availability windows)
        usort($slots, function($a, $b) {
            return strcmp($a['start'], $b['start']);
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

    public function store(Request $request)
    {
        $request->validate([
            'event_type_id' => 'required|exists:event_types,id',
            'guest_name' => 'required|string',
            'guest_email' => 'required|email',
            'guest_phone' => 'nullable|string',
            'start_time' => 'required',
            'end_time' => 'required',
        ]);

        // Fetch event type to get duration
        $eventType = EventType::with('user')->findOrFail($request->event_type_id);
        $host = $eventType->user;

        $startDatetime = Carbon::parse($date . ' ' . $request->start_time);
        $endDatetime = Carbon::parse($date . ' ' . $request->end_time);
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
            $isDateBlocked = $host->availabilities()
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

        $hasAvailability = $host->availabilities()
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

    //Get all bookings for authenticated user (host)
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
