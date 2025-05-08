<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class DefaultUserSeeder extends Seeder
{
    public function run()
    {
        User::updateOrCreate(
            ['email' => 'usuario@example.com'], // Condición para evitar duplicados
            [
                'name' => 'usuario',
                'email' => 'usuario@example.com',
                'password' => Hash::make('contrasenia'),
                'role' => 'user' // Puedes cambiar esto si tienes diferentes roles
            ]
        );
    }
}
