import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUser } from 'react-icons/fa';
import { TbEyeClosed, TbEyeUp } from "react-icons/tb";
import logo from '../assets/logo.png';
import '../styles/ForgotPassword.css';
import { getApiUrl, API_ENDPOINTS } from '../Constants';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordAndOTP, setShowPasswordAndOTP] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({
        username: '',
        otp: '',
        password: '',
        form: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'username') {
            setUsername(value);
            if (/[^a-zA-Z0-9]/.test(value)) {
                setErrors({ ...errors, username: 'Please enter a valid input (alphanumeric characters only).' });
            } else {
                setErrors({ ...errors, username: '' });
            }
        }
        if (name === 'otp') setOtp(value);
        if (name === 'password') setPassword(value);
        setErrors({ ...errors, [name]: '', form: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({ username: '', otp: '', password: '', form: '' });
        setIsSubmitting(true);

        if (!showPasswordAndOTP) {
            if (!username) {
                setErrors({ ...errors, username: 'Username is required' });
                setIsSubmitting(false);
                return;
            }

            if (/[^a-zA-Z0-9]/.test(username)) {
                setErrors({ ...errors, username: 'Please enter a valid input (alphanumeric characters only).' });
                setIsSubmitting(false);
                return;
            }

            const userData = { username };
            try {
                const response = await axios.post(getApiUrl(API_ENDPOINTS.USER.FORGOT_PASSWORD), userData);
                if (response.status === 200) {
                    setShowPasswordAndOTP(true);
                } else {
                    setErrors({ ...errors, form: 'Request failed. Please check your credentials and try again.' });
                }
            } catch (error) {
                if (error.response && error.response.data && error.response.data.message) {
                    setErrors({ ...errors, form: error.response.data.message });
                } else {
                    setErrors({ ...errors, form: 'An error occurred while processing your request.' });
                }
            } finally {
                setIsSubmitting(false);
            }
        } else {
            let validationErrors = {};
            if (!otp) validationErrors.otp = 'OTP is required';
            if (!password) validationErrors.password = 'Password is required';

            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
                setIsSubmitting(false);
                return;
            }

            const updateData = { username, otp, password };

            try {
                const response = await axios.post(getApiUrl(API_ENDPOINTS.USER.VERIFY_PASSWORD), updateData);
                if (response.status === 200) {
                    navigate('/login');
                } else {
                    setErrors({ ...errors, form: 'Request failed. Please check your credentials and try again.' });
                }
            } catch (error) {
                if (error.response && error.response.data && error.response.data.message) {
                    setErrors({ ...errors, form: error.response.data.message });
                } else {
                    setErrors({ ...errors, form: 'An error occurred while processing your request.' });
                }
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="forgot-password">
            <div className="form-box-forgot">
                <form onSubmit={handleSubmit} className="form-container-forgot">
                    <div className="header">
                        <div className="logo">
                            <img src={logo} alt="Logo" id="logo" />
                        </div>
                        <h1>{showPasswordAndOTP ? 'Change Password' : 'Forgot Password'}</h1>
                    </div>

                    {errors.form && <p className="error-message">{errors.form}</p>}

                    <div className="label-input-box">
                        <label htmlFor="username">Username</label>
                        <div className="show-password">
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={username}
                                onChange={handleChange}
                                disabled={showPasswordAndOTP || isSubmitting}
                            />
                            <FaUser className="icon" />
                        </div>
                        {errors.username && <p className="error-message">{errors.username}</p>}
                    </div>

                    {showPasswordAndOTP && (
                        <>
                            <div className="label-input-box">
                                <label htmlFor="otp">OTP</label>
                                <input
                                    type="text"
                                    id="otp"
                                    name="otp"
                                    value={otp}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                />
                                {errors.otp && <p className="error-message">{errors.otp}</p>}
                            </div>

                            <div className="label-input-box">
                                <label htmlFor="password">New Password</label>
                                <div className='show-password'>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        value={password}
                                        onChange={handleChange}
                                        disabled={isSubmitting}
                                    />
                                    {showPassword ? (
                                        <TbEyeUp className="icon" onClick={togglePasswordVisibility} />
                                    ) : (
                                        <TbEyeClosed className="icon" onClick={togglePasswordVisibility} />
                                    )}
                                </div>
                                {errors.password && <p className="error-message">{errors.password}</p>}
                            </div>
                        </>
                    )}

                    {!showPasswordAndOTP ? (
                        <div className="center-button">
                            <button
                                type="submit"
                                disabled={isSubmitting || !username || /[^a-zA-Z0-9]/.test(username)}
                                className={isSubmitting ? 'button-disabled' : 'button-enabled'}
                            >
                                {isSubmitting ? 'Checking...' : 'Check Username'}
                            </button>
                        </div>
                    ) : (
                        <div className="button-container">
                            <button
                                type="button"
                                className="forgotcancel-button"
                                onClick={() => navigate('/login')}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={isSubmitting ? 'button-disabled' : 'button-enabled'}
                            >
                                {isSubmitting ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;

