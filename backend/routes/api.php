<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EventTypeController;
use App\Http\Controllers\Api\BookingController;

// routes allow signup, login, email verification, and password reset
// No middleware required as their are public routes
Route::post('/auth/signup', [AuthController::class,'signup']);
Route::post('/auth/login', [AuthController::class,'login']);
Route::post('/auth/verify-email', [AuthController::class,'verifyEmail']);

// Bookings
Route::get('bookings/available-slots', [BookingController::class, 'availableSlots']);
Route::post('bookings', [BookingController::class, 'store']);

// Resend Email Verification (MAX 3 request per minute)
Route::post('/auth/resend-verification', [AuthController::class, 'resendVerification'])
    ->middleware('throttle:3,1');


Route::post('/auth/forgot-password', [AuthController::class,'forgotPassword']);
Route::post('/auth/reset-password', [AuthController::class,'resetPassword']);

// Protected routes
Route::middleware(['auth:sanctum', 'verified.email'])->group(function() {
    Route::post('/auth/logout', [AuthController::class,'logout']);
    Route::get('/auth/profile', [AuthController::class,'profile']);

    // Event Types
    Route::apiResource('event-types', EventTypeController::class);
    
});

?>