<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class EventTypeController extends Controller
{
    public function index(Request $request){
        return response()->json([
            'event_types' => $request->user()->event_types //Laravel always return empty array
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'duration' => 'required|integer|min:5',
        ]);

        $eventType = $request->user()->event_types()->create([
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

}
