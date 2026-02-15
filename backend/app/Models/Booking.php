<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\EventType;
use App\Models\Availability;
use App\Models\BookingSlot;

class Booking extends Model
{
    use HasFactory, SoftDeletes;

    public $fillable=[
        'user_id',
        'event_type_id',
        'guest_name',
        'guest_email',
        'guest_phone',
        'start_datetime',
        'end_datetime',
    ];
    protected $casts=[
        'start_datetime'=>'datetime',
        'end_datetime'=>'datetime',
    ];
    public function user(){
        return $this->belongsTo(User::class);
    }

    public function eventType()
    {
        return $this->belongsTo(\App\Models\EventType::class);
    }

    public function bookingSlot(){
        return $this->belongsTo(BookingSlot::class);
    }

    public function availability(){
        return $this->belongsTo(Availability::class);
    }
}
