<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'clinic_id',
        'doctor_id',
        'appointment_datetime',
        'status',
        'notes',
    ];

    /**
     * Get the user that owns the appointment.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the clinic that owns the appointment.
     */
    public function clinic()
    {
        return $this->belongsTo(Clinic::class);
    }

    /**
     * Get the doctor that owns the appointment.
     */
    public function doctor()
    {
        return $this->belongsTo(Doctor::class);
    }
}
