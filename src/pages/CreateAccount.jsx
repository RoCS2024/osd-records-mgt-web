import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaUser } from 'react-icons/fa';
import { TbEyeClosed, TbEyeUp } from 'react-icons/tb';
import logo from '../assets/logo.png';
import '../styles/CreateAccount.css';
import { getApiUrl, API_ENDPOINTS } from '../Constants';

const CreateAccount = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    // Form validation
    const validateForm = () => {
        const newErrors = {};
        if (!formData.username) newErrors.username = 'Username is required';
        if (!formData.password) newErrors.password = 'Password is required';
        if (!formData.email) newErrors.email = 'Email is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        if (!validateForm()) return;

        setIsSubmitting(true);
        await registerUser();
        setIsSubmitting(false);
    };

    // Register user
    const registerUser = async () => {
        const payload = {
            user: {
                username: formData.username,
                password: formData.password
            },
            email: formData.email
        };

        try {
            const response = await axios.post(getApiUrl(API_ENDPOINTS.USER.REGISTER), payload);
            if (response.status === 200) {
                navigate('/account/otp');
            }
        } catch (error) {
            handleErrorResponse(error);
        }
    };

    // Handle errors from API
    const handleErrorResponse = (error) => {
        console.error('Error:', error);
        if (error.response) {
            const { status, data } = error.response;
            if (status === 500) {
                setErrorMessage('A server error occurred. Please try again later.');
            } else if (data?.message) {
                setErrorMessage(data.message);
            } else {
                setErrorMessage('An unexpected error occurred. Please try again.');
            }
        } else if (error.request) {
            setErrorMessage('Network error. Please check your internet connection.');
        } else {
            setErrorMessage('An error occurred while processing your request.');
        }
    };

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="create-account-container">
            <div className="form-box-register">
                <div className="header">
                    <div className="logo">
                        <img src={logo} alt="Logo" id="logo" />
                    </div>
                    <h1>Register</h1>
                </div>

                <form onSubmit={handleSubmit} className="form-container">
                    <div className="input-box">
                        <label>Username:</label>
                        <div className="insert">
                            <input type="text" name="username" value={formData.username} onChange={handleChange} />
                            <FaUser className="icon" />
                        </div>
                        {errors.username && <p className="error-message">{errors.username}</p>}
                    </div>

                    <div className="input-box">
                        <label>Password:</label>
                        <div className="insert">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            {showPassword ? (
                                <TbEyeUp className="icon" onClick={togglePasswordVisibility} aria-label="Hide password" />
                            ) : (
                                <TbEyeClosed className="icon" onClick={togglePasswordVisibility} aria-label="Show password" />
                            )}
                        </div>
                        {errors.password && <p className="error-message">{errors.password}</p>}
                    </div>

                    <div className="input-box">
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        {errors.email && <p className="error-message">{errors.email}</p>}
                    </div>

                    {errorMessage && <p className="error-message general">{errorMessage}</p>}

                    <button
                        type="submit"
                        className={`register-button ${isSubmitting ? 'disabled' : ''}`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Submitting...' : 'Register'}
                    </button>

                    <div className="login-link">
                        <p>Already have an Account? <Link to="/login" className="click">Login here</Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateAccount;
