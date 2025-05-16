<?php

namespace App\Providers;

use App\Events\NewLostPetReport;
use App\Listeners\SendLostPetNotification;
use Illuminate\Support\Facades\Event;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        NewLostPetReport::class => [
            SendLostPetNotification::class,
        ],
    ];

    public function boot()
    {
        parent::boot();
    }
}
