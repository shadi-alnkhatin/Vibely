<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Friendship extends Model
{
    protected $fillable = ['user_id', 'friend_id', 'status'];

    public function user(){
        return $this->belongsTo(User::class);
    }
        // The user who received the friend request
    public function friend(){
        return $this->belongsTo(User::class, 'friend_id');
    }
}
