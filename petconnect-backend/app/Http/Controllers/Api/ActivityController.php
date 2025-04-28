<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use Illuminate\Http\Request;

class ActivityController extends Controller
{
    public function index(Request $request)
    {
        $activities = Activity::with('users')
            ->get()
            ->map(function($act) use ($request) {
                $act->joined = $act->users->contains($request->user()->id);
                return $act;
            });
        return response()->json($activities);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title'       => 'required|string|max:150',
            'description' => 'nullable|string',
            'location'    => 'nullable|string',
            'starts_at'   => 'nullable|date',
            'ends_at'     => 'nullable|date|after_or_equal:starts_at',
        ]);

        $activity = Activity::create($data);

        return response()->json($activity, 201);
    }

    public function show(Activity $activity)
    {
        return response()->json($activity->load('comments.user'));
    }

    public function update(Request $request, Activity $activity)
    {
        $data = $request->validate([
            'title'       => 'sometimes|required|string|max:150',
            'description' => 'nullable|string',
            'location'    => 'nullable|string',
            'starts_at'   => 'nullable|date',
            'ends_at'     => 'nullable|date|after_or_equal:starts_at',
        ]);

        $activity->update($data);

        return response()->json($activity);
    }

    public function destroy(Activity $activity)
    {
        $activity->delete();
        return response()->json(null, 204);
    }

    // Apuntarse a la actividad
    public function register(Request $request, Activity $activity)
    {
        $activity->users()->syncWithoutDetaching([
            $request->user()->id => ['registered_at' => now()]
        ]);
        return response()->json(['joined' => true]);
    }
}
