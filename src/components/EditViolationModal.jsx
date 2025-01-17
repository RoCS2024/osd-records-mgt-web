import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { FaTimes } from 'react-icons/fa';
import { getApiUrl, API_ENDPOINTS } from '../Constants';
import styles from '../styles/ViolationModal.module.css';

const EditViolationModal = ({ isOpen, onClose, onSubmit, violationToEdit }) => {
    const [errors, setErrors] = useState({});
    const [offenses, setOffenses] = useState([]);
    const [students, setStudents] = useState([]);
    const [employees, setEmployees] = useState([]);
    const disciplinaryActions = [
        { value: 'Reminder from Discipline Officer', label: 'Reminder from Discipline Officer' },
        { value: 'Reminder from Discipline Officer w/ Written Warning', label: 'Reminder from Discipline Officer w/ Written Warning' },
        { value: 'Dialogue with Prefect of Discipline', label: 'Dialogue with Prefect of Discipline' },
        { value: 'Probation for 1 Semester', label: 'Probation for 1 Semester' },
        { value: 'Conference with the DSSS', label: 'Conference with the DSSS' },
        { value: 'Meeting of the DSSS w/ the student\'s parent/guardian', label: 'Meeting of the DSSS w/ the student\'s parent/guardian' },
        { value: 'Issuance of notice of violation', label: 'Issuance of notice of violation' },
        { value: 'Non-admission for 1 semester', label: 'Non-admission for 1 semester' },
        { value: 'Non-admission for 2 semesters', label: 'Non-admission for 2 semesters' },
        { value: 'Recommendation for dismissal', label: 'Recommendation for dismissal' },
    ];    
    
    const [violation, setViolation] = useState({
        studentId: "",
        studentNumber: "",
        studentName: "",
        offenseId: "",
        dateOfNotice: "",
        warningNumber: "",
        disciplinaryAction: "",
        csHours: "",
        approvedByNumber: "",
        approvedByName: ""
    });

    useEffect(() => {
        if (violationToEdit) {
            const formattedViolation = {
                ...violationToEdit,
                studentNumber: violationToEdit.student.studentNumber,
                studentName: `${violationToEdit.student.lastName}, ${violationToEdit.student.firstName} ${violationToEdit.student.middleName}`,
                dateOfNotice: new Date(violationToEdit.dateOfNotice).toISOString().split('T')[0],
                approvedByNumber: violationToEdit.approvedBy ? violationToEdit.approvedBy.employeeNumber : "",
                approvedByName: violationToEdit.approvedBy ? `${violationToEdit.approvedBy.lastName}, ${violationToEdit.approvedBy.firstName} ${violationToEdit.approvedBy.middleName}` : "",
                offenseId: violationToEdit.offense.id,
            };
            setViolation(formattedViolation);
        }
    }, [violationToEdit]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const [offensesResponse, studentsResponse, employeesResponse] = await Promise.all([
                    axios.get(getApiUrl(API_ENDPOINTS.OFFENSE.LIST), {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    axios.get(getApiUrl(API_ENDPOINTS.STUDENT.LIST), {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    axios.get(getApiUrl(API_ENDPOINTS.EMPLOYEE.LIST), {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                ]);
                setOffenses(offensesResponse.data.map(offense => ({
                    value: offense.id,
                    label: offense.description
                })));
                setStudents(studentsResponse.data);
                setEmployees(employeesResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (violation.offenseId && offenses.length > 0) {
            const selectedOffense = offenses.find(offense => offense.value === violation.offenseId);
            if (selectedOffense) {
                setViolation(prev => ({ ...prev, offenseId: selectedOffense.value }));
            }
        }
    }, [violation.offenseId, offenses]);

    const validate = () => {
        const currentDate = new Date().toISOString().split('T')[0];
        const specialCharPattern = /[^a-zA-Z0-9- ]/;
        const numberPattern = /^[0-9]+$/;
        let validationErrors = {};

        if (!violation.dateOfNotice) {
            validationErrors.dateOfNotice = "Date of Notice is required";
        } else if (violation.dateOfNotice > currentDate) {
            validationErrors.dateOfNotice = "Date cannot be in the future";
        }

        if (!violation.csHours) {
            validationErrors.csHours = "Community Service Hours is required";
        } else if (!numberPattern.test(violation.csHours) || parseInt(violation.csHours) <= 0) {
            validationErrors.csHours = "Please enter a valid number of hours";
        }

        if (!violation.studentNumber) {
            validationErrors.studentNumber = "Student Number is required";
        } else if (specialCharPattern.test(violation.studentNumber)) {
            validationErrors.studentNumber = "This entry can only accept alphanumeric characters and hyphens";
        }

        if (!violation.disciplinaryAction) {
            validationErrors.disciplinaryAction = "Disciplinary Action is required";
        }

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setViolation(prev => ({ ...prev, [name]: value }));
        if (name === 'studentNumber') {
            fetchStudentDetails(value);
        } else if (name === 'approvedByNumber') {
            fetchEmployeeDetails(value);
        }
    };

    const handleOffenseChange = (selectedOption) => {
        setViolation(prev => ({ ...prev, offenseId: selectedOption ? selectedOption.value : "" }));
    };

    const handleDisciplinaryActionChange = (selectedOption) => {
        setViolation(prev => ({ ...prev, disciplinaryAction: selectedOption ? selectedOption.value : "" }));
    };

    const fetchStudentDetails = (studentNumber) => {
        const student = students.find(s => s.studentNumber === studentNumber);
        if (student) {
            setViolation(prev => ({
                ...prev,
                studentName: `${student.lastName}, ${student.firstName} ${student.middleName}`,
                studentId: student.id
            }));
        } else {
            setViolation(prev => ({ ...prev, studentName: '', studentId: '' }));
        }
    };

    const fetchEmployeeDetails = (employeeNumber) => {
        const employee = employees.find(e => e.employeeNumber === employeeNumber);
        if (employee) {
            setViolation(prev => ({
                ...prev,
                approvedByName: `${employee.lastName}, ${employee.firstName} ${employee.middleName}`,
                approvedById: employee.id
            }));
        } else {
            setViolation(prev => ({ ...prev, approvedByName: '', approvedById: '' }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(violation);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.violationModalOverlay}>
            <div className={styles.violationModalContent}>
                <button onClick={onClose} className={styles.violationCloseBtn}>
                    <FaTimes />
                </button>

                <h2 className={styles.headerText}>Edit Violation</h2>

                <form onSubmit={handleSubmit} className={styles.violationFormContainer}>
                    <div className={styles.violationFormGrid}>
                        <div className={styles.violationFormGroup}>
                            <label htmlFor="studentNumber">Student Number</label>
                            <input
                                type="text"
                                id="studentNumber"
                                name="studentNumber"
                                value={violation.studentNumber}
                                onChange={handleInputChange}
                                required
                            />
                            {errors.studentNumber && <p className={styles.violationErrorMessage}>{errors.studentNumber}</p>}
                        </div>

                        <div className={styles.violationFormGroup}>
                            <label htmlFor="studentName">Student Name</label>
                            <input
                                type="text"
                                id="studentName"
                                name="studentName"
                                value={violation.studentName}
                                disabled
                            />
                        </div>

                        <div className={styles.violationFormGroup}>
                            <label htmlFor="offenseId">Offense</label>
                            <Select
                                id="offenseId"
                                options={offenses}
                                onChange={handleOffenseChange}
                                value={offenses.find(option => option.value === violation.offenseId) || null}
                                placeholder="Select an offense"
                                className={styles.violationSelect}
                                isClearable={false}
                            />
                            {errors.offenseId && <p className={styles.violationErrorMessage}>{errors.offenseId}</p>}
                        </div>

                        <div className={styles.violationFormGroup}>
                            <label htmlFor="dateOfNotice">Date of Notice</label>
                            <input
                                type="date"
                                id="dateOfNotice"
                                name="dateOfNotice"
                                value={violation.dateOfNotice}
                                onChange={handleInputChange}
                                required
                            />
                            {errors.dateOfNotice && <p className={styles.violationErrorMessage}>{errors.dateOfNotice}</p>}
                        </div>

                        <div className={styles.violationFormGroup}>
                            <label htmlFor="warningNumber">Number of Occurrence</label>
                            <input
                                type="text"
                                id="warningNumber"
                                name="warningNumber"
                                value={violation.warningNumber}
                                disabled
                            />
                        </div>

                        <div className={styles.violationFormGroup}>
                            <label htmlFor="disciplinaryAction">Disciplinary Action</label>
                            <Select
                                id="disciplinaryAction"
                                options={disciplinaryActions}
                                onChange={handleDisciplinaryActionChange}
                                value={disciplinaryActions.find(option => option.value === violation.disciplinaryAction) || null}
                                placeholder="Select a disciplinary action"
                                className={styles.violationSelect}
                            />
                            {errors.disciplinaryAction && <p className={styles.violationErrorMessage}>{errors.disciplinaryAction}</p>}
                        </div>

                        <div className={styles.violationFormGroup}>
                            <label htmlFor="csHours">Community Service Hours</label>
                            <input
                                type="number"
                                id="csHours"
                                name="csHours"
                                value={violation.csHours}
                                onChange={handleInputChange}
                                required
                            />
                            {errors.csHours && <p className={styles.violationErrorMessage}>{errors.csHours}</p>}
                        </div>

                        <div className={styles.violationFormGroup}>
                            <label htmlFor="approvedByNumber">Approved by: Employee Number</label>
                            <input
                                type="text"
                                id="approvedByNumber"
                                name="approvedByNumber"
                                value={violation.approvedByNumber}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className={styles.violationFormGroup}>
                            <label htmlFor="approvedByName">Approved by: Employee Name</label>
                            <input
                                type="text"
                                id="approvedByName"
                                name="approvedByName"
                                value={violation.approvedByName}
                                disabled
                            />
                        </div>
                    </div>

                    <button type="submit" className={styles.violationSubmitBtn}>Save Changes</button>
                </form>
            </div>
        </div>
    );
};

export default EditViolationModal;

