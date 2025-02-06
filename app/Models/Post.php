<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\Relations\MorphMany;


class Post extends Model
{
    protected $fillable = [
         'content', 'likes_count', 'user_id', 'image'
    ];

    protected $appends = ['is_liked'];

    public function likes():  MorphMany
    {
        return $this->morphMany(Like::class, 'likeable');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getIsLikedAttribute()
    {
        return Auth::check() && $this->likes()->where('user_id', Auth::id())->exists();
    }
}
