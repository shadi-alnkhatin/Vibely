<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Like extends Model
{
    protected $fillable = ['user_id', 'likeable_type', 'likeable_id', 'emoji'];

    // Define polymorphic relationship
    public function likeable() : MorphTo
    {
        return $this->morphTo();
    }

    // Define relationship to User
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
