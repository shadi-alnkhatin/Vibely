import React, { useEffect, useState } from 'react';
import { CircleX } from 'lucide-react';
import Modal from '@/components/Modal';
import axios from 'axios';
import Pusher from "pusher-js";

// Initialize Pusher once
const pusher = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
    cluster: import.meta.env.VITE_PUSHER_CLUSTER,
    forceTLS: true
});

export default function Comments({ postId, showModal, setShowModal }) {
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);

    useEffect(() => {
        if (!postId) return;

        axios.get(`/post/comments/${postId}`)
            .then(response => setComments(response.data.comments || []))
            .catch(error => {
                console.error('Error fetching comments:', error);
                setComments([]);
            });

        const channelName = `post.${postId}`;
        const channel = pusher.subscribe(channelName);

        channel.bind('NewComment', (event) => {
            console.log("New comment received:", event.comment);
            setComments(prevComments => [event.comment, ...prevComments]);
        });

        // Handle subscription errors
        channel.bind('pusher:subscription_error', (status) => {
            console.error('Pusher subscription error:', status);
        });

        return () => {
            pusher.unsubscribe(channelName);
        };
    }, [postId]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();

        if (comment.trim()) {
            try {
                const response = await axios.post(`/comment/create`, {
                    content: comment,
                    post_id: postId
                });

                // setComments(prevComments => [response.data.comment, ...prevComments]);
                setComment('');
            } catch (error) {
                console.error('Error submitting comment:', error);
            }
        }
    };

    return (
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
                <div className="overflow-auto" style={{ maxHeight: '300px' }}>
                    {comments.length > 0 ? (
                        comments.map((comment, index) => (
                            <div key={index} className="mb-3">
                                <div className="d-flex align-items-center">
                                    <div className="mr-3">
                                        <img
                                            src={`http://127.0.0.1:8000/storage/users-avatar/${comment?.user?.avatar || 'default.png'}`}
                                            alt="User Avatar"
                                            className="rounded-circle"
                                            width="40"
                                            height="40"
                                        />
                                    </div>
                                    <div>
                                        <strong>{comment?.user?.name || 'Unknown User'}</strong>
                                        <p className="text-muted">{comment.content}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-muted">No comments yet.</p>
                    )}
                </div>

                {/* Comment Form */}
                <form onSubmit={handleCommentSubmit}>
                    <div className="input-group mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Write a comment..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <button type="submit" className="btn btn-primary">
                            Comment
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
