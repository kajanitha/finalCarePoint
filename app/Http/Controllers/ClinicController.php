<?php

namespace App\Http\Controllers;

use App\Models\Clinic;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ClinicController extends Controller
{
    public function index(Request $request)
    {
        // Get all clinics, with optional filtering by location
        $query = Clinic::query();

        if ($request->has('latitude') && $request->has('longitude') && $request->has('radius')) {
            $latitude = $request->input('latitude');
            $longitude = $request->input('longitude');
            $radius = $request->input('radius'); // in kilometers

            // Use a function to calculate distance (Haversine formula)
            $query->select('*')
                  ->selectRaw(
                      '( 6371 * acos( cos( radians(?) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(?) ) + sin( radians(?) ) * sin( radians( latitude ) ) ) ) AS distance',
                      [$latitude, $longitude, $latitude]
                  )
                  ->having('distance', '<=', $radius);
        }

        $clinics = $query->get();
        return response()->json($clinics);
    }

    public function show(Clinic $clinic)
    {
        //show single clinic
        return response()->json($clinic);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'contact_phone' => 'required|string|max:20',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $clinic = Clinic::create([
            'name' => $request->input('name'),
            'address' => $request->input('address'),
            'latitude' => $request->input('latitude'),
            'longitude' => $request->input('longitude'),
            'contact_phone' => $request->input('contact_phone'),
            'description' => $request->input('description'),
        ]);
        return response()->json($clinic, 201);
    }

    public function update(Request $request, Clinic $clinic)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'string|max:255',
            'address' => 'string|max:255',
            'latitude' => 'numeric',
            'longitude' => 'numeric',
            'contact_phone' => 'string|max:20',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $clinic->update($request->all());
        return response()->json($clinic, 200);
    }

    public function destroy(Clinic $clinic)
    {
        $clinic->delete();
        return response()->json(null, 204);
    }

    public function getDoctors(Clinic $clinic)
    {
        return response()->json($clinic->doctors, 200);
    }

    public function getSchedule(Clinic $clinic)
    {
        //eager load
        $schedules = $clinic->schedules()->with('doctor')->get();
        return response()->json($schedules, 200);
    }
}
