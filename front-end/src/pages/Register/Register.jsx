import React, { useRef } from 'react'
import './Register.css'
import { FaMeta } from "react-icons/fa6";
import { Input } from '../../components/Input/Input';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../utils/api';

export const Register = () => {
    // navigation
    const navigate = useNavigate();


    // refs for email, full name, and password inputs
    const emailRef = useRef();
    const usernameRef = useRef();
    const passwordRef = useRef();

    // register function
    const handleRegister = async (e) => {
        e.preventDefault();
        // register logic here
        const data = {
            email: emailRef.current.value,
            username: usernameRef.current.value,
            password: passwordRef.current.value,
        }
        console.log(data);

        try {
            // api call register route
            const response = await api.post('/api/auth/register', data);
            console.log(response);
            toast.success("Registration successful! please verify your email.");
            
            // store the email in the local storage
            localStorage.setItem('email', data.email);

            // navigate to the otp verification page
            navigate('/verify-otp');

            // api call send otp route
            const otpResponse = await api.post('/api/auth/send-otp', { email: data.email });
            console.log(otpResponse);

        } catch (error) {
            console.error('Error registering user:', error);

            // handle errors
            if (error.response?.data?.messages) {
                error.response.data.messages.forEach((message) => {
                    toast.error(message);
                });
            } else if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('An error occurred during registration. Please try again.');
            }
        }
    }
    
    return (
        <>
            <div className="register-container">

                {/* page header */}
                <div className="register-header">
                    <span className="meta-icon"><FaMeta /> Meta</span>
                    <h2>Get started on Instagram</h2>
                    <p>Sign up to see photos and videos from your friends.</p>
                </div>

                {/* register form */}
                <div className="register-form-container">
                    <form className="register-form" onSubmit={handleRegister}>
                        <Input type="email" name="email" placeholder="Email address" ref={emailRef} /> {/* email input */}
                        <Input type="text" name="username" placeholder="Full Name" ref={usernameRef} /> {/* full name input */}
                        <Input type="password" name="password" placeholder="Password" ref={passwordRef} /> {/* password input */}
                        <button className="sign-up" type="submit">Sign Up</button> {/* sign up button */}
                        <button className="have-account" onClick={() => navigate('/login')}>
                            I already have an account
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
};

