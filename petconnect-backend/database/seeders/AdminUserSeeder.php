<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        // Elimina cualquier usuario con ese email
        User::where('email', 'admin@petconnect.com')->delete();

        User::create([
            'name' => 'Admin',
            'email' => 'admin@petconnect.com',
            'password' => Hash::make('admin1234'),
            'role' => 'admin',
        ]);
    }
}
