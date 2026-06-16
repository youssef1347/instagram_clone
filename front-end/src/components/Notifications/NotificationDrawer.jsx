import { useCallback, useEffect } from "react";
import "./NotificationDrawer.css";
import { FiCheck, FiRefreshCw, FiTrash2, FiUserPlus, FiX } from "react-icons/fi";
import { FaRegComment, FaRegHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../utils/api";
import {
  clearNotificationsInState,
  markAllNotificationsReadInState,
  markNotificationReadInState,
  removeNotificationFromState,
  setNotifications,
  setNotificationsLoading,
} from "../../store/slices/notificationSlice";

const getNotificationIcon = (type) => {
  if (type === "comment") return <FaRegComment />;
  if (type === "follow") return <FiUserPlus />;
  return <FaRegHeart />;
};

const formatNotificationTime = (createdAt) => {
  const diffMs = Date.now() - new Date(createdAt).getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) return "now";
  if (diffMinutes < 60) return `${diffMinutes}m`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h`;

  return `${Math.floor(diffHours / 24)}d`;
};

export const NotificationDrawer = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notifications, unreadCount, isLoading } = useSelector(
    (state) => state.notifications,
  );

  const fetchNotifications = useCallback(async () => {
    try {
      dispatch(setNotificationsLoading(true));
      const response = await api.get("/api/notifications");
      dispatch(
        setNotifications({
          notifications: response.data.notifications,
          unreadCount: response.data.unreadCount,
        }),
      );
    } catch (error) {
      toast.error("Failed to load notifications");
      console.log(error);
    } finally {
      dispatch(setNotificationsLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [fetchNotifications, isOpen]);

  const handleMarkRead = async (notificationId) => {
    try {
      dispatch(markNotificationReadInState(notificationId));
      await api.patch(`/api/notifications/${notificationId}/read`);
    } catch (error) {
      toast.error("Failed to update notification");
      fetchNotifications();
      console.log(error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      dispatch(markAllNotificationsReadInState());
      await api.patch("/api/notifications/read-all");
    } catch (error) {
      toast.error("Failed to update notifications");
      fetchNotifications();
      console.log(error);
    }
  };

  const handleDelete = async (event, notificationId) => {
    event.stopPropagation();

    try {
      dispatch(removeNotificationFromState(notificationId));
      await api.delete(`/api/notifications/${notificationId}`);
    } catch (error) {
      toast.error("Failed to delete notification");
      fetchNotifications();
      console.log(error);
    }
  };

  const handleClearAll = async () => {
    try {
      dispatch(clearNotificationsInState());
      await api.delete("/api/notifications");
    } catch (error) {
      toast.error("Failed to clear notifications");
      fetchNotifications();
      console.log(error);
    }
  };

  const handleOpenNotification = (notification) => {
    if (!notification.isRead) {
      handleMarkRead(notification._id);
    }

    if (notification.actor?._id) {
      navigate(`/${notification.actor._id}`);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <aside className="notification-drawer" aria-label="Notifications">
      <div className="notification-drawer-header">
        <div>
          <h2>Notifications</h2>
          <p>{unreadCount} unread</p>
        </div>
        <button
          type="button"
          className="notification-icon-button"
          onClick={onClose}
          aria-label="Close notifications"
          title="Close"
        >
          <FiX />
        </button>
      </div>

      <div className="notification-actions">
        <button
          type="button"
          onClick={fetchNotifications}
          disabled={isLoading}
          title="Refresh"
        >
          <FiRefreshCw /> Refresh
        </button>
        <button
          type="button"
          onClick={handleMarkAllRead}
          disabled={!unreadCount}
          title="Mark all as read"
        >
          <FiCheck /> Mark read
        </button>
        <button
          type="button"
          onClick={handleClearAll}
          disabled={!notifications.length}
          title="Clear all"
        >
          <FiTrash2 /> Clear
        </button>
      </div>

      <div className="notification-list">
        {isLoading ? (
          <p className="notification-empty">Loading notifications...</p>
        ) : notifications.length === 0 ? (
          <p className="notification-empty">No notifications yet.</p>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification._id}
              className={`notification-item ${
                notification.isRead ? "" : "notification-item-unread"
              }`}
            >
              <button
                type="button"
                className="notification-item-main"
                onClick={() => handleOpenNotification(notification)}
              >
                <span className="notification-avatar-wrap">
                  <img
                    src={notification.actor?.profilePic}
                    alt={notification.actor?.username || "User"}
                    className="notification-avatar"
                  />
                  <span className="notification-type-icon">
                    {getNotificationIcon(notification.type)}
                  </span>
                </span>

                <span className="notification-content">
                  <span className="notification-message">
                    {notification.message}
                  </span>
                  <span className="notification-time">
                    {formatNotificationTime(notification.createdAt)}
                  </span>
                </span>

                {notification.post?.imageUrl && (
                  <img
                    src={`${import.meta.env.VITE_BACKEND_URL}/${notification.post.imageUrl}`}
                    alt=""
                    className="notification-post-thumb"
                  />
                )}
              </button>

              <button
                type="button"
                className="notification-delete"
                title="Delete notification"
                onClick={(event) => handleDelete(event, notification._id)}
              >
                <FiTrash2 />
              </button>
            </div>
          ))
        )}
      </div>
    </aside>
  );
};
