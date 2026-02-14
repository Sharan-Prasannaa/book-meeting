<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Availability;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AvailabilityController extends Controller
{
    //Get all availabilities for the authenticated host
    public function index(Request $request)
    {
        $availabilities = Availability::where('user_id', $request->user()->id)
            ->orderBy('day_of_week')
            ->orderBy('start_time')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $availabilities
        ]);
    }

    // Store a new availability rule
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'day_of_week' => 'required|in:monday,tuesday,wednesday,thursday,friday,saturday,sunday',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Check for overlapping availability on the same day
        $overlap = Availability::where('user_id', $request->user()->id)
            ->where('day_of_week', $request->day_of_week)
            ->where('is_active', true)
            ->where(function ($query) use ($request) {
                $query->whereBetween('start_time', [$request->start_time, $request->end_time])
                    ->orWhereBetween('end_time', [$request->start_time, $request->end_time])
                    ->orWhere(function ($q) use ($request) {
                        $q->where('start_time', '<=', $request->start_time)
                          ->where('end_time', '>=', $request->end_time);
                    });
            })
            ->exists();

        if ($overlap) {
            return response()->json([
                'success' => false,
                'message' => 'This time overlaps with an existing availability'
            ], 409);
        }

        $availability = Availability::create([
            'user_id' => $request->user()->id,
            'day_of_week' => $request->day_of_week,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
            'is_active' => $request->is_active ?? true,
            'is_blocked' => false,
            'blocked_date' => null
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Availability created successfully',
            'data' => $availability
        ], 201);
    }

    // Update an availability
    public function update(Request $request, $id)
    {
        $availability = Availability::where('user_id', $request->user()->id)
            ->findOrFail($id);

        // Don't allow updating blocked dates through this endpoint
        if ($availability->is_blocked) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot update blocked dates. Delete and recreate if needed.'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'day_of_week' => 'sometimes|in:monday,tuesday,wednesday,thursday,friday,saturday,sunday',
            'start_time' => 'sometimes|date_format:H:i',
            'end_time' => 'sometimes|date_format:H:i|after:start_time',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $availability->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Availability updated successfully',
            'data' => $availability
        ]);
    }

    // Delete an availability
    public function destroy(Request $request, $id)
    {
        $availability = Availability::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $availability->delete();

        return response()->json([
            'success' => true,
            'message' => 'Availability deleted successfully'
        ]);
    }

    // Block a specific date
    public function blockDate(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'blocked_date' => 'required|date|after_or_equal:today'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Check if this date is already blocked
        $alreadyBlocked = Availability::where('user_id', $request->user()->id)
            ->where('is_blocked', true)
            ->where('blocked_date', $request->blocked_date)
            ->exists();
        
        if ($alreadyBlocked) {
            return response()->json([
                'success' => false,
                'message' => 'This date is already blocked'
            ], 409);
        }

        $availability = Availability::create([
            'user_id' => $request->user()->id,
            'day_of_week' => strtolower(date('l', strtotime($request->blocked_date))),
            'start_time' => '00:00',
            'end_time' => '23:59',
            'is_active' => false,
            'is_blocked' => true,
            'blocked_date' => $request->blocked_date
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Date blocked successfully',
            'data' => $availability
        ], 201);
    }
}
