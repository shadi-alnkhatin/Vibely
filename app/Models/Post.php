<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $fillable = [
         'content','likes_count' ,'user_id', 'user_id','image'
    ];

    public function user(){
        return $this->belongsTo(User::class);
    }

}
