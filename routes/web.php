<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\PrescriptionController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\AppointmentController;

Route::get('/', function () {
    return Inertia::render('HomePage');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');


    Route::get('doctor/appointments', [AppointmentController::class, 'doctorAppointmentsPage'])
        ->middleware(['auth', 'verified'])
        ->name('doctor.appointments');

    // New route to provide JSON data for doctor appointments
    Route::get('doctor/appointments/data', [AppointmentController::class, 'getDoctorAppointments'])
        ->middleware(['auth', 'verified'])
        ->name('doctor.appointments.data');

    Route::get('doctor/prescriptions', function () {
        return Inertia::render('DoctorDashboardPrescription');
    })->name('doctor.prescriptions');

    Route::get('appointments/{appointment}', function ($appointment) {
        return Inertia::render('AppointmentDetails', ['appointmentId' => $appointment]);
    })->name('appointments.details');

    Route::get('appointment-form', function () {
        return Inertia::render('AppointmentForm');
    })->name('appointment.form');

    Route::get('upcoming-appointments', function () {
        return Inertia::render('UpcomingAppointments');
    })->name('upcoming.appointments');

    Route::get('nearby-clinics', function () {
        return Inertia::render('NearClinic');
    })->name('nearby.clinics');

    Route::get('user-profile', function () {
        return Inertia::render('UserProfile');
    })->name('user.profile');

    Route::get('patients/register', function () {
        return Inertia::render('PatientRegistrationForm');
    })->middleware('auth')->name('patients.register');



    Route::get('book-appointment', [AppointmentController::class, 'bookAppointment'])->name('book.appointment');
});

    Route::get('patients/checkin', function () {
        return Inertia::render('CheckInPatientModal');
    })->name('patients.checkin');

    Route::get('clinic-list', function () {
        return Inertia::render('ClinicList');
    })->name('clinic.list');

   

    Route::get('patients/{patient}', [PatientController::class, 'showRecord'])->name('patients.record');

    Route::get('patients/{patient}/edit', [PatientController::class, 'edit'])->name('patients.edit');
    Route::put('patients/{patient}', [PatientController::class, 'update'])->name('patients.update');
    Route::delete('patients/{patient}', [PatientController::class, 'destroy'])->name('patients.destroy');

    // Route::get('patients', function () {
    //     return Inertia::render('PatientList');
    // })->name('patients.list');
});

Route::middleware('auth:sanctum')->group(function () {
    // Add patients list API route
    Route::get('/patients', [PatientController::class, 'index']);
    Route::post('/patients', [PatientController::class, 'store']);
    

    // Prescription management routes
    Route::get('/patients/{patient}/prescriptions', [PrescriptionController::class, 'index']);
    Route::post('/prescriptions', [PrescriptionController::class, 'store']);
    Route::get('/prescriptions/{prescription}', [PrescriptionController::class, 'show']);
    Route::put('/prescriptions/{prescription}', [PrescriptionController::class, 'update']);
    Route::delete('/prescriptions/{prescription}', [PrescriptionController::class, 'destroy']);
    Route::get('/medications', [PrescriptionController::class, 'medications']);
});

// Appointment routes
Route::get('/appointments', [AppointmentController::class, 'index'])->middleware('auth:sanctum'); //get all appointments for user
Route::get('/appointments/{appointment}', [AppointmentController::class, 'show'])->middleware('auth:sanctum'); //show single appointment
Route::post('/appointments', [AppointmentController::class, 'store'])->middleware('auth:sanctum'); //create appointment
Route::put('/appointments/{appointment}', [AppointmentController::class, 'update'])->middleware('auth:sanctum');  //update appointment
Route::delete('/appointments/{appointment}', [AppointmentController::class, 'destroy'])->middleware('auth:sanctum'); //delete
Route::get('/clinic/appointments', [AppointmentController::class, 'getClinicAppointments'])->middleware('auth:sanctum', 'role:clinic_admin'); //get all appointments for a clinic
Route::get('/appointments/today', [AppointmentController::class, 'getTodaysAppointments'])->middleware('auth:sanctum', 'role:gp,receptionist'); //get today's appointments for GP/Receptionist
    // Route::get('/doctor/appointments', [AppointmentController::class, 'getDoctorAppointments'])->middleware('auth:sanctum', 'role:doctor'); //get doctor's appointments with filters
Route::post('/appointments/{appointment}/confirm', [AppointmentController::class, 'confirm'])->middleware('auth:sanctum', 'role:clinic_admin');
Route::post('/appointments/{appointment}/cancel', [AppointmentController::class, 'cancel'])->middleware('auth:sanctum', 'role:clinic_admin');

// Cancel appointment by patient (authenticated user)
Route::post('/appointments/{appointment}/cancel-by-user', [AppointmentController::class, 'cancelByUser'])->middleware('auth:sanctum');


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
