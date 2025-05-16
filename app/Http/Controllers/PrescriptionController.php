<?php

namespace App\Http\Controllers;

use App\Models\Prescription;
use App\Models\Medication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PrescriptionController extends Controller
{
    /**
     * Display a listing of prescriptions for a patient.
     */
    public function index(Request $request, $patientId)
    {
        $prescriptions = Prescription::with('medication', 'doctor')
            ->where('patient_id', $patientId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($prescriptions);
    }

    /**
     * Store a newly created prescription in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'patient_id' => 'required|exists:patients,id',
            'doctor_id' => 'required|exists:users,id',
            'medication_id' => 'required|exists:medications,id',
            'dosage' => 'required|string|max:255',
            'frequency' => 'required|string|max:255',
            'duration' => 'required|string|max:255',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $prescription = Prescription::create($request->all());

        return response()->json($prescription, 201);
    }

    /**
     * Display the specified prescription.
     */
    public function show($id)
    {
        $prescription = Prescription::with('medication', 'doctor', 'patient')->findOrFail($id);

        return response()->json($prescription);
    }

    /**
     * Update the specified prescription in storage.
     */
    public function update(Request $request, $id)
    {
        $prescription = Prescription::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'medication_id' => 'sometimes|required|exists:medications,id',
            'dosage' => 'sometimes|required|string|max:255',
            'frequency' => 'sometimes|required|string|max:255',
            'duration' => 'sometimes|required|string|max:255',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $prescription->update($request->all());

        return response()->json($prescription);
    }

    /**
     * Remove the specified prescription from storage.
     */
    public function destroy($id)
    {
        $prescription = Prescription::findOrFail($id);
        $prescription->delete();

        return response()->json(null, 204);
    }

    /**
     * Get list of medications for selection.
     */
    public function medications()
    {
        $medications = Medication::orderBy('name')->get();

        return response()->json($medications);
    }
}
