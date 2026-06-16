import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import { addNotification } from "../../store/slices/notificationSlice";

export const NotificationSocket = () => {
  const dispatch = useDispatch();
  const [token, setToken] = useState(() => localStorage.getItem("accessToken"));

  useEffect(() => {
    const syncToken = () => setToken(localStorage.getItem("accessToken"));

    window.addEventListener("auth-token-changed", syncToken);
    window.addEventListener("storage", syncToken);

    return () => {
      window.removeEventListener("auth-token-changed", syncToken);
      window.removeEventListener("storage", syncToken);
    };
  }, []);

  useEffect(() => {
    if (!token) return undefined;

    const socket = io(`${import.meta.env.VITE_BACKEND_URL}`, {
      auth: { token },
      withCredentials: true,
    });

    socket.on("notification:new", (notification) => {
      dispatch(addNotification(notification));
      toast(notification.message);
    });

    socket.on("connect_error", (error) => {
      console.log(error.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch, token]);

  return null;
};
