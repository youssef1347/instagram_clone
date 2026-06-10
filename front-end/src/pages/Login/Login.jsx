import React, { useRef, useState } from 'react'
import './Login.css'
import { FaMeta } from "react-icons/fa6";
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Input } from '../../components/Input/Input';


export const Login = () => {
    const [disabled, setDisabled] = useState(true);

    const navigate = useNavigate();

    // error message
    const [errorMessage, setErrorMessage] = useState('');



    // refs for email and password inputs
    const emailRef = useRef();
    const passwordRef = useRef();

    async function handleLogin(e) {
        e.preventDefault();

        // get email and password values from refs
        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        try {
            // send login request to backend
            const response = await api.post('/api/auth/login', { email, password });
            console.log(response);

            // store access token in local storage
            const { accessToken } = response.data;
            localStorage.setItem('accessToken', accessToken);

            // navigate to home page after successful login
            navigate('/');
        } catch (error) {
            console.log(error);
            // handle if the user isn't verifief
            if (error.response && error.response.status === 403) {
                setErrorMessage('Your account is not verified.');
                return;
            }
            
            toast.error(error.response?.data?.message);
        }
    }

    function onChange(e) {
        // handle if the input fields are empty or not, and enable/disable the login button accordingly
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        if (!email.trim() || !password.trim()) {
            // disable login button if input is empty
            setDisabled(true);
        } else {
            setDisabled(false);
        }
    }


    return (
        <div className="login-container">

            {/* images side */}
            <div className="images-side-container">
                <div className="images-side">
                    <div className="instagram-logo-container">
                        <img className="instagram-logo" src="instaLogo-removebg-preview.png" alt="" />
                    </div>

                    <div className="phone-image-container">
                        <p className="text">See everyday moments from <br /> your <span>close friends</span>.</p>
                        <img src="phone.png" alt="" />
                    </div>
                </div>
            </div>

            <div className="divider"></div>

            {/* form side */}
            <div className="form-side-container">
                <div className="form-side">
                    <img className='instagram-logo-mobile' src="instaLogo-removebg-preview.png" alt="Instagram Logo" />
                    <h3>Log into Instagram</h3>

                    <div className="form-container">
                        <form onSubmit={handleLogin}>
                            <Input 
                                type="email" 
                                placeholder="Email address" 
                                ref={emailRef} 
                                onChange={onChange} 
                            />
                            <Input 
                                type="password" 
                                placeholder="Password" 
                                ref={passwordRef} 
                                onChange={onChange} 
                            />

                            {errorMessage && <p className="error-message">{errorMessage} to verify your account <span onClick={() => navigate('/verify-otp')}>click here</span> </p>} {/* error message */}

                            <button className={disabled ? 'disabled' : ''} type="submit" disabled={disabled}>Log In</button> {/* login button */}
                            <span onClick={() => navigate('/forgot-password')} className="forgot-password">Forgot password?</span> {/* forgot password link */}
                        </form>


                        <div className="meta-logo-container">
                            <button onClick={() => navigate('/register')} className="create-account-button">Create New Account</button> {/* create account button */} 
                            <span className="meta-logo"><FaMeta fontSize={22} /> Meta </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
