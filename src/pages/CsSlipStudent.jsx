import React from 'react';
import styles from '../styles/CsSlipStudent.module.css';

import TableCsSlipStudent from '../components/TableCsSlipStudent';
import NavBarStudent from '../components/NavBarStudent';
import { useCsSlips } from '../hooks/useCsSlips';

const CsSlipStudent = () => {
    const role = sessionStorage.getItem('role'); 
    const {
        csSlips,
        selectedSlip,
        handleRowClick,
        handleLogout,
        formatDate,
        formatTime,
        calculateTotalHoursCompleted,
    } = useCsSlips(role); 

    return (
        <div className={styles.csSlipStudentPage}>
            {/* Navigation Bar */}
            <NavBarStudent handleLogout={handleLogout} />

            <div className={styles.csListContainer}>
                <h1 className={styles.head}>LIST OF COMMUNITY SERVICE SLIP</h1>

                <div className={styles.contentContainer}>
                    {/* Table displaying CS Slips */}
                    <TableCsSlipStudent
                        csSlips={csSlips}
                        selectedSlip={selectedSlip}
                        handleRowClick={handleRowClick}
                        formatDate={formatDate}
                        formatTime={formatTime}
                        calculateTotalHoursCompleted={calculateTotalHoursCompleted}
                    />
                </div>
            </div>
        </div>
    );
};

export default CsSlipStudent;
