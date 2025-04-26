<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('HomePage');
    })->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('appointment-form', function () {
        return Inertia::render('AppointmentForm');
    })->name('appointment.form');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
