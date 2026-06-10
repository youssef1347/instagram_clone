import React, { useContext, useState, useEffect, useRef } from "react";
import "./SideNavbar.css";
import { FaInstagram } from "react-icons/fa";
import Form from "react-bootstrap/Form";
import { LuSend } from "react-icons/lu";
import { MdOutlinePhotoLibrary } from "react-icons/md";
import { IoSearchOutline } from "react-icons/io5";
import { CiHeart } from "react-icons/ci";
import { FiPlus } from "react-icons/fi";
import { GoVideo, GoHomeFill } from "react-icons/go";
import { SlCompass } from "react-icons/sl";
import { IoMdMenu } from "react-icons/io";
import { BsGearWide, BsMoon, BsSun } from "react-icons/bs";
import { useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";

export const SideNavbar = ({ onOpenCreatePost }) => {
    const [openMenu, setOpenMenu] = useState(false);
    const [openNotification, setOpenNotification] = useState(false);
    const { isDark, toggleTheme } = useContext(ThemeContext);

    const navigate = useNavigate();
    const { user } = useSelector((state) => state.user);
    console.log(user);

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
                    onClick={() => setOpenNotification((prev) => !prev)}
                    >
                    <CiHeart className="navbar-notifications-icon" />
                    <h5>Notifications</h5>
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
                        // dispatch(clearUser());
                        navigate("/login");
                        }}
                    >
                        Logout
                    </h6>
                    </div>
                )}
                </div>
            </div>
        </div>
    );
};
