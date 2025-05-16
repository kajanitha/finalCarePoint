<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Patient;
use App\Models\User;

class Appointment extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id',
        //'doctor_id',
        //'clinic_id',
        'appointment_date',
        'appointment_time',
        'appointment_type',
        'reason',
        'confirmation_sent',
        'notes',
        'status',
        'check_in_time',
        'payment_collected',
        'triage_notes',
        'contact_number',
    ];

    protected $casts = [
        'confirmation_sent' => 'boolean',
        'appointment_date' => 'date',
        'appointment_time' => 'datetime:H:i:s',
        'check_in_time' => 'datetime',
        'payment_collected' => 'boolean',
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function doctor()
    {
        return $this->hasOneThrough(
            User::class,
            Patient::class,
            'id', // Foreign key on patients table...
            'id', // Foreign key on users table...
            'patient_id', // Local key on appointments table...
            'doctor_id' // Local key on patients table...
        );
    }
}
