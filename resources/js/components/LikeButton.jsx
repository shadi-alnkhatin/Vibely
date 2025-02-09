import { useState ,useEffect} from 'react';
import axios from 'axios';
import { Heart } from 'lucide-react';

export default function LikeButton({ likeableType, likeableId, initialLiked, likeCounter }) {
    const [liked, setLiked] = useState(initialLiked);
    const [likeCount, setLikeCount] = useState(likeCounter);
    const pusher = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
        cluster: import.meta.env.VITE_PUSHER_CLUSTER, // Required
        forceTLS: true // Ensure it's secure
    });
    useEffect(() => {
        const channel = pusher.subscribe(`likes.Post`);

        channel.bind("LikeUpdated", (data) => {
            if (data.likeableId === likeableId) {
                setLikeCount(data.likeCount);
            }
        });

        return () => {
            pusher.unsubscribe("likes");
        };
    }, [likeableId]);


    const toggleLike = () => {
        if (liked) {
            axios.delete('/like', { data: { likeable_type: likeableType, likeable_id: likeableId } })
                .then(() => {
                    setLiked(false);

                })
                .catch(error => console.error('Error removing like:', error));
        } else {
            axios.post('/like', { likeable_type: likeableType, likeable_id: likeableId })
                .then(() => {
                    setLiked(true);
                })
                .catch(error => console.error('Error adding like:', error));
        }
    };

    return (
        <button
            onClick={toggleLike}
            className="flex items-center space-x-2 transition"
        >
            <Heart className={`w-5 h-5 ${liked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
            <span className="text-sm">
                {likeCount}
            </span>
        </button>
    );
}
