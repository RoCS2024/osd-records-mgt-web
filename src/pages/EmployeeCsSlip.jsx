import React, { useState, useEffect, useCallback } from 'react';
import axios from "axios";
import styles from '../styles/EmployeeCsSlip.module.css';
import AddCsReportModal from "../components/AddCsReportModal";
import Table from '../components/Table';
import { getApiUrl, API_ENDPOINTS } from '../Constants';

const EmployeeCsSlip = ({ data }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [totalCsHours, setTotalHours] = useState("");
    const [completedHours, setCompletedHours] = useState(0);
    const [remainingHours, setRemainingHours] = useState(0);

    const loadTotalHours = useCallback(async () => {
        if (!data || !data.studentNumber) return;

        try {
            const response = await axios.get(getApiUrl(`${API_ENDPOINTS.CSSLIP.TOTAL_CS_HOURS}${data.studentNumber}`), {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setTotalHours(response.data);
        } catch (error) {
            console.error('Error fetching total community service hours:', error);
        }
    }, [data]);

    useEffect(() => {
        loadTotalHours();
    }, [loadTotalHours, data]);

    const calculateTotalHoursCompleted = useCallback(() => {
        let totalHours = 0;
        if (data && data.reports) {
            totalHours = data.reports.reduce((sum, report) => sum + parseFloat(report.hoursCompleted), 0);
        }
        setCompletedHours(totalHours);
    }, [data]);

    const updateRemainingHours = useCallback(() => {
        const requiredHours = parseFloat(totalCsHours || 0);
        const deduction = parseFloat(data.deduction || 0);
        setRemainingHours(requiredHours - (completedHours + deduction));
    }, [totalCsHours, completedHours, data]);

    useEffect(() => {
        calculateTotalHoursCompleted();
        updateRemainingHours();
    }, [totalCsHours, data, calculateTotalHoursCompleted, updateRemainingHours]);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setMessage("");
    };

    const handleAddCsReport = useCallback(
        async (csSlipId, newCsReport) => {
            if (!newCsReport || !newCsReport.dateOfCs || !newCsReport.timeIn || !newCsReport.timeOut) {
                setMessage("All fields are required. Please fill in all details.");
                return;
            }
    
            try {
                const startTimeString = `${newCsReport.dateOfCs}T${newCsReport.timeIn}`;
                const endTimeString = `${newCsReport.dateOfCs}T${newCsReport.timeOut}`;
        
                const startTime = new Date(startTimeString);
                const endTime = new Date(endTimeString);
                const diffInMs = endTime - startTime;
                const hours = diffInMs / (1000 * 60 * 60);
                newCsReport.hoursCompleted = hours.toFixed(2);
        
                if (parseFloat(newCsReport.hoursCompleted) > remainingHours) {
                    setMessage("Hours completed cannot exceed remaining hours.");
                    return;
                }
        
                const params = {
                    dateOfCs: newCsReport.dateOfCs,
                    timeIn: startTime,
                    timeOut: endTime,
                    hoursCompleted: parseFloat(newCsReport.hoursCompleted),
                    natureOfWork: newCsReport.natureOfWork,
                    status: newCsReport.status,
                    remarks: newCsReport.remarks
                };
    
                const response = await axios.post(getApiUrl(`${API_ENDPOINTS.CSREPORT.CREATE}/${csSlipId}`), params, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
    
                setMessage("CS Report added successfully");
                closeModal();
                data.reports.push(response.data);
                calculateTotalHoursCompleted();
                updateRemainingHours();
            } catch (error) {
                setMessage("Error adding CS Report. Please try again.");
                console.error(error);
            }
        },
        [data, remainingHours, calculateTotalHoursCompleted, updateRemainingHours]
    );
    

    const formatDate = (date) => new Date(date).toLocaleDateString();
    const formatTime = (time) => new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const isSubmitDisabled = !data.id || remainingHours <= 0;

    const columns = [
        { key: 'dateOfCs', header: 'Date of CS', render: (row) => formatDate(row.dateOfCs) },
        { key: 'timeIn', header: 'Time In', render: (row) => formatTime(row.timeIn) },
        { key: 'timeOut', header: 'Time Out', render: (row) => formatTime(row.timeOut) },
        { key: 'hoursCompleted', header: 'Hours Completed' },
        { key: 'natureOfWork', header: 'Nature of Work' },
        { key: 'status', header: 'Status' },
        { key: 'remarks', header: 'Remarks' },
    ];

    return (
        <div className={styles.csSlipPageEmployee}>
            <h1>Community Service Report</h1>
            <div className={styles.csSlipContentContainer}>
                <div className={styles.inputContainer}>
                    {[
                        { label: "Student ID", value: data.studentNumber },
                        { label: "Full Name", value: data.name },
                        { label: "Section", value: data.section },
                        { label: "Cluster Head", value: data.head },
                        { label: "Hours Required", value: totalCsHours },
                        { label: "Hours to Deduct", value: data.deduction },
                        { label: "Area of Community Service", value: data.area },
                        { label: "Reason for Community Service", value: data.reason },
                    ].map((field, index) => (
                        <div key={index} className={styles.fieldContainer}>
                            <label>{field.label}:</label>
                            <input type="text" value={field.value || ""} disabled className={styles.inputField} />
                        </div>
                    ))}
                </div>
                <Table columns={columns} data={data.reports || []} />
                <div className={styles.summaryContainer}>
                    <h3>Total Hours Completed: {completedHours}</h3>
                    <h3>Remaining Hours: {remainingHours}</h3>
                </div>
                <button
                    onClick={openModal}
                    disabled={isSubmitDisabled}
                    className={styles.addReportButton}
                >
                    Add Report
                </button>
                {message && <p className={styles.errorMessage}>{message}</p>}
            </div>

            <AddCsReportModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSubmit={handleAddCsReport}
                csSlipId={data.id}
            />
        </div>
    );
};

export default EmployeeCsSlip;
