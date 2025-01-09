import React, { useState } from 'react';
import Modal from 'react-modal';

import '../styles/AddOffenseModal.css';

const AddOffenseModal = ({ isOpen, onClose, onSubmit }) => {
    const [errors, setErrors] = useState({});
    const [newOffense, setNewOffense] = useState({
        description: "",
        type: ""
    });

    const validate = () => {
        const specialCharPattern = /[^a-zA-Z ]/;
        let validationErrors = {};

        if (!newOffense.description) {
            validationErrors.description = "Offense is required";
        } else if (specialCharPattern.test(newOffense.description)) {
            validationErrors.description = "Invalid Input. Please try again";
        } else if (newOffense.description.length > 32) {
            validationErrors.description = "Use at least 32 characters";
        }

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewOffense({ ...newOffense, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(validate());
        if (validate()) {
            onSubmit(newOffense);
        }
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onClose} className="modal-container">

            <button onClick={onClose} className="close-btn">&times;</button>

            <h2>Add Offense</h2>

            <form onSubmit={handleSubmit} className='offense-form-container'>

                <div className="add-offense-input-container">
                    <label>Offense</label>
                    <input type="text" className='add-offense-input' name="description" value={newOffense.description} onChange={handleInputChange} required />
                    {errors.description && <p className="error-add-offense">{errors.description}</p>}
                </div>

                <div className="add-offense-form-group">
                    <label>Type</label>
                    <select name="type" value={newOffense.type} onChange={handleInputChange} className='add-offense-selectOffense' required>
                        <option value="" disabled>Select type</option>
                        <option value="Major">Major</option>
                        <option value="Minor">Minor</option>
                    </select>
                </div>

                <div className="button-container">
                    <button type="submit" className="submit-btn">Submit</button>
                </div>
            </form>
            
        </Modal>
    );
};

export default AddOffenseModal;