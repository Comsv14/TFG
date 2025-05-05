<?php
// petconnect-backend/app/Http/Controllers/Api/LostReportController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LostReport;
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
        $reports = LostReport::with(['pet','user','comments.user'])
            ->orderBy('happened_at','desc')
            ->get()
            ->map(function($r) {
                // pasar foto a URL pública
                $r->photo = $r->photo
                    ? url(Storage::url($r->photo))
                    : null;
                return $r;
            });

        return response()->json($reports);
    }

    /**
     * Reportar una pérdida
     * POST /api/lost-reports
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'pet_id'       => 'required|exists:pets,id',
            'comment'      => 'required|string',
            'happened_at'  => 'required|date',
            'latitude'     => 'required|numeric|between:-90,90',
            'longitude'    => 'required|numeric|between:-180,180',
            'photo'        => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('photo')) {
            $data['photo'] = $request->file('photo')
                                   ->store('lost-reports','public');
        }

        $report = LostReport::create(array_merge($data, [
            'user_id' => $request->user()->id,
        ]));

        $report->load(['pet','user','comments.user']);
        $report->photo = $report->photo
            ? url(Storage::url($report->photo))
            : null;

        return response()->json($report, 201);
    }

    /**
     * Reportar un avistamiento (opcional, si lo quieres separado)
     * POST /api/lost-reports/found
     */
    public function storeFound(Request $request)
    {
        $data = $request->validate([
            'comment'     => 'required|string',
            'happened_at' => 'required|date',
            'latitude'    => 'required|numeric|between:-90,90',
            'longitude'   => 'required|numeric|between:-180,180',
            'photo'       => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('photo')) {
            $data['photo'] = $request->file('photo')
                                   ->store('lost-reports','public');
        }

        $report = LostReport::create(array_merge($data, [
            'user_id' => $request->user()->id,
        ]));

        $report->load(['pet','user','comments.user']);
        $report->photo = $report->photo
            ? url(Storage::url($report->photo))
            : null;

        return response()->json($report, 201);
    }
}
