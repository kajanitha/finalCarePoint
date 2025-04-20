<?php

namespace App\Http\Controllers;

use App\Models\Clinic;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Grimzy\LaravelMysqlSpatial\Types\Point;

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

            $point = new Point($latitude, $longitude);

            // Use grimzy spatial function to find clinics within radius (meters)
            $query->distanceSphere('location', $point, $radius * 1000);
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

        $location = new Point($request->input('latitude'), $request->input('longitude'));

        $clinic = Clinic::create([
            'name' => $request->input('name'),
            'address' => $request->input('address'),
            'location' => $location,
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

        $data = $request->all();

        if ($request->has('latitude') && $request->has('longitude')) {
            $data['location'] = new Point($request->input('latitude'), $request->input('longitude'));
        }

        $clinic->update($data);
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
