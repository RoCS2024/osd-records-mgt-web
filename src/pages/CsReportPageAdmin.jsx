import React from "react";
import styles from '../styles/CsReportPageAdmin.module.css';
import Table from '../components/Table';

const CsReportPageAdmin = ({ data, isOpen }) => {
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const formatTime = (timeString) => {
        const options = { hour: '2-digit', minute: '2-digit' };
        return new Date(timeString).toLocaleTimeString(undefined, options);
    };

    const columns = [
        { key: 'studentName', header: 'Student Name', render: () => `${data.student.firstName} ${data.student.lastName}` },
        { key: 'area', header: 'Area of Community Service', render: () => data.area },
        { key: 'dateOfCs', header: 'Date of CS', render: (row) => formatDate(row.dateOfCs) },
        { key: 'timeIn', header: 'Time In', render: (row) => formatTime(row.timeIn) },
        { key: 'timeOut', header: 'Time Out', render: (row) => formatTime(row.timeOut) },
        { key: 'hoursCompleted', header: 'Hours Completed' },
        { key: 'natureOfWork', header: 'Nature of Work' },
        { key: 'status', header: 'Status' },
        { key: 'remarks', header: 'Remarks' },
    ];

    if (!isOpen) return null;

    return (
        <div className={styles.csReportPageAdmin}>
            <div className={styles.reportContainer}>
                <h2 className={styles.reportHeader}>COMMUNITY SERVICE REPORT</h2>
                <div className={styles.tableContainer}>
                    <Table columns={columns} data={data.reports || []} />
                </div>
            </div>
        </div>
    );
};

export default CsReportPageAdmin;

