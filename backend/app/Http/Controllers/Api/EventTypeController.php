<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class EventTypeController extends Controller
{
    public function index(Request $request){
        return response()->json([
            'event_types' => $request->user()
                ->eventType()
                ->where('is_active', 1)
                ->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'duration' => 'required|integer|min:5',
        ]);

        $eventType = $request->user()->eventType()->create([
            'title' => $request->title,
            'description' => $request->description,
            'duration' => $request->duration,
            'slug' => Str::slug($request->title) . '-' . Str::random(6),
        ]);

        return response()->json([
            'message' => 'Event Type created',
            'event_type' => $eventType
        ], 201);
    }

    //---------- show events of based on User $id refers to event_types id --------
    public function show(Request $request, $id){ 
        $eventType = $request->user()
            ->eventType()
            ->findOrFail($id);

        return response()->json([
            'message' => 'show successfully',
            'event_type' => $eventType,
        ]);
    }

    // ----------- Update method ----------------
    public function update(Request $request, $id){
        $eventType = $request->user()
            ->eventType()
            ->findOrFail($id);

        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'duration' => 'sometimes|required|integer|min:5',
        ]);

        $eventType->update([
            'title' => $request->title ?? $eventType->title,
            'description' => $request->description ?? $eventType->description,
            'duration' => $request->duration ?? $eventType->duration,
        ]);

        return response()->json([
            'message' => 'Event Type updated',
            'event_type' => $eventType
        ]);
    }

    //------------- Delete --------------
    public function destroy(Request $request, $id){
        $eventType = $request->user()
        ->eventType()
        ->findOrFail($id);

        $eventType->delete();

        return response()->json([
            'message' => 'Event Type deleted successfully'
        ]);
    }

}
