const express = require("express");
const {
  followUser,
  getUserById,
  getUserData,
  searchUsers,
  test,
  unfollowUser,
} = require("../controllers/userController");
const router = express.Router();
const { authMiddleware } = require("../middlewares/authMiddleware");

router.get("/me", authMiddleware, getUserData);
router.get("/search", authMiddleware, searchUsers);
router.get("/test", authMiddleware, test);
router.get("/:userId", authMiddleware, getUserById);
router.post("/:userId/follow", authMiddleware, followUser);
router.post("/:userId/unfollow", authMiddleware, unfollowUser);

module.exports = router;
