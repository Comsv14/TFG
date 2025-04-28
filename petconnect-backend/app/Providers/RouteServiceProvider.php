<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    public function boot()
    {
        $this->routes(function () {
            // Agrupa y carga todas las rutas de routes/api.php bajo el prefijo /api
            Route::middleware('api')
                 ->prefix('api')
                 ->group(base_path('routes/api.php'));

            // Carga las rutas web (web.php)
            Route::middleware('web')
                 ->group(base_path('routes/web.php'));
        });
    }
}
