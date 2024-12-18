import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/CreateAccount.css';

import { getApiUrl, API_ENDPOINTS } from '../Constants';

import { FaUser } from "react-icons/fa";
import { TbEyeClosed, TbEyeUp } from "react-icons/tb";
import logo from '../assets/logo.png';

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
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showGuestModal, setShowGuestModal] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setIsButtonDisabled(true);
        setIsSubmitting(true);

        // Validations
        if (formData.username === '' || !/^[a-zA-Z0-9]+$/.test(formData.username)) {
            setErrorMessage('Please enter a valid username (use alphanumeric characters only).');
            setIsButtonDisabled(false);
            setIsSubmitting(false);
            return;
        }
        if (formData.password === '') {
            setErrorMessage('Please Enter a Password.');
            setIsButtonDisabled(false);
            setIsSubmitting(false);
            return;
        }
        if (userType !== 'guest' && formData.memberNumber === '') {
            setErrorMessage('Please Enter your Member Number.');
            setIsButtonDisabled(false);
            setIsSubmitting(false);
            return;
        }
        if (userType !== 'guest' && !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
            setErrorMessage('Please Enter a valid Email Address.');
            setIsButtonDisabled(false);
            setIsSubmitting(false);
            return;
        }

        if (userType === 'guest') {
            setShowGuestModal(true);
            setIsButtonDisabled(false);
            setIsSubmitting(false);
        } else {
            await registerUser();
        }
    };

    const registerUser = async (guestData = null) => {
        try {
            let payload;
            if (userType === 'guest') {
                payload = {
                    user: {
                        username: formData.username,
                        password: formData.password
                    },
                    guest: {
                        guestNumber: `GUEST_${Math.floor(1000 + Math.random() * 9000)}`,
                        ...guestData
                    }
                };
            } else {
                payload = {
                    user: {
                        username: formData.username,
                        password: formData.password
                    },
                    [userType]: {
                        [userType === 'student' ? 'studentNumber' : 'employeeNumber']: formData.memberNumber,
                        email: formData.email
                    }
                };
            }

            const response = await axios.post(getApiUrl(API_ENDPOINTS.USER.REGISTER), payload);
            if (response.status === 200) {
                navigate(userType === 'guest' ? '/login' : '/account/otp');
            } else {
                console.error('Unexpected response:', response);
                setErrorMessage('An unexpected error occurred. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            if (error.response && error.response.data && error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage('An error occurred while processing your request.');
            }
        }
        setIsButtonDisabled(false);
        setIsSubmitting(false);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleGuestSubmit = async (guestData) => {
        await registerUser(guestData);
        setShowGuestModal(false);
    };

    return (
        <div className="create-account-container">
            <div className="form-box-register">
                <div className="header">
                    <div className="logo">
                        <img src={logo} alt="Logo" id="logo"/>
                    </div>
                    <h1>Register</h1>
                </div>

                <form onSubmit={handleSubmit} className="form-container">
                    <div className="input-box">
                        <label>User Type:</label>
                        <select
                            name="userType"
                            value={userType}
                            onChange={(e) => setUserType(e.target.value)}
                            className="select-style"
                        >
                            <option value="student">Student</option>
                            <option value="employee">Employee</option>
                            <option value="external">External</option>
                            <option value="guest">Guest</option>
                        </select>
                        {errorMessage && errorMessage === 'User Type is required.' && <p className="error-message">{errorMessage}</p>}
                    </div>

                    <div className="input-box">
                        <label>Username:</label>
                        <div className="insert">
                            <input type="text" name="username" value={formData.username} onChange={handleChange} />
                            <FaUser className="icon" />
                        </div>
                        {errorMessage && (errorMessage === 'Please enter a valid username (alphanumeric characters only).' || errorMessage === 'USERNAME ALREADY EXISTS.') && <p className="error-message">{errorMessage}</p>}
                    </div>

                    <div className="input-box">
                        <label>Password</label>
                        <div className="insert">
                            <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} required />
                            {showPassword ? (
                                <TbEyeUp className="icon" onClick={togglePasswordVisibility} />
                            ) : (
                                <TbEyeClosed className="icon" onClick={togglePasswordVisibility} />
                            )}
                        </div>  
                        {errorMessage && (errorMessage === 'Please Enter a Password.' || errorMessage === 'PLEASE CREATE A STRONGER PASSWORD. PASSWORD SHOULD CONTAIN SPECIAL CHARACTERS.') && <p className="error-message">{errorMessage}</p>}
                    </div>

                    {userType !== 'guest' && (
                        <div className="input-box">
                            <label>{userType === 'student' ? 'Student Number:' : 'Employee Number:'}</label>
                            <input type="text" name="memberNumber" value={formData.memberNumber} onChange={handleChange} />
                        </div>
                    )}
                    {errorMessage && (errorMessage === 'STUDENT NUMBER DOES NOT EXIST!!' || errorMessage === 'STUDENT ALREADY EXISTS!') && <p className="error-message">{errorMessage}</p>}
                    {errorMessage && (errorMessage === 'EMPLOYEE NUMBER DOES NOT EXIST!!' || errorMessage === 'EMPLOYEE ALREADY EXISTS!') && <p className="error-message">{errorMessage}</p>}
                    
                    {userType !== 'guest' && (
                        <div className="input-box">
                            <label>Email:</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} />
                            {errorMessage && errorMessage === 'Please Enter a valid Email Address.' && <p className="error-message">{errorMessage}</p>}
                        </div>
                    )}
                    <p className="error-message">{errorMessage}</p>
                    <button type="submit" className={`register-button ${isButtonDisabled ? 'disabled' : ''}`} disabled={isButtonDisabled || isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Register'}
                    </button>
                </form>
            </div>

            {showGuestModal && (
                <AddGuestModal onClose={() => setShowGuestModal(false)} onSubmit={handleGuestSubmit} />
            )}
        </div>
    );
};

export default CreateAccount;