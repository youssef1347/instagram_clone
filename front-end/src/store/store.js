import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice.js';
import notificationReducer from './slices/notificationSlice.js';

export const store = configureStore({
  reducer: {
    user: userReducer,
    notifications: notificationReducer,
  },
});
