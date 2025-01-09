
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

    const [errors, setErrors] = useState({}); // To track field errors


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setGuestData({ ...guestData, [name]: value });

         // Clear the error for the field being edited
         setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    };

    const handleGuestSubmit = (e) => {
        e.preventDefault();
    
        const newErrors = {};
    
        // Check for required fields and add class if empty
        if (!guestData.email) newErrors.email = true;
        if (!guestData.contactNumber) newErrors.contactNumber = true;
    
        // If there are errors, set them and prevent submission
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
    
        // Call the onSubmit function if no errors
        onSubmit(guestData);
    };
    
    

    return (
        <div className="gues-modal-container">

            <div className="guest-modal-content">

                <form className='form-modal' onSubmit={handleGuestSubmit}>

                    <span className="close2" onClick={onClose}>&times;</span>

                    <h2 className='add-guest-header'>Add Guest</h2>

                    <h3 className='required-asterisk-header'>Fields that are marked with * are required</h3>

                    <div className='wrap-modal'>  

                        <div className="form-group-modal">
                            <label>First Name:</label>
                            <input
                                type="text"
                                name="firstName"
                                value={guestData.firstName}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group-modal">
                            <label>Middle Name:</label>
                            <input 
                                type="text" 
                                name="middleName" 
                                value={guestData.middleName} 
                                onChange={handleInputChange} 
                            />
                        </div>

                        <div className="form-group-modal">
                            <label>Last Name:</label>
                            <input
                                type="text"
                                name="lastName"
                                value={guestData.lastName}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group-modal">
                            <label>Birthdate:</label>
                            <input
                                type="date"
                                name="birthdate"
                                value={guestData.birthdate}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group-modal">
                            <label>Birthplace:</label>
                            <input 
                                type="text" 
                                name="birthplace" 
                                value={guestData.birthplace} 
                                onChange={handleInputChange} 
                            />
                        </div>

                        <div className="form-group-modal">
                            <label>Citizenship:</label>
                            <input 
                                type="text" 
                                name="citizenship" 
                                value={guestData.citizenship} 
                                onChange={handleInputChange} 
                            />
                        </div>

                        <div className="form-group-modal">
                            <label>Religion:</label>
                            <input 
                                type="text" 
                                name="religion" 
                                value={guestData.religion} 
                                onChange={handleInputChange} 
                            />
                        </div>

                        <div className="form-group-modal">
                            <label>Civil Status:</label>
                            <input 
                                type="text" 
                                name="civilStatus" 
                                value={guestData.civilStatus} 
                                onChange={handleInputChange} 
                            />
                        </div>

                        <div className="form-group-modal">
                            <label>Sex:</label>
                            <input 
                                type="text" 
                                name="sex" 
                                value={guestData.sex} 
                                onChange={handleInputChange} 
                            />
                        </div>

                        <div className="form-group-modal">
                            <label>Email: <span className="required">*</span></label>
                            <input
                                type="email"
                                name="email"
                                value={guestData.email}
                                onChange={handleInputChange}
                                className={errors.email ? 'input-error' : ''}
                            />
                        </div>

                        <div className="form-group-modal">
                            <label>Contact Number: <span className="required">*</span></label>
                            <input
                                type="text"
                                name="contactNumber"
                                value={guestData.contactNumber}
                                onChange={handleInputChange}
                                className={errors.contactNumber ? 'input-error' : ''}
                            />
                        </div>

                        <div className="form-group-modal">
                            <label>Address:</label>
                            <input 
                                type="text" 
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
