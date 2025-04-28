<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PetController;
use App\Http\Controllers\Api\ActivityController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\LostPetController;

Route::post('register', [AuthController::class, 'register']);
Route::post('login',    [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    // Autenticación
    Route::post('logout', [AuthController::class, 'logout']);

    // Mascotas
    Route::apiResource('pets', PetController::class);

    // Actividades
    Route::apiResource('activities', ActivityController::class);
    Route::post('activities/{activity}/register', [ActivityController::class, 'register']);

    // Comentarios
    Route::get('comments', [CommentController::class, 'index']);
    Route::post('comments', [CommentController::class, 'store']);
    Route::delete('comments/{comment}', [CommentController::class, 'destroy']);

    // Mascotas perdidas
    Route::apiResource('lost-pets', LostPetController::class)->except(['update','show']);
    Route::put('lost-pets/{lost_pet}', [LostPetController::class, 'update']); 
    Route::post('lost-pets/{lost_pet}/sightings', [LostPetController::class, 'reportSighting']);
});
