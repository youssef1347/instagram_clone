import React, { useEffect, useState } from "react";
import "./Home.css";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Post } from "../../components/Post/Post";
import { SideNavbar } from "../../components/SideNavbar/SideNavbar";
import { CreatePostModal } from "../../components/CreatePostModal/CreatePostModal";

export const Home = () => {
    const { user } = useSelector((state) => state.user);
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

    useEffect(() => {
      fetchFeed();
    }, []);

    const fetchFeed = async () => {
        try {
        setIsLoading(true);
            const response = await api.get("/api/posts/feed");
            console.log(response);
        setPosts(response.data.posts);
        } catch (error) {
        toast.error("Failed to load feed");
        console.log(error);
        } finally {
        setIsLoading(false);
        }
    };

    const handlePostUpdate = (updatedPost) => {
        setPosts(
        posts.map((post) => (post._id === updatedPost._id ? updatedPost : post)),
        );
    };

    const handleOpenCreatePost = () => setIsCreatePostOpen(true);
    const handleCloseCreatePost = () => setIsCreatePostOpen(false);
    const handlePostCreated = (newPost) => {
        setPosts([newPost, ...posts]);
    };

    return (
        <>
        <SideNavbar onOpenCreatePost={handleOpenCreatePost} />
        <CreatePostModal
            isOpen={isCreatePostOpen}
            onClose={handleCloseCreatePost}
            onPostCreated={handlePostCreated}
        />
        <div className="home-container">
            {/* Main Feed */}
            <main className="feed">
            {/* Stories Section */}
            <div className="stories-container">
                <div className="stories">
                <div className="story">
                    <img
                    src={user?.profilePic}
                    alt="Your story"
                    className="story-avatar"
                    />
                    <span className="story-label">Your story</span>
                </div>
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="story">
                    <img
                        src={`${import.meta.env.VITE_BACKEND_URL}/uploads/default-profile-pic.jpg`}
                        alt={`User${i}`}
                        className="story-avatar"
                    />
                    <span className="story-label">{`User${i}`}</span>
                    </div>
                ))}
                </div>
            </div>

            {/* Posts Feed */}
            <div className="posts-feed">
                {isLoading ? (
                <div className="loading">
                    <p>Loading posts...</p>
                </div>
                ) : posts.length === 0 ? (
                <div className="no-posts">
                    <p>No posts yet. Follow some users to see their posts!</p>
                </div>
                ) : (
                posts.map((post) => (
                    <Post
                    key={post._id}
                    post={post}
                    onPostUpdate={handlePostUpdate}
                    />
                ))
                )}
            </div>
            </main>

        {/* Right Sidebar - Suggestions */}
        <aside className="suggestions">
          <div className="user-card">
            <div className="current-user">
              <img
                src={user?.profilePic}
                alt={user?.username}
                className="avatar-large"
              />
              <div className="user-info">
                <h3>{user?.username}</h3>
                <p>@{user?.username}</p>
              </div>
            </div>
          </div>

          <div className="suggestions-section">
            <div className="suggestions-header">
              <h4>Suggestions For You</h4>
              <a href="#">See All</a>
            </div>
            <div className="suggestions-list">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="suggestion-item">
                  <div className="suggestion-user">
                    <img
                      src={`${import.meta.env.VITE_BACKEND_URL}/uploads/default-profile-pic.jpg`}
                      alt={`User${i}`}
                    />
                    <div>
                      <p className="username">{`user${i}`}</p>
                      <p className="text">Popular</p>
                    </div>
                  </div>
                  <button className="follow-btn">Follow</button>
                </div>
              ))}
            </div>
          </div>

          <footer className="footer-info">
            <p>© 2024 Instagram Clone</p>
          </footer>
        </aside>
      </div>
    </>
  );
};
