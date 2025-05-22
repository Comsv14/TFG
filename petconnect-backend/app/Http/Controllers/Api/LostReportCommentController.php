<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LostReportComment;
use Illuminate\Http\Request;

class LostReportCommentController extends Controller
{
    public function index($lostReportId)
    {
        return LostReportComment::where('lost_report_id', $lostReportId)
            ->with('user:id,name')
            ->latest()
            ->get();
    }

    public function store(Request $request, $lostReportId)
    {
        $request->validate([
            'body' => 'required|string|max:1000',
        ]);

        $comment = LostReportComment::create([
            'user_id' => auth()->id(),
            'lost_report_id' => $lostReportId,
            'body' => $request->body,
        ]);

        return $comment->load('user');
    }
}
