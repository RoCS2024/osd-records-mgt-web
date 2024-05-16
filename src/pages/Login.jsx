import React from "react";
import { useNavigate } from "react-router-dom";
import '../styles/Login.css';
import { FaUser } from "react-icons/fa";
import { TbEyeClosed } from "react-icons/tb";

const Login = () => {
    const navigate = useNavigate();
    
    const handleLogin = (e) => {
        e.preventDefault();
     
        navigate('/offense-admin');
    };

    return (
        <div className="wrapper">
            <div className="form-box-login">
                <form onSubmit={handleLogin}>
                    <h1>Login</h1>
                    <div className="input-box">
                        <label>User Type</label>
                        <input type="text" required/>
                    </div>
                    <div className="input-box">
                        <label>Username</label>
                        <input type="text" required/>
                        <FaUser className="icon" />  
                    </div>
                    <div className="input-box">
                        <label>Password</label>
                        <input type="password" required/>
                        <TbEyeClosed className="icon" />
                    </div> 
                    <div className="forgot-password">
                        <a href="#">Forgot password?</a>
                    </div>
                    <button type="submit">Login</button>
                    <div className="register-link">
                        <p>Don't have an Account?<a href="#">Click here</a></p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
