<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
    ];

    /**
     * The clinics that belong to the service.
     */
    public function clinics()
    {
        return $this->belongsToMany(Clinic::class, 'clinic_services');
    }
}
