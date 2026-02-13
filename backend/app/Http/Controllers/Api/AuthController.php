<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Mail;
use App\Mail\VerifyEmailMail;
use Throwable;

class AuthController extends Controller
{
    public function signup(Request $request){
        $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed', // confirmed => laravel expects another field "password_confirmation"
            'role' => 'nullable|in:admin,guest,host',
            'timezone' => 'sometimes|timezone',
            'buffer_minutes' => 'nullable|integer|min:0|max:120'
        ]);

        try{
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => $request->role ?? 'guest',
                'verification_token' => Str::random(60),
                'token_expires_at' => now()->addHours(2),
                'timezone' => $request->timezone ?? 'UTC',
                'buffer_minutes' => $request->buffer_minutes ?? 0,
            ]);

            // TODO: Queue email verification (also fixes user created but mail not sent cases)
            // Example: /api/auth/verify-email/{token}
            
            $link = url("api/auth/verify-email/{$user->verification_token}");
            Mail::to($user->email)->send(new VerifyEmailMail($link));

            return response()->json([
                'message'=>'User registered. Please verify Email',
                'user' => $user
            ], 201);
        } catch (Throwable $e){
            if (config('app.debug')) {
                return response()->json([
                    'error' => 'Token not verified',
                    'message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                    'trace' => $e->getTrace(),
                ], 500);
            }
            
            return response()->json([
                'error' => "Failed User Registration",
                'message' => $e->getMessage(),
            ],500);
        }

    }

    public function verifyEmail($token){
        try{
            $user = User::where('verification_token', $token)->first();
            
            if(!($user)){
                return response()->json([
                    'message' => 'Invalid verification Token',
                ],400);
            }

            // Check if already verified
            if ($user->email_verified_at) {
                return response()->json([
                    'message' => 'Email already verified'
                ], 400);
            }

            if (!$user->token_expires_at || $user->token_expires_at->isPast()) {
                return response()->json([
                    'message' => 'Token Expired',
                ],400);
            }

            $user->update([
                'email_verified_at' => now(),
                'verification_token' => null,
                'token_expires_at' => null,
            ]);

            return response()->json([
                'message' => 'Email verified successfully'
            ]);
            
        } catch (Throwable  $e){
            if (config('app.debug')) {
                return response()->json([
                    'error' => 'Token not verified',
                    'message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                    'trace' => $e->getTrace(),
                ], 500);
            }

            return response()->json([
                'error' => 'Token not verified',
                'message' => $e->getMessage(),
            ], 500);
        }
    }



}
