
import React from 'react';

const TableViolationStudent = ({ filteredViolations, formatDate }) => {
    return (
        <table className="my-violation-table">
            <thead>
                <tr>
                    <th>STUDENT</th>
                    <th>OFFENSE</th>
                    <th>DATE OF NOTICE</th>
                    <th>NUMBER OF OCCURRENCE</th>
                    <th>DISCIPLINARY ACTION</th>
                    <th>COMMUNITY SERVICE HOURS</th>
                </tr>
            </thead>
            <tbody>
            {filteredViolations.map((violation) => (
                <tr key={violation.id}>
                    <td>{`${violation.student.lastName}, ${violation.student.firstName} ${violation.student.middleName || ''}`}</td>
                    <td>{violation.offense.description}</td>
                    <td>{formatDate(violation.dateOfNotice)}</td>
                    <td>{violation.warningNumber}</td>
                    <td>{violation.disciplinaryAction}</td>
                    <td>{violation.csHours}</td>
                </tr>
            ))}


                {filteredViolations.length === 0 && (
                    <tr>
                        <td colSpan="7">No results found.</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};

export default TableViolationStudent;
