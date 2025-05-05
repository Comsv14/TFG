<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    // GET /api/profile
    public function show(Request $request)
    {
        $user = $request->user();
        $user->avatar_url = $user->avatar_url; // usa el accessor
        return response()->json($user);
    }

    // POST /api/profile
    public function update(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'name'                  => 'required|string|max:100',
            'email'                 => 'required|email|unique:users,email,'.$user->id,
            'avatar'                => 'nullable|image|max:2048',
            'latitude'  => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
        ]);

        if ($request->hasFile('avatar')) {
            // borra la vieja
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }
            $path = $request->file('avatar')->store('avatars', 'public');
            $data['avatar'] = $path;
        }

        $user->update($data);
        $user->avatar_url = $user->avatar_url;
        return response()->json($user);
    }
}
