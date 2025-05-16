<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    use HasFactory;

    protected $fillable = [
        'full_name',
        'nic',
        'date_of_birth',
        'gender',
        'street_address',
        'city',
        'district',
        'province',
        'contact_number',
        'email_address',
        'marital_status',
        'emergency_contact_name',
        'emergency_contact_number',
        'emergency_contact_relationship',
        'blood_group',
        'known_allergies',
        'current_medications',
        'past_medical_history',
        'registration_date',
        'patient_id',
    ];

    protected $dates = [
        'date_of_birth',
        'registration_date',
    ];

    // You can add relationships here if needed

    /**
     * Get the doctor (user) that registered the patient.
     */
    public function doctor()
    {
        return $this->belongsTo(\App\Models\User::class, 'doctor_id');
    }

    /**
     * Get the appointments for the patient.
     */
    public function appointments()
    {
        return $this->hasMany(\App\Models\Appointment::class);
    }
}
