const Notification = require("../models/notifications");

const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    const notifications = await Notification.find({ recipient: userId })
      .populate("actor", "username profilePic")
      .populate("post", "imageUrl caption")
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      recipient: userId,
      isRead: false,
    });

    res.json({
      message: "Notifications retrieved successfully",
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

const markNotificationRead = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { notificationId } = req.params;

    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, recipient: userId },
      { isRead: true },
      { new: true },
    )
      .populate("actor", "username profilePic")
      .populate("post", "imageUrl caption");

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    const unreadCount = await Notification.countDocuments({
      recipient: userId,
      isRead: false,
    });

    res.json({
      message: "Notification marked as read",
      notification,
      unreadCount,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

const markAllNotificationsRead = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    await Notification.updateMany(
      { recipient: userId, isRead: false },
      { isRead: true },
    );

    res.json({ message: "All notifications marked as read", unreadCount: 0 });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { notificationId } = req.params;

    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      recipient: userId,
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    const unreadCount = await Notification.countDocuments({
      recipient: userId,
      isRead: false,
    });

    res.json({ message: "Notification deleted", unreadCount });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

const clearNotifications = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    await Notification.deleteMany({ recipient: userId });

    res.json({ message: "Notifications cleared", unreadCount: 0 });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  clearNotifications,
};
