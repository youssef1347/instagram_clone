const express = require("express");
const {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  clearNotifications,
} = require("../controllers/notificationController");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getNotifications);
router.patch("/read-all", authMiddleware, markAllNotificationsRead);
router.patch("/:notificationId/read", authMiddleware, markNotificationRead);
router.delete("/:notificationId", authMiddleware, deleteNotification);
router.delete("/", authMiddleware, clearNotifications);

module.exports = router;
