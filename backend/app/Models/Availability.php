<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Availability extends Model
{
    use HasFactory;

    protected $fillable=[
        'user_id',
        'day_of_week',
        'start_time',
        'end_time',
        'is_active',
        'is_blocked',
        'blocked_date',
    ];
    protected $casts=[
        'is_active'=>'boolean',
        'is_blocked'=>'boolean',
        'blocked_date'=>'date:Y-m-d',
    ];

    public function user(){
        return $this->belongsTo(User::class);
    }
}
