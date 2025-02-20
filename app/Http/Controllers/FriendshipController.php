<?php

namespace App\Http\Controllers;

use App\Models\Friendship;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class FriendshipController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function peopleYouMayKnow()
    {
        $userId = Auth::id();

        // Fetch friend relationships
        $friendships = Friendship::where(function ($query) use ($userId) {
            $query->where('user_id', $userId)
                  ->orWhere('friend_id', $userId);
        })->get(['user_id', 'friend_id']);

        // Extract unique friend IDs
        $friendsId = collect($friendships)
            ->pluck('user_id')
            ->merge($friendships->pluck('friend_id'))
            ->unique()
            ->reject(fn($id) => $id == $userId) // Exclude self
            ->toArray();

        Log::info("Friendship IDs", $friendsId);

        // Fetch suggested users
        $suggestedUsers = User::whereNotIn('id', $friendsId) // Exclude friends
            ->where('id', '!=', $userId) // Ensure self-exclusion
            ->inRandomOrder()
            ->limit(20)
            ->get();

        return response()->json(['suggested_users' => $suggestedUsers]);
    }
    public function FriendsRequest(){
        $userId = Auth::id();
        $pendingRequests = Friendship::where('friend_id', $userId)
            ->where('status', 'pending')
            ->with('user')
            ->get();
        return response()->json(['pending_requests' => $pendingRequests]);
    }

    public function acceptFriendRequest($friendId){
        $friendship = Friendship::where('user_id', $friendId)
            ->where('friend_id', Auth::id())
            ->where('status', 'pending')
            ->first();
        if($friendship){
            $friendship->status = 'accepted';
            $friendship->save();
            return response()->json(['message' => 'Friend request accepted successfully']);
        }else{
            return response()->json(['message' => 'Friend request not found or already accepted']);
        }
    }


    public function rejectFriendRequest($friendId){
        $friendship = Friendship::where('user_id', $friendId)
            ->where('friend_id', Auth::id())
            ->where('status', 'pending')
            ->first();
        if($friendship){
            $friendship->delete();
            return response()->json(['message' => 'Friend request rejected successfully']);
        }else{
            return response()->json(['message' => 'Friend request not found or already accepted']);
        }
    }
    public function cancelFriendRequest($friendId){
        $friendship=Friendship::where('user_id',Auth::id())
        ->where('friend_id', $friendId)
        ->where('status', 'pending')
        ->first();
        if($friendship){
            $friendship->delete();
            return response()->json(['message' => 'Friend request cancelled successfully']);
        }
        return response()->json(['message' => 'Friend request not found or already accepted']);
    }

    public function deleteFriend($friendId){
        $authUserId=Auth::id();

        $friendship = Friendship::where(function ($query) use ($authUserId, $friendId) {
            $query->where('user_id', $authUserId)
                  ->where('friend_id', $friendId);
        })->orWhere(function ($query) use ($authUserId, $friendId) {
            $query->where('user_id', $friendId)
                  ->where('friend_id', $authUserId);
        })->first();
        if($friendship){
            $friendship->delete();
            return response()->json(['message' => 'Friend deleted successfully']);
        }
        return response()->json(['message' => 'Friend not found']);
    }




    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'friend_id' =>'required|integer|exists:users,id'
        ]);

        $friendship = Friendship::create([
            'user_id' => Auth::id(),
            'friend_id' => $request->friend_id,
           'status' => 'pending'
        ]);

        return response()->json(['friendship_request' => $friendship]);
    }






    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Friendship $friendship)
    {
        //
    }
}
