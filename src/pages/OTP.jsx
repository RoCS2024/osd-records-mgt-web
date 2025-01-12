import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { getApiUrl, API_ENDPOINTS } from '../Constants';

import '../styles/OTP.css';
import logo from '../assets/logo.png';

const OTP = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        otp: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [errorType, setErrorType] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setMessage(''); 
        setErrorType(''); 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage('');
        setErrorType('');
        try {
            const payload = {
                username: formData.username,
                otp: formData.otp
            };
            const response = await axios.post(getApiUrl(API_ENDPOINTS.USER.VERIFY_OTP), payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (response.status === 200) {
                setMessage('OTP verified successfully!');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        } catch (error) {
            setIsSubmitting(false);

            if (error.response && error.response.data) {
                const { message } = error.response.data;

                if (message === 'Incorrect OTP') {
                    setMessage('The OTP you entered is incorrect.');
                    setErrorType('otp');
                } else if (message === 'User does not exist') {
                    setMessage('The username you entered does not exist.');
                    setErrorType('username');
                } else {
                    setMessage('An error occurred: ' + message);
                }
            } else {
                setMessage('An unexpected error occurred. Please try again.');
            }
        }
    };

    return (
        <div className="otp-container">

            <div className="header">
                <div className="logo">
                    <img src={logo} alt="Logo" id="logo" />
                </div>
                <h1>Verify OTP</h1>
            </div>

            <form onSubmit={handleSubmit} className="otp-form-container">
                <div className={`input-box ${errorType === 'username' ? 'error' : ''}`}>
                    <label>Username:</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        disabled={isSubmitting}
                    />
                </div>

                <div className={`input-box ${errorType === 'otp' ? 'error' : ''}`}>
                    <label>Enter OTP:</label>
                    <input
                        type="text"
                        name="otp"
                        value={formData.otp}
                        onChange={handleChange}
                        disabled={isSubmitting}
                    />
                </div>

                <button
                    className="otp-button"
                    type="submit"
                    disabled={isSubmitting || formData.otp.length === 0 || formData.username.length === 0}
                >
                    {isSubmitting ? 'Submitting...' : 'Verify OTP'}
                </button>
            </form>

            {message && <p className={`message ${errorType ? 'error-message' : 'success-message'}`}>{message}</p>}
        </div>
    );
};

export default OTP;
