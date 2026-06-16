import React, { useState } from "react";
import { FiHeart, FiMessageCircle, FiShare2, FiBookmark } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import api from "../../utils/api";
import toast from "react-hot-toast";
import "./Post.css";
import { useSelector } from "react-redux";

export const Post = ({ post, onPostUpdate }) => {
    const { user } = useSelector(state => state.user);
    console.log(user)
    const [isLiked, setIsLiked] = useState(
        post.likes.some((like) => like._id === localStorage.getItem("userId")),
    );
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [isLoadingComment, setIsLoadingComment] = useState(false);


    const handleLike = async () => {
        try {
        const response = await api.post(`/api/posts/${post._id}/like`);
        setIsLiked(response.data.liked);
        onPostUpdate(response.data.post);
        } catch (error) {
        toast.error("Failed to like post");
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        setIsLoadingComment(true);
        try {
        const response = await api.post(`/api/posts/${post._id}/comment`, {
            text: commentText,
        });
        setCommentText("");
        onPostUpdate(response.data.post);
        toast.success("Comment added");
        } catch (error) {
        toast.error("Failed to add comment");
        } finally {
        setIsLoadingComment(false);
        }
    };

    return (
        <div className="post">
            {/* Post Header */}
            <div className="post-header">
                <div className="post-user-info">
                    <img
                        src={post.user.profilePic}
                        alt={post.user.username}
                        className="post-avatar"
                    />
                    <div className="post-user-details">
                        <h3 className="post-username">{post.user.username}</h3>
                        <span className="post-time">
                        {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>
                <div className="post-menu">⋯</div>
            </div>

            {/* Post Image */}
            <div className="post-image-container">
                <img src={`${import.meta.env.VITE_BACKEND_URL}/${post.imageUrl}`} alt="Post" className="post-image" />
            </div>

            {/* Post Actions */}
            <div className="post-actions">
                <div className="post-actions-left">
                    <button
                        className={`post-action-btn ${isLiked ? "liked" : ""}`}
                        onClick={handleLike}
                    >
                        {isLiked ? <FaHeart /> : <FiHeart />}
                    </button>
                    <button
                        className="post-action-btn"
                        onClick={() => setShowComments(!showComments)}
                    >
                        <FiMessageCircle />
                    </button>
                    <button className="post-action-btn">
                        <FiShare2 />
                    </button>
                </div>
                <button className="post-action-btn bookmark">
                <FiBookmark />
                </button>
            </div>

            {/* Post Stats */}
            <div className="post-stats">
                <span className="likes-count">
                {post.likes.length > 0 &&
                    `${post.likes.length} ${post.likes.length === 1 ? "like" : "likes"}`}
                </span>
            </div>

            {/* Post Caption */}
            <div className="post-caption">
                <p>
                <strong>{post.user.username}</strong> {post.caption}
                </p>
            </div>

            {/* Comments Section */}
            {post.comments.length > 0 && !showComments && (
                <div className="post-comments-preview">
                <span
                    className="view-comments-link"
                    onClick={() => setShowComments(true)}
                >
                    View all {post.comments.length} comments
                </span>
                </div>
            )}

            {showComments && (
                <div className="post-comments">
                {post.comments.map((comment) => (
                    <div key={comment._id} className="comment">
                    <strong>{post.user.username}</strong> {comment.text}
                    </div>
                ))}
                </div>
            )}

            {/* Comment Input */}
            <form className="post-comment-form" onSubmit={handleAddComment}>
                <input
                    type="text"
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="comment-input"
                />
                <button
                    type="submit"
                    className="comment-submit"
                    disabled={isLoadingComment || !commentText.trim()}
                >
                    {isLoadingComment ? "..." : "Post"}
                </button>
            </form>
        </div>
    );
};
