import React from 'react'
import './Login.css'
import { FaMeta } from "react-icons/fa6";


export const Login = () => {
    return (
        <div className="login-container">

            {/* images side */}
            <div className="images-side">
                <div className="instagram-logo-container">
                    <img src="instaLogo-removebg-preview.png" alt="" />
                </div>

                <div className="phone-image-container">
                    <p className="text">See everyday moments from <br /> your close friends.</p>
                    <img src="phone-image.png" alt="" />
                </div>
            </div>

            {/* form side */}
            <div className="form-side-container">
                <span>Log into Instagram</span>

                <div className="form-container">
                    <form>
                        <input type="email" placeholder="email" /> {/* email input */}
                        <input type="password" placeholder="Password" /> {/* password input */}

                        <button type="submit">Log In</button> {/* login button */}
                        <span className="forgot-password">Forgot password?</span> {/* forgot password link */}
                    </form>

                    <div className="meta-logo-container">
                        <span className="meta-logo">Meta <FaMeta /> </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
