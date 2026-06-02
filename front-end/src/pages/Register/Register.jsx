import React from 'react'
import './Register.css'
import { FaMeta } from "react-icons/fa6";

export const Register = () => {
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
                    <form>
                        <input type="email" placeholder="Mobile number or email address" /> {/* email input */}
                        <input type="text" placeholder="Full Name" /> {/* full name input */}
                        <input type="password" placeholder="Password" /> {/* password input */}
                        <button type="submit">Sign Up</button> {/* sign up button */}
                        <button className="have-account" onClick={() => navigate('/login')}>
                            I already have an account
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}
