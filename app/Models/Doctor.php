<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Doctor extends Model
{
    use HasFactory;

    protected $fillable = [
        'clinic_id',
        'name',
        'specialization',
        'bio',
    ];

    /**
     * Get the clinic that the doctor belongs to.
     */
    public function clinic()
    {
        return $this->belongsTo(Clinic::class);
    }

    /**
     * Get the schedules for the doctor.
     */
    public function schedules()
    {
        return $this->hasMany(Schedule::class);
    }

    /**
     * Get the appointments for the doctor.
     */
    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }
}
