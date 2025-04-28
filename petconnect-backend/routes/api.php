<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PetController;
use App\Http\Controllers\Api\ActivityController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\LostPetController;

// Rutas públicas
Route::post('register', [AuthController::class, 'register']);
Route::post('login',    [AuthController::class, 'login']);

// CSRF endpoint
Route::get('sanctum/csrf-cookie', [AuthController::class, 'csrfCookie'])->name('sanctum.csrfCookie');

// Rutas protegidas
Route::middleware('auth:sanctum')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);

    Route::apiResource('pets', PetController::class);

    Route::apiResource('activities', ActivityController::class);
    Route::post('activities/{activity}/register', [ActivityController::class, 'register']);

    Route::get('comments',    [CommentController::class, 'index']);
    Route::post('comments',   [CommentController::class, 'store']);
    Route::delete('comments/{comment}', [CommentController::class, 'destroy']);

    Route::apiResource('lost-pets', LostPetController::class)->except(['update']);
    Route::put('lost-pets/{lost_pet}', [LostPetController::class, 'update']);
    Route::post('lost-pets/{lost_pet}/sightings', [LostPetController::class, 'reportSighting']);
});
