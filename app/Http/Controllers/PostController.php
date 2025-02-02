<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PostController extends Controller
{
    private $userID;

    public function __construct()
    {
        $this->userID = Auth::id();
    }    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Fetch all posts with their associated user, ordered by latest first
        $posts = Post::with('user')->latest()->get();

        return response()->json(['posts' => $posts]);
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
        // Validate the request
        $request->validate([
            'content' => 'required',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048', // Validate image format and size
        ]);

        $post = new Post();
        $post->user_id = $this->userID;
        $post->content = $request->content;
        $post->save();

        if ($request->hasFile('image')) {
            $imagePath = $request->image->store('posts', 'public');

            $post->image = Storage::url($imagePath);
            $post->save();
        }
        return Inertia::render('Dashboard', [
            'posts' => Post::latest()->get(),
            'successMessage' => 'Post created successfully!'
        ]);    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Post $post)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Post $post)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post)
    {
        //
    }
}
