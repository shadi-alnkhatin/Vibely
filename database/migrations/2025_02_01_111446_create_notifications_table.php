<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // The user who will receive the notification
            $table->text('message'); // The notification message or content
            $table->string('type'); // Type of notification (e.g., 'comment', 'like', 'friend_request')
            $table->morphs('notifiable'); // Polymorphic relationship (can relate to posts, comments, etc.)
            $table->boolean('read')->default(false); // If the notification has been read or not
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
