<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pet;
use Illuminate\Http\Request;

class PetController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(
            $request->user()->pets()->get()
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'  => 'required|string|max:100',
            'breed' => 'nullable|string|max:100',
            'age'   => 'nullable|integer|min:0',
            'photo' => 'nullable|url',
        ]);

        $pet = $request->user()->pets()->create($data);

        return response()->json($pet, 201);
    }

    public function show(Pet $pet)
    {
        $this->authorize('view', $pet);
        return response()->json($pet);
    }

    public function update(Request $request, Pet $pet)
    {
        $this->authorize('update', $pet);

        $data = $request->validate([
            'name'  => 'sometimes|required|string|max:100',
            'breed' => 'nullable|string|max:100',
            'age'   => 'nullable|integer|min:0',
            'photo' => 'nullable|url',
        ]);

        $pet->update($data);

        return response()->json($pet);
    }

    public function destroy(Pet $pet)
    {
        $this->authorize('delete', $pet);
        $pet->delete();
        return response()->json(null, 204);
    }
}
