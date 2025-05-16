<?php
// app/Http/Controllers/Api/ActivityController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use Illuminate\Http\Request;

class ActivityController extends Controller
{
    // Listado
    public function index(Request $request)
    {
        $activities = Activity::with(['user', 'participants'])
            ->withCount('participants')
            ->orderBy('starts_at', 'asc')
            ->get()
            ->map(function (Activity $act) use ($request) {
                $act->is_registered = $act->participants->contains($request->user()->id);
                return $act;
            });

        return response()->json($activities);
    }

    // Crear
    public function store(Request $request)
    {
        $data = $request->validate([
            'title'       => 'required|string|max:150',
            'description' => 'nullable|string',
            'location'    => 'nullable|string',
            'starts_at'   => 'required|date',
            'ends_at'     => 'nullable|date|after_or_equal:starts_at',
            'latitude'    => 'nullable|numeric|between:-90,90',
            'longitude'   => 'nullable|numeric|between:-180,180',
        ]);

        $data['user_id'] = $request->user()->id;
        $activity = Activity::create($data);

        $activity->load(['user']);
        $activity->is_registered = false;
        $activity->participants_count = 0;
        $activity->average_rating = 0.00;

        return response()->json($activity, 201);
    }

    // Apuntarse
    public function register(Request $request, Activity $activity)
    {
        $activity->participants()->syncWithoutDetaching([
            $request->user()->id => ['registered_at' => now()]
        ]);

        $activity->loadCount('participants');

        return response()->json([
            'is_registered' => true,
            'participants_count' => $activity->participants_count,
        ], 200);
    }
}
