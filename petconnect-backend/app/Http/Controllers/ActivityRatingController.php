<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ActivityRating;
use App\Models\Activity;
use Illuminate\Support\Facades\Auth;

class ActivityRatingController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'activity_id' => 'required|exists:activities,id',
            'rating' => 'required|integer|min:1|max:5',
        ]);

        $user = Auth::id();

        // Actualiza o crea la valoración
        $rating = ActivityRating::updateOrCreate(
            ['activity_id' => $request->activity_id, 'user_id' => $user],
            ['rating' => $request->rating]
        );

        // Recalcular el promedio solo si la valoración cambió
        $activity = Activity::find($request->activity_id);
        $average = $activity->ratings()->avg('rating');
        $activity->update(['average_rating' => $average]);

        return response()->json([
            'message' => 'Valoración guardada con éxito.',
            'average_rating' => $average,
        ]);
    }

    public function average($activity_id)
    {
        $activity = Activity::findOrFail($activity_id);
        return response()->json(['average' => $activity->average_rating]);
    }
}
