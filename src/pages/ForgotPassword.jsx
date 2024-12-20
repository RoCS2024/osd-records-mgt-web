import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/ForgotPassword.css';

import { getApiUrl, API_ENDPOINTS } from '../Constants';

import { TbEyeClosed, TbEyeUp} from "react-icons/tb";
import logo from '../assets/logo.png';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordAndOTP, setShowPasswordAndOTP] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [errors, setErrors] = useState({
        username: '',
        otp: '',
        password: '',
        form: ''
    });

    const oldPassword = ""; // Assuming you have the old password stored somewhere

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'username') {
            setUsername(value);
            if (/[^a-zA-Z0-9]/.test(value)) {
                setErrors({ ...errors, username: 'Please Enter a Valid Input (alphanumeric characters only).' });
            } else {
                setErrors({ ...errors, username: '' });
            }
        }
        if (name === 'otp') setOtp(value);
        if (name === 'password') setPassword(value);
        setErrors({ ...errors, [name]: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({ username: '', otp: '', password: '', form: '' });
        setIsButtonDisabled(true);

        if (!showPasswordAndOTP) {
            if (!username) {
                setErrors({ ...errors, username: 'Username is Required' });
                setIsButtonDisabled(false);
                return;
            }

            if (/[^a-zA-Z0-9]/.test(username)) {
                setErrors({ ...errors, username: 'Please Enter a Valid Input (alphanumeric characters only).' });
                setIsButtonDisabled(false);
                return;
            }

            const userData = { username };
            try {
                const response = await axios.post(getApiUrl(API_ENDPOINTS.USER.FORGOT_PASSWORD), userData);
                if (response.status === 200) {
                    setShowPasswordAndOTP(true);
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
            if (password === oldPassword) {
                setErrors({ ...errors, password: 'You cannot use the same password. Please enter a new one.' });
                setIsButtonDisabled(false);
                return;
            }

            let validationErrors = {};
            if (!otp) validationErrors.otp = 'OTP is Required';
            if (!password) validationErrors.password = 'Password is Required';

            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
                setIsButtonDisabled(false);
                return;
            }

            const updateData = { username, otp, password };

            try {
                const response = await axios.post(getApiUrl(API_ENDPOINTS.USER.VERIFY_PASSWORD), updateData);
                if (response.status === 200) {
                    navigate('/Login');
                } else {
                    setErrors({ ...errors, form: 'Request Failed. Please check your credentials and try again.' });
                }
            } catch (error) {
                if (error.response && error.response.data && error.response.data.message) {
                    setErrors({ ...errors, form: error.response.data.message });
                } else {
                    setErrors({ ...errors, form: 'An Error occurred while processing your request.' });
                }
            } finally {
                setIsButtonDisabled(false);
            }
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="forgot-password">

            <div className= "form-box-forgot">

                <form onSubmit={handleSubmit} className="form-container-forgot">

                    <div className="header">
                        <div className="logo">
                            <img src={logo} alt="Logo" id="logo" />
                        </div>
                        <h1>{showPasswordAndOTP ? 'Change Password' : 'Forgot Password'}</h1>
                    </div>

                    {errors.form && <p className="error-message">{errors.form}</p>}

                    <div className="label-input-box">

                        <label>Username</label>

                        <div className="input-with-icon"></div>

                        <input
                            type="text"
                            name="username"
                            required
                            value={username}
                            onChange={handleChange}
                        />
                        {errors.username && <p className="error-message">{errors.username}</p>}
                    </div>

                    {showPasswordAndOTP && (
                        <>
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

                            <div className="label-input-box">

                                <label>Password</label>

                                <div className='show-password'>
                                    
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        required
                                        value={password}
                                        onChange={handleChange}
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
                                disabled={isButtonDisabled || !username || /[^a-zA-Z0-9]/.test(username)}
                                className={isButtonDisabled ? 'button-disabled' : 'button-enabled'}
                            >
                                Check Username
                            </button>
                        </div>
                    ) : (
                        <div className="button-container">
                            
                            <button
                                type="button"
                                className="forgotcancel-button"
                                onClick={() => navigate('/Login')}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isButtonDisabled}
                                className={isButtonDisabled ? 'button-disabled' : 'button-enabled'}
                            >
                                Save
                            </button>

                        </div>

                    )}

                </form>

            </div>
            
        </div>
    );
    
};

export default ForgotPassword;