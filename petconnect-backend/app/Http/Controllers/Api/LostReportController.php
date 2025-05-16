<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LostReport;
use App\Models\Pet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class LostReportController extends Controller
{
    /**
     * Listado de todos los reportes
     * GET /api/lost-reports
     */
    public function index()
    {
        $reports = LostReport::with(['pet', 'user'])
            ->orderBy('happened_at', 'desc')
            ->get()
            ->map(function ($report) {
                $report->photo = $report->photo ? url(Storage::url($report->photo)) : null;
                return $report;
            });

        return response()->json($reports);
    }

    /**
     * Reportar una pérdida o mascota encontrada
     * POST /api/lost-reports
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'type'          => 'required|in:lost,found',
            'pet_id'        => 'nullable|exists:pets,id', // Solo si es perdida
            'pet_name'      => 'required_if:type,found|string|max:150', // Requerido si es encontrada
            'comment'       => 'required|string',
            'happened_at'   => 'required|date',
            'latitude'      => 'required|numeric|between:-90,90',
            'longitude'     => 'required|numeric|between:-180,180',
            'photo'         => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('photo')) {
            $data['photo'] = $request->file('photo')->store('lost-reports', 'public');
        }

        // Si es una mascota encontrada, creamos un nuevo reporte sin mascota relacionada
        if ($data['type'] === 'found') {
            $report = LostReport::create([
                'user_id' => $request->user()->id,
                'type' => 'found',
                'pet_name' => $data['pet_name'],
                'comment' => $data['comment'],
                'happened_at' => $data['happened_at'],
                'latitude' => $data['latitude'],
                'longitude' => $data['longitude'],
                'photo' => $data['photo'] ?? null,
                'resolved' => false, // NUEVO: inicialmente no está encontrada
            ]);
        } else {
            // Si es una pérdida, debe estar vinculada a una mascota
            $report = LostReport::create([
                'user_id' => $request->user()->id,
                'type' => 'lost',
                'pet_id' => $data['pet_id'],
                'comment' => $data['comment'],
                'happened_at' => $data['happened_at'],
                'latitude' => $data['latitude'],
                'longitude' => $data['longitude'],
                'photo' => $data['photo'] ?? null,
                'resolved' => false, // NUEVO: inicialmente no está encontrada
            ]);
        }

        $report->load(['pet', 'user']);
        return response()->json($report, 201);
        event(new NewLostPetReport($report));
    }

    /**
     * Marcar un reporte como resuelto (encontrada)
     * POST /api/lost-reports/{lost_report}/toggle-resolved
     */
    public function toggleResolved(LostReport $lost_report, Request $request)
    {
        // Verificar que el usuario sea el dueño del reporte
        if ($request->user()->id !== $lost_report->user_id) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        // Cambiar el estado de resuelto
        $lost_report->resolved = !$lost_report->resolved;
        $lost_report->save();

        return response()->json([
            'message' => $lost_report->resolved ? 'Mascota marcada como encontrada' : 'Mascota marcada como perdida nuevamente.',
            'resolved' => $lost_report->resolved
        ]);
    }

    /**
     * Mostrar un reporte específico
     * GET /api/lost-reports/{lost_report}
     */
    public function show(LostReport $lost_report)
    {
        $lost_report->load(['pet', 'user']);
        return response()->json($lost_report);
    }

    /**
     * Actualizar un reporte
     * PUT /api/lost-reports/{lost_report}
     */
    public function update(Request $request, LostReport $lost_report)
    {
        $data = $request->validate([
            'type'        => 'required|in:lost,found',
            'pet_id'      => 'nullable|exists:pets,id|required_if:type,lost',
            'pet_name'    => 'nullable|string|max:150|required_if:type,found',
            'description' => 'nullable|string',
            'happened_at' => 'required|date',
            'latitude'    => 'required|numeric|between:-90,90',
            'longitude'   => 'required|numeric|between:-180,180',
            'photo'       => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('photo')) {
            if ($lost_report->photo) {
                Storage::disk('public')->delete($lost_report->photo);
            }
            $data['photo'] = $request->file('photo')->store('lost-reports', 'public');
        }

        $lost_report->update($data);
        $lost_report->load(['pet', 'user']);

        return response()->json($lost_report);
    }

    /**
     * Eliminar un reporte
     * DELETE /api/lost-reports/{lost_report}
     */
    public function destroy(LostReport $lost_report)
    {
        if ($lost_report->photo) {
            Storage::disk('public')->delete($lost_report->photo);
        }

        $lost_report->delete();
        return response()->json(null, 204);
    }
}
