const Post = require("../models/posts");
const User = require("../models/users");
const Notification = require("../models/notifications");
const { emitNotification } = require("../utils/socket");

// create post
const createPost = async (req, res) => {
  try {
        if (!req.file) {
        return res.status(400).json({ message: "No image file uploaded" });
        }

        const { caption } = req.body;
        const imageUrl = req.file.path;

        // create post in the database
        const newPost = await Post.create({
        user: req.user.id,
        caption,
        imageUrl,
        });

        // Populate user info for response
        await newPost.populate("user", "username profilePic");

        res
        .status(201)
        .json({ message: "Post created successfully", post: newPost });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

// get all posts (for feed)
const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
        .populate("user", "username profilePic")
        .populate("comments.user", "username profilePic")
        .sort({ createdAt: -1 });

        res.json({ message: "Posts retrieved successfully", posts });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

// get posts by user ID
const getPostsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const posts = await Post.find({ user: userId })
      .populate("user", "username profilePic")
      .populate("comments.user", "username profilePic")
      .sort({ createdAt: -1 });

    res.json({ message: "User posts retrieved successfully", posts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// get single post
const getPostById = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId)
      .populate("user", "username profilePic")
      .populate("comments.user", "username profilePic");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json({ message: "Post retrieved successfully", post });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// like post
const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id || req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user already liked the post
    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      // Unlike post
      post.likes = post.likes.filter((id) => !id.equals(userId));
    } else {
      // Like post
      post.likes.push(userId);

      if (!post.user.equals(userId)) {
        const actor = await User.findById(userId).select("username");

        const notification = await Notification.create({
          recipient: post.user,
          actor: userId,
          post: post._id,
          type: "like",
          message: `${actor?.username || "Someone"} liked your post`,
        });

        await notification.populate("actor", "username profilePic");
        await notification.populate("post", "imageUrl caption");
        emitNotification(post.user, notification);
      }
    }

    await post.save();
    await post.populate("user", "username profilePic");

    res.json({
      message: alreadyLiked ? "Post unliked" : "Post liked",
      post,
      liked: !alreadyLiked,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// add comment
const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;
    const userId = req.user.id || req.user._id;

    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.comments.push({
      user: userId,
      text,
    });

    if (!post.user.equals(userId)) {
      const actor = await User.findById(userId).select("username");

      const notification = await Notification.create({
        recipient: post.user,
        actor: userId,
        post: post._id,
        type: "comment",
        message: `${actor?.username || "Someone"} commented on your post`,
      });

      await notification.populate("actor", "username profilePic");
      await notification.populate("post", "imageUrl caption");
      emitNotification(post.user, notification);
    }

    await post.save();
    await post.populate("user", "username profilePic");
    await post.populate("comments.user", "username profilePic");

    res.json({ message: "Comment added successfully", post });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// delete comment
const deleteComment = async (req, res) => {
    try {
        const { postId, commentId } = req.params;
        const userId = req.user.id;

        const post = await Post.findById(postId);

        if (!post) {
        return res.status(404).json({ message: "Post not found" });
        }

        const comment = post.comments.id(commentId);

        if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
        }

        // Check if user owns the comment
        if (!comment.user.equals(userId)) {
        return res
            .status(403)
            .json({ message: "Not allowed to delete this comment" });
        }

        post.comments.id(commentId).deleteOne();
        await post.save();

        res.json({ message: "Comment deleted successfully", post });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

// delete post
const deletePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user.id;

        const post = await Post.findById(postId);

        if (!post) {
        return res.status(404).json({ message: "Post not found" });
        }

        // Check if user owns the post
        if (!post.user.equals(userId)) {
        return res
            .status(403)
            .json({ message: "Not allowed to delete this post" });
        }

        await Post.findByIdAndDelete(postId);

        res.json({ message: "Post deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    createPost,
    getAllPosts,
    getPostsByUser,
    getPostById,
    likePost,
    addComment,
    deleteComment,
    deletePost,
};
