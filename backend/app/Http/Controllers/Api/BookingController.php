<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\EventType;
use Carbon\Carbon;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function availableSlots(Request $request)
    {
        // Validate input
        $request->validate([
            'event_type_id' => 'required|exists:event_types,id',
            'date' => 'required|date',
        ]);

        $eventTypeId = $request->event_type_id;
        $date = $request->date;

        // Fetch event type to get duration
        $eventType = EventType::with(['bookings' => function($query) use ($date) {
            $query->whereDate('start_datetime', $date);
        }])->findOrFail($eventTypeId);
        
        $bookings = $eventType->bookings;
        $slotDuration = $eventType->duration; // Use event type's duration

        // Get working hours from constants
        $startOfDay = Carbon::parse($date . config('constants.working_hours.start'));
        $endOfDay = Carbon::parse($date . config('constants.working_hours.end'));

        $slots = [];
        $current = $startOfDay->copy();

        // Check if slot END fits within working hours
        while ($current->copy()->addMinutes($slotDuration) <= $endOfDay) {
            $slotStart = $current->copy();
            $slotEnd = $current->copy()->addMinutes($slotDuration);
    
            // Check if slot is booked
            $isBooked = $bookings->contains(function($booking) use ($slotStart, $slotEnd) {
                return !($slotEnd <= $booking->start_datetime || $slotStart >= $booking->end_datetime);
            });
    
            $slots[] = [
                'start' => $slotStart->format('H:i'),
                'end' => $slotEnd->format('H:i'),
                'status' => $isBooked ? 'booked' : 'available',
            ];
    
            $current->addMinutes($slotDuration);
        }

        return response()->json($slots);
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

        try{
            // Fetch event type to get duration
            $eventType = EventType::findOrFail($request->event_type_id);

            $date = $request->date;
            $startDatetime = Carbon::parse($date . ' ' . $request->start_time);
            $endDatetime = Carbon::parse($date . ' ' . $request->end_time);

            // Validate duration matches event type
            // Cast both to integer to avoid type mismatch
            $requestedDuration = (int) $startDatetime->diffInMinutes($endDatetime);
            $eventDuration = (int) $eventType->duration;

            if ($requestedDuration !== $eventType->duration) {
                return response()->json([
                    'status' => false,
                    'message' => "Booking duration must be {$eventType->duration} minutes."
                ], 422);
            }

            // Check for overlapping booking using relationship
            $conflict = $eventType->bookings()
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
            ]);

            return response()->json([
                'status' => true,
                'message' => 'Booking confirmed!',
                'booking' => $booking
            ]);
        } catch (Throwable $e) {
            if (config('app.debug')) {
                return response()->json([
                    'error' => 'Unable to create booking',
                    'message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                    'trace' => $e->getTrace(),
                ], 500);
            }
            
            return response()->json([
                'error' => "Booking not created",
                'message' => $e->getMessage(),
            ],500);
        }
    }

}
