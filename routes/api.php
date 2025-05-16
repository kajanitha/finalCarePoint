<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PrescriptionController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\PatientController;

// Authentication routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    // Add patients list API route
    Route::get('/patients', [PatientController::class, 'apiIndex']);
    Route::post('/patients', [PatientController::class, 'store']);

    // Add delete patient route
    Route::delete('/patients/{patient}', [PatientController::class, 'destroy']);

    // Prescription management routes
    Route::get('/patients/{patient}/prescriptions', [PrescriptionController::class, 'index']);
    Route::post('/prescriptions', [PrescriptionController::class, 'store']);
    Route::get('/prescriptions/{prescription}', [PrescriptionController::class, 'show']);
    Route::put('/prescriptions/{prescription}', [PrescriptionController::class, 'update']);
    Route::delete('/prescriptions/{prescription}', [PrescriptionController::class, 'destroy']);
    Route::get('/medications', [PrescriptionController::class, 'medications']);
});

// Clinic routes
//Route::get('/clinics', [ClinicController::class, 'index']); // Get all clinics, with optional filters
//Route::get('/clinics/{clinic}', [ClinicController::class, 'show']); //show a single clinic
//Route::get('/clinics/{clinic}/doctors', [ClinicController::class, 'getDoctors']);
//Route::get('/clinics/{clinic}/schedule', [ClinicController::class, 'getSchedule']);
//Route::post('/clinics', [ClinicController::class, 'store'])->middleware('auth:sanctum', 'role:clinic_admin'); //create clinic
//Route::put('/clinics/{clinic}', [ClinicController::class, 'update'])->middleware('auth:sanctum', 'role:clinic_admin'); //update clinic
//Route::delete('/clinics/{clinic}', [ClinicController::class, 'destroy'])->middleware('auth:sanctum', 'role:clinic_admin');

// Appointment routes
Route::get('/appointments', [AppointmentController::class, 'index'])->middleware('auth:sanctum'); //get all appointments for user
Route::get('/appointments/{appointment}', [AppointmentController::class, 'show'])->middleware('auth:sanctum'); //show single appointment
Route::post('/appointments', [AppointmentController::class, 'store'])->middleware('auth:sanctum'); //create appointment
Route::put('/appointments/{appointment}', [AppointmentController::class, 'update'])->middleware('auth:sanctum');  //update appointment
Route::delete('/appointments/{appointment}', [AppointmentController::class, 'destroy'])->middleware('auth:sanctum'); //delete
Route::get('/clinic/appointments', [AppointmentController::class, 'getClinicAppointments'])->middleware('auth:sanctum', 'role:admin'); //get all appointments for a clinic
Route::get('/appointments/today', [AppointmentController::class, 'getTodaysAppointments'])->middleware('auth:sanctum', 'role:admin'); //get today's appointments for GP/Receptionist
Route::get('/doctor/appointments', [AppointmentController::class, 'getDoctorAppointments'])->middleware('auth:sanctum', 'role:doctor'); //get doctor's appointments with filters
Route::post('/appointments/{appointment}/confirm', [AppointmentController::class, 'confirm'])->middleware('auth:sanctum', 'role:admin');
Route::post('/appointments/{appointment}/cancel', [AppointmentController::class, 'cancel'])->middleware('auth:sanctum', 'role:admin');

// Cancel appointment by patient (authenticated user)
Route::post('/appointments/{appointment}/cancel-by-user', [AppointmentController::class, 'cancelByUser'])->middleware('auth:sanctum');

// Doctor routes
//Route::get('/doctors', [DoctorController::class, 'index']);
//Route::get('/doctors/{doctor}', [DoctorController::class, 'show']);
//Route::post('/doctors', [DoctorController::class, 'store'])->middleware('auth:sanctum', 'role:clinic_admin');
//Route::put('/doctors/{doctor}', [DoctorController::class, 'update'])->middleware('auth:sanctum', 'role:clinic_admin');
//Route::delete('/doctors/{doctor}', [DoctorController::class, 'destroy'])->middleware('auth:sanctum', 'role:clinic_admin');

// Schedule routes
//Route::get('/schedules', [ScheduleController::class, 'index']);
//Route::get('/schedules/{schedule}', [ScheduleController::class, 'show']);
//Route::post('/schedules', [ScheduleController::class, 'store'])->middleware('auth:sanctum', 'role:clinic_admin');
//Route::put('/schedules/{schedule}', [ScheduleController::class, 'update'])->middleware('auth:sanctum', 'role:clinic_admin');
//Route::delete('/schedules/{schedule}', [ScheduleController::class, 'destroy'])->middleware('auth:sanctum', 'role:clinic_admin');

// Review routes
//Route::get('/reviews', [ReviewController::class, 'index']);
//Route::get('/reviews/{review}', [ReviewController::class, 'show']);
//Route::post('/reviews', [ReviewController::class, 'store'])->middleware('auth:sanctum');
//Route::put('/reviews/{review}', [ReviewController::class, 'update'])->middleware('auth:sanctum', 'role:clinic_admin');
//Route::delete('/reviews/{review}', [ReviewController::class, 'destroy'])->middleware('auth:sanctum', 'role:clinic_admin');
