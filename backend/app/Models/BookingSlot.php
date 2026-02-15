<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BookingSlot extends Model
{
    use HasFactory;
    public $fillable =[
        'user_id',
        'availability_id',
        'booking_id',
        'date',
        'start_time',
        'end_time',
        'is_booked',
        'booking_id',
    ];

    protected $casts=[
        'is_booked'=>'boolean',
        'booking_id'=>'integer',
    ];

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function availability(){
        return $this->belongsTo(Availability::class);
    }

    public function booking(){
        return $this->belongsTo(Booking::class);
    }
    
}
