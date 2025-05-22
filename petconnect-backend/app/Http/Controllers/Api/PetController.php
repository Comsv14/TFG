<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pet;
use App\Models\PetImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PetController extends Controller
{
    public function index(Request $request)
    {
        $pets = Pet::with('images')                  // eager-load imágenes
            ->where('user_id', $request->user()->id)
            ->get()
            ->map(function (Pet $pet) {
                // Si tiene al menos 1 imagen, crea una URL pública:
                $pet->photo_url = $pet->images->count()
                    ? url(Storage::url($pet->images->first()->path))
                    : null;
                return $pet;
            });

        return response()->json($pets);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'  => 'required|string|max:100',
            'breed' => 'nullable|string|max:100',
            'age'   => 'nullable|integer|min:0',
            'photo' => 'nullable|image|max:4096',
        ]);

        $data['user_id'] = $request->user()->id;
        $pet = Pet::create($data);

        // Si subieron foto, la guardamos en pet_images:
        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('pets', 'public');
            $pet->images()->create([
                'path' => $path
            ]);
            $pet->photo_url = url(Storage::url($path));
        } else {
            $pet->photo_url = null;
        }

        return response()->json($pet, 201);
    }

    public function show(Pet $pet)
    {
        $this->authorize('view', $pet);
        $pet->load('images');
        $pet->photo_url = $pet->images->count()
            ? url(Storage::url($pet->images->first()->path))
            : null;
        return response()->json($pet);
    }

    public function update(Request $request, Pet $pet)
    {
        $this->authorize('update', $pet);

        $data = $request->validate([
            'name'  => 'required|string|max:100',
            'breed' => 'nullable|string|max:100',
            'age'   => 'nullable|integer|min:0',
            'photo' => 'nullable|image|max:4096',
        ]);

        $pet->update($data);

        // Si cambian la foto, la reemplazamos:
        if ($request->hasFile('photo')) {
            // Borramos todas las imágenes previas
            foreach ($pet->images as $img) {
                Storage::disk('public')->delete($img->path);
                $img->delete();
            }
            // Subimos la nueva
            $path = $request->file('photo')->store('pets', 'public');
            $pet->images()->create(['path' => $path]);
            $pet->photo_url = url(Storage::url($path));
        } else {
            // Recalculamos URL si no cambiaron foto
            $pet->photo_url = $pet->images->count()
                ? url(Storage::url($pet->images->first()->path))
                : null;
        }

        return response()->json($pet);
    }

    public function destroy(Pet $pet)
    {
        $this->authorize('delete', $pet);

        // Borramos archivos e imágenes asociadas
        foreach ($pet->images as $img) {
            Storage::disk('public')->delete($img->path);
        }
        $pet->images()->delete();

        $pet->delete();
        return response()->noContent();
    }
     public function toggleWalk(Pet $pet)
    {
        $this->authorize('update', $pet); // Quita esta línea si no usas políticas

        $pet->is_walking = !$pet->is_walking;
        $pet->save();

        return response()->json(['is_walking' => $pet->is_walking]);
    }
}
