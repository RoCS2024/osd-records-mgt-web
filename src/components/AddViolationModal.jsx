import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { FaTimes } from 'react-icons/fa';
import { getApiUrl, API_ENDPOINTS } from '../Constants';
import styles from '../styles/ViolationModal.module.css';

const AddViolationModal = ({ isOpen, onClose, onSubmit }) => {
    const [errors, setErrors] = useState({});
    const [offenses, setOffenses] = useState([]);
    const [students, setStudents] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [disciplinaryActions, setDisciplinaryActions] = useState([
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
    ]);
    const [newViolation, setNewViolation] = useState({
        studentId: "",
        studentNumber: "",
        studentName: "",
        offenseId: "",
        dateOfNotice: "",
        disciplinaryAction: "",
        csHours: "",
        approvedByNumber: "",
        approvedByName: ""
    });

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

    const validate = () => {
        const currentDate = new Date().toISOString().split('T')[0];
        const specialCharPattern = /[^a-zA-Z0-9- ]/;
        const numberPattern = /^[0-9]+$/;
        let validationErrors = {};

        if (!newViolation.offenseId) {
            validationErrors.offenseId = "Offense is required";
        }

        if (!newViolation.dateOfNotice) {
            validationErrors.dateOfNotice = "Date of Notice is required";
        } else if (newViolation.dateOfNotice > currentDate) {
            validationErrors.dateOfNotice = "Date cannot be in the future";
        }

        if (!newViolation.csHours) {
            validationErrors.csHours = "Community Service Hours is required";
        } else if (!numberPattern.test(newViolation.csHours) || parseInt(newViolation.csHours) <= 0) {
            validationErrors.csHours = "Please enter a valid number of hours";
        }

        if (!newViolation.studentNumber) {
            validationErrors.studentNumber = "Student Number is required";
        } else if (specialCharPattern.test(newViolation.studentNumber)) {
            validationErrors.studentNumber = "This entry can only accept alphanumeric characters and hyphens";
        }

        if (!newViolation.disciplinaryAction) {
            validationErrors.disciplinaryAction = "Disciplinary Action is required";
        }

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewViolation(prev => ({ ...prev, [name]: value }));
        if (name === 'studentNumber') {
            fetchStudentDetails(value);
        } else if (name === 'approvedByNumber') {
            fetchEmployeeDetails(value);
        }
    };

    const handleOffenseChange = (selectedOption) => {
        setNewViolation(prev => ({ ...prev, offenseId: selectedOption ? selectedOption.value : "" }));
    };

    const handleDisciplinaryActionChange = (selectedOption) => {
        setNewViolation(prev => ({ ...prev, disciplinaryAction: selectedOption ? selectedOption.value : "" }));
    };

    const fetchStudentDetails = (studentNumber) => {
        const student = students.find(s => s.studentNumber === studentNumber);
        if (student) {
            setNewViolation(prev => ({
                ...prev,
                studentName: `${student.lastName}, ${student.firstName} ${student.middleName}`,
                studentId: student.id
            }));
        } else {
            setNewViolation(prev => ({ ...prev, studentName: '', studentId: '' }));
        }
    };

    const fetchEmployeeDetails = (employeeNumber) => {
        const employee = employees.find(e => e.employeeNumber === employeeNumber);
        if (employee) {
            setNewViolation(prev => ({
                ...prev,
                approvedByName: `${employee.lastName}, ${employee.firstName} ${employee.middleName}`,
                approvedById: employee.id
            }));
        } else {
            setNewViolation(prev => ({ ...prev, approvedByName: '', approvedById: '' }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(newViolation);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.violationModalOverlay}>
            <div className={styles.violationModalContent}>
                <button onClick={onClose} className={styles.violationCloseBtn}>
                    <FaTimes />
                </button>

                <h2 className={styles.headerText}>Add Violation</h2>

                <form onSubmit={handleSubmit} className={styles.violationFormContainer}>
                    <div className={styles.violationFormGrid}>
                        <div className={styles.violationFormGroup}>
                            <label htmlFor="studentNumber">Student Number</label>
                            <input
                                type="text"
                                id="studentNumber"
                                name="studentNumber"
                                value={newViolation.studentNumber}
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
                                value={newViolation.studentName}
                                disabled
                            />
                        </div>

                        <div className={styles.violationFormGroup}>
                            <label htmlFor="offenseId">Offense</label>
                            <Select
                                id="offenseId"
                                options={offenses}
                                onChange={handleOffenseChange}
                                value={offenses.find(option => option.value === newViolation.offenseId) || null}
                                placeholder="Select an offense"
                                className={styles.violationSelect}
                            />
                            {errors.offenseId && <p className={styles.violationErrorMessage}>{errors.offenseId}</p>}
                        </div>

                        <div className={styles.violationFormGroup}>
                            <label htmlFor="dateOfNotice">Date of Notice</label>
                            <input
                                type="date"
                                id="dateOfNotice"
                                name="dateOfNotice"
                                value={newViolation.dateOfNotice}
                                onChange={handleInputChange}
                                required
                            />
                            {errors.dateOfNotice && <p className={styles.violationErrorMessage}>{errors.dateOfNotice}</p>}
                        </div>

                        <div className={styles.violationFormGroup}>
                            <label htmlFor="disciplinaryAction">Disciplinary Action</label>
                            <Select
                                id="disciplinaryAction"
                                options={disciplinaryActions}
                                onChange={handleDisciplinaryActionChange}
                                value={disciplinaryActions.find(option => option.value === newViolation.disciplinaryAction) || null}
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
                                value={newViolation.csHours}
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
                                value={newViolation.approvedByNumber}
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
                                value={newViolation.approvedByName}
                                disabled
                            />
                        </div>
                    </div>

                    <button type="submit" className={styles.violationSubmitBtn}>Submit</button>
                </form>
            </div>
        </div>
    );
};

export default AddViolationModal;

