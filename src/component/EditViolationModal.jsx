import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import '../styles/EditViolationModal.css';

import { getApiUrl, API_ENDPOINTS } from '../Constants';

const EditViolationModal = ({ isOpen, onClose, onSubmit, violationToEdit }) => {
    const [errors, setErrors] = useState({});
    const [offenses, setOffenses] = useState([]);
    const [students, setStudents] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [violation, setViolation] = useState({
        studentId: "",
        studentNumber: "",
        studentName: "",
        type: "",
        offenseId: "",
        description: "",
        dateOfNotice: "",
        warningNumber: "",
        disciplinaryAction: "",
        csHours: "",
        approvedById: "",
        approvedByNumber: "",
        approvedByName: ""
    });

    
    const validate = () => {
        
        const currentDate = new Date().toISOString().split('T')[0];
        const specialCharPattern = /[^a-zA-Z0-9- ]/;
        const numberPattern = /^[0-9]*$/;
        let validationErrors = {};

        if (!violation.dateOfNotice) {
            validationErrors.dateOfNotice = "Date of Notice is required";
        } else if (violation.dateOfNotice > currentDate) {
            validationErrors.dateOfNotice = "Date cannot be in the future";
        }

        if (!violation.warningNumber) {
            validationErrors.warningNumber = "Number of Occurrence is required";
        } else if (!numberPattern.test(violation.warningNumber) || violation.warningNumber <= 0) {
            validationErrors.warningNumber = "Invalid input";
        }

        if (!violation.csHours) {
            validationErrors.csHours = "Community Service Hours is required";
        } else if (!numberPattern.test(violation.csHours) || violation.csHours <= 0) {
            validationErrors.csHours = "Please enter valid hour";
        }

        if (!violation.studentNumber) {
            validationErrors.studentNumber = "Student Number is required";
        } else if (specialCharPattern.test(violation.studentNumber)) {
            validationErrors.studentNumber = "This entry can only accept alpha-numeric and (-)";
        } 

        if (!violation.disciplinaryAction) {
            validationErrors.disciplinaryAction = "Disciplinary Action is required";
        } else if (specialCharPattern.test(violation.disciplinaryAction)) {
            validationErrors.disciplinaryAction = "Input must not contain special characters";
        }

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    useEffect(() => {
        if (violationToEdit) {
            const formattedViolation = {
                ...violationToEdit,
                studentNumber: violationToEdit.student.studentNumber,
                studentName: `${violationToEdit.student.lastName}, ${violationToEdit.student.firstName} ${violationToEdit.student.middleName}`,
                dateOfNotice: new Date(violationToEdit.dateOfNotice).toISOString().split('T')[0],
                approvedById: violationToEdit.approvedBy ? violationToEdit.approvedBy.employeeNumber : "",
                approvedByName: violationToEdit.approvedBy ? `${violationToEdit.approvedBy.lastName}, ${violationToEdit.approvedBy.firstName} ${violationToEdit.approvedBy.middleName}` : ""
            };
            setViolation(formattedViolation);
        }
    }, [violationToEdit]);

    useEffect(() => {
       
        const fetchOffenses = async () => {
            try {
                const response = await axios.get(getApiUrl(API_ENDPOINTS.OFFENSE.LIST), {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    }
                });
                setOffenses(response.data);
            } catch (error) {
                console.error('Error fetching offenses:', error);
            }
        };
        fetchOffenses();

        // fetch student and employee
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const [studentsResponse, employeesResponse] = await Promise.all([
                    axios.get(getApiUrl(API_ENDPOINTS.STUDENT.LIST), {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    axios.get(getApiUrl(API_ENDPOINTS.EMPLOYEE.LIST), {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                ]);
                setStudents(studentsResponse.data);
                setEmployees(employeesResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setViolation({ ...violation, [name]: value });

        if (name === 'studentNumber') {
            fetchStudentDetails(value);
        }

        if (name === 'approvedById') {
            fetchEmployeeDetails(value);
        }
    };

    const fetchStudentDetails = async (studentNumber) => {
        const student = students.find(student => student.studentNumber === studentNumber);
        if (student) {
            setViolation(prevState => ({
                ...prevState,
                studentName: `${student.lastName}, ${student.firstName} ${student.middleName}`,
                studentId: student.id
            }));
        } else {
            setViolation(prevState => ({
                ...prevState,
                studentName: '',
                studentId: ''
            }));
        }
    };

    const fetchEmployeeDetails = async (employeeNumber) => {
        const employee = employees.find(employee => employee.employeeNumber === employeeNumber);
        if (employee) {
            setViolation(prevState => ({
                ...prevState,
                approvedByName: `${employee.lastName}, ${employee.firstName} ${employee.middleName}`
            }));
        } else {
            setViolation(prevState => ({
                ...prevState,
                approvedByName: ''
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(violation);
        }
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onClose} className="modal">

            <button onClick={onClose} className="close-btn">&times;</button>
            
            <h2>Edit Violation</h2>

            <form onSubmit={handleSubmit} className='violation-form-container'>

                <div className='wrap'>

                    <div className="form-group">
                        <label>Student Number</label>
                        <input type="text" name="studentNumber" value={violation.studentNumber} onChange={handleInputChange} />
                        {errors.studentNumber && <p className="error-studentNumber">{errors.studentNumber}</p>}
                    </div>

                    <div className="form-group">
                        <label>Student Name</label>
                        <input type="text" name="studentName" value={violation.studentName} disabled />
                    </div>

                    <div className="form-group">
                        <label>Offense</label>
                        <select name="offenseId" value={violation.offenseId} onChange={handleInputChange}>
                            <option value="" disabled>Select an offense</option>
                            {offenses.map(offense => (
                                <option key={offense.id} value={offense.id}>{offense.description}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Date of Notice</label>
                        <input type="date" name="dateOfNotice" value={violation.dateOfNotice} onChange={handleInputChange} required />
                        {errors.dateOfNotice && <p className="error-date-notice">{errors.dateOfNotice}</p>}
                    </div>

                    <div className="form-group">
                        <label>Number of Occurrence</label>
                        <input type="text" name="warningNumber" value={violation.warningNumber} disabled />
                    </div>

                    <div className="form-group">
                        <label>Disciplinary Action</label>
                        <input
                            list="disciplinaryActions"
                            type="text"
                            name="disciplinaryAction"
                            value={violation.disciplinaryAction}
                            onChange={handleInputChange}
                            required
                            placeholder="Select or type an action"
                        />
                        <datalist id="disciplinaryActions">
                            <option value="First Offense" />
                            <option value="Second Offense" />
                            <option value="Probation" />
                            <option value="Suspension" />
                            <option value="Expulsion" />
                        </datalist>
                        {errors.disciplinaryAction && <p className="error-disciplinary-cation">{errors.disciplinaryAction}</p>}
                    </div>

                    <div className="form-group">
                        <label>Community Service Hours</label>
                        <input type="number" name="csHours" value={violation.csHours} onChange={handleInputChange} required />
                        {errors.csHours && <p className="error-cs-hours">{errors.csHours}</p>}
                    </div>

                    <div className="form-group">
                        <label>Approved by Employee Number</label>
                        <input type="text" name="approvedById" value={violation.approvedById} onChange={handleInputChange} required />
                    </div>

                    <div className="form-group">
                        <label>Approved by Employee Name</label>
                        <input type="text" name="approvedByName" value={violation.approvedByName} disabled />
                    </div>

                </div>
                
                <button type="submit" className="submit-btn">Save</button>

            </form>
            
        </Modal>
    );
};

export default EditViolationModal;
