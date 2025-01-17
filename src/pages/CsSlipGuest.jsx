import React, { useState } from 'react';
import styles from '../styles/CsSlipGuest.module.css';

import DropdownCsSlipGuest from '../components/DropdownCsSlipGuest';
import TableCsSlipGuest from '../components/TableCsSlipGuest';
import NavBarGuest from '../components/NavBarGuest';
import { useCsSlips } from '../hooks/useCsSlips';

const CsSlipGuest = () => {
    const role = sessionStorage.getItem('role');
    const { 
        csSlips, 
        selectedSlip, 
        handleRowClick, 
        handleLogout, 
        formatDate, 
        formatTime, 
        calculateTotalHoursCompleted 
    } = useCsSlips(role);

    const [selectedStudentNumber, setSelectedStudentNumber] = useState('');
    const students = [...new Set(csSlips.map((csSlip) => csSlip.student.studentNumber))];

    const filteredCsSlips = selectedStudentNumber
        ? csSlips.filter((csSlip) => csSlip.student.studentNumber === selectedStudentNumber)
        : csSlips;

    const handleStudentChange = (event) => {
        setSelectedStudentNumber(event.target.value);
    };

    return (
        <div className={styles.csSlipGuestPage}>
            {/* Navigation Bar */}
            <NavBarGuest handleLogout={handleLogout} />

            <div className={styles.csListContainer}>
                <h1 className={styles.head}>LIST OF COMMUNITY SERVICE SLIP</h1>

                <div className={styles.contents}>
                    <div className={styles.searchFilterContainer}>
                        {/* Dropdown for student filter */}
                        <DropdownCsSlipGuest
                            students={students}
                            selectedStudentNumber={selectedStudentNumber}
                            handleStudentChange={handleStudentChange}
                            csSlips={csSlips}
                        />
                    </div>

                    <div className={styles.tableContainer}>
                        {/* Table displaying CS Slips */}
                        <TableCsSlipGuest
                            csSlips={csSlips}
                            filteredCsSlips={filteredCsSlips}
                            selectedSlip={selectedSlip}
                            handleRowClick={handleRowClick}
                            formatDate={formatDate}
                            formatTime={formatTime}
                            calculateTotalHoursCompleted={calculateTotalHoursCompleted}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CsSlipGuest;
