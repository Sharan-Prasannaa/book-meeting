<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\User;
use App\Models\Bookings;

class EventType extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'duration',
        'slug',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'duration' => 'integer',
    ];
    
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function bookings()
    {
        return $this->hasMany(\App\Models\Booking::class);
    }

    // Cascade for soft delete
    protected static function booted()
    {
        static::deleting(function ($eventType) {
            if ($eventType->isForceDeleting()) {
                $eventType->bookings()->forceDelete();
            } else {
                $eventType->bookings()->delete();
            }
        });
    }
}
