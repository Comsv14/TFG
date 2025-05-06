<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\ActivityUser;
use App\Http\Resources\ActivityResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class ActivityController extends Controller
{
    /* ---------- CRUD básico ------------------------------------------ */

    public function index()
    {
        $activities = Activity::with('creator')
            ->withCount('participants')
            ->withAvg('participants as average_rating', 'rating')   // 👈  cambio aquí
            ->get()
            ->map(function ($act) {
                $act->checkAndMarkFinished();
                return $act;
            });

        return ActivityResource::collection($activities);
    }

    public function show(Activity $activity)
    {
        $activity->load('creator')
                 ->loadCount('participants')
                 ->loadAvg('participants as average_rating', 'rating'); // 👈  cambio

        $activity->checkAndMarkFinished();

        return new ActivityResource($activity);
    }

    /* ---------- store, update, destroy idénticos… -------------------- */

    public function store(Request $request) { /* … */ }

    public function update(Request $request, Activity $activity) { /* … */ }

    public function destroy(Activity $activity) { /* … */ }

    /* ---------- Inscripción & valoración ----------------------------- */

    public function join(Activity $activity) { /* … */ }

    public function rate(Request $request, Activity $activity)
    {
        $request->validate(['rating' => 'required|integer|min:1|max:5']);

        $pivot = ActivityUser::where('activity_id', $activity->id)
            ->where('user_id', Auth::id())
            ->first();

        if (!$pivot) {
            throw ValidationException::withMessages([
                'rating' => 'Debes estar inscrito para valorar la actividad.',
            ]);
        }

        if (!$activity->is_finished) {
            throw ValidationException::withMessages([
                'rating' => 'Solo se puede valorar tras finalizar la actividad.',
            ]);
        }

        $pivot->rating = $request->rating;
        $pivot->save();

        return response()->json(['message' => 'Valoración guardada con éxito.']);
    }
}
