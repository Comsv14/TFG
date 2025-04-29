<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use Illuminate\Http\Request;

class ActivityController extends Controller
{
    // Listado
    public function index(Request $request)
    {
        $activities = Activity::with(['user','users'])
            ->orderBy('starts_at','asc')
            ->get()
            ->map(function(Activity $act) use ($request) {
                $act->is_registered = 
                    $act->users->contains($request->user()->id);
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
        $activity->load(['user','users']);
        $activity->is_registered = false;

        return response()->json($activity,201);
    }

    // Mostrar
    public function show(Request $request, Activity $activity)
    {
        $activity->load(['user','users','comments.user']);
        $activity->is_registered = 
            $activity->users->contains($request->user()->id);
        return response()->json($activity);
    }

    // Actualizar
    public function update(Request $request, Activity $activity)
    {
        $data = $request->validate([
            'title'       => 'sometimes|required|string|max:150',
            'description' => 'nullable|string',
            'location'    => 'nullable|string',
            'starts_at'   => 'nullable|date',
            'ends_at'     => 'nullable|date|after_or_equal:starts_at',
            'latitude'    => 'nullable|numeric|between:-90,90',
            'longitude'   => 'nullable|numeric|between:-180,180',
        ]);

        $activity->update($data);
        $activity->load(['user','users']);
        $activity->is_registered = 
            $activity->users->contains($request->user()->id);

        return response()->json($activity);
    }

    // Borrar
    public function destroy(Activity $activity)
    {
        $activity->delete();
        return response()->json(null,204);
    }

    // Apuntarse
    public function register(Request $request, Activity $activity)
    {
        $activity->users()->syncWithoutDetaching([
            $request->user()->id => ['registered_at'=>now()]
        ]);
        return response()->json(['is_registered'=>true],200);
    }
}
