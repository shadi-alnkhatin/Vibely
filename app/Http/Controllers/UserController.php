<?php

namespace App\Http\Controllers;

use App\Models\Friendship;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\User;
use App\Models\Post;


class UserController extends Controller
{

    public function profile($userId)
    {
        $user = User::findOrFail($userId);
        $authUserId = Auth::id();

        if (!$authUserId) {
            return redirect()->route('login'); // Ensure user is authenticated
        }

        // Fetch friendship status in one query
        $friendship = Friendship::where(function ($query) use ($authUserId, $userId) {
            $query->where('user_id', $authUserId)
                  ->where('friend_id', $userId);
        })->orWhere(function ($query) use ($authUserId, $userId) {
            $query->where('user_id', $userId)
                  ->where('friend_id', $authUserId);
        })->first();

        // Determine sender and receiver statuses
        $senderFriendStatus = $friendship && $friendship->user_id === $authUserId ? $friendship->status : null;
        $receiverFriendStatus = $friendship && $friendship->friend_id === $authUserId ? $friendship->status : null;

        return Inertia::render('Profile', [
            'user' => $user,
            'SenderFriendStatus' => $senderFriendStatus,
            'ReceiverFriendStatus' => $receiverFriendStatus,
        ]);
    }

    public function UserPosts($userId){
        $posts= Post::where('user_id',$userId)->with('user')->withCount('comments')->get();
        return response()->json([
            'posts'=>$posts]);
    }

}
