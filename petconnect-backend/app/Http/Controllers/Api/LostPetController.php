<?php
// petconnect-backend/app/Http/Controllers/Api/LostPetController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LostPet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class LostPetController extends Controller
{
    /**
     * GET /api/lost-pets
     */
    public function index(Request $request)
    {
        $pets = LostPet::with(['user','sightings.user'])
            // Cambiado: usamos posted_at en lugar de created_at
            ->orderBy('posted_at','desc')
            ->get()
            ->map(function (LostPet $pet) {
                $pet->photo = $pet->photo
                    ? url(Storage::url($pet->photo))
                    : null;
                return $pet;
            });

        return response()->json($pets);
    }

    /**
     * POST /api/lost-pets
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'pet_name'             => 'required|string|max:150',
            'description'          => 'nullable|string',
            'last_seen_location'   => 'nullable|string',
            'last_seen_latitude'   => 'nullable|numeric|between:-90,90',
            'last_seen_longitude'  => 'nullable|numeric|between:-180,180',
            'photo'                => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('photo')) {
            $data['photo'] = $request->file('photo')
                                   ->store('lost-pets','public');
        }

        // Relación lostPets() en User.php
        $lost = $request->user()->lostPets()->create($data);

        $lost->photo = $lost->photo
            ? url(Storage::url($lost->photo))
            : null;

        return response()->json($lost, 201);
    }

    /**
     * PUT /api/lost-pets/{lost_pet}
     */
    public function update(Request $request, LostPet $lost_pet)
    {
        $data = $request->validate([
            'pet_name'             => 'sometimes|required|string|max:150',
            'description'          => 'nullable|string',
            'last_seen_location'   => 'nullable|string',
            'last_seen_latitude'   => 'nullable|numeric|between:-90,90',
            'last_seen_longitude'  => 'nullable|numeric|between:-180,180',
            'photo'                => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('photo')) {
            if ($lost_pet->photo) {
                Storage::disk('public')->delete($lost_pet->photo);
            }
            $data['photo'] = $request->file('photo')
                                   ->store('lost-pets','public');
        }

        $lost_pet->update($data);

        $lost_pet->photo = $lost_pet->photo
            ? url(Storage::url($lost_pet->photo))
            : null;

        return response()->json($lost_pet);
    }

    /**
     * DELETE /api/lost-pets/{lost_pet}
     */
    public function destroy(LostPet $lost_pet)
    {
        if ($lost_pet->photo) {
            Storage::disk('public')->delete($lost_pet->photo);
        }
        $lost_pet->delete();

        return response()->json(null, 204);
    }

    /**
     * POST /api/lost-pets/{lost_pet}/sightings
     */
    public function reportSighting(Request $request, LostPet $lost_pet)
    {
        $data = $request->validate([
            'location'   => 'nullable|string',
            'latitude'   => 'nullable|numeric|between:-90,90',
            'longitude'  => 'nullable|numeric|between:-180,180',
            'comment'    => 'nullable|string',
            'photo'      => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('photo')) {
            $data['photo'] = $request->file('photo')
                                   ->store('lost-pets/sightings','public');
        }

        $sighting = $lost_pet->sightings()->create(array_merge($data, [
            'user_id' => $request->user()->id,
        ]));

        $sighting->load('user');
        $sighting->photo = isset($data['photo'])
            ? url(Storage::url($data['photo']))
            : null;

        return response()->json($sighting, 201);
    }
}
