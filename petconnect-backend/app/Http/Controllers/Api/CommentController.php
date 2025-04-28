<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'activity_id' => 'required|exists:activities,id'
        ]);

        $comments = Comment::with('user')
            ->where('activity_id', $request->activity_id)
            ->orderBy('created_at','desc')
            ->get();

        return response()->json($comments);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'activity_id' => 'required|exists:activities,id',
            'body'        => 'required|string',
        ]);

        $comment = $request->user()->comments()->create($data);

        return response()->json($comment->load('user'), 201);
    }

    public function destroy(Comment $comment)
    {
        $this->authorize('delete', $comment);
        $comment->delete();
        return response()->json(null, 204);
    }
}
