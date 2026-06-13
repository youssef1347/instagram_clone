const express = require("express");
const {
  getConversations,
  getMessages,
  getOrCreateConversation,
  markConversationRead,
  sendMessage,
} = require("../controllers/chatController");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getConversations);
router.post("/with/:userId", authMiddleware, getOrCreateConversation);
router.get("/:conversationId/messages", authMiddleware, getMessages);
router.post("/:conversationId/messages", authMiddleware, sendMessage);
router.patch("/:conversationId/read", authMiddleware, markConversationRead);

module.exports = router;
