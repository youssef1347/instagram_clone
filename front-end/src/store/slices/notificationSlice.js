import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload.notifications || [];
      state.unreadCount = action.payload.unreadCount || 0;
    },
    setNotificationsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    addNotification: (state, action) => {
      const exists = state.notifications.some(
        (notification) => notification._id === action.payload._id,
      );

      if (exists) return;

      state.notifications.unshift(action.payload);

      if (!action.payload.isRead) {
        state.unreadCount += 1;
      }
    },
    markNotificationReadInState: (state, action) => {
      const notification = state.notifications.find(
        (item) => item._id === action.payload,
      );

      if (notification && !notification.isRead) {
        notification.isRead = true;
        state.unreadCount = Math.max(state.unreadCount - 1, 0);
      }
    },
    markAllNotificationsReadInState: (state) => {
      state.notifications = state.notifications.map((notification) => ({
        ...notification,
        isRead: true,
      }));
      state.unreadCount = 0;
    },
    removeNotificationFromState: (state, action) => {
      const removed = state.notifications.find(
        (notification) => notification._id === action.payload,
      );

      state.notifications = state.notifications.filter(
        (notification) => notification._id !== action.payload,
      );

      if (removed && !removed.isRead) {
        state.unreadCount = Math.max(state.unreadCount - 1, 0);
      }
    },
    clearNotificationsInState: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
  },
});

export const {
  addNotification,
  setNotifications,
  setNotificationsLoading,
  markNotificationReadInState,
  markAllNotificationsReadInState,
  removeNotificationFromState,
  clearNotificationsInState,
} = notificationSlice.actions;

export default notificationSlice.reducer;
