<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Aquí configuramos los orígenes permitidos, métodos, cabeceras y
    | habilitamos el envío de cookies (credenciales) para Sanctum.
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => ['*'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // <-- Muy importante para que el front envíe la cookie de sesión
    'supports_credentials' => true,
];
