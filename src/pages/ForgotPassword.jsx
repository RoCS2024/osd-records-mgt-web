import React from 'react';
import '../styles/ForgotPassword.css';
import { FaUser } from "react-icons/fa";
import { TbEyeClosed } from "react-icons/tb";

const ForgotPassword = () => {
    return (
        <div className="wrapper">
            <div className="form-box-login">
                <form>
                    <h1>Forgot Password</h1>
                    <div className="input-box">
                        <label>Username</label>
                        <input type="text" required />
                        <FaUser className="icon" />
                    </div>
                    <div className="input-box">
                        <label>Code</label>
                        <input type="text" required />
                       
                    </div>
                    <div className="input-box">
                        <label>New Password</label>
                        <input type="password" required />
                        <TbEyeClosed className="icon" />
                    </div>
                    
                    <button type="submit">Save</button>
                  
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
