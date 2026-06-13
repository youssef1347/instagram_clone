import { useState } from "react";
import "./Navbar.css";
import {
  FiHome,
  FiSearch,
  FiHeart,
  FiMessageCircle,
  FiBookmark,
  FiUser,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearUser } from "../../store/slices/userSlice";

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    window.dispatchEvent(new Event("auth-token-changed"));
    dispatch(clearUser());
    navigate("/login");
  };

  const navItems = [
    { icon: FiHome, label: "Home", href: "/" },
    { icon: FiSearch, label: "Explore", href: "/explore" },
    { icon: FiHeart, label: "Likes", href: "/likes" },
    { icon: FiMessageCircle, label: "Messages", href: "/messages" },
    { icon: FiBookmark, label: "Saved", href: "/saved" },
    { icon: FiUser, label: "Profile", href: "/profile" },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <h1>📷 Instagram</h1>
        </div>

        {/* Search Bar */}
        <form
          className="navbar-search"
          onSubmit={(event) => {
            event.preventDefault();
            const trimmed = searchQuery.trim();
            if (trimmed) {
              navigate(`/search?query=${encodeURIComponent(trimmed)}`);
            }
          }}
        >
          <FiSearch size={18} />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </form>

        {/* Desktop Navigation Icons */}
        <div className="navbar-icons">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <a
                key={index}
                href={item.href}
                className={`nav-icon ${index === 0 ? "active" : ""}`}
                title={item.label}
              >
                <Icon size={24} />
              </a>
            );
          })}
          <div className="nav-divider"></div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <a
                key={index}
                href={item.href}
                className={`mobile-nav-item ${index === 0 ? "active" : ""}`}
              >
                <Icon size={24} />
                <span>{item.label}</span>
              </a>
            );
          })}
          <button className="mobile-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};
