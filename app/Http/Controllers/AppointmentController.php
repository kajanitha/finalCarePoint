<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

use Inertia\Inertia;
use App\Models\Patient;

class AppointmentController extends Controller
{
    /**
     * Display a listing of the appointments for the authenticated user.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        // Assuming user is a patient or clinic admin, adjust as needed
        $appointments = Appointment::where('patient_id', $user->id)
            ->with(['doctor', 'patient'])
            ->get();

        return response()->json($appointments);
    }

    /**
     * Render the DoctorAppointments page with appointments data.
     */
    public function doctorAppointmentsPage(Request $request)
    {
        $status = $request->query('status'); // scheduled, completed, cancelled
        $range = $request->query('range', 'day'); // day, week, month

        $query = Appointment::query()
            ->with(['patient'])
            ->orderBy('appointment_date')
            ->orderBy('appointment_time');

        if ($status) {
            $query->where('status', $status);
        }

        $today = now()->startOfDay();
        if ($range === 'day') {
            $query->whereDate('appointment_date', $today);
        } elseif ($range === 'week') {
            $query->whereBetween('appointment_date', [$today, $today->copy()->endOfWeek()]);
        } elseif ($range === 'month') {
            $query->whereBetween('appointment_date', [$today, $today->copy()->endOfMonth()]);
        }

        $appointments = $query->get();

        return Inertia::render('DoctorAppointments', [
            'appointments' => $appointments,
            'filters' => [
                'range' => $range,
                'status' => $status,
            ],
        ]);
    }

    /**
     * Show the book appointment page with patients data.
     */
    public function bookAppointment()
    {
        $patients = Patient::all();

        return Inertia::render('BookAppointment', [
            'patients' => $patients,
        ]);
    }

    /**
     * Display a listing of appointments for the authenticated doctor with optional filters.
     */
    public function getDoctorAppointments(Request $request)
    {
        $status = $request->query('status'); // scheduled, completed, cancelled
        $range = $request->query('range', 'day'); // day, week, month

        $query = Appointment::with(['patient'])
            ->orderBy('appointment_date')
            ->orderBy('appointment_time');

        // Filter by status if provided
        if ($status) {
            $query->where('status', $status);
        }

        // Filter by date range
        $today = now()->startOfDay();
        if ($range === 'day') {
            $query->whereDate('appointment_date', $today);
        } elseif ($range === 'week') {
            $query->whereBetween('appointment_date', [$today, $today->copy()->endOfWeek()]);
        } elseif ($range === 'month') {
            $query->whereBetween('appointment_date', [$today, $today->copy()->endOfMonth()]);
        }

        $appointments = $query->get();

        return response()->json($appointments);
    }

    /**
     * Display a listing of today's appointments with patient details and reasons for GP/Receptionist.
     */
    public function getTodaysAppointments(Request $request)
    {
        $user = $request->user();

        $today = now()->toDateString();

        $appointments = Appointment::where('appointment_date', $today)
            ->with('patient')
            ->orderBy('appointment_time')
            ->get();

        return response()->json($appointments);
    }

    /**
     * Store a newly created appointment in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            //'doctor_id' => 'required|exists:doctors,id',
            //'clinic_id' => 'required|exists:clinics,id',
            'appointment_date' => 'required|date|after_or_equal:today',
            'appointment_time' => 'required|date_format:H:i',
            'appointment_type' => ['required', Rule::in(['General Consultation', 'Follow-up', 'Checkup'])],
            'reason' => 'required|string|max:1000',
            'confirmation_sent' => 'boolean',
            'notes' => 'nullable|string|max:2000',
            'status' => ['nullable', Rule::in(['pending', 'confirmed', 'cancelled'])],
        ]);

        $appointment = Appointment::create([
            'patient_id' => $validated['patient_id'],
            //'doctor_id' => $validated['doctor_id'],
            //'clinic_id' => $validated['clinic_id'],
            'appointment_date' => $validated['appointment_date'],
            'appointment_time' => $validated['appointment_time'],
            'appointment_type' => $validated['appointment_type'],
            'reason' => $validated['reason'],
            'confirmation_sent' => $validated['confirmation_sent'] ?? false,
            'notes' => $validated['notes'] ?? null,
            'status' => $validated['status'] ?? 'pending',
        ]);

        // TODO: Send confirmation SMS/Email if confirmation_sent is true

        return response()->json(['message' => 'Appointment booked successfully', 'appointment' => $appointment], 201);
    }

    /**
     * Check-in the specified appointment.
     */
    public function checkIn(Request $request, Appointment $appointment)
    {
        $validated = $request->validate([
            'contact_number' => 'nullable|string|max:255',
            'payment_collected' => 'boolean',
            'triage_notes' => 'nullable|string',
        ]);

        $appointment->update([
            'contact_number' => $validated['contact_number'] ?? $appointment->contact_number,
            'payment_collected' => $validated['payment_collected'] ?? false,
            'triage_notes' => $validated['triage_notes'] ?? null,
            'check_in_time' => now(),
            'status' => 'confirmed',
        ]);

        return response()->json(['message' => 'Patient checked in successfully', 'appointment' => $appointment]);
    }

    /**
     * Display the specified appointment.
     */
    public function show(Appointment $appointment)
    {
        $appointment->load(['patient', 'doctor']);
        return response()->json($appointment);
    }

    /**
     * Update the specified appointment in storage.
     */
    public function update(Request $request, Appointment $appointment)
    {
        $validated = $request->validate([
            'appointment_date' => 'sometimes|date|after_or_equal:today',
            'appointment_time' => 'sometimes|date_format:H:i',
            'appointment_type' => [ 'sometimes', Rule::in(['General Consultation', 'Follow-up', 'Checkup'])],
            'reason' => 'sometimes|string|max:1000',
            'confirmation_sent' => 'sometimes|boolean',
            'notes' => 'nullable|string|max:2000',
            'status' => [ 'sometimes', Rule::in(['pending', 'confirmed', 'cancelled'])],
        ]);

        $appointment->update($validated);

        return response()->json(['message' => 'Appointment updated successfully', 'appointment' => $appointment]);
    }

    /**
     * Remove the specified appointment from storage.
     */
    public function destroy(Appointment $appointment)
    {
        $appointment->delete();

        return response()->json(['message' => 'Appointment deleted successfully']);
    }
}
