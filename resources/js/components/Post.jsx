import React, { useEffect, useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import Modal from '@/components/Modal';
import Comments from './Comments';
import LikeButton from './LikeButton';
import axios from 'axios';

export default function Posts({ userId }) {
    const [posts, setPosts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [activePostId, setActivePostId] = useState(null);

    useEffect(() => {
        if (userId) {
            axios.get(`/user/posts/${userId}`)
                .then(response => {
                    console.log("User posts:", response.data);
                    setPosts(response.data.posts);
                })
                .catch(error => console.error("Error fetching user posts:", error));
        } else {
            axios.get('/posts')
                .then(response => {
                    console.log("All posts:", response.data);
                    setPosts(response.data.posts);
                })
                .catch(error => console.error("Error fetching posts:", error));
        }
    }, [userId]); // 👈 Ensure updates when userId changes

    const openCommentModal = (postId) => {
        setActivePostId(postId);
        setShowModal(true);
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
            {posts.map((post) => (
                <div key={post.id} className="bg-white rounded-xl shadow-md mb-6 overflow-hidden">
                    {/* Header */}
                    <div className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="relative">
                                    <img
                                        src={post.user.avatar
                                            ? `http://127.0.0.1:8000/storage/users-avatar/${post.user.avatar}`
                                            : "/default-avatar.jpg"
                                        }
                                        alt="User Avatar"
                                        className="w-12 h-12 rounded-full object-cover border-2 border-blue-100"
                                    />
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{post.user.name}</h3>
                                    <p className="text-sm text-gray-500">
                                        {new Date(post.created_at).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <button className="text-gray-400 hover:text-gray-600">
                                <MoreHorizontal className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="px-4 py-2">
                        <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
                    </div>

                    {/* Image */}
                    {post.image && (
                        <div className="mt-2">
                            <img
                                src={`http://127.0.0.1:8000${post.image}`}
                                alt="Post Image"
                                className="w-full object-cover max-h-96"
                            />
                        </div>
                    )}

                    {/* Engagement */}
                    <div className="px-4 py-3 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                            <div className="flex space-x-4">
                                <LikeButton likeableType="App\Models\Post" likeableId={post.id} initialLiked={post.is_liked} likeCounter={post.likes_count} />

                                <button
                                    onClick={() => openCommentModal(post.id)}
                                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition"
                                >
                                    <MessageCircle className="w-5 h-5" />
                                    <span className="text-sm">{post.comments_count}</span>
                                </button>
                                <button className="flex items-center space-x-2 text-gray-600 hover:text-green-500 transition">
                                    <Share2 className="w-5 h-5" />
                                    <span className="text-sm">3</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Comment Modal */}
            {showModal && activePostId !== null && (
                <Comments
                    postId={activePostId}
                    showModal={showModal}
                    setShowModal={setShowModal}
                />
            )}
        </div>
    );
}
