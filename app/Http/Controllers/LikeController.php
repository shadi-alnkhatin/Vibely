<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Like;
use App\Models\Post;
use App\Models\Comment;

class LikeController extends Controller
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
            'likeable_type' => 'required|string', // Model class name (e.g., Post, Comment)
            'likeable_id'   => 'required|integer', // ID of the post or comment
            'emoji'         => 'nullable|string' // Optional emoji reaction
        ]);

        $like = Like::create([
            'user_id'       => Auth::id(),
            'likeable_type' => $request->likeable_type,
            'likeable_id'   => $request->likeable_id,
            'emoji'         => $request->emoji
        ]);

        return response()->json(['like' => $like]);
    }


    /**
     * Display the specified resource.
     */
    public function show(Like $like)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Like $like)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Like $like)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy( Request $request)
    {
        $request->validate([
            'likeable_type' => 'required|string', // Model class name (e.g., Post, Comment)
            'likeable_id'   => 'required|integer', // ID of the post or comment
        ]);

        $like = Like::where([
            'user_id'       => Auth::id(),
            'likeable_type' => $request->likeable_type,
            'likeable_id'   => $request->likeable_id,]);

        $like->delete();
        return response()->json(['message' => 'Like deleted successfully']);

    }
}
