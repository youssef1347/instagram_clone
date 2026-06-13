import { useEffect } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import { Login } from "./pages/Login/Login";
import { Register } from "./pages/Register/Register";
import { Toaster } from "react-hot-toast";
import { VerifyOtp } from "./pages/VerifyOtp/VerifyOtp";
import { ForgotPassword } from "./pages/ForgotPassword/ForgotPassword";
import { ResetPassword } from "./pages/ResetPassword/ResetPassword";
import api from "./utils/api";
import { useDispatch } from "react-redux";
import { setUser } from "./store/slices/userSlice";
import { Home } from "./pages/Home/Home";
import { Settings } from "./pages/Settings/Settings";
import { Profile } from "./pages/Profile/Profile";
import { Search } from "./pages/Search/Search";
import { NotFound } from "./pages/NotFound/NotFound";
import { NotificationSocket } from "./components/Notifications/NotificationSocket";
import { Messages } from "./pages/Messages/Messages";

function App() {
  // check if user is logged in by checking for access token in local storage
  const accessToken = localStorage.getItem("accessToken");
  const dispatch = useDispatch();

  async function fetchUserData() {
    try {
      if (accessToken) {
        const response = await api.get("/api/user/me");
        console.log(response);
        dispatch(setUser(response.data.user));
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <>
      <Toaster />
      <NotificationSocket />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/settings/*" element={<Settings />} />
        <Route path="/:userId" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
