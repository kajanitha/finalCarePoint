<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AppointmentController extends Controller
{
    public function index(Request $request)
    {
        // Get all appointments for authenticated user
        $appointments = $request->user()->appointments()->get();
        return response()->json($appointments);
    }

    public function show(Appointment $appointment)
    {
        return response()->json($appointment);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'clinic_id' => 'required|exists:clinics,id',
            'doctor_id' => 'required|exists:doctors,id',
            'scheduled_time' => 'required|date',
            'status' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $appointment = Appointment::create([
            'user_id' => $request->user()->id,
            'clinic_id' => $request->input('clinic_id'),
            'doctor_id' => $request->input('doctor_id'),
            'scheduled_time' => $request->input('scheduled_time'),
            'status' => $request->input('status', 'pending'),
            'notes' => $request->input('notes'),
        ]);

        return response()->json($appointment, 201);
    }

    public function update(Request $request, Appointment $appointment)
    {
        $validator = Validator::make($request->all(), [
            'clinic_id' => 'exists:clinics,id',
            'doctor_id' => 'exists:doctors,id',
            'scheduled_time' => 'date',
            'status' => 'string',
            'notes' => 'string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $appointment->update($request->all());
        return response()->json($appointment, 200);
    }

    public function destroy(Appointment $appointment)
    {
        $appointment->delete();
        return response()->json(null, 204);
    }

    public function getClinicAppointments(Request $request)
    {
        $user = $request->user();
        $clinic = $user->clinic; // Assuming clinic_admin user has clinic relation

        if (!$clinic) {
            return response()->json(['message' => 'Clinic not found for user'], 404);
        }

        $appointments = Appointment::where('clinic_id', $clinic->id)->get();
        return response()->json($appointments);
    }

    public function confirm(Appointment $appointment)
    {
        $appointment->status = 'confirmed';
        $appointment->save();

        return response()->json($appointment, 200);
    }

    public function cancel(Appointment $appointment)
    {
        $appointment->status = 'cancelled';
        $appointment->save();

        return response()->json($appointment, 200);
    }
}
