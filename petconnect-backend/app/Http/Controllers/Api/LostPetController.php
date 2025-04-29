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
     * Lista todas las mascotas perdidas, con usuario y avistamientos,
     * y convierte la ruta de foto en URL absoluta.
     */
    public function index()
    {
        $pets = LostPet::with('user', 'sightings.user')
            ->orderBy('posted_at', 'desc')
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
     * Reporta una nueva mascota perdida, sube foto si la hay
     * y devuelve la entidad con URL absoluta de la imagen.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'pet_name'           => 'required|string|max:150',
            'description'        => 'nullable|string',
            'last_seen_location' => 'nullable|string',
            'photo'              => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('lost-pets', 'public');
            $data['photo'] = $path;
        }

        $lost = $request->user()->lostPets()->create($data);

        $lost->photo = $lost->photo
            ? url(Storage::url($lost->photo))
            : null;

        return response()->json($lost, 201);
    }

    /**
     * Actualiza el flag `found` de un reporte de mascota perdida.
     */
    public function update(Request $request, LostPet $lostPet)
    {
        $this->authorize('update', $lostPet);

        $data = $request->validate([
            'found' => 'required|boolean',
        ]);

        $lostPet->update($data);

        // Si quieres devolver la foto con URL absoluta en la respuesta:
        $lostPet->photo = $lostPet->photo
            ? url(Storage::url($lostPet->photo))
            : null;

        return response()->json($lostPet);
    }

    /**
     * Elimina un reporte de mascota perdida y borra su foto del disco.
     */
    public function destroy(LostPet $lostPet)
    {
        $this->authorize('delete', $lostPet);

        if ($lostPet->photo) {
            // Extraemos el path interno para borrarlo
            $internal = ltrim(parse_url($lostPet->photo, PHP_URL_PATH), '/storage/');
            Storage::disk('public')->delete($internal);
        }

        $lostPet->delete();

        return response()->noContent();
    }

    /**
     * Reporta un avistamiento para la mascota perdida,
     * opcionalmente con foto, y devuelve el avistamiento creado.
     */
    public function reportSighting(Request $request, LostPet $lostPet)
    {
        $data = $request->validate([
            'location' => 'nullable|string',
            'comment'  => 'nullable|string',
            'photo'    => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('lost-pets/sightings', 'public');
            $data['photo'] = $path;
        }

        $sighting = $lostPet->sightings()->create(array_merge($data, [
            'user_id' => $request->user()->id,
        ]));

        $sighting->load('user');
        if (isset($data['photo'])) {
            $sighting->photo = url(Storage::url($data['photo']));
        }

        return response()->json($sighting, 201);
    }
}
