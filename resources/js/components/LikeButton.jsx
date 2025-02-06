import { useState } from 'react';
import axios from 'axios';
import { Heart } from 'lucide-react';

export default function LikeButton({ likeableType, likeableId, initialLiked }) {
    const [liked, setLiked] = useState(initialLiked);

    const toggleLike = () => {
        if (liked) {
            axios.delete('/like', { data: { likeable_type: likeableType, likeable_id: likeableId } })
                .then(() => setLiked(false))
                .catch(error => console.error('Error removing like:', error));
        } else {
            axios.post('/like', { likeable_type: likeableType, likeable_id: likeableId })
                .then(() => setLiked(true))
                .catch(error => console.error('Error adding like:', error));
        }
    };

    return (
        <button
            onClick={toggleLike}
            className="flex items-center space-x-2 transition"
        >
            <Heart className={`w-5 h-5 ${liked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
            <span className={`text-sm ${liked ? 'text-red-500' : 'text-gray-600'}`}>
                {liked ? 'Liked' : 'Like'}
            </span>
        </button>
    );
}
