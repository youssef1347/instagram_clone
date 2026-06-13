import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import api from "../../utils/api";
import { SideNavbar } from "../../components/SideNavbar/SideNavbar";
import { setUser } from "../../store/slices/userSlice";
import "./Profile.css";

export const Profile = () => {
    const { userId } = useParams();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [profileUser, setProfileUser] = useState(null);
    const [isProfileLoading, setIsProfileLoading] = useState(true);
    const [isFollowLoading, setIsFollowLoading] = useState(false);

    const isOwnProfile = user?._id === userId;
    const isFollowing = useMemo(
        () =>
        Boolean(
            profileUser?.followers?.some((followerId) => followerId === user?._id),
        ),
        [profileUser?.followers, user?._id],
    );

    useEffect(() => {
        const fetchProfileUser = async () => {
        setIsProfileLoading(true);
        try {
            const response = await api.get(`/api/user/${userId}`);
            setProfileUser(response.data.user);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load profile");
            setProfileUser(null);
        } finally {
            setIsProfileLoading(false);
        }
        };

        if (userId) {
        fetchProfileUser();
        }
    }, [userId]);

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

    const handleFollowToggle = async () => {
        if (!profileUser || isOwnProfile || isFollowLoading) return;

        setIsFollowLoading(true);
        try {
            const endpoint = isFollowing ? "unfollow" : "follow";
            const response = await api.post(`/api/user/${profileUser._id}/${endpoint}`);

            setProfileUser(response.data.user);
            dispatch(setUser(response.data.currentUser));
            toast.success(response.data.message);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to update follow");
        } finally {
            setIsFollowLoading(false);
        }
    };

    return (
        <div className="profile-page">
            <SideNavbar />
            <main className="profile-main">
                <section className="profile-header-card">
                <div className="profile-avatar-card">
                    <img
                    src={
                        profileUser?.profilePic ||
                        "http://localhost:5000/uploads/default-profile-pic.jpg"
                    }
                    alt={profileUser?.username || "Profile"}
                    className="profile-avatar"
                    />
                </div>

                <div className="profile-user-info">
                    <div className="profile-title-row">
                    <div>
                        <h1>
                        {isProfileLoading
                            ? "Loading..."
                            : profileUser?.username || "Unknown User"}
                        </h1>
                        <p className="profile-handle">
                        @{profileUser?.username || userId}
                        </p>
                    </div>
                    <button
                        className={`profile-action-btn ${isFollowing ? "following" : ""}`}
                        onClick={handleFollowToggle}
                        disabled={isOwnProfile || isProfileLoading || isFollowLoading}
                    >
                        {isOwnProfile
                            ? "Edit Profile"
                            : isFollowLoading
                                ? "Updating..."
                                : isFollowing
                                ? "Following"
                                : "Follow"}
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
