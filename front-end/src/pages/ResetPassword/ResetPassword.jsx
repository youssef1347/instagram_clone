
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ResetPassword.css";
import api from "../../utils/api";
import { Input } from "../../components/Input/Input";
import toast from "react-hot-toast";

export const ResetPassword = () => {

    // newPassword: the new password entered by the user
    const [newPassword, setNewPassword] = useState("");

    // disabled: controls submit button enabled state
    const [disabled, setDisabled] = useState(true);

    // loading: shows loading state while API request is in-flight
    const [loading, setLoading] = useState(false);

    // errorMessage: error message displayed if token is invalid or expired
    const [errorMessage, setErrorMessage] = useState("");

    // passwordRef: direct ref to the password input field
    const passwordRef = useRef(null);
    const navigate = useNavigate();

    const { resetToken } = useParams();

    // Update the Reset button enabled/disabled state as the user types the password.
    const handleChange = () => {
        const password = passwordRef.current?.value || "";
        // Enable button if password is at least 6 characters
        setDisabled(password.trim().length < 6);
    };

    // Submit handler: resets the password using the token.
    const handleResetPassword = async (e) => {
        e.preventDefault();
        const password = passwordRef.current?.value.trim();

        if (password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return;
        }

        setLoading(true);

        try {
        // Call backend reset-password endpoint with token and new password
        const response = await api.post("/api/auth/reset-password", {
            token: resetToken,
            newPassword: password,
        });
        console.log(response);
        toast.success("Password reset successfully!");
        // Redirect to login page after successful reset
        navigate("/login");
        } catch (error) {
        console.error(error);
        const message =
            error.response?.data?.message ||
            "Failed to reset password. Please try again.";
        setErrorMessage(message);
        toast.error(message);
        } finally {
        setLoading(false);
        }
    };

    // If no valid token, show error state
    if (errorMessage) {
        return (
        <div className="reset-password-page">
            <div className="reset-password-card">
                <div className="reset-password-top">
                    <img
                    className="reset-logo"
                    src="instaLogo-removebg-preview.png"
                    alt="Instagram"
                    />
                    <h1>Reset password</h1>
                    <p className="error-text">{errorMessage}</p>
                </div>
                <div className="reset-password-footer">
                    <button
                    className="back-button"
                    onClick={() => navigate("/forgot-password")}
                    >
                    Back to forgot password
                    </button>
                </div>
            </div>
        </div>
        );
    }

    return (
        <div className="reset-password-page">
            <div className="reset-password-card">
                {/* Top section: logo and instructions */}
                <div className="reset-password-top">
                <img
                    className="reset-logo"
                    src="instaLogo-removebg-preview.png"
                    alt="Instagram"
                />
                <h1>Create a new password</h1>
                <p>Enter a strong password to secure your account.</p>
                </div>

                {/* Form: password input and reset button */}
                <form className="reset-password-form" onSubmit={handleResetPassword}>
                    <Input
                        type="password"
                        placeholder="Enter new password (min. 6 characters)"
                        onChange={handleChange}
                        ref={passwordRef}
                    />

                    <button
                        type="submit"
                        className={disabled || loading ? "disabled" : ""}
                        disabled={disabled || loading}
                    >
                        {loading ? "Resetting..." : "Reset password"}
                    </button>
                </form>

                {/* Footer: error display and navigation link */}
                <div className="reset-password-footer">
                    {errorMessage && <p className="error-text">{errorMessage}</p>}
                    <span onClick={() => navigate("/login")}>Back to log in</span>
                </div>
            </div>
        </div>
    );
};
