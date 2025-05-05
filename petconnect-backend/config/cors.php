<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Laravel CORS Options
    |--------------------------------------------------------------------------
    */

    // Rutas que se protegerán con CORS:
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    // Métodos HTTP permitidos
    'allowed_methods' => ['*'],

    // Orígenes permitidos (toma el env que acabas de definir)
    'allowed_origins' => explode(
        ',', 
        env('CORS_ALLOWED_ORIGINS', '*')
    ),

    // ¿Debe permitir subdominios (wildcards)?
    'allowed_origins_patterns' => [],

    // Cabeceras que permites que envíe el cliente
    'allowed_headers' => ['*'],

    // Cabeceras que expones al navegador
    'exposed_headers' => [],

    // ¿Permitimos credenciales (cookies, Authorization headers, etc.)?
    'supports_credentials' => true,

];
