import { useContext, useEffect, useState } from "react";
import "./SideNavbar.css";
import { FaInstagram } from "react-icons/fa";
import { LuSend } from "react-icons/lu";
import { IoSearchOutline } from "react-icons/io5";
import { CiHeart } from "react-icons/ci";
import { FiPlus } from "react-icons/fi";
import { GoVideo, GoHomeFill } from "react-icons/go";
import { SlCompass } from "react-icons/sl";
import { IoMdMenu } from "react-icons/io";
import { BsGearWide, BsMoon, BsSun } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import { NotificationDrawer } from "../Notifications/NotificationDrawer";
import api from "../../utils/api";
import {
    clearNotificationsInState,
    setNotifications,
} from "../../store/slices/notificationSlice";
import { clearUser } from "../../store/slices/userSlice";

export const SideNavbar = ({ onOpenCreatePost }) => {
    const [openMenu, setOpenMenu] = useState(false);
    const [openNotification, setOpenNotification] = useState(false);
    const { isDark, toggleTheme } = useContext(ThemeContext);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    const { unreadCount } = useSelector((state) => state.notifications);

    useEffect(() => {
        const fetchNotificationCount = async () => {
            try {
                const response = await api.get("/api/notifications");
                dispatch(
                    setNotifications({
                        notifications: response.data.notifications,
                        unreadCount: response.data.unreadCount,
                    }),
                );
            } catch (error) {
                console.log(error);
            }
        };

        if (localStorage.getItem("accessToken")) {
            fetchNotificationCount();
        }
    }, [dispatch]);

    return (
        <div className="navbar-main-container">
            {/* navbar container */}
            <div
                className={`navbar-container ${openMenu ? "navbar-container-static" : "navbar-container-active"}`}
            >
                <div className="navbar-instagram-logo-container ">
                <FaInstagram className="navbar-instagram-logo" />
                </div>

                {/* home link */}
                <NavLink to="/">
                <div className="home-link-container">
                    <GoHomeFill className="navbar-home-icon" />
                    <h5>Home</h5>
                </div>
                </NavLink>

            {/* reels link */}
                <NavLink to="/reels">
                <div className="reels-link-container">
                    <GoVideo className="navbar-reels-icon" />
                    <h5>Reels</h5>
                </div>
                </NavLink>

                {/* messages link */}
                <NavLink to="/messages">
                <div className="messages-link-container">
                    <LuSend className="navbar-messages-icon" />
                    <h5>Messages</h5>
                </div>
                </NavLink>

                {/* search link */}
                <NavLink to="/search">
                <div className="search-link-container">
                    <IoSearchOutline className="navbar-search-icon" />
                    <h5>Search</h5>
                </div>
                </NavLink>

                {/* explore link */}
                <NavLink to="/explore">
                <div className="explore-link-container">
                    <SlCompass className="navbar-explore-icon" />
                    <h5>Explore</h5>
                </div>
                </NavLink>

                {/* notifications link */}
                <div
                    className="notifications-link-container"
                    onClick={() => {
                        setOpenMenu(false);
                        setOpenNotification((prev) => !prev);
                    }}
                    >
                    <CiHeart className="navbar-notifications-icon" />
                    <h5>Notifications</h5>
                    {unreadCount > 0 && (
                        <span className="notification-badge">
                            {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                    )}
                </div>

                {/* create post link */}
                <div
                    className="create-post-link-container"
                    onClick={() => onOpenCreatePost?.()}
                    >
                    <FiPlus className="navbar-create-post-icon" />
                    <h5>Create</h5>
                </div>

                {/* profile link */}
                <NavLink to={`/${user?._id}`}>
                    <div className="profile-link-container">
                        <img
                        src={`http://localhost:5000/${user?.profilePic}`}
                        width="20"
                        height="20"
                        alt="profile"
                        className="navbar-profile-pic"
                        />
                        <h5>Profile</h5>
                    </div>
                </NavLink>

                {/* // menu link */}
                <div
                className="menu-link-container"
                onClick={() => setOpenMenu(!openMenu)}
                >
                <IoMdMenu className="navbar-menu-icon" />
                <h5>More</h5>

                {openMenu && (
                    <div className="menu-modal-container">
                    <h6
                        onClick={() => {
                        setOpenMenu(false);
                        navigate("/settings");
                        }}
                    >
                        <BsGearWide className="navbar-lock-icon" /> Settings
                    </h6>

                    <div className="modal-divider"></div>

                    <h6 onClick={toggleTheme} className="theme-toggle-option">
                        {isDark ? (
                        <>
                            <BsSun className="theme-icon" /> Light Mode
                        </>
                        ) : (
                        <>
                            <BsMoon className="theme-icon" /> Dark Mode
                        </>
                        )}
                    </h6>

                    <div className="modal-divider"></div>

                    <h6
                        onClick={async () => {
                        // await logout();
                        localStorage.removeItem("accessToken");
                        window.dispatchEvent(new Event("auth-token-changed"));
                        dispatch(clearUser());
                        dispatch(clearNotificationsInState());
                        navigate("/login");
                        }}
                    >
                        Logout
                    </h6>
                    </div>
                )}
                </div>
            </div>
            <NotificationDrawer
                isOpen={openNotification}
                onClose={() => setOpenNotification(false)}
            />
        </div>
    );
};
