<?php
namespace App\Listeners;

use App\Events\NewLostPetReport;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendLostPetNotification
{
    public function handle(NewLostPetReport $event)
    {
        $report = $event->report;

        // Obtener usuarios en la misma provincia
        $users = User::where('province', $report->user->province)
            ->where('id', '!=', $report->user_id)
            ->get();

        // Enviar notificación a cada usuario
        foreach ($users as $user) {
            Notification::create([
                'user_id' => $user->id,
                'title' => 'Mascota Perdida en tu provincia',
                'message' => 'Se ha reportado una mascota perdida cerca de tu ubicación.',
                'read' => false
            ]);
        }
    }
}
