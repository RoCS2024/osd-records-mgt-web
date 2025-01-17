import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import styles from '../styles/CsReportModal.module.css';

const AddCsReportModal = ({ isOpen, onClose, onSubmit, csSlipId }) => {
    const initialCsReportState = {
        dateOfCs: "",
        timeIn: "",
        timeOut: "",
        hoursCompleted: "",
        natureOfWork: "",
        status: "Incomplete",
        remarks: "",
    };

    const [newCsReport, setNewCsReport] = useState(initialCsReportState);
    const [errors, setErrors] = useState({});

    const validate = () => {
        const currentDate = new Date().toISOString().split('T')[0];
        const specialCharPattern = /[^a-zA-Z0-9 ]/;
        const numberPattern = /[0-9]/;
        let validationErrors = {};

        if (!newCsReport.dateOfCs) {
            validationErrors.dateOfCs = "Date of CS is required";
        } else if (newCsReport.dateOfCs > currentDate) {
            validationErrors.dateOfCs = "Date of CS cannot be in the future";
        }

        if (!newCsReport.timeIn) {
            validationErrors.timeIn = "Time In is required";
        }

        if (!newCsReport.timeOut) {
            validationErrors.timeOut = "Time Out is required";
        }

        if (newCsReport.timeIn && newCsReport.timeOut && newCsReport.timeIn >= newCsReport.timeOut) {
            validationErrors.timeOut = "Time Out should be after Time In";
        }

        if (!newCsReport.natureOfWork) {
            validationErrors.natureOfWork = "Nature of Work is required";
        } else if (specialCharPattern.test(newCsReport.natureOfWork)) {
            validationErrors.natureOfWork = "Nature of Work should not contain special characters";
        } else if (numberPattern.test(newCsReport.natureOfWork)) {
            validationErrors.natureOfWork = "Nature of Work should not contain numbers";
        }

        if (!newCsReport.remarks) {
            validationErrors.remarks = "Remarks are required";
        } else if (specialCharPattern.test(newCsReport.remarks)) {
            validationErrors.remarks = "Remarks should not contain special characters";
        }

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCsReport({ ...newCsReport, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(csSlipId, newCsReport);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.csReportModalOverlay}>
            <div className={styles.csReportModalContent}>
                <div className={styles.csReportModalHeader}>
                    <h2>Add CS Report</h2>
                    <button onClick={onClose} className={styles.csReportCloseBtn}>
                        <FaTimes />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className={styles.csReportFormContainer}>
                    <div className={styles.csReportFormGrid}>
                        <div className={styles.csReportFormGroup}>
                            <label htmlFor="dateOfCs">Date of CS:</label>
                            <input
                                type="date"
                                id="dateOfCs"
                                name="dateOfCs"
                                value={newCsReport.dateOfCs}
                                onChange={handleInputChange}
                                className={styles.csReportInput}
                                required
                            />
                            {errors.dateOfCs && <p className={styles.csReportErrorMessage}>{errors.dateOfCs}</p>}
                        </div>

                        <div className={styles.csReportFormGroup}>
                            <label htmlFor="timeIn">Time In:</label>
                            <input
                                type="time"
                                id="timeIn"
                                name="timeIn"
                                value={newCsReport.timeIn}
                                onChange={handleInputChange}
                                className={styles.csReportInput}
                                required
                            />
                            {errors.timeIn && <p className={styles.csReportErrorMessage}>{errors.timeIn}</p>}
                        </div>

                        <div className={styles.csReportFormGroup}>
                            <label htmlFor="timeOut">Time Out:</label>
                            <input
                                type="time"
                                id="timeOut"
                                name="timeOut"
                                value={newCsReport.timeOut}
                                onChange={handleInputChange}
                                className={styles.csReportInput}
                                required
                            />
                            {errors.timeOut && <p className={styles.csReportErrorMessage}>{errors.timeOut}</p>}
                        </div>

                        <div className={styles.csReportFormGroup}>
                            <label htmlFor="natureOfWork">Nature of Work:</label>
                            <input
                                type="text"
                                id="natureOfWork"
                                name="natureOfWork"
                                value={newCsReport.natureOfWork}
                                onChange={handleInputChange}
                                className={styles.csReportInput}
                                required
                            />
                            {errors.natureOfWork && <p className={styles.csReportErrorMessage}>{errors.natureOfWork}</p>}
                        </div>

                        <div className={styles.csReportFormGroup}>
                            <label htmlFor="status">Status:</label>
                            <select
                                id="status"
                                name="status"
                                value={newCsReport.status}
                                onChange={handleInputChange}
                                className={styles.csReportSelect}
                                required
                            >
                                <option value="Incomplete">Incomplete</option>
                                <option value="Complete">Complete</option>
                            </select>
                        </div>

                        <div className={styles.csReportFormGroup}>
                            <label htmlFor="remarks">Remarks:</label>
                            <textarea
                                id="remarks"
                                name="remarks"
                                value={newCsReport.remarks}
                                onChange={handleInputChange}
                                className={styles.csReportTextarea}
                                required
                            ></textarea>
                            {errors.remarks && <p className={styles.csReportErrorMessage}>{errors.remarks}</p>}
                        </div>
                    </div>

                    <button type="submit" className={styles.csReportSubmitBtn}>Submit</button>
                </form>
            </div>
        </div>
    );
};

export default AddCsReportModal;

