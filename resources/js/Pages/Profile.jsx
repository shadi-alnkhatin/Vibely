import React, { useState } from "react";
import { Head, usePage } from "@inertiajs/react";
import axios from "axios"; 
import Posts from "@/components/Post";

export default function Profile() {
    const { user, SenderFriendStatus, ReceiverFriendStatus } = usePage().props;

    const [senderStatus, setSenderStatus] = useState(SenderFriendStatus);
    const [receiverStatus, setReceiverStatus] = useState(ReceiverFriendStatus);

    function sendFriendRequest(userId) {
        axios.post("/add-friend", { friend_id: userId })
            .then(() => {
                setSenderStatus("pending"); // Update state
            })
            .catch(error => console.error("Error sending request:", error));
    }

    function rejectFriendRequest(userId) {
        axios.delete(`/reject/friend/${userId}`)
           .then(() => {
                setSenderStatus(null); // Reset status
            })
           .catch(error => console.error("Error canceling request:", error));
    }

    function acceptFriendRequest(userId) {
        axios.put(`/accept/friend/${userId}`)
           .then(() => {
                setReceiverStatus("accepted"); // Mark as accepted
            })
           .catch(error => console.error("Error accepting request:", error));
    }

    function declineFriendRequest(userId) {
        axios.delete(`/remove/friend/${userId}`)
           .then(() => {
                setReceiverStatus(null); // Reset status
                setSenderStatus(null); // Reset status
            })
           .catch(error => console.error("Error declining request:", error));
    }

    return (
    <div className="container mx-auto p-6">
        <Head title={`${user.name}'s Profile`} />

        <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg my-3 p-6">
            {/* Profile Header */}
            <div className="flex items-center space-x-4">
                <img
                    src={user.avatar ? `/storage/users-avatar/${user.avatar}` : "/default-avatar.png"}
                    alt="User Avatar"
                    className="w-24 h-24 rounded-full border"
                />
                <div>
                    <h1 className="text-2xl font-bold">{user.name}</h1>
                    <p className="text-gray-600">@{user.username}</p>
                </div>
            </div>

            {/* Profile Details */}
            <div className="mt-4">
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Joined:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
            </div>

            {/* Actions */}
            <div className="mt-6 flex space-x-4">
                {/* Send Friend Request */}
                {senderStatus == null && receiverStatus == null && (
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                        onClick={() => sendFriendRequest(user.id)}
                    >
                        Send Friend Request
                    </button>
                )}

                {/* Pending Request */}
                {senderStatus === "pending" && (
                    <button
                        className="px-4 py-2 bg-gray-500 text-white rounded"
                        onClick={() => rejectFriendRequest(user.id)}
                    >
                        Cancel Request
                    </button>
                )}

                {/* Accept Friend Request */}
                {receiverStatus === "pending" && (
                    <button
                        className="px-4 py-2 bg-green-500 text-white rounded"
                        onClick={() => acceptFriendRequest(user.id)}
                    >
                        Accept Request
                    </button>
                )}

                {/* Already Friends */}
                {senderStatus === "accepted" || receiverStatus === "accepted" ? (
                    <button
                        className="px-4 py-2 bg-green-500 text-white rounded"
                        onClick={() => declineFriendRequest(user.id)}
                    >
                        Friends
                    </button>
                ) : null}

                {/* Message Button */}
                <button className="px-4 py-2 bg-gray-500 text-white rounded">Message</button>
            </div>

        </div>
            {/* Posts */}
            <Posts userId={user.id}></Posts>
    </div>
    );
}
