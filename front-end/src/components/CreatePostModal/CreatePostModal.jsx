import React, { useState } from "react";
import toast from "react-hot-toast";
import api from "../../utils/api";
import "./CreatePostModal.css";

export const CreatePostModal = ({ isOpen, onClose, onPostCreated }) => {
    const [caption, setCaption] = useState("");
    const [imageUrl, setImageUrl] = useState(null);
    const [previewSrc, setPreviewSrc] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) {
        setImageUrl(null);
        setPreviewSrc(null);
        return;
        }

        setImageUrl(file);
        setPreviewSrc(URL.createObjectURL(file));
    };

    const resetForm = () => {
        setCaption("");
        setImageUrl(null);
        setPreviewSrc(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!imageUrl) {
        toast.error("Please choose an image for your post.");
        return;
        }

        setIsSubmitting(true);
        try {
        const formData = new FormData();
        formData.append("caption", caption);
        formData.append("image", imageUrl);

        const response = await api.post("/api/posts/create", formData);

        toast.success("Post created successfully!");
        onPostCreated(response.data.post);
        resetForm();
        onClose();
        } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Unable to create post.");
        } finally {
        setIsSubmitting(false);
        }
    };

    if (!isOpen) {
        return null;
    }

  return (
    <div className="create-post-overlay" onClick={onClose}>
      <div className="create-post-modal" onClick={(e) => e.stopPropagation()}>
        <div className="create-post-header">
          <h2>Create Post</h2>
          <button className="close-modal-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form className="create-post-form" onSubmit={handleSubmit}>
          <label className="create-post-label" htmlFor="post-image">
            Image
          </label>
          <input
            id="post-image"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="create-post-input"
          />

          {previewSrc ? (
            <div className="create-post-preview">
              <img src={previewSrc} alt="Preview" />
            </div>
          ) : (
            <div className="create-post-placeholder">
              Select an image to preview your post.
            </div>
          )}

          <label className="create-post-label" htmlFor="post-caption">
            Caption
          </label>
          <textarea
            id="post-caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="create-post-textarea"
            placeholder="Write a caption..."
            rows={4}
          />

          <button className="create-post-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Posting..." : "Post"}
          </button>
        </form>
      </div>
    </div>
  );
};
