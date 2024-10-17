
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/ForgotUsername.css'; 

import logo from '../assets/logo.png';

const ForgotUsername = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newUsername, setNewUsername] = useState(''); 
    const [showOtp, setShowOtp] = useState(false);
    const [errors, setErrors] = useState({
        email: '',
        otp: '',
        newUsername: '', 
        form: ''
    });
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setErrors({ ...errors, [name]: '' }); 
        if (name === 'email') setEmail(value);
        if (name === 'otp') setOtp(value);
        if (name === 'newUsername') setNewUsername(value); 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({ email: '', otp: '', newUsername: '', form: '' });
        setIsButtonDisabled(true);

        if (!showOtp) {
            
            if (!email) {
                setErrors({ ...errors, email: 'Email is Required' });
                setIsButtonDisabled(false);
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                setErrors({ ...errors, email: 'Please Enter a Valid Email Address.' });
                setIsButtonDisabled(false);
                return;
            }

            const userData = { email };
            try {
                const response = await axios.post('http://localhost:8080/user/forgot-username', userData);
                if (response.status === 200) {
                    setShowOtp(true); 
                } else {
                    setErrors({ ...errors, form: 'Request Failed. Please check your credentials and try again.' });
                }
            } catch (error) {
                if (error.response && error.response.data && error.response.data.message) {
                    setErrors({ ...errors, form: error.response.data.message });
                } else {
                    setErrors({ ...errors, form: 'An error occurred while processing your request.' });
                }
            } finally {
                setIsButtonDisabled(false);
            }
        } else {
            
            if (!otp) {
                setErrors({ ...errors, otp: 'OTP is Required' });
                setIsButtonDisabled(false);
                return;
            }
            if (!newUsername) {
                setErrors({ ...errors, newUsername: 'New Username is Required' });
                setIsButtonDisabled(false);
                return;
            }

            const updateData = { otp, username: newUsername };
            try {
                const response = await axios.post('http://localhost:8080/user/verify-otp-forgot-username', updateData);
                if (response.status === 200) {
                    navigate('/DisplayUsername');
                } else {
                    setErrors({ ...errors, form: 'Request Failed. Please check your credentials and try again.' });
                }
            } catch (error) {
                if (error.response && error.response.data && error.response.data.message) {
                    setErrors({ ...errors, form: error.response.data.message });
                } else {
                    setErrors({ ...errors, form: 'An error occurred while processing your request.' });
                }
            } finally {
                setIsButtonDisabled(false);
            }
        }
    };

    return (
        <div className="forgot-username">

            <div className="form-box-forgot">

                <form onSubmit={handleSubmit} className="form-container-forgot">

                    <div className="header">
                        <div className="logo">
                            <img src={logo} alt="Logo" id="logo" />
                        </div>
                        <h1>{showOtp ? 'New Username and OTP' : 'Forgot Username'}</h1>
                    </div>

                    {errors.form && <p className="error-message">{errors.form}</p>}

                    <div className="label-input-box">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            required
                            value={email}
                            onChange={handleChange}
                        />
                        {errors.email && <p className="error-message">{errors.email}</p>}
                    </div>

                    {showOtp && (
                        <>
                            <div className="label-input-box">
                                <label>New Username</label>
                                <input
                                    type="text"
                                    name="newUsername"
                                    required
                                    value={newUsername}
                                    onChange={handleChange}
                                />
                                {errors.newUsername && <p className="error-message">{errors.newUsername}</p>}
                            </div>

                            <div className="label-input-box">
                                <label>OTP</label>
                                <input
                                    type="text"
                                    name="otp"
                                    required
                                    value={otp}
                                    onChange={handleChange}
                                />
                                {errors.otp && <p className="error-message">{errors.otp}</p>}
                            </div>
                        </>
                    )}

                    <div className="center-button">
                        <button
                            type="submit"
                            disabled={isButtonDisabled || (showOtp ? !otp || !newUsername : !email)}
                            className={isButtonDisabled ? 'button-disabled' : 'button-enabled'}
                        >
                            {showOtp ? 'Submit' : 'Check Email'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotUsername;
