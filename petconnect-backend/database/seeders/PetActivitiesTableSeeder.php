<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PetActivitiesTableSeeder extends Seeder
{
    public function run()
    {
        DB::table('activities')->insert([
            [
                'title' => 'Vacunación de Mascotas',
                'description' => 'Campaña de vacunación para perros y gatos.',
                'location' => 'Parque Central',
                'starts_at' => '2025-06-15 10:00:00',
                'ends_at' => '2025-06-15 14:00:00',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Adopción de Mascotas',
                'description' => 'Evento de adopción organizado por la comunidad local.',
                'location' => 'Plaza Mayor',
                'starts_at' => '2025-07-10 09:00:00',
                'ends_at' => '2025-07-10 17:00:00',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        echo "✅ Seeder de actividades ejecutado correctamente.\n";
    }
}
