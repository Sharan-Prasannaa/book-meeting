<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\EventType;

class PublicController extends Controller
{
    /**
     * Get host's event types by user_slug (Calendly approach)
     * Route: GET /{user_slug}/event-types
     */
    public function hostEventTypes($userSlug)
    {
        // Find user by name (will use username/user_slug column in future)
        $user = User::where('user_slug', $userSlug)
            ->where('role', 'host')
            ->firstOrFail();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Host not found'
            ], 404);
        }

        $eventTypes = $user->eventTypes()
            ->where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function($eventType) use ($user) {
                return [
                    'id' => $eventType->id,
                    'title' => $eventType->title,
                    'description' => $eventType->description,
                    'duration' => $eventType->duration,
                    'slug' => $eventType->slug,
                    'host' => [
                        'name' => $user->name,
                        'user_slug' => $user->user_slug
                    ]
                ];
            });

        return response()->json([
            'success' => true,
            'host' => [
                'name' => $user->name,
                'email' => $user->email,
                'user_slug' => $user->user_slug,
            ],
            'event_types' => $eventTypes
        ]);
    }

    /**
     * Get single event type by user_slug and event slug
     * Route: GET /{user_slug}/{event_slug}
     */
    public function eventTypeBySlug($userSlug, $eventSlug)
    {
        $user = User::where('user_slug', $userSlug)
            ->where('role', 'host')
            ->firstOrFail();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Host not found'
            ], 404);
        }

        // Find event type by slug for this user
        $eventType = $user->eventTypes()
            ->where('slug', $eventSlug)
            ->where('is_active', true)
            ->firstOrFail();

        if (!$eventType) {
            return response()->json([
                'success' => false,
                'message' => 'Event type not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'event_type' => [
                'id' => $eventType->id,
                'title' => $eventType->title,
                'description' => $eventType->description,
                'duration' => $eventType->duration,
                'slug' => $eventType->slug,
                'host' => [
                    'name' => $user->name,
                    'user_slug' => $user->user_slug,
                    'email' => $user->email,
                    'timezone' => $user->timezone
                ]
            ]
        ]);
    }

    /**
     * Get host info by user_slug (for booking page header)
     * Route: GET /{user_slug}
     */
    public function hostInfo($userSlug)
    {
        $user = User::where('user_slug', $userSlug)
            ->where('role', 'host')
            ->firstOrFail();

        $eventTypesCount = $user->eventTypes()
            ->where('is_active', true)
            ->count();

        return response()->json([
            'success' => true,
            'host' => [
                'name' => $user->name,
                'user_slug' => $user->user_slug,
                'timezone' => $user->timezone,
                'event_types_count' => $eventTypesCount
            ]
        ]);
    }
}