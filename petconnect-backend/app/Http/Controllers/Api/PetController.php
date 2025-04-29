<?php
// petconnect-backend/app/Http/Controllers/Api/PetController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PetController extends Controller
{
    public function index(Request $request)
    {
        $pets = Pet::where('user_id', $request->user()->id)
            ->get()
            ->map(function (Pet $pet) {
                $pet->photo = $pet->photo
                    ? url(Storage::url($pet->photo))
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
            'photo' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('pets', 'public');
            $data['photo'] = $path;
        }

        $data['user_id'] = $request->user()->id;

        $pet = Pet::create($data);

        $pet->photo = $pet->photo
            ? url(Storage::url($pet->photo))
            : null;

        return response()->json($pet, 201);
    }

    public function show(Pet $pet)
    {
        $this->authorize('view', $pet);

        $pet->photo = $pet->photo
            ? url(Storage::url($pet->photo))
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
            'photo' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('photo')) {
            if ($pet->photo) {
                // borra la foto vieja
                $old = str_replace('/storage/', '', parse_url($pet->photo, PHP_URL_PATH));
                Storage::disk('public')->delete($old);
            }
            $path = $request->file('photo')->store('pets', 'public');
            $data['photo'] = $path;
        }

        $pet->update($data);

        $pet->photo = $pet->photo
            ? url(Storage::url($pet->photo))
            : null;

        return response()->json($pet);
    }

    public function destroy(Pet $pet)
    {
        $this->authorize('delete', $pet);

        if ($pet->photo) {
            $old = str_replace('/storage/', '', parse_url($pet->photo, PHP_URL_PATH));
            Storage::disk('public')->delete($old);
        }

        $pet->delete();

        return response()->noContent();
    }
}
