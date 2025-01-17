import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import styles from '../styles/OffenseModal.module.css';

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
            validationErrors.description = "Use at most 32 characters";
        }

        if (!newOffense.type) {
            validationErrors.type = "Type is required";
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
        if (validate()) {
            onSubmit(newOffense);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.offenseModalOverlay}>
            <div className={styles.offenseModalContent}>
                <button onClick={onClose} className={styles.offenseCloseBtn}>
                    <FaTimes />
                </button>

                <div className={styles.offenseModalHeader}>
                    <h2 className={styles.offenseModalTitle}>Add Offense</h2>
                </div>

                <form onSubmit={handleSubmit} className={styles.offenseFormContainer}>
                    <div className={styles.offenseFormGroup}>
                        <label htmlFor="description">Offense</label>
                        <input
                            type="text"
                            id="description"
                            name="description"
                            value={newOffense.description}
                            onChange={handleInputChange}
                            required
                        />
                        {errors.description && <p className={styles.offenseErrorMessage}>{errors.description}</p>}
                    </div>

                    <div className={styles.offenseFormGroup}>
                        <label htmlFor="type">Type</label>
                        <select
                            id="type"
                            name="type"
                            value={newOffense.type}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="" disabled>Select type</option>
                            <option value="Major">Major</option>
                            <option value="Minor">Minor</option>
                        </select>
                        {errors.type && <p className={styles.offenseErrorMessage}>{errors.type}</p>}
                    </div>

                    <button type="submit" className={styles.offenseSubmitBtn}>Submit</button>
                </form>
            </div>
        </div>
    );
};

export default AddOffenseModal;

