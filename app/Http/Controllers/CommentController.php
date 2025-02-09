<?php

namespace App\Http\Controllers;

use App\Events\CommentPosted;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class CommentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'content' => 'required|string|min:1',
            'post_id' => 'required|integer'
        ]);

        $comment = Comment::create([
            'content' => $request->content,
            'post_id' => $request->post_id,
            'user_id' => Auth::id()
        ]);

        // Load user relationship
        $comment->load('user');
        broadcast(new CommentPosted($comment))->toOthers();

        return response()->json(['comment' => $comment]);
    }

    /**
     * Display the specified resource.
     */
    public function show($postId)
    {
        $comments=Comment::with('user')->where('post_id',$postId)->latest()->get();
        return response()->json(['comments'=>$comments]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Comment $comment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Comment $comment)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Comment $comment)
    {
        //
    }
}
