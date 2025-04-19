<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Clinic extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'address',
        'latitude',
        'longitude',
        'contact_phone',
        'description',
    ];

    /**
     * Get the doctors for the clinic.
     */
    public function doctors()
    {
        return $this->hasMany(Doctor::class);
    }

    /**
     * Get the schedules for the clinic.
     */
    public function schedules()
    {
        return $this->hasMany(Schedule::class);
    }

    /**
     * Get the appointments for the clinic.
     */
    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }

    /**
     * Get the reviews for the clinic.
     */
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    /**
     * The services that belong to the clinic.
     */
    public function services()
    {
        return $this->belongsToMany(Service::class, 'clinic_services');
    }
}
