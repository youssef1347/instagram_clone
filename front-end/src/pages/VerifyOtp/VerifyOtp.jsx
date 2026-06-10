
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './VerifyOtp.css'
import api from '../../utils/api'
import { Input } from '../../components/Input/Input'
import toast from 'react-hot-toast'

export const VerifyOtp = () => {
    // email: email address retrieved from localStorage (set during registration)
    const [email, setEmail] = useState('');

    // disabled: controls verify button enabled state based on OTP input
    const [disabled, setDisabled] = useState(true);

    const [resendTimer, setResendTimer] = useState(0); // countdown timer for resend OTP

    // loading: shows loading state while API requests are in-flight
    const [loading, setLoading] = useState(false);

    // infoMessage: user-facing informational or error message displayed on the page
    const [infoMessage, setInfoMessage] = useState('');

    // otpRef: direct ref to the OTP input field to read its current value
    const otpRef = useRef(null);

    const navigate = useNavigate();

    // On mount, read the stored email. If not present, redirect to register flow.
    useEffect(() => {
        const storedEmail = localStorage.getItem('email');
        if (!storedEmail) {
            // No email means user didn't come from register; redirect to register page
            navigate('/register')
            return
        }

        setEmail(storedEmail);
    }, [navigate])

    // Update the Verify button enabled/disabled state as the user types the OTP.
    const handleChange = () => {
        const otp = otpRef.current?.value || ''
        setDisabled(!otp.trim())
    }

    // Submit handler: verifies the OTP with the backend.
    const handleVerify = async (e) => {
        e.preventDefault();
        const otp = otpRef.current?.value.trim();

        setLoading(true);

        try {
            // Call backend verify-otp endpoint with email and otp
            const response = await api.post('/api/auth/verify-otp', { email, otp });
            const { accessToken } = response.data;
            // Save access token locally for authenticated requests
            localStorage.setItem('accessToken', accessToken);
            toast.success('Verified successfully. Welcome!');
            // Redirect to app home after successful verification
            navigate('/');
        } catch (error) {
            // Log error and show a user-friendly message
            console.error(error);
            const message = error.response?.data?.message || 'Verification failed. Please try again.';
            setInfoMessage(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }

    // the interval for resending OTP is set to 60 seconds
    useEffect(() => {
        let interval = null;
        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [resendTimer]);

    // Resend OTP handler: triggers backend to send a fresh OTP to `email`.
    const handleResend = async () => {
        setLoading(true);
        try {
            await api.post('/api/auth/send-otp', { email });
            setInfoMessage('A new code has been sent to your email.');
            toast.success('OTP resent successfully');
            setResendTimer(60); // Start 60-second countdown for next resend
        } catch (error) {
            console.error(error)
            const message = error.response?.data?.message || 'Unable to resend code.'
            setInfoMessage(message)
            toast.error(message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="verify-otp-page">
            <div className="verify-otp-card">
                {/* Top section: logo and instructions */}
                <div className="verify-otp-top">
                    <img
                        className="verify-logo"
                        src="instaLogo-removebg-preview.png"
                        alt="Instagram"
                    />
                    <h1>Verify your account</h1>
                    <p>
                        Enter the 6-digit code we sent to <strong>{email}</strong>.
                    </p>
                </div>

                {/* Form: OTP input and verify button */}
                <form className="verify-otp-form" onSubmit={handleVerify}>
                    <Input
                        type="text"
                        placeholder="Enter verification code"
                        onChange={handleChange}
                        ref={otpRef}
                    />

                    <button
                        type="submit"
                        className={disabled || loading ? 'disabled' : ''}
                        disabled={disabled || loading}
                    >
                        {loading ? 'Checking...' : 'Verify'}
                    </button>
                </form>

                {/* Footer: informational text, resend action, and back to login link */}
                <div className="verify-otp-footer">
                    <p className="info-text">{infoMessage}</p>
                    <button
                        type="button"
                        className="resend-button"
                        onClick={handleResend}
                        disabled={loading || resendTimer > 0}
                    >
                        {resendTimer > 0 ? `Resend code (${resendTimer})` : 'Resend code'}
                    </button>
                    <span onClick={() => navigate('/login')}>
                        Back to log in
                    </span>
                </div>
            </div>
        </div>
    )
}
