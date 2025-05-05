<?php
// app/Http/Controllers/Api/LostPetController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\LostPetResource;
use App\Models\LostPet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class LostPetController extends Controller
{
    /*-------------------------------------------------
    | GET /api/lost-pets
    *------------------------------------------------*/
    public function index(Request $request)
    {
        $lost = LostPet::with('pet')
            ->orderByDesc('posted_at')
            ->get();

        return LostPetResource::collection($lost);
    }

    /*-------------------------------------------------
    | GET /api/lost-pets/{lost_pet}
    *------------------------------------------------*/
    public function show(LostPet $lost_pet)
    {
        $lost_pet->load('pet', 'sightings.user');
        return new LostPetResource($lost_pet);
    }

    /*-------------------------------------------------
    | POST /api/lost-pets
    *------------------------------------------------*/
    public function store(Request $request)
    {
        $data = $request->validate([
            'pet_name'            => 'required|string|max:150',
            'description'         => 'nullable|string',
            'last_seen_location'  => 'nullable|string|max:255',
            'last_seen_latitude'  => 'nullable|numeric|between:-90,90',
            'last_seen_longitude' => 'nullable|numeric|between:-180,180',
            'photo'               => 'nullable|image|max:2048',
        ]);

        if ($f = $request->file('photo')) {
            $data['photo'] = $f->store('lost-pets', 'public');
        }

        $data['posted_at'] = now();

        /*  ⬇️  Crea y CARGA la relación ‘pet’ antes de devolver */
        $lost = $request->user()
                        ->lostPets()
                        ->create($data)
                        ->load('pet');

        return new LostPetResource($lost);
    }

    /*-------------------------------------------------
    | PUT /api/lost-pets/{lost_pet}
    *------------------------------------------------*/
    public function update(Request $request, LostPet $lost_pet)
    {
        $data = $request->validate([
            'pet_name'            => 'sometimes|required|string|max:150',
            'description'         => 'nullable|string',
            'last_seen_location'  => 'nullable|string|max:255',
            'last_seen_latitude'  => 'nullable|numeric|between:-90,90',
            'last_seen_longitude' => 'nullable|numeric|between:-180,180',
            'photo'               => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('photo')) {
            if ($lost_pet->photo) {
                Storage::disk('public')->delete($lost_pet->photo);
            }
            $data['photo'] = $request->file('photo')
                                     ->store('lost-pets', 'public');
        }

        $lost_pet->update($data);
        $lost_pet->load('pet');          /* ⬅️  asegura la relación */

        return new LostPetResource($lost_pet);
    }

    /*-------------------------------------------------
    | DELETE /api/lost-pets/{lost_pet}
    *------------------------------------------------*/
    public function destroy(LostPet $lost_pet)
    {
        if ($lost_pet->photo) {
            Storage::disk('public')->delete($lost_pet->photo);
        }
        $lost_pet->delete();

        return response()->json(null, 204);
    }

    /*-------------------------------------------------
    | POST /api/lost-pets/{lost_pet}/sightings
    *------------------------------------------------*/
    public function reportSighting(Request $request, LostPet $lost_pet)
    {
        $data = $request->validate([
            'location'  => 'nullable|string|max:255',
            'latitude'  => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'comment'   => 'nullable|string',
            'photo'     => 'nullable|image|max:2048',
        ]);

        if ($f = $request->file('photo')) {
            $data['photo'] = $f->store('lost-pets/sightings', 'public');
        }

        $sighting = $lost_pet->sightings()->create(
            $data + ['user_id' => $request->user()->id]
        );

        $sighting->load('user');

        return response()->json($sighting, 201);
    }
}
