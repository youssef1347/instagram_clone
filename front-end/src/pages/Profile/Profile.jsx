import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../../utils/api";
import { SideNavbar } from "../../components/SideNavbar/SideNavbar";
import "./Profile.css";

export const Profile = () => {
    const { userId } = useParams();
    const { user } = useSelector((state) => state.user);
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [profileUser, setProfileUser] = useState(null);

    useEffect(() => {
        if (user && user._id === userId) {
        setProfileUser(user);
        } else {
        setProfileUser(null);
        }
    }, [user, userId]);

    useEffect(() => {
        const fetchUserPosts = async () => {
        setIsLoading(true);
        try {
            const response = await api.get(`/api/posts/user/${userId}`);
            setPosts(response.data.posts || []);
        } catch (error) {
            console.error(error);
            setPosts([]);
        } finally {
            setIsLoading(false);
        }
        };

        if (userId) {
        fetchUserPosts();
        }
    }, [userId]);

    return (
        <div className="profile-page">
            <SideNavbar />
            <main className="profile-main">
                <section className="profile-header-card">
                <div className="profile-avatar-card">
                    <img
                    src={
                        profileUser?.profilePic ||
                        user?.profilePic
                    }
                    alt={profileUser?.username || "Profile"}
                    className="profile-avatar"
                    />
                </div>

                <div className="profile-user-info">
                    <div className="profile-title-row">
                    <div>
                        <h1>{profileUser?.username || "Unknown User"}</h1>
                        <p className="profile-handle">
                        @{profileUser?.username || userId}
                        </p>
                    </div>
                    <button className="profile-action-btn">
                        {profileUser?._id === user?._id ? "Edit Profile" : "Follow"}
                    </button>
                    </div>

                    <p className="profile-bio">
                    {profileUser?.bio || "This user has no bio yet."}
                    </p>

                    <div className="profile-stats">
                    <div>
                        <strong>{posts.length}</strong>
                        <span>Posts</span>
                    </div>
                    <div>
                        <strong>{profileUser?.followers?.length ?? 0}</strong>
                        <span>Followers</span>
                    </div>
                    <div>
                        <strong>{profileUser?.following?.length ?? 0}</strong>
                        <span>Following</span>
                    </div>
                    </div>
                </div>
                </section>

                <section className="profile-posts-section">
                <div className="profile-posts-header">
                    <h2>Posts</h2>
                </div>

                {isLoading ? (
                    <div className="profile-loading">Loading posts...</div>
                ) : posts.length === 0 ? (
                    <div className="profile-empty-state">
                    <p>No posts yet.</p>
                    </div>
                ) : (
                    <div className="profile-posts-grid">
                    {posts.map((post) => (
                        <div key={post._id} className="profile-post-card">
                        <img
                            src={`http://localhost:5000/${post.imageUrl}`}
                            alt={post.caption || "Post image"}
                        />
                        </div>
                    ))}
                    </div>
                )}
                </section>
            </main>
        </div>
    );
};
