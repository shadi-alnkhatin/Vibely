import React, { useEffect, useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal,CircleX } from 'lucide-react';
import Modal from '@/components/Modal';

export default function Posts() {
    const [posts, setPosts] = useState([]);
    const [showModal, setShowModal] = useState(false);


    useEffect(() => {
        axios.get('/posts')
            .then(response => setPosts(response.data.posts))
            .catch(error => console.error("Error fetching posts:", error));
    }, []);

    const openModal = (post) => {
        setShowModal(true);
    };


    return (
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
            {posts.map((post) => (
                <div key={post.id} className="bg-white rounded-xl shadow-md mb-6 overflow-hidden">
                    {/* Header Section */}
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

                    {/* Content Section */}
                    <div className="px-4 py-2">
                        <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
                    </div>

                    {/* Image Section */}
                    {post.image && (
                        <div className="mt-2">
                            <img
                                src={`http://127.0.0.1:8000${post.image}`}
                                alt="Post Image"
                                className="w-full object-cover max-h-96"
                            />
                        </div>
                    )}

                    {/* Engagement Section */}
                    <div className="px-4 py-3 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                            <div className="flex space-x-4">
                                <button className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition">
                                    <Heart className="w-5 h-5" />
                                    <span className="text-sm">24</span>
                                </button>
                                <button onClick={openModal} className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition">
                                    <MessageCircle className="w-5 h-5" />
                                    <span className="text-sm">12</span>
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

<Modal show={showModal} onClose={() => setShowModal(false)}>
            <div className="p-4">
                {/* Header Section */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3 className="text-lg font-semibold">Comments</h3>
                    <button className="btn btn-light" onClick={() => setShowModal(false)}>
                        <CircleX size={20} />
                    </button>
                </div>

                {/* Comments Section */}
                <p className="text-muted">No comments yet.</p>

                {/* Comment Form */}
                <form>
                    <div className="input-group mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Write a comment..."
                        />
                        <button type="submit" className="btn btn-primary">
                            Comment
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
        </div>
    );
}
