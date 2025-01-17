import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import styles from '../styles/OffenseModal.module.css';

const EditOffenseModal = ({ isOpen, onClose, onSubmit, offenseToEdit }) => {
    const [errors, setErrors] = useState({});
    const [offense, setOffense] = useState({
        description: "",
        type: ""
    });

    useEffect(() => {
        if (offenseToEdit) {
            setOffense(offenseToEdit);
        }
    }, [offenseToEdit]);

    const validate = () => {
        const specialCharPattern = /[^a-zA-Z ]/;
        let validationErrors = {};

        if (!offense.description) {
            validationErrors.description = "Offense is required";
        } else if (specialCharPattern.test(offense.description)) {
            validationErrors.description = "Invalid Input. Please try again";
        } else if (offense.description.length > 32) {
            validationErrors.description = "Use at most 32 characters";
        }

        if (!offense.type) {
            validationErrors.type = "Type is required";
        }

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setOffense({ ...offense, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(offense);
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
                    <h2 className={styles.offenseModalTitle}>Edit Offense</h2>
                </div>

                <form onSubmit={handleSubmit} className={styles.offenseFormContainer}>
                    <div className={styles.offenseFormGroup}>
                        <label htmlFor="description">Offense</label>
                        <input
                            type="text"
                            id="description"
                            name="description"
                            value={offense.description}
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
                            value={offense.type}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="" disabled>Select type</option>
                            <option value="Major">Major</option>
                            <option value="Minor">Minor</option>
                        </select>
                        {errors.type && <p className={styles.offenseErrorMessage}>{errors.type}</p>}
                    </div>

                    <button type="submit" className={styles.offenseSubmitBtn}>Save Changes</button>
                </form>
            </div>
        </div>
    );
};

export default EditOffenseModal;

