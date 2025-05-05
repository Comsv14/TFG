<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LostReport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class LostReportController extends Controller
{
    // GET /api/lost-reports?type=lost|found
    public function index(Request $request)
    {
        $type = $request->query('type', 'lost');
        $reports = LostReport::with(['user','pet'])
            ->where('type', $type)
            ->orderBy('happened_at','desc')
            ->get()
            ->map(function($r) {
                if ($r->photo) {
                    $r->photo = url(Storage::url($r->photo));
                }
                return $r;
            });

        return response()->json($reports);
    }

    // POST /api/lost-reports
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

        if ($request->hasFile('photo')) {
            $data['photo'] = $request->file('photo')->store('lost-reports','public');
        }

        $report = $request->user()->lostReports()->create($data);
        $report->load('user','pet');

        if ($report->photo) {
            $report->photo = url(Storage::url($report->photo));
        }

        return response()->json($report, 201);
    }

    // POST /api/lost-reports/{id}/toggle-resolved
    public function toggleResolved(LostReport $id)
    {
        $id->update(['resolved' => ! $id->resolved]);
        return response()->json($id);
    }
}
