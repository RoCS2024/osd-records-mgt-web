
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import '../styles/CreateAccount.css';

import { FaUser } from "react-icons/fa";
import { TbEyeClosed, TbEyeUp } from "react-icons/tb";
import logo from '../assets/logo.png';

import AddGuestModal from '../component/AddGuestModal';

const RegisterForm = () => {

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
            // show add guest modal
            setShowGuestModal(true);
            setIsButtonDisabled(false);
            setIsSubmitting(false);
        } else {
            // register user
            try {
                const payload = {
                    user: {
                        username: formData.username,
                        password: formData.password
                    },
                    [userType]: {
                        [userType === 'student' ? 'studentNumber' : 'employeeNumber']: formData.memberNumber,
                        email: formData.email
                    }
                };
                const response = await Axios.post('http://localhost:8080/user/register', payload);
                if (response.status === 200) {
                    navigate('/account/otp');
                } else if (response && response.data) {
                   
                } else {
                    console.error('Response Data is Undefined:', response);
                }
            } catch (error) {
                console.error('Error:', error);
                if (error.response && error.response.data && error.response.data.message) {
                    if (error.response.data.message === 'PLEASE CREATE A STRONGER PASSWORD. PASSWORD SHOULD CONTAIN SPECIAL CHARACTERS.') {
                        setErrorMessage(error.response.data.message);
                    } else if(error.response.data.message === 'STUDENT ALREADY EXISTS!' || error.response.data.message === 'STUDENT NUMBER DOES NOT EXIST!!') {
                        setErrorMessage(error.response.data.message);
                    } else if(error.response.data.message === 'EMPLOYEE ALREADY EXISTS!' || error.response.data.message === 'EMPLOYEE NUMBER DOES NOT EXIST!!') {
                        setErrorMessage(error.response.data.message);
                    } else if(error.response.data.message === 'USERNAME ALREADY EXISTS.') {
                        setErrorMessage(error.response.data.message)
                    }
                } else { 
                    setErrorMessage('An error occurred while processing your request.');
                }
            }
            setIsButtonDisabled(false);
            setIsSubmitting(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword); 
    };

    const handleSubmitGuest = async (guestData) => {
        try {
            const guestNumber = `GUEST_${Math.floor(1000 + Math.random() * 9000)}`;
            
            const guestResponse = await Axios.post('http://localhost:8080/guest/addGuest', { guest: guestData, guestNumber });
            
            if (guestResponse.status === 200) {
                console.log('Guest Added Successfully');
                
                const userPayload = {
                    user: {
                        username: formData.username,
                        password: formData.password
                    },
                    guest: {
                        guestNumber: guestNumber,
                        firstName: guestData.firstName,
                        middleName: guestData.middleName,
                        lastName: guestData.lastName,
                        birthdate: guestData.birthdate,
                        birthplace: guestData.birthplace,
                        citizenship: guestData.citizenship,
                        civilStatus: guestData.civilStatus,
                        contactNumber: guestData.contactNumber,
                        email: guestData.email,
                        religion: guestData.religion,
                        sex: guestData.sex,
                        address: guestData.address
                    }
                };
    
                const userRegisterResponse = await Axios.post('http://localhost:8080/user/register', userPayload);
    
                if (userRegisterResponse.status === 200) {
                    console.log('User Registered Successfully');
                    setShowGuestModal(false);
                    navigate('/login');
                } else {
                    console.error('Failed to Register User');
                }
            } else {
                console.error('Failed to Add Guest');
            }
        } catch (error) {
            console.error('Error Adding Guest:', error);
        }
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
                            <input type={showPassword ? "text" : "password"} required onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                            {showPassword ? (
                                <TbEyeUp className="icon" onClick={togglePasswordVisibility} />
                            ) : (
                                <TbEyeClosed className="icon" onClick={togglePasswordVisibility} />
                            )}
                        </div>  

                        {errorMessage && (errorMessage === 'Please Enter a Password.' || errorMessage === 'PLEASE CREATE A STRONGER PASSWORD. PASSWORD SHOULD CONTAIN SPECIAL CHARACTERS.') &&    
                             <p className="error-message">{errorMessage}</p>}

                    </div>

                    {userType !== 'guest' && (
                        <div className="input-box">
                            <label>{userType === 'student' ? 'Student Number:' : 'Employee Number:'}</label>
                            <input type="text" name="memberNumber" value={formData.memberNumber} onChange={handleChange} />
                        </div>
                    )}
                    {errorMessage && (errorMessage === 'STUDENT NUMBER DOES NOT EXIST!!' || errorMessage === 'STUDENT ALREADY EXISTS!') && <p className="error-message">{errorMessage}</p>}
                    {errorMessage && (errorMessage === 'EMPLOYEE NUMBER DOES NOT EXIST!!' || errorMessage === 'EMPLOYEE ALREADY EXISTS!') && <p className="error-message">{errorMessage}</p>}
                    {errorMessage && (errorMessage === 'Please Enter your Member Number') && <p className="error-message">{errorMessage}</p>}

                    {userType !== 'guest' && (
                        <div className="input-box">
                            <label>Email:</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} />
                        </div>
                    )}
                    {errorMessage && errorMessage === 'Please Enter a Valid Email Address.' && <p className="error-message">{errorMessage}</p>}

                    <button 
                        type="submit" 
                        disabled={isButtonDisabled || isSubmitting}
                        className={isButtonDisabled || isSubmitting ? 'button-disabled1' : 'button-enabled1'}
                    >
                        {isSubmitting ? 'Submitting...' : 'Register'}
                    </button>
                    
                    
                    <div className="register-link">
                        <p className="noAcc">Already have an Account?<a className="click" href="/login">Click here</a></p>
                    </div>

                </form>

            </div>
            
            {showGuestModal && <AddGuestModal onClose={() => setShowGuestModal(false)} onSubmit={handleSubmitGuest} />}

        </div>
    );
};

export default RegisterForm;

