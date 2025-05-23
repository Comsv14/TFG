<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Pet;
use App\Models\Activity;
use App\Models\LostReport;
use App\Models\Comment;
use App\Models\LostPetComment;
use App\Models\LostReportComment;

class AdminController extends Controller
{
    public function users()
    {
        return User::select('id', 'name', 'email', 'role', 'created_at')->get();
    }

    public function pets()
    {
        return Pet::with(['user:id,name,email', 'images'])->get();
    }

    public function activities()
    {
        return Activity::with(['user:id,name,email'])
            ->select('id', 'title', 'description', 'starts_at', 'ends_at', 'average_rating', 'user_id', 'created_at')
            ->get();
    }

    public function lostReports()
    {
        return LostReport::with(['user:id,name,email', 'pet:id,name'])
            ->select('id', 'type', 'comment', 'resolved', 'happened_at', 'user_id', 'pet_id', 'created_at')
            ->get();
    }

    public function comments()
    {
        return [
            'activityComments' => Comment::with('user:id,name')->select('id', 'body', 'user_id', 'activity_id', 'created_at')->get(),
            'lostPetComments' => LostPetComment::with('user:id,name')->select('id', 'body', 'user_id', 'lost_pet_id', 'created_at')->get(),
            'lostReportComments' => LostReportComment::with('user:id,name')->select('id', 'body', 'user_id', 'lost_report_id', 'created_at')->get()
        ];
    }

    public function stats()
{
    $comments_activity = \App\Models\Comment::count();
    $comments_lost_reports = \App\Models\LostReportComment::count();

    return response()->json([
        'users' => \App\Models\User::count(),
        'pets' => \App\Models\Pet::count(),
        'activities' => \App\Models\Activity::count(),
        'comments_activity' => $comments_activity,
        'comments_lost_reports' => $comments_lost_reports,
        'comments_total' => $comments_activity + $comments_lost_reports,
        'lostReports' => \App\Models\LostReport::count(),
    ]);
}

    public function deleteUser(User $user)
    {
        $user->delete();
        return response()->json(['message' => 'Usuario eliminado correctamente']);
    }

    public function deletePet(Pet $pet)
    {
        $pet->delete();
        return response()->json(['message' => 'Mascota eliminada correctamente']);
    }

    public function deleteActivity(Activity $activity)
    {
        $activity->delete();
        return response()->json(['message' => 'Actividad eliminada correctamente']);
    }

    public function deleteLostReport(LostReport $lostReport)
    {
        $lostReport->delete();
        return response()->json(['message' => 'Reporte de pérdida eliminado correctamente']);
    }

    public function deleteComment($id)
    {
        $found = Comment::find($id)
            ?? LostPetComment::find($id)
            ?? LostReportComment::find($id);

        if ($found) {
            $found->delete();
            return response()->json(['message' => 'Comentario eliminado correctamente']);
        }

        return response()->json(['message' => 'Comentario no encontrado'], 404);
    }
}
