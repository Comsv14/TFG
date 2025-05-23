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
                'name' => 'admin',
                'email' => 'admin@petconnect.com',
                'password' => Hash::make('12345678'),
                'role' => 'admin' // Puedes cambiar esto si tienes diferentes roles
            ]
        );
    }
}
