<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LostReport;
use App\Models\Pet;
use App\Models\User;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class LostReportController extends Controller
{
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

    public function store(Request $request)
    {
        $data = $request->validate([
            'type'          => 'required|in:lost,found',
            'pet_id'        => 'nullable|exists:pets,id',
            'pet_name'      => 'required_if:type,found|string|max:150',
            'comment'       => 'required|string',
            'happened_at'   => 'required|date',
            'latitude'      => 'required|numeric|between:-90,90',
            'longitude'     => 'required|numeric|between:-180,180',
            'photo'         => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('photo')) {
            $data['photo'] = $request->file('photo')->store('lost-reports', 'public');
        }

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
                'resolved' => false,
            ]);
        } else {
            $report = LostReport::create([
                'user_id' => $request->user()->id,
                'type' => 'lost',
                'pet_id' => $data['pet_id'],
                'comment' => $data['comment'],
                'happened_at' => $data['happened_at'],
                'latitude' => $data['latitude'],
                'longitude' => $data['longitude'],
                'photo' => $data['photo'] ?? null,
                'resolved' => false,
            ]);
        }

        $report->load(['pet', 'user']);

        // 🚨 Notificar usuarios cercanos (radio de 25 km)
        $this->notifyNearbyUsers($report, 25);

        return response()->json($report, 201);
    }

    private function notifyNearbyUsers(LostReport $report, $radiusKm)
    {
        $users = User::where('id', '!=', $report->user_id)
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->get();

        foreach ($users as $user) {
            $distance = $this->haversineDistance(
                $report->latitude, $report->longitude,
                $user->latitude, $user->longitude
            );

            if ($distance <= $radiusKm) {
                Notification::create([
                    'user_id' => $user->id,
                    'title' => 'Mascota perdida cerca',
                    'message' => 'Se ha reportado una mascota perdida cerca de tu ubicación.',
                    'read' => false,
                ]);
            }
        }
    }

    private function haversineDistance($lat1, $lon1, $lat2, $lon2)
    {
        $earthRadius = 6371;
        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);
        $a = sin($dLat/2) * sin($dLat/2) +
             cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
             sin($dLon/2) * sin($dLon/2);
        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
        return $earthRadius * $c;
    }

    public function toggleResolved(LostReport $lost_report, Request $request)
    {
        if ($request->user()->id !== $lost_report->user_id) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $lost_report->resolved = !$lost_report->resolved;
        $lost_report->save();

        return response()->json([
            'message' => $lost_report->resolved
                ? 'Mascota marcada como encontrada'
                : 'Mascota marcada como perdida nuevamente.',
            'resolved' => $lost_report->resolved
        ]);
    }

    public function show(LostReport $lost_report)
    {
        $lost_report->load(['pet', 'user']);
        return response()->json($lost_report);
    }

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

    public function destroy(LostReport $lost_report)
    {
        if ($lost_report->photo) {
            Storage::disk('public')->delete($lost_report->photo);
        }

        $lost_report->delete();
        return response()->json(null, 204);
    }
}
