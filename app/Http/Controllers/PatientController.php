<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class PatientController extends Controller
{
    /**
     * Return total number of patients.
     */
    public function getTotalPatients()
    {
        $totalPatients = Patient::count();
        return response()->json(['totalPatients' => $totalPatients]);
    }

    /**
     * Store a newly created patient in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'nic' => 'required|string|max:20|unique:patients,nic',
            'date_of_birth' => 'required|date',
            'gender' => ['required', Rule::in(['Male', 'Female', 'Other'])],
            'street_address' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'district' => 'required|string|max:255',
            'province' => 'required|string|max:255',
            'contact_number' => ['required', 'regex:/^07[0-9]{8}$/'],
            'email_address' => 'nullable|email|max:255',
            'marital_status' => ['nullable', Rule::in(['Single', 'Married', 'Divorced', 'Widowed'])],
            'emergency_contact_name' => 'required|string|max:255',
            'emergency_contact_number' => 'required|string|max:20',
            'emergency_contact_relationship' => 'required|string|max:255',
            'blood_group' => 'nullable|string|max:10',
            'known_allergies' => 'nullable|string',
            'current_medications' => 'nullable|string',
            'past_medical_history' => 'nullable|string',
        ]);

        $validated['registration_date'] = now()->toDateString();
        $validated['patient_id'] = strtoupper(Str::random(10));

        // Associate the patient with the authenticated doctor
        $validated['doctor_id'] = $request->user()->id;

        $patient = Patient::create($validated);

        return redirect()->route('patients.record', $patient->id)->with('success', 'Patient registered successfully');
    }

    /**
     * Show the form for editing the specified patient.
     */
    public function edit($id)
    {
        $patient = Patient::find($id);

        if (!$patient) {
            abort(404, 'Patient not found');
        }

        return Inertia::render('PatientEdit', ['patient' => $patient]);
    }

    /**
     * Update the specified patient in storage.
     */
    public function update(Request $request, $id)
    {
        $patient = Patient::find($id);

        if (!$patient) {
            abort(404, 'Patient not found');
        }

        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'nic' => ['required', 'string', 'max:20', Rule::unique('patients')->ignore($patient->id)],
            'date_of_birth' => 'required|date',
            'gender' => ['required', Rule::in(['Male', 'Female', 'Other'])],
            'street_address' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'district' => 'required|string|max:255',
            'province' => 'required|string|max:255',
            'contact_number' => ['required', 'regex:/^07[0-9]{8}$/'],
            'email_address' => 'nullable|email|max:255',
            'marital_status' => ['nullable', Rule::in(['Single', 'Married', 'Divorced', 'Widowed'])],
            'emergency_contact_name' => 'required|string|max:255',
            'emergency_contact_number' => 'required|string|max:20',
            'emergency_contact_relationship' => 'required|string|max:255',
            'blood_group' => 'nullable|string|max:10',
            'known_allergies' => 'nullable|string',
            'current_medications' => 'nullable|string',
            'past_medical_history' => 'nullable|string',
        ]);

        $patient->update($validated);

        return redirect()->route('patients.record', $patient->id)->with('success', 'Patient updated successfully');
    }

    /**
     * Display the specified patient with appointments for Inertia rendering.
     */
    public function showRecord($id)
    {
        $patient = Patient::with(['appointments' => function ($query) {
            $query->orderBy('appointment_date', 'desc')->orderBy('appointment_time', 'desc');
        }])->find($id);

        if (!$patient) {
            abort(404, 'Patient not found');
        }

        return Inertia::render('PatientRecord', ['patient' => $patient]);
    }

    /**
     * Search patients by name or NIC.
     */
    public function search(Request $request)
    {
        $query = $request->query('q', '');

        $patients = Patient::where('full_name', 'like', "%{$query}%")
            ->orWhere('nic', 'like', "%{$query}%")
            ->get();

        return response()->json($patients);
    }

    /**
     * Display a listing of patients.
     */
    public function index()
    {
        $patients = Patient::orderBy('full_name')->get();
        return Inertia::render('PatientList', ['patients' => $patients]);
    }

    /**
     * Return JSON list of patients for API.
     */
    public function apiIndex()
    {
        $patients = Patient::orderBy('full_name')->get();
        return response()->json($patients);
    }

    /**
     * Display the specified patient with appointments.
     */
    public function show($id)
    {
        $patient = Patient::with(['appointments' => function ($query) {
            $query->orderBy('appointment_date', 'desc')->orderBy('appointment_time', 'desc');
        }])->find($id);

        if (!$patient) {
            return response()->json(['message' => 'Patient not found'], 404);
        }

        return response()->json($patient);
    }

    /**
     * Remove the specified patient from storage.
     */
    public function destroy($id)
    {
        $patient = Patient::find($id);

        if (!$patient) {
            return response()->json(['message' => 'Patient not found'], 404);
        }

        $patient->delete();

        return response()->json(['message' => 'Patient deleted successfully']);
    }
}
