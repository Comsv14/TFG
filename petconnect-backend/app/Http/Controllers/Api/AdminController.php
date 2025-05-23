<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Pet;
use App\Models\Activity;
use App\Models\LostReport;
use App\Models\Comment;

class AdminController extends Controller
{
    public function users()
    {
        return User::all();
    }

    public function deleteUser(User $user)
    {
        $user->delete();
        return response()->noContent();
    }

    public function pets()
    {
        return Pet::with('user')->get();
    }

    public function deletePet(Pet $pet)
    {
        $pet->delete();
        return response()->noContent();
    }

    public function activities()
    {
        return Activity::with('participants')->get();
    }

    public function deleteActivity(Activity $activity)
    {
        $activity->delete();
        return response()->noContent();
    }

    public function lostReports()
    {
        return LostReport::with(['pet', 'user'])->get();
    }

    public function deleteLostReport(LostReport $lostReport)
    {
        $lostReport->delete();
        return response()->noContent();
    }

    public function comments()
    {
        return Comment::with('user')->get();
    }

    public function deleteComment(Comment $comment)
    {
        $comment->delete();
        return response()->noContent();
    }

    public function stats()
    {
        return response()->json([
            'users' => User::count(),
            'pets' => Pet::count(),
            'activities' => Activity::count(),
            'lost_reports' => LostReport::count(),
            'comments' => Comment::count(),
        ]);
    }
}
