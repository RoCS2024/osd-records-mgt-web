
import React from 'react';

const Dropdown = ({ students, selectedStudentNumber, handleStudentChange, violations }) => {
    return (
        <select
            id="studentFilter"
            name="studentFilter"
            className="beneficiary-button"
            onChange={handleStudentChange}
            value={selectedStudentNumber}
        >
            <option value="">All Students</option>
            {students.map(studentNumber => {
                const student = violations.find(violation => violation.student.studentNumber === studentNumber)?.student;
                return (
                    <option key={studentNumber} value={studentNumber}>
                        {student ? `${student.lastName}, ${student.firstName} ${student.middleName}` : ''}
                    </option>
                );
            })}
        </select>
    );
};

export default Dropdown;
