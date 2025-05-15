<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LostPet;
use App\Models\Pet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class LostPetController extends Controller
{
    // Listar mascotas perdidas (solo del usuario autenticado)
    public function index(Request $request)
    {
        $lostPets = LostPet::where('user_id', $request->user()->id)
            ->where('found', false)
            ->orderBy('posted_at', 'desc')
            ->get()
            ->map(function ($pet) {
                $pet->photo = $pet->photo ? url(Storage::url($pet->photo)) : null;
                return $pet;
            });

        return response()->json($lostPets);
    }

    // Reportar mascota perdida (de las mascotas del usuario)
    public function store(Request $request)
    {
        $data = $request->validate([
            'pet_id'             => 'required|exists:pets,id',
            'description'        => 'nullable|string',
            'last_seen_location' => 'nullable|string|max:255',
            'last_seen_latitude' => 'nullable|numeric|between:-90,90',
            'last_seen_longitude'=> 'nullable|numeric|between:-180,180',
            'photo'              => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('photo')) {
            $data['photo'] = $request->file('photo')->store('lost-pets', 'public');
        }

        $data['posted_at'] = now();
        $data['user_id'] = $request->user()->id;
        $data['found'] = false;

        $lostPet = LostPet::create($data);

        return response()->json($lostPet, 201);
    }

    // Marcar mascota como encontrada
    public function markAsFound(Request $request, LostPet $lostPet)
    {
        $lostPet->update(['found' => true]);
        return response()->json(['message' => 'Mascota marcada como encontrada.']);
    }

    // Eliminar reporte de mascota perdida
    public function destroy(LostPet $lostPet)
    {
        if ($lostPet->photo) {
            Storage::disk('public')->delete($lostPet->photo);
        }
        $lostPet->delete();

        return response()->json(null, 204);
    }
}
