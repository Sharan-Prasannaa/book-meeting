<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Models\EventType;
use App\Models\Availability;
use App\Models\Booking;
use App\Models\BookingSlot;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;


class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'email_verified_at',
        'phone',
        'password',
        'role',
        'verification_token',
        'token_expires_at',
        'remember_token',
        'timezone',
        'buffer_minutes',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'verification_token',
        'token_expires_at',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'token_expires_at' => 'datetime',
        ];
    }

    public function eventType()
    {
        return $this->hasMany(EventType::class);
    }

    public function availabilities(){
        return $this->hasMany(Availability::class);
    }

    public function bookingSlots(){
        return $this->hasMany(BookingSlot::class);
    }

    public function bookings(){
        return $this->hasMany(Booking::class);
    }

    // Common function to Generates raw token, hash it, Set expiry, Save to database
    public function generateVerificationToken()
    {
        $rawToken = Str::random(64);

        $this->verification_token = hash('sha256', $rawToken);
        $this->token_expires_at = now()->addMinutes(60);

        $this->save();

        return $rawToken; // return raw token for email
    }
}
