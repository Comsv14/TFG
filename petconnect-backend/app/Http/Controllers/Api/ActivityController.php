<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use Illuminate\Http\Request;

class ActivityController extends Controller
{
    /**
     * GET /api/activities
     * Lista todas las actividades con:
     *  - user: el creador
     *  - users: inscritos
     *  - is_registered: si el usuario actual está inscrito
     */
    public function index(Request $request)
    {
        $activities = Activity::with(['user', 'users'])
            ->orderBy('starts_at', 'asc')
            ->get()
            ->map(function (Activity $act) use ($request) {
                // Marcamos si el auth user está inscrito
                $act->is_registered = $act->users->contains($request->user()->id);
                return $act;
            });

        return response()->json($activities);
    }

    /**
     * POST /api/activities
     * Crea una nueva actividad, asignando siempre user_id
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'title'       => 'required|string|max:150',
            'description' => 'nullable|string',
            'location'    => 'nullable|string',
            'starts_at'   => 'required|date',
            'ends_at'     => 'nullable|date|after_or_equal:starts_at',
        ]);

        // Asignamos el usuario creador
        $data['user_id'] = $request->user()->id;

        $activity = Activity::create($data);

        // Recargamos relaciones para devolverlas en la respuesta
        $activity->load(['user', 'users']);
        $activity->is_registered = false;

        return response()->json($activity, 201);
    }

    /**
     * GET /api/activities/{activity}
     * Muestra una sola actividad, con creador, comentarios e inscritos, y is_registered
     */
    public function show(Request $request, Activity $activity)
    {
        $activity->load(['user', 'users', 'comments.user']);

        // Marcamos inscripción
        $activity->is_registered = $activity->users->contains($request->user()->id);

        return response()->json($activity);
    }

    /**
     * PUT/PATCH /api/activities/{activity}
     * Actualiza una actividad existente
     */
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

        // Recargamos relaciones y estado de inscripción
        $activity->load(['user', 'users']);
        $activity->is_registered = $activity->users->contains($request->user()->id);

        return response()->json($activity);
    }

    /**
     * DELETE /api/activities/{activity}
     * Elimina la actividad
     */
    public function destroy(Activity $activity)
    {
        $activity->delete();
        return response()->json(null, 204);
    }

    /**
     * POST /api/activities/{activity}/register
     * Inscribe al usuario actual en la actividad
     */
    public function register(Request $request, Activity $activity)
    {
        // Añade sin duplicar, guardando fecha de registro
        $activity->users()->syncWithoutDetaching([
            $request->user()->id => ['registered_at' => now()],
        ]);

        return response()->json(['is_registered' => true], 200);
    }
}
