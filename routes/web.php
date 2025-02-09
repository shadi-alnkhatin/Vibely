<?php

use App\Http\Controllers\PostController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\FriendshipController;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {

    Route::get('/add-friends', function () {
        return Inertia::render('AddFriend');
    });
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::post('/post',[PostController::class,'store'])->name('post.store');
    Route::get('/posts',[PostController::class,'index'])->name('post.index');

    Route::post('/comment/create',[CommentController::class,'store'])->name('comment.store');
    Route::get('/post/comments/{postId}',[CommentController::class,'show'])->name('comment.index');

    Route::post('/like', [LikeController::class, 'store']);
    Route::delete('/like', [LikeController::class, 'destroy']);
    Route::get('/people-you-may-know', [FriendshipController::class, 'peopleYouMayKnow']);
    Route::post('/add-friend', [FriendshipController::class,'store']);
    Route::get('/friends/pending', [FriendshipController::class, 'FriendsRequest']);
    Route::put('/accept/friend/{friendId}', [FriendshipController::class, 'acceptFriendRequest']);
    Route::delete('/reject/friend/{friendId}', [FriendshipController::class,'rejectFriendRequest']);
    Route::delete('/remove/friend/{friendId}', [FriendshipController::class,'deleteFriend']);
    Route::delete('/cancel/friend/{friendId}', [FriendshipController::class,'cancelFriendRequest']);



    Route::get('/user/profile/{userId}', [UserController::class, 'profile']);
    Route::get('/user/friends/{userId}', [UserController::class, 'friends']);
    Route::get('/user/posts/{userId}', [UserController::class, 'UserPosts']);
});




Route::get('/auth/google', function () {
    return Socialite::driver('google')->redirect();
});

Route::get('/auth/google/callback', function () {
    $googleUser = Socialite::driver('google')->user();

    // Find the user first
    $user = User::where('email', $googleUser->getEmail())->first();

    if (!$user) {
        // Create a new user
        $user = new User();
        $user->email = $googleUser->getEmail();
        $user->name = $googleUser->getName();
        $user->google_id = $googleUser->id;
        $user->save();
    } else {
        // Update the existing user
        $user->update([
            'google_id' => $googleUser->id,
        ]);
    }

    Auth::login($user);

    return redirect('/dashboard');
});



require __DIR__ . '/auth.php';
