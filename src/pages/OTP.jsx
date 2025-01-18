import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MdLockOutline } from 'react-icons/md';
import { getApiUrl, API_ENDPOINTS } from '../Constants';
import '../styles/OTP.css';
import logo from '../assets/logo.png';

const OTP = () => {
    const navigate = useNavigate();
    const [otp, setOtp] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const handleChange = (e) => {
        setOtp(e.target.value);
        setMessage('');
        setIsError(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage('');
        setIsError(false);

        try {
            const payload = { otp };
            const response = await axios.post(getApiUrl(API_ENDPOINTS.USER.VERIFY_OTP), payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (response.status === 200) {
                alert('OTP verified successfully! Redirecting to login...');
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            }
        } catch (error) {
            setIsSubmitting(false);
            handleErrorResponse(error);
        }
    };

    const handleErrorResponse = (error) => {
    console.error('Error:', error);

    if (error.response) {
        const { status, data } = error.response;

        if (status === 500) {
            setMessage('A server error occurred. Please try again later.');
        } else if (data?.message) {
            setMessage(data.message);
        } else if (typeof data === 'string') {
            setMessage(data); 
        } else {
            setMessage('An unexpected error occurred. Please try again.');
        }
    } else if (error.request) {
        setMessage('Network error. Please check your internet connection.');
    } else {
        setMessage('An error occurred while processing your request.');
    }

    setIsError(true);
};

    return (
        <div className="otp-container">
            <div className="form-box-otp">
                <div className="header">
                    <div className="logo">
                        <img src={logo} alt="Logo" id="logo" />
                    </div>
                    <h1>Verify OTP</h1>
                </div>

                <form onSubmit={handleSubmit} className="form-container">
                    <div className={`input-box ${isError ? 'error' : ''}`}>
                        <label htmlFor="otp">Enter OTP:</label>
                        <div className="insert">
                            <input
                                type="text"
                                id="otp"
                                name="otp"
                                value={otp}
                                onChange={handleChange}
                                disabled={isSubmitting}
                            />
                            <MdLockOutline className="icon" />
                        </div>
                    </div>

                    <button
                        className="otp-button"
                        type="submit"
                        disabled={isSubmitting || otp.length === 0}
                    >
                        {isSubmitting ? 'Verifying...' : 'Verify OTP'}
                    </button>
                </form>

                {message && <p className={`message ${isError ? 'error-message' : 'success-message'}`}>{message}</p>}
            </div>
        </div>
    );
};

export default OTP;
