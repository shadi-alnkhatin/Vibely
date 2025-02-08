import { useState, useEffect } from "react";
import axios from "axios";
import "../css/add-friend.css";

export default function PendingFriendsRequest() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get("/friends/pending")
            .then(response => setUsers(response.data.pending_requests))
            .catch(error => console.error("Error fetching users:", error));
    }, []);

    function approveFriendRequest(friendID) {
        axios.post(`/accept/friend/${friendID}`)
            .then(() => {
                const updatedUsers = users.filter(user => user.user.id!== friendID);
                setUsers(updatedUsers);
            })
            .catch(error => console.error("Error sending request:", error));
    }
    function rejectFriendRequest(userId){
        axios.delete(`/reject/friend/${userId}`)
           .then(
            () => {
                const updatedUsers = users.filter(user => user.user.id!== userId);
                setUsers(updatedUsers);
            }
           )
           .catch(error => console.error("Error rejecting request:", error));
    }

    return (
        <div className="d-flex flex-column align-items-center justify-content-center ">
        <h3 className="my-5 text-lg text-pretty">Friend Request</h3>
            <div className="container">
                <div className="row  justify-content-center">
                    <div className="col-md-8">
                        <div className="people-nearby">
                            {users.map((user) => (
                                <div className="nearby-user" key={user.user.id}>
                                    <div className="row">
                                        <div className="col-md-2 col-sm-2">
                                            <img
                                                src={user.user.avatar
                                                    ? `http://127.0.0.1:8000/storage/users-avatar/${user.user.avatar}`
                                                    : "/default-avatar.jpg"
                                                }
                                                alt="user"
                                                className="profile-photo-lg"
                                            />
                                        </div>
                                        <div className="col-md-7 col-sm-7">
                                            <h5>
                                                <a href="#" className="profile-link">{user.user.name}</a>
                                            </h5>

                                        </div>
                                        <div className="col-md-3 col-sm-3 ">
                                            <button
                                                className="btn btn-primary pull-right d-block my-1 w-20"
                                                onClick={() => approveFriendRequest(user.user.id)}
                                            >
                                                Approve
                                            </button>
                                            <button
                                                className="btn btn-danger pull-right w-20"
                                                onClick={() => rejectFriendRequest(user.user.id)}
                                            >
                                                 Reject
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {users.length === 0 && (
                                <p className="text-center">No pending friend requests found.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
