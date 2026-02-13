<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

// routes allow signup, login, email verification, and password reset
// No middleware required as their are public routes
Route::post('/auth/signup', [AuthController::class,'signup']);
Route::get('/auth/verify-email/{token}', [AuthController::class,'verifyEmail']);


?>