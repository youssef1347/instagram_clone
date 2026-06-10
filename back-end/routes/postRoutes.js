const express = require("express");
const {
    createPost,
    getAllPosts,
    getPostsByUser,
    getPostById,
    likePost,
    addComment,
    deleteComment,
    deletePost,
} = require("../controllers/postController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const {uploads} = require("../utils/uploads");

const router = express.Router();


// Routes
router.post("/create", authMiddleware, uploads.single("image"), createPost);
router.get("/feed", authMiddleware, getAllPosts);
router.get("/user/:userId", authMiddleware, getPostsByUser);
router.get("/:postId", authMiddleware, getPostById);
router.post("/:postId/like", authMiddleware, likePost);
router.post("/:postId/comment", authMiddleware, addComment);
router.delete("/:postId/comment/:commentId", authMiddleware, deleteComment);
router.delete("/:postId", authMiddleware, deletePost);

module.exports = router;
