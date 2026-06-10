
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";
import api from "../../utils/api";
import { Input } from "../../components/Input/Input";
import toast from "react-hot-toast";

export const ForgotPassword = () => {
    // email: the user's email address input
    const [email, setEmail] = useState("");
    // disabled: controls submit button enabled state
    const [disabled, setDisabled] = useState(true);
    // loading: shows loading state while API request is in-flight
    const [loading, setLoading] = useState(false);
    // infoMessage: confirmation or error message shown to user
    const [infoMessage, setInfoMessage] = useState("");
    // emailRef: direct ref to the email input field
    const emailRef = useRef(null);
    const navigate = useNavigate();

    // Update the Send button enabled/disabled state as the user types the email.
    const handleChange = () => {
        const email = emailRef.current?.value || "";
        setDisabled(!email.trim());
    };

    // Submit handler: requests a password reset link via email.
    const handleSendReset = async (e) => {
        e.preventDefault();
        const email = emailRef.current?.value.trim();

        setLoading(true);

        try {
        // Call backend forgot-password endpoint with email
        const response = await api.post("/api/auth/forgot-password", { email });
        console.log(response);
        // Show success message and info about the reset link
        setInfoMessage(
            `Password reset link sent to ${email}. Check your email and click the link.`,
        );
        toast.success("Reset link sent successfully!");
        // Clear the input after successful submission
        emailRef.current.value = "";
        setDisabled(true);
        } catch (error) {
        console.error(error);
        const message =
            error.response?.data?.message ||
            "Failed to send reset link. Please try again.";
        setInfoMessage(message);
        toast.error(message);
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="forgot-password-page">
            <div className="forgot-password-card">
                {/* Top section: logo and instructions */}
                <div className="forgot-password-top">
                <img
                    className="forgot-logo"
                    src="instaLogo-removebg-preview.png"
                    alt="Instagram"
                />
                <h1>Trouble logging in?</h1>
                <p>
                    Enter the email address associated with your account and we'll send
                    you a link to reset your password.
                </p>
                </div>

                {/* Form: email input and send button */}
                <form className="forgot-password-form" onSubmit={handleSendReset}>
                    <Input
                        type="email"
                        placeholder="Enter your email address"
                        onChange={handleChange}
                        ref={emailRef}
                    />

                    <button
                        type="submit"
                        className={disabled || loading ? "disabled" : ""}
                        disabled={disabled || loading}
                    >
                        {loading ? "Sending..." : "Send reset link"}
                    </button>
                </form>

                {/* Footer: info message and navigation links */}
                <div className="forgot-password-footer">
                    {infoMessage && <p className="info-text">{infoMessage}</p>}
                    <div className="footer-links">
                        <span onClick={() => navigate("/login")}>Back to log in</span>
                        <span className="divider">•</span>
                        <span onClick={() => navigate("/register")}>
                        Create new account
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
