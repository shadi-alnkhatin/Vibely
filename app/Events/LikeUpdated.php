<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class LikeUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public $likeableId;
    public $likeCount;
    public $likeType;

    public function __construct($likeableId, $likeCount, $likeType)
    {
        $this->likeableId = $likeableId;
        $this->likeCount = $likeCount;
        $this->likeType = $likeType;
    }

    public function broadcastOn()
    {
        return new Channel('likes.'.$this->likeType);
    }

    public function broadcastAs()
    {
        return 'LikeUpdated';
    }
}
