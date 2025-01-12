import React, { useState } from 'react';
import '../styles/ViolationGuest.css';

const Dropdown = ({ students, selectedStudentNumber, handleStudentChange, violations }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const filteredStudents = students.filter(studentNumber => {
        const student = violations.find(violation => violation.student.studentNumber === studentNumber)?.student;
        const fullName = student 
            ? `${student.lastName}, ${student.firstName} ${student.middleName}`.toLowerCase() 
            : '';
        return fullName.includes(searchTerm.toLowerCase());
    });

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    return (
        <div className="searchable-dropdown">
            <button 
                type="button" 
                className="beneficiary-button" 
                onClick={toggleDropdown}
            >
                {selectedStudentNumber 
                    ? violations.find(violation => violation.student.studentNumber === selectedStudentNumber)?.student?.lastName || "Select Student" 
                    : "All Students"}
            </button>
            {isDropdownOpen && (
                <div className="dropdown-menu">
                    <input
                        type="text"
                        className="dropdown-search"
                        placeholder="Search students"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <ul className="dropdown-options">
                        <li 
                            className="dropdown-option" 
                            onClick={() => {
                                handleStudentChange({ target: { value: '' } });
                                setIsDropdownOpen(false);
                            }}
                        >
                            All Students
                        </li>
                        {filteredStudents.map(studentNumber => {
                            const student = violations.find(violation => violation.student.studentNumber === studentNumber)?.student;
                            return (
                                <li
                                    key={studentNumber}
                                    className="dropdown-option"
                                    onClick={() => {
                                        handleStudentChange({ target: { value: studentNumber } });
                                        setIsDropdownOpen(false);
                                    }}
                                >
                                    {student ? `${student.lastName}, ${student.firstName} ${student.middleName}` : ''}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Dropdown;
