import React from 'react';
import UnifiedDropdown from './UnifiedDropdown';

const DropdownViolationGuest = ({ students, selectedStudentNumber, handleStudentChange, violations }) => {
  const options = [
    { value: '', label: 'All Students' },
    ...students.map(studentNumber => {
      const student = violations.find(violation => violation.student.studentNumber === studentNumber)?.student;
      return {
        value: studentNumber,
        label: student ? `${student.lastName}, ${student.firstName} ${student.middleName}` : '',
        student: student
      };
    })
  ];

  return (
    <UnifiedDropdown
      options={options}
      selectedValue={selectedStudentNumber}
      onChange={(value) => handleStudentChange({ target: { value } })}
      placeholder="Select a student"
      label="Student"
      isSearchable={true}
      renderOption={(option) => option.label}
      getOptionValue={(option) => option.value}
    />
  );
};

export default DropdownViolationGuest;

