<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * GET  /sanctum/csrf-cookie
     */
    public function csrfCookie(Request $request)
    {
        // Llamada desde el frontend para inicializar la cookie de CSRF
        return response()->json(['csrf' => true]);
    }

    /**
     * POST /api/register
     */
    public function register(Request $request)
    {
        $data = $request->validate([
            'name'                  => 'required|string|max:100',
            'email'                 => 'required|email|unique:users,email',
            'password'              => 'required|string|min:6|confirmed',
        ]);

        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        // Creamos un token
        $plainToken = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'user'  => $user,
            'token' => $plainToken,
        ], 201);
    }

    /**
     * POST /api/login
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        // Intentamos autenticar
        if (! Auth::attempt($credentials)) {
            throw ValidationException::withMessages([
                'email' => ['Credenciales inválidas.'],
            ]);
        }

        /** @var \App\Models\User $user */
        $user = $request->user();

        // (Opcional) Eliminar tokens previos
        $user->tokens()->delete();

        $plainToken = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'user'  => $user,
            'token' => $plainToken,
        ], 200);
    }

    /**
     * POST /api/logout
     */
    public function logout(Request $request)
    {
        // Borra todos los tokens del usuario actual
        $request->user()->tokens()->delete();

        return response()->json(['message' => 'Sesión cerrada'], 200);
    }
}
