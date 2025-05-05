<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PetController;
use App\Http\Controllers\Api\ActivityController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\LostPetController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\LostReportController;

// Rutas públicas
Route::post('register', [AuthController::class, 'register']);
Route::post('login',    [AuthController::class, 'login']);
Route::get('sanctum/csrf-cookie', [AuthController::class, 'csrfCookie'])
     ->name('sanctum.csrfCookie');

// Rutas protegidas
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('logout', [AuthController::class, 'logout']);

    // Perfil
    Route::get('profile', [ProfileController::class, 'show']);
    Route::post('profile', [ProfileController::class, 'update']);

    // Mascotas
    Route::apiResource('pets', PetController::class);

    // Actividades
    Route::apiResource('activities', ActivityController::class);
    Route::post('activities/{activity}/register', [ActivityController::class, 'register']);

    // Comentarios
    Route::get('comments',    [CommentController::class, 'index']);
    Route::post('comments',   [CommentController::class, 'store']);
    Route::delete('comments/{comment}', [CommentController::class, 'destroy']);

    // Mascotas perdidas
    Route::apiResource('lost-pets', LostPetController::class)->except(['update']);
    Route::put('lost-pets/{lost_pet}', [LostPetController::class, 'update']);
    Route::post('lost-pets/{lost_pet}/sightings', [LostPetController::class, 'reportSighting']);
    /* NUEVA ==> */ Route::get('lost-pets/{lost_pet}', [LostPetController::class, 'show']);
    

    // Reportes de pérdida
    Route::get('lost-reports',                       [LostReportController::class, 'index']);
    Route::post('lost-reports',                      [LostReportController::class, 'store']);
    Route::post('lost-reports/{lost_report}/toggle-resolved',
               [LostReportController::class, 'toggleResolved']);
    Route::delete('lost-reports/{lost_report}',      [LostReportController::class, 'destroy']);
});
