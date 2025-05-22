<?php

namespace App\Http\Controllers\Api;

use App\Models\Comment;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class CommentController extends Controller
{
    public function index($activityId)
    {
        $comments = Comment::where('activity_id', $activityId)
            ->with('user:id,name')
            ->latest()
            ->get();

        return response()->json($comments);
    }

    public function store(Request $request, $activityId)
    {
        $request->validate([
            'body' => 'required|string|max:1000',
        ]);

        $comment = Comment::create([
            'user_id' => auth()->id(),
            'activity_id' => $activityId,
            'body' => $request->body,
        ]);

        return response()->json($comment->load('user'));
    }
}

