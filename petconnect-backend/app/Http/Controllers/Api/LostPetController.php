<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LostPet;
use App\Models\LostPetSighting;
use Illuminate\Http\Request;

class LostPetController extends Controller
{
    public function index()
    {
        return response()->json(
            LostPet::with('user','sightings.user')
                   ->orderBy('posted_at','desc')
                   ->get()
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'pet_name'           => 'nullable|string|max:100',
            'description'        => 'nullable|string',
            'photo'              => 'nullable|url',
            'last_seen_location' => 'nullable|string',
        ]);

        $lost = $request->user()->lostPets()->create($data);

        return response()->json($lost, 201);
    }

    // Marcar encontrada
    public function update(Request $request, LostPet $lostPet)
    {
        $this->authorize('update', $lostPet);
        $request->validate(['found' => 'required|boolean']);
        $lostPet->update(['found' => $request->found]);
        return response()->json($lostPet);
    }

    public function destroy(LostPet $lostPet)
    {
        $this->authorize('delete', $lostPet);
        $lostPet->delete();
        return response()->json(null, 204);
    }

    // Nuevo avistamiento
    public function reportSighting(Request $request, LostPet $lostPet)
    {
        $data = $request->validate([
            'location' => 'nullable|string',
            'comment'  => 'nullable|string',
            'photo'    => 'nullable|url',
        ]);

        $sighting = $lostPet->sightings()->create([
            'user_id'   => $request->user()->id,
            'location'  => $data['location'] ?? null,
            'comment'   => $data['comment'] ?? null,
            'photo'     => $data['photo'] ?? null,
        ]);

        return response()->json($sighting->load('user'), 201);
    }
}
