<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'clinic_id',
        'doctor_id',
        'day_of_week',
        'start_time',
        'end_time',
    ];

    /**
     * Get the clinic that owns the schedule.
     */
    public function clinic()
    {
        return $this->belongsTo(Clinic::class);
    }

    /**
     * Get the doctor that owns the schedule.
     */
    public function doctor()
    {
        return $this->belongsTo(Doctor::class);
    }
}
