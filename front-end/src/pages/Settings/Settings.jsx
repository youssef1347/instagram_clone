import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { setUser } from "../../store/slices/userSlice";
import { SideNavbar } from "../../components/SideNavbar/SideNavbar";
import "./Settings.css";

export const Settings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    bio: "",
    privateAccount: false,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        bio: user.bio || "",
        privateAccount: Boolean(user.privateAccount),
      });
    }
  }, [user]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    dispatch(
      setUser({
        ...user,
        username: formData.username,
        email: formData.email,
        bio: formData.bio,
        privateAccount: formData.privateAccount,
      }),
    );

    toast.success("Profile settings updated.");
  };

  return (
    <div className="settings-page">
      <SideNavbar />
      <div className="settings-content">
        <div className="settings-header">
          <button className="back-link" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <div>
            <h1>Settings</h1>
            <p>Manage your account, privacy, and profile details.</p>
          </div>
        </div>

        <div className="settings-grid">
          <section className="settings-panel">
            <div className="settings-card">
              <h2>Edit profile</h2>
              <p>Update the details that appear on your profile.</p>
              <form onSubmit={handleSubmit} className="settings-form">
                <label>
                  Username
                  <input
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Username"
                  />
                </label>

                <label>
                  Email
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email address"
                  />
                </label>

                <label>
                  Bio
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Add a short bio"
                    rows="4"
                  />
                </label>

                <div className="form-actions">
                  <button type="submit" className="save-btn">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>

            <div className="settings-card small-card">
              <h2>Account privacy</h2>
              <label className="toggle-row">
                <span>Private account</span>
                <input
                  type="checkbox"
                  name="privateAccount"
                  checked={formData.privateAccount}
                  onChange={handleChange}
                />
              </label>
              <p>
                When your account is private, only people you approve can see
                your posts.
              </p>
            </div>
          </section>

          <section className="settings-panel">
            <div className="settings-card">
              <h2>Security</h2>
              <p>Keep your account safe and secure.</p>
              <div className="settings-list">
                <div className="settings-item">
                  <div>
                    <h3>Change password</h3>
                    <p>
                      Update your password regularly to keep your account
                      secure.
                    </p>
                  </div>
                  <button className="action-btn" type="button">
                    Manage
                  </button>
                </div>

                <div className="settings-item">
                  <div>
                    <h3>Two-factor authentication</h3>
                    <p>Review and manage two-factor authentication settings.</p>
                  </div>
                  <button className="action-btn" type="button">
                    Set up
                  </button>
                </div>
              </div>
            </div>

            <div className="settings-card small-card">
              <h2>Support</h2>
              <p>Find help and resources for your Instagram clone.</p>
              <a href="mailto:support@example.com" className="support-link">
                Contact support
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
