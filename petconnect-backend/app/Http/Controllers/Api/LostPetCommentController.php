<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LostPetComment;
use App\Models\LostPet;
use Illuminate\Http\Request;

class LostPetCommentController extends Controller
{
    public function index($lostPetId)
    {
        return LostPetComment::where('lost_pet_id', $lostPetId)
            ->with('user:id,name')
            ->latest()
            ->get();
    }

    public function store(Request $request, $lostPetId)
    {
        $request->validate([
            'body' => 'required|string|max:1000',
        ]);

        // Verifica que el lost_pet exista antes de guardar el comentario
        $lostPet = LostPet::find($lostPetId);

        if (!$lostPet) {
            return response()->json(['error' => 'Mascota perdida no encontrada.'], 404);
        }

        $comment = LostPetComment::create([
            'user_id' => auth()->id(),
            'lost_pet_id' => $lostPetId,
            'body' => $request->body,
        ]);

        return $comment->load('user');
    }
}
