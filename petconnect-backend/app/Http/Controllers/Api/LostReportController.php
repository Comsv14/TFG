<?php
// petconnect-backend/app/Http/Controllers/Api/LostReportController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LostReport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class LostReportController extends Controller
{
    // Listar todos, con filtros opcionales (?type=lost|found, ?resolved=0|1)
    public function index(Request $request)
    {
        $q = LostReport::with(['user','pet'])
            ->orderBy('happened_at','desc');

        if ($t = $request->query('type')) {
            $q->where('type',$t);
        }
        if (!is_null($r = $request->query('resolved'))) {
            $q->where('resolved',(bool)$r);
        }

        return response()->json($q->get());
    }

    // Nuevo reporte (lost o found)
    public function store(Request $request)
    {
        $data = $request->validate([
            'type'         => 'required|in:lost,found',
            'pet_id'       => 'required_if:type,lost|exists:pets,id',
            'comment'      => 'nullable|string',
            'happened_at'  => 'nullable|date',
            'latitude'     => 'nullable|numeric|between:-90,90',
            'longitude'    => 'nullable|numeric|between:-180,180',
            'photo'        => 'nullable|image|max:2048',
        ]);

        // foto
        if ($request->hasFile('photo')) {
            $data['photo'] = $request->file('photo')->store('lost-reports','public');
        }

        $report = $request->user()->lostReports()->create($data);

        return response()->json($report->load('user','pet'),201);
    }

    // Marcar encontrado (para los “lost”) o reabrir
    public function toggleResolved(LostReport $lost_report)
    {
        if ($lost_report->type!=='lost') {
            return response()->json(['error'=>'Sólo lost reports'],422);
        }
        $lost_report->resolved = !$lost_report->resolved;
        $lost_report->save();
        return response()->json($lost_report);
    }

    // Eliminar un reporte
    public function destroy(LostReport $lost_report)
    {
        if ($lost_report->photo) {
            Storage::disk('public')->delete($lost_report->photo);
        }
        $lost_report->delete();
        return response()->json(null,204);
    }
}
