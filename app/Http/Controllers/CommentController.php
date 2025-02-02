<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;

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
            'content' =>'required|string|min:1',
            'user_id' =>'required|integer',
            'post_id' =>'required|integer'
        ]);
        Comment::create($request->all());
        return response()->json(['message' => 'Comment created successfully']);
    }

    /**
     * Display the specified resource.
     */
    public function show($postID)
    {
        $comments=Comment::with('user')->where('post_id',$postID)->latest()->get();
        return response()->json($comments);
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
