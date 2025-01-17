import React, { useState } from 'react';
import '../styles/AddGuestModal.css';

const AddGuestModal = ({ onClose, onSubmit }) => {
    const [guestData, setGuestData] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        birthdate: '',
        birthplace: '',
        citizenship: '',
        religion: '',
        civilStatus: '',
        sex: '',
        email: '',
        contactNumber: '',
        address: '',
        guestNumber: '' 
    });

    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setGuestData({ ...guestData, [name]: value });
        setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    };

    const handleGuestSubmit = (e) => {
        e.preventDefault();
    
        const newErrors = {};
    
        if (!guestData.email) newErrors.email = 'Email is required';
        if (!guestData.contactNumber) newErrors.contactNumber = 'Contact number is required';
    
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
    
        onSubmit(guestData);
    };

    return (
        <div className="guest-modal-overlay">
            <div className="guest-modal-content">
                <form className='form-modal' onSubmit={handleGuestSubmit}>
                    <div className="modal-header">
                        <h2>Add Guest</h2>
                        <button type="button" className="close-button" onClick={onClose}>&times;</button>
                    </div>

                    <p className='required-info'>Fields marked with * are required</p>

                    <div className='form-fields'>  
                        <div className="form-group-modal">
                            <label htmlFor="firstName">First Name:</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={guestData.firstName}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group-modal">
                            <label htmlFor="middleName">Middle Name:</label>
                            <input 
                                type="text"
                                id="middleName"
                                name="middleName" 
                                value={guestData.middleName} 
                                onChange={handleInputChange} 
                            />
                        </div>

                        <div className="form-group-modal">
                            <label htmlFor="lastName">Last Name:</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={guestData.lastName}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group-modal">
                            <label htmlFor="birthdate">Birthdate:</label>
                            <input
                                type="date"
                                id="birthdate"
                                name="birthdate"
                                value={guestData.birthdate}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group-modal">
                            <label htmlFor="birthplace">Birthplace:</label>
                            <input 
                                type="text"
                                id="birthplace"
                                name="birthplace" 
                                value={guestData.birthplace} 
                                onChange={handleInputChange} 
                            />
                        </div>

                        <div className="form-group-modal">
                            <label htmlFor="citizenship">Citizenship:</label>
                            <input 
                                type="text"
                                id="citizenship"
                                name="citizenship" 
                                value={guestData.citizenship} 
                                onChange={handleInputChange} 
                            />
                        </div>

                        <div className="form-group-modal">
                            <label htmlFor="religion">Religion:</label>
                            <input 
                                type="text"
                                id="religion"
                                name="religion" 
                                value={guestData.religion} 
                                onChange={handleInputChange} 
                            />
                        </div>

                        <div className="form-group-modal">
                            <label htmlFor="civilStatus">Civil Status:</label>
                            <input 
                                type="text"
                                id="civilStatus"
                                name="civilStatus" 
                                value={guestData.civilStatus} 
                                onChange={handleInputChange} 
                            />
                        </div>

                        <div className="form-group-modal">
                            <label htmlFor="sex">Sex:</label>
                            <input 
                                type="text"
                                id="sex"
                                name="sex" 
                                value={guestData.sex} 
                                onChange={handleInputChange} 
                            />
                        </div>

                        <div className="form-group-modal">
                            <label htmlFor="email">Email: <span className="required">*</span></label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={guestData.email}
                                onChange={handleInputChange}
                                className={errors.email ? 'input-error' : ''}
                            />
                            {errors.email && <p className="error-message">{errors.email}</p>}
                        </div>

                        <div className="form-group-modal">
                            <label htmlFor="contactNumber">Contact Number: <span className="required">*</span></label>
                            <input
                                type="text"
                                id="contactNumber"
                                name="contactNumber"
                                value={guestData.contactNumber}
                                onChange={handleInputChange}
                                className={errors.contactNumber ? 'input-error' : ''}
                            />
                            {errors.contactNumber && <p className="error-message">{errors.contactNumber}</p>}
                        </div>

                        <div className="form-group-modal">
                            <label htmlFor="address">Address:</label>
                            <input 
                                type="text"
                                id="address"
                                name="address" 
                                value={guestData.address} 
                                onChange={handleInputChange} 
                            />
                        </div>
                    </div>
                    
                    <button type="submit" className='add-guest-button'>Add Guest</button>
                </form>
            </div>
        </div>
    );
};

export default AddGuestModal;

