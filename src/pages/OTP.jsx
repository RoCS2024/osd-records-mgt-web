import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUser } from 'react-icons/fa';
import { MdLockOutline } from 'react-icons/md';
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
                setMessage('');
                alert('OTP verified successfully! Redirecting to login...');
                setErrorType(''); // Ensure it's not an error message
                setTimeout(() => {
                    navigate('/login');
                }, 3000); // Increased delay to 3 seconds for better user experience
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
            <div className="form-box-otp">
                <div className="header">
                    <div className="logo">
                        <img src={logo} alt="Logo" id="logo" />
                    </div>
                    <h1>Verify OTP</h1>
                </div>

                <form onSubmit={handleSubmit} className="form-container">
                    <div className={`input-box ${errorType === 'username' ? 'error' : ''}`}>
                        <label htmlFor="username">Username:</label>
                        <div className="insert">
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                disabled={isSubmitting}
                            />
                            <FaUser className="icon" />
                        </div>
                    </div>

                    <div className={`input-box ${errorType === 'otp' ? 'error' : ''}`}>
                        <label htmlFor="otp">Enter OTP:</label>
                        <div className="insert">
                            <input
                                type="text"
                                id="otp"
                                name="otp"
                                value={formData.otp}
                                onChange={handleChange}
                                disabled={isSubmitting}
                            />
                            <MdLockOutline className="icon" />
                        </div>
                    </div>

                    <button
                        className="otp-button"
                        type="submit"
                        disabled={isSubmitting || formData.otp.length === 0 || formData.username.length === 0}
                    >
                        {isSubmitting ? 'Verifying...' : 'Verify OTP'}
                    </button>
                </form>

                {message && <p className={`message ${errorType ? 'error-message' : 'success-message'}`}>{message}</p>}
            </div>
        </div>
    );
};

export default OTP;

