<?php

return [
    'working_hours' => [
        'start' => '09:00',
        'end' => '17:00',
    ],
    
    // Optional: different hours for different days
    'working_hours_by_day' => [
        'monday' => ['start' => '09:00', 'end' => '17:00'],
        'tuesday' => ['start' => '09:00', 'end' => '17:00'],
        'wednesday' => ['start' => '09:00', 'end' => '17:00'],
        'thursday' => ['start' => '09:00', 'end' => '17:00'],
        'friday' => ['start' => '09:00', 'end' => '17:00'],
        'saturday' => ['start' => '10:00', 'end' => '14:00'],
        'sunday' => null, // Closed
    ],
];