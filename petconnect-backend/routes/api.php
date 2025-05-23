<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PetController;
use App\Http\Controllers\Api\ActivityController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\LostPetController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\ActivityRatingController;
use App\Http\Controllers\Api\LostReportController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\LostReportCommentController;
use App\Http\Controllers\Api\LostPetCommentController;
use App\Http\Controllers\Api\AdminController;

// Rutas públicas
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::get('sanctum/csrf-cookie', [AuthController::class, 'csrfCookie'])->name('sanctum.csrfCookie');

// Rutas protegidas
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('logout', [AuthController::class, 'logout']);

    // Perfil
    Route::get('profile', [ProfileController::class, 'show']);
    Route::post('profile', [ProfileController::class, 'update']);

    // Notificaciones
    Route::post('activity-ratings', [ActivityRatingController::class, 'store']);
    Route::get('activity-ratings/{activity_id}/average', [ActivityRatingController::class, 'average']);
    Route::get('notifications', [NotificationController::class, 'index']);
    Route::post('notifications/mark-as-read', [NotificationController::class, 'markAsRead']);

    // Actividades
    Route::apiResource('activities', ActivityController::class);
    Route::post('activities/{activity}/join', [ActivityController::class, 'join']);
    Route::post('activities/{activity}/rate', [ActivityController::class, 'rate']);
    Route::post('activities/{activity}/register', [ActivityController::class, 'register']);

    // Comentarios de actividades
    Route::get('activities/{activity}/comments', [CommentController::class, 'index']);
    Route::post('activities/{activity}/comments', [CommentController::class, 'store']);
    Route::delete('comments/{comment}', [CommentController::class, 'destroy']);

    // Mascotas
    Route::apiResource('pets', PetController::class);
    Route::patch('pets/{pet}/toggle-walk', [PetController::class, 'toggleWalk']);

    // Mascotas perdidas
    Route::apiResource('lost-pets', LostPetController::class)->except(['update']);
    Route::put('lost-pets/{lost_pet}', [LostPetController::class, 'update']);
    Route::post('lost-pets/{lost_pet}/sightings', [LostPetController::class, 'reportSighting']);
    Route::get('lost-pets/{lost_pet}', [LostPetController::class, 'show']);

    // Reportes de pérdida
    Route::get('lost-reports', [LostReportController::class, 'index']);
    Route::post('lost-reports', [LostReportController::class, 'store']);
    Route::post('lost-reports/{lost_report}/toggle-resolved', [LostReportController::class, 'toggleResolved']);
    Route::delete('lost-reports/{lost_report}', [LostReportController::class, 'destroy']);

    // Comentarios en mascotas perdidas
    Route::get('lost-pets/{lost_pet}/comments', [LostPetCommentController::class, 'index']);
    Route::post('lost-pets/{lost_pet}/comments', [LostPetCommentController::class, 'store']);
    Route::get('lost-reports/{lost_report}/comments', [LostReportCommentController::class, 'index']);
    Route::post('lost-reports/{lost_report}/comments', [LostReportCommentController::class, 'store']);
});

// Rutas de administración
Route::middleware(['auth:sanctum'])->prefix('admin')->group(function () {
    Route::get('/users', [AdminController::class, 'users']);
    Route::delete('/users/{user}', [AdminController::class, 'deleteUser']);

    Route::get('/pets', [AdminController::class, 'pets']);
    Route::delete('/pets/{pet}', [AdminController::class, 'deletePet']);

    Route::get('/activities', [AdminController::class, 'activities']);
    Route::delete('/activities/{activity}', [AdminController::class, 'deleteActivity']);

    Route::get('/lost-reports', [AdminController::class, 'lostReports']);
    Route::delete('/lost-reports/{lost_report}', [AdminController::class, 'deleteLostReport']);

    Route::get('/comments', [AdminController::class, 'comments']);
    Route::delete('/comments/{comment}', [AdminController::class, 'deleteComment']);

    Route::get('/stats', [AdminController::class, 'stats']);
});
