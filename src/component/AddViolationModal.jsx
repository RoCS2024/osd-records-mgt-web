import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import Select from 'react-select';

import { getApiUrl, API_ENDPOINTS } from '../Constants';

import '../styles/AddEditViolationModal.css';

const AddViolationModal = ({ isOpen, onClose, onSubmit }) => {
    const [errors, setErrors] = useState({});
    const [offenses, setOffenses] = useState([]);
    const [offenseInput, setOffenseInput] = useState(""); 
    const [students, setStudents] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [newViolation, setNewViolation] = useState({
        studentId: "",
        studentNumber: "",
        studentName: "",
        type: "",
        offenseId: "",
        description: "",
        dateOfNotice: "",
        disciplinaryAction: "",
        csHours: "",
        approvedById: "",
        approvedByNumber: "",
        approvedByName: ""
    });

    const validate = () => {
        
        const currentDate = new Date().toISOString().split('T')[0];
        const specialCharPattern = /[^a-zA-Z0-9- ]/;
        const numberPattern = /[0-9]/;
        let validationErrors = {};

        if (!newViolation.offenseId) {
            validationErrors.offenseId = "Offense is required";
        } else if (specialCharPattern.test(offenseInput)) {
            validationErrors.offense = "Invalid Input. Please try again";
        } else if (offenseInput.length > 32) {
            validationErrors.offense = "Use at least 32 characters";
        }

        if (!newViolation.dateOfNotice) {
            validationErrors.dateOfNotice = "Date of Notice is required";
        } else if (newViolation.dateOfNotice > currentDate) {
            validationErrors.dateOfNotice = "Date cannot be in the future";
        }

        // if (!newViolation.warningNumber) {
        //     validationErrors.warningNumber = "Number of Occurence is required";
        // } else if (!numberPattern.test(newViolation.warningNumber) || newViolation.warningNumber <= 0) {
        //     validationErrors.warningNumber = "Invalid input";
        // }    
        
        if (!newViolation.csHours) {
            validationErrors.csHours = "Community Service Hours is required";
        } else if (!numberPattern.test(newViolation.csHours) || newViolation.csHours <= 0) {
            validationErrors.csHours = "Please enter valid hour";
        } 

        if (!newViolation.studentNumber) {
            validationErrors.studentNumber = "Student Number is required";
        } else if (specialCharPattern.test(newViolation.studentNumber)) {
            validationErrors.studentNumber = "This entry can only accept alpha-numeric and (-)";
        }

        if (!newViolation.disciplinaryAction) {
            validationErrors.disciplinaryAction = "Disciplinary Action is required";
        } else if (specialCharPattern.test(newViolation.disciplinaryAction)) {
            validationErrors.disciplinaryAction = "Input must not contain special characters";
        }

        if (!newViolation.offenseId) {
            validationErrors.offenseId = "Offense is required";
        } else {
            const selectedOffense = offenses.find(offense => offense.value === newViolation.offenseId);
            if (selectedOffense && selectedOffense.label.length > 32) {
                validationErrors.offenseId = "Use at least 32 characters";
            }
        }

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const handleOffenseInputChange = (input) => {
        setOffenseInput(input); 
    };
    

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
    
        if (name === 'studentNumber') {
            fetchStudentDetails(value);
            setNewViolation((prevState) => ({
                ...prevState,
                // warningNumber: value ? '1' : '', 
            }));
        } else if (name === 'approvedByNumber') {
            fetchEmployeeDetails(value);
        }
    
        setNewViolation((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleOffenseChange = (selectedOption) => {
        setNewViolation({ ...newViolation, offenseId: selectedOption ? selectedOption.value : "" });
    };

    const fetchStudentDetails = async (studentId) => {
        const student = students.find(student => student.studentNumber === studentId);
        console.log(student);
        if (student) {
            setNewViolation(prevState => ({
                ...prevState,
                studentName: `${student.lastName}, ${student.firstName} ${student.middleName}`,
                studentId: `${student.id}`
            }));
        } else {
            setNewViolation(prevState => ({
                ...prevState,
                studentName: '',
                studentId: ''
            }));
        }
    };

    const fetchEmployeeDetails = async (approvedById) => {
        const employee = employees.find(employee => employee.employeeNumber === approvedById);
        if (employee) {
            setNewViolation(prevState => ({
                ...prevState,
                approvedByName: `${employee.lastName}, ${employee.firstName} ${employee.middleName}`,
                approvedById: `${employee.id}`
            }));
        } else {
            setNewViolation(prevState => ({
                ...prevState,
                approvedByName: '',
                approvedById: ''
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(validate());
        if (validate()) {
            onSubmit(newViolation);
        }
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onClose} className="modal">

            <button onClick={onClose} className="close-btn">&times;</button>
            
            <h2>Add Violation</h2>

            <form onSubmit={handleSubmit} className='violation-form-container'>

                <div className='wrap'>

                    <div className="form-class">
                        <label>Student Number</label>
                        <input type="text" name="studentNumber" value={newViolation.studentNumber} onChange={handleInputChange} required />
                        {errors.studentNumber && <p className="error-studentNumber">{errors.studentNumber}</p>}
                    </div>

                    <div className="form-class">
                        <label>Student Name</label>
                        <input type="text" name="studentName" value={newViolation.studentName} disabled />
                    </div>

                    <div className="form-class">
                        <label>Offense</label>
                        <Select
                        className="searchable-offense-dropdown"
                        classNamePrefix="dropdown"
                        options={offenses}
                        onChange={handleOffenseChange} 
                        onInputChange={handleOffenseInputChange} 
                        value={offenses.find((option) => option.value === newViolation.offenseId) || null}
                        placeholder="Select an offense"
                        />
                        {errors.offenseId && <p className="error-offense">{errors.offenseId}</p>}
                    </div>

                    <div className="form-class">
                        <label>Date of Notice</label>
                        <input type="date" name="dateOfNotice" value={newViolation.dateOfNotice} onChange={handleInputChange} required />
                        {errors.dateOfNotice && <p className="error-date-notice">{errors.dateOfNotice}</p>}
                    </div>

                    {/* <div className="form-group">
                        <label>Number of Occurrence</label>
                        <input
                            type="text"
                            name="warningNumber"
                            value={newViolation.warningNumber}
                            onChange={handleInputChange}
                            disabled // Make this field read-only
                            required
                        />
                        {errors.warningNumber && <p className="error-num-occurence">{errors.warningNumber}</p>}
                    </div> */}

                    <div className="form-class">
                        <label>Disciplinary Action</label>
                        <input
                            list="disciplinaryActions"
                            type="text"
                            name="disciplinaryAction"
                            value={newViolation.disciplinaryAction}
                            onChange={handleInputChange}
                            required
                            placeholder="Select or type an action"
                        />
                        <datalist id="disciplinaryActions">
                            <option value="Reminder from Discipline Officer" />
                            <option value="Reminder from Discipline Officer w/ Written Warning" />
                            <option value="Dialogue with Prefect of Discipline" />
                            <option value="Probation for 1 Semester" />
                            <option value="Conference with the DSSS" />
                            <option value="Meeting of the DSSS w/ the student's parent/guardian" />
                            <option value="Issuance of notice of violation" />
                            <option value="Non-admission for 1 semester" />
                            <option value="Non-admission for 2 semesters" />
                            <option value="Recommendation for dismissal" />
                        </datalist>
                        {errors.disciplinaryAction && <p className="error-disciplinary-cation">{errors.disciplinaryAction}</p>}
                    </div>


                    <div className="form-class">
                        <label>Community Service Hours</label>
                        <input type="number" name="csHours" value={newViolation.csHours} onChange={handleInputChange} required />
                        {errors.csHours && <p className="error-cs-hours">{errors.csHours}</p>}
                    </div>

                    <div className="form-class">
                        <label>Approved by: Employee Number</label>
                        <input type="text" name="approvedByNumber" value={newViolation.approvedByNumber} onChange={handleInputChange} required />
                    </div>

                    <div className="form-class">
                        <label>Approved by: Employee Name</label>
                        <input type="text" name="approvedByName" value={newViolation.approvedByName} disabled />
                    </div>

                </div>
                
                <button type="submit" className="submit-btn">Submit</button>

            </form>
            
        </Modal>
    );
};

export default AddViolationModal;