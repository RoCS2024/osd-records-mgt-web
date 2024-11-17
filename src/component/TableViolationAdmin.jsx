import React from "react";
import '../styles/ViolationTableAdmin.css';
import edit from '../assets/compose.png';

const TableViolationAdmin = ({ filteredViolations, openEditModal, formatDate }) => {
    return (
        <table className="violation-table">
            <thead>
                <tr>
                    <th>STUDENT</th>
                    <th>OFFENSE</th>
                    <th>DATE OF NOTICE</th>
                    <th>NUMBER OF OCCURRENCE</th>
                    <th>DISCIPLINARY ACTION</th>
                    <th>COMMUNITY SERVICE HOUR</th>
                    <th>ACTION</th>
                </tr>
            </thead>

            <tbody>
                {filteredViolations.map(violation => (
                    <tr key={violation.id}>
                        <td>{violation.student ? `${violation.student.lastName}, ${violation.student.firstName} ${violation.student.middleName}` : 'Unknown Student'}</td>
                        <td>{violation.offense ? violation.offense.description : 'Unknown Offense'}</td>
                        <td>{formatDate(violation.dateOfNotice)}</td>
                        <td>{violation.warningNumber}</td>
                        <td>{violation.disciplinaryAction}</td>
                        <td>{violation.csHours}</td>
                        <td>
                            <button className="edit-button" onClick={() => openEditModal(violation)}>
                                <img src={edit} alt="Edit" className="edit-icon" />
                            </button>
                        </td>
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

export default TableViolationAdmin;
