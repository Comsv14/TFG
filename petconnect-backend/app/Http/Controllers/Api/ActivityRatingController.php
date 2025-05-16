<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ActivityRating;
use App\Models\Activity;
use Illuminate\Support\Facades\Auth;

class ActivityRatingController extends Controller
{
    public function store(Request $request)
    {
        // Verifica que el usuario esté autenticado
        if (!Auth::check()) {
            return response()->json(['error' => 'No autenticado'], 401);
        }

        // Validación
        $request->validate([
            'activity_id' => 'required|exists:activities,id',
            'rating' => 'required|integer|min:1|max:5',
        ]);

        // Obtener usuario autenticado
        $user = Auth::id();

        try {
            // Crear o actualizar valoración
            $rating = ActivityRating::updateOrCreate(
                ['activity_id' => $request->activity_id, 'user_id' => $user],
                ['rating' => $request->rating]
            );

            // Calcular la media de valoraciones de la actividad
            $activity = Activity::find($request->activity_id);
            $average = $activity->ratings()->avg('rating');

            // Guardar la media en la actividad
            $activity->average_rating = $average;
            $activity->save();

            return response()->json([
                'message' => 'Valoración guardada con éxito.',
                'average_rating' => $average
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al guardar la valoración: ' . $e->getMessage()], 500);
        }
    }

    public function average($activity_id)
    {
        $activity = Activity::findOrFail($activity_id);
        return response()->json(['average' => $activity->average_rating]);
    }
}
