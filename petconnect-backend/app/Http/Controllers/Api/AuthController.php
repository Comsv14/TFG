<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        // tu lógica de registro…
    }

    public function login(Request $request)
    {
        // tu lógica de login, que devuelva ['token'=>…, 'user'=>…]
    }

    public function logout(Request $request)
    {
        // tu lógica de logout…
    }

    /**
     * Entrega la cookie de sesión + CSRF para Sanctum.
     */
    public function csrfCookie(Request $request)
    {
        return response()->json(['message' => 'CSRF cookie set']);
    }

    /**
     * Devuelve datos del usuario autenticado.
     */
    public function profile(Request $request)
    {
        return response()->json([
            'user' => $request->user(),
        ]);
    }
}
