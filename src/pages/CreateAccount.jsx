import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaUser } from 'react-icons/fa';
import { TbEyeClosed, TbEyeUp } from 'react-icons/tb';
import logo from '../assets/logo.png';
import '../styles/CreateAccount.css';
import { getApiUrl, API_ENDPOINTS } from '../Constants';
import AddGuestModal from '../component/AddGuestModal';

const CreateAccount = () => {
    const navigate = useNavigate();
    const [userType, setUserType] = useState('student');
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        memberNumber: '',
        email: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showGuestModal, setShowGuestModal] = useState(false);
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
        if (userType !== 'guest') {
            if (!formData.memberNumber) {
                newErrors.memberNumber = `${userType === 'student' ? 'Student' : 'Employee'} Number is required`;
            }
            if (!formData.email) newErrors.email = 'Email is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        if (!validateForm()) return;

        setIsSubmitting(true);

        if (userType === 'guest') {
            setShowGuestModal(true);
        } else {
            await registerUser();
        }

        setIsSubmitting(false);
    };

    // Register user
    const registerUser = async (guestData = null) => {
        const payload = {
            user: {
                username: formData.username,
                password: formData.password
            },
            [userType]: userType === 'guest'
                ? { guestNumber: `GUEST_${Math.floor(1000 + Math.random() * 9000)}`, ...guestData }
                : {
                    [userType === 'student' ? 'studentNumber' : 'employeeNumber']: formData.memberNumber,
                    email: formData.email
                }
        };

        try {
            const response = await axios.post(getApiUrl(API_ENDPOINTS.USER.REGISTER), payload);
            if (response.status === 200) {
                navigate(userType === 'guest' ? '/login' : '/account/otp');
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

    // Handle guest modal submission
    const handleGuestSubmit = async (guestData) => {
        setShowGuestModal(false);
        await registerUser(guestData);
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
                        <label>User Type:</label>
                        <select
                            name="userType"
                            value={userType}
                            onChange={(e) => {
                                setUserType(e.target.value);
                                setFormData({ username: '', password: '', memberNumber: '', email: '' });
                                setErrorMessage('');
                            }}
                            className="select-style"
                        >
                            <option value="student">Student</option>
                            <option value="employee">Employee</option>
                            <option value="external">External</option>
                            <option value="guest">Guest</option>
                        </select>
                    </div>

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

                    {userType !== 'guest' && (
                        <>
                            <div className="input-box">
                                <label>{userType === 'student' ? 'Student Number:' : 'Employee Number:'}</label>
                                <input
                                    type="text"
                                    name="memberNumber"
                                    value={formData.memberNumber}
                                    onChange={handleChange}
                                />
                                {errors.memberNumber && <p className="error-message">{errors.memberNumber}</p>}
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
                        </>
                    )}

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

            {showGuestModal && (
                <AddGuestModal onClose={() => setShowGuestModal(false)} onSubmit={handleGuestSubmit} />
            )}
        </div>
    );
};

export default CreateAccount;
