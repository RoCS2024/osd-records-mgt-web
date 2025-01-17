import React from 'react';
import UnifiedDropdown from './UnifiedDropdown';

const DropdownCsSlipGuest = ({ students, selectedStudentNumber, handleStudentChange, csSlips }) => {
  const options = [
    { value: '', label: 'All Students' }, // Option to show all students
    ...students.map((studentNumber) => {
      const student = csSlips.find((csSlip) => csSlip.student.studentNumber === studentNumber)?.student;
      return {
        value: studentNumber,
        label: student
          ? `${student.lastName}, ${student.firstName} ${student.middleName}`
          : studentNumber, // Fallback to studentNumber if student details are not found
        student: student,
      };
    }),
  ];

  return (
    <div className="dropdown-filter">
      <UnifiedDropdown
        options={options}
        selectedValue={selectedStudentNumber}
        onChange={(value) => handleStudentChange({ target: { value } })}
        placeholder="Select a student"
        isSearchable={true}
        label="Student"
        renderOption={(option) => option.label}
        getOptionValue={(option) => option.value}
      />
    </div>
  );
};

export default DropdownCsSlipGuest;
