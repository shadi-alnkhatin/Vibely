import { useState, useEffect } from "react";
import axios from "axios";
import "../css/add-friend.css";

export default function PeopleYouMayKnow() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get("/people-you-may-know")
            .then(response => setUsers(response.data.suggested_users))
            .catch(error => console.error("Error fetching users:", error));
    }, []);

    function sendFriendRequest(userId) {
        axios.post("/add-friend", { friend_id: userId })
            .then(response => ()=>{
                const updatedUsers=users.filter(user => user.id !== userId);
                setUsers(updatedUsers);
            })
            .catch(error => console.error("Error sending request:", error));
    }


    return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100">
            <h3 className="m-3 text-lg text-pretty">People You May Know</h3>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="people-nearby">
                            {users.map((user) => (
                                <div className="nearby-user" key={user.id}>
                                    <div className="row ">
                                        <div className="col-md-2 col-sm-2">
                                            <img
                                                src={user.avatar
                                                    ? `http://127.0.0.1:8000/storage/users-avatar/${user.avatar}`
                                                    : "/default-avatar.jpg"
                                                }
                                                alt="user"
                                                className="profile-photo-lg"
                                            />
                                        </div>
                                        <div className="col-md-7 col-sm-7">
                                            <h5>
                                                <a href="#" className="profile-link">{user.name}</a>
                                            </h5>

                                        </div>
                                        <div className="col-md-3 col-sm-3">
                                            <button
                                                className="btn btn-primary pull-right"
                                                onClick={() => sendFriendRequest(user.id)}
                                            >
                                                Add Friend
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
