<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;
use App\Mail\VerifyEmailMail;
use Throwable;

class AuthController extends Controller
{

    // ------- Sign Up (New User) -------
    public function signup(Request $request){
        $request->validate([
            'name' => 'required|string|min:3|max:100',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed', // confirmed => laravel expects another field "password_confirmation"
            'role' => 'nullable|in:admin,guest,host',
            'timezone' => 'sometimes|timezone',
            'buffer_minutes' => 'nullable|integer|min:0|max:120'
        ]);

        try{
            $rawToken = Str::random(64);
            $user = User::create([
                'name' => $request->name,
                'email' => strtolower($request->email),
                'password' => Hash::make($request->password),
                'role' => $request->role ?? 'guest',
                'verification_token' => hash('sha256', $rawToken),
                'token_expires_at' => now()->addHours(2),
                'timezone' => $request->timezone ?? 'UTC',
                'buffer_minutes' => $request->buffer_minutes ?? 0,
            ]);

            // TODO: Queue email verification (also fixes user created but mail not sent cases)
            // $rawToken = $user->generateVerificationToken();
            
            $link = config('app.frontend_url') . "/verify-email?token={$rawToken}";

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

    // ---------- Verify Email (After SignUP) ------------
    public function verifyEmail(Request $request){
        $request->validate([
            'token' => 'required|string',
            'password' => 'required|string'
        ]);

        $hashedToken = hash('sha256', trim($request->token));

        $user = User::where('verification_token', $hashedToken)->first();
        
        if(!($user)){
            return response()->json([
                'message' => 'Invalid verification Token',
                'can_resend' => false,
            ],400);
        }

        // Check if already verified
        if ($user->email_verified_at) {
            return response()->json([
                'message' => 'Email already verified',
                'already_verified' => true
            ], 400);
        }

        // Check expiration
        if (!$user->token_expires_at || $user->token_expires_at->isPast()) {
            return response()->json([
                'message' => 'Verification link expired.',
                'can_resend' => true,
                'email' => $user->email
            ],400);
        }

        // Confirm password before verifying
        if (!Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Incorrect password',
            'can_resend' => true,
            'email' => $user->email,
        ], 401);
        }

        //Update user
        $user->update([
            'email_verified_at' => now(),
            'verification_token' => null,
            'token_expires_at' => null,
        ]);

        // Optional: Auto login after verification
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Email verified successfully',
            'token' => $token,
        ]);
            
    }

    //----------- Login ---------------------------
    public function login(Request $request){
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);
        try {    
            $user = User::where('email', strtolower($request->email))->first();
    
            if (!$user || !Hash::check($request->password, $user->password)) {
                return response()->json(['message' => 'Invalid credentials'], 422);
            }
    
            if (!$user->email_verified_at) {
                return response()->json(['message' => 'Email not verified'], 403);
            }
    
            $token = $user->createToken('auth_token')->plainTextToken;
    
            return response()->json([
                'message' => 'Login successful',
                'token' => $token,
                'user' => $user
            ]);
    
        } catch (Throwable $e) {
            return response()->json([
                'message' => config('app.debug') ? $e->getMessage() : 'Something went wrong'
            ], 500);
        }
    }
    
    // ---------- Logout --------------------------
    public function logout(Request $request)
    {
        try {
            $request->user()->currentAccessToken()->delete();

            return response()->json([
                'message' => 'Logged out successfully'
            ]);

        } catch (Throwable $e) {
            return response()->json([
                'message' => config('app.debug') ? $e->getMessage() : 'Something went wrong'
            ], 500);
        }
    }

    // ---------- User Profile --------------------------
    public function profile(Request $request)
    {
        return response()->json([
            'user' => $request->user()
        ]);
    }

    // ---------- Resend Verification --------------------------
    public function resendVerification(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email'
        ]);

        $user = User::where('email', strtolower($request->email))->first();

        //Already Verified
        if ($user->email_verified_at) {
            return response()->json([
                'message' => 'Email already verified'
            ], 400);
        }

        // Generate new token
        $rawToken = $user->generateVerificationToken();

        $link = config('app.frontend_url') . "/verify-email?token={$rawToken}";

        Mail::to($user->email)->send(new VerifyEmailMail($link));

        return response()->json([
            'message' => 'Verification email resent'
        ]);
    }

}
