import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getApiUrl, API_ENDPOINTS } from '../Constants';
import styles from '../styles/CsSlipPageAdmin.module.css';
import NavBarAdmin from "../components/NavBarAdmin";
import { useCsSlipForm } from '../hooks/useCsSlipForm';
import { useAuth } from '../hooks/useAuth';
import { useCsSlips } from '../hooks/useCsSlips';
import Table from '../components/Table';

const CsSlipPageAdmin = () => {
    const navigate = useNavigate();
    const { handleLogout } = useAuth();
    const [stations, setStations] = useState([]);
    const [students, setStudents] = useState([]);

    const {
        formData,
        errors,
        violations,
        totalHoursRequired,
        message,
        successMessage,
        isFormValid,
        handleInputChange,
        handleSubmit,
        clearForm
    } = useCsSlipForm(students);

    const { } = useCsSlips('ROLE_ROLE_ADMIN');

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                };
                const [stationsResponse, studentsResponse] = await Promise.all([
                    axios.get(getApiUrl(API_ENDPOINTS.STATION.LIST), { headers }),
                    axios.get(getApiUrl(API_ENDPOINTS.STUDENT.LIST), { headers })
                ]);
                setStations(stationsResponse.data || []);
                setStudents(studentsResponse.data || []);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchInitialData();
    }, []);

    useEffect(() => {
        if (successMessage) {
            clearForm();
        }
    }, [successMessage, clearForm]);

    const violationColumns = [
        { key: 'student', header: 'STUDENT', render: (row) => row.student.studentNumber },
        { key: 'offense', header: 'OFFENSE', render: (row) => row.offense.description },
        { key: 'csHours', header: 'CS HOURS', render: (row) => row.csHours },
    ];

    return (
        <div className={styles.csSlipPageAdmin}>
            <NavBarAdmin handleLogout={handleLogout} />
            <div className={styles.csslipBox}>
                <h1>COMMUNITY SERVICE SLIP</h1>
                <div className={styles.csSlipContainer}>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.inputContainer}>
                            <div className={styles.fieldContainer}>
                                <label>Student ID:</label>
                                <input
                                    type="text"
                                    className={styles.csInputField}
                                    name="studentId"
                                    value={formData.studentId}
                                    onChange={handleInputChange}
                                />
                                {errors?.studentId && <span className={styles.error}>{errors.studentId}</span>}
                            </div>

                            <div className={styles.fieldContainer}>
                                <label>Full Name:</label>
                                <input
                                    type="text"
                                    disabled
                                    className={styles.csInputField}
                                    name="name"
                                    value={formData.name}
                                />
                            </div>

                            <div className={styles.fieldContainer}>
                                <label>Section:</label>
                                <input
                                    type="text"
                                    disabled
                                    className={styles.csInputField}
                                    name="section"
                                    value={formData.section}
                                />
                            </div>

                            <div className={styles.fieldContainer}>
                                <label>Cluster Head:</label>
                                <input
                                    type="text"
                                    disabled
                                    className={styles.csInputField}
                                    name="head"
                                    value={formData.head}
                                />
                            </div>

                            <div className={styles.fieldContainer}>
                                <label>Hours to Deduct:</label>
                                <input
                                    type="text"
                                    className={styles.csInputField}
                                    name="deduction"
                                    value={formData.deduction}
                                    onChange={handleInputChange}
                                />
                                {errors?.deduction && <span className={styles.error}>{errors.deduction}</span>}
                            </div>

                            <div className={styles.fieldContainer}>
                                <label>Area of Community Service:</label>
                                <select
                                    className={styles.selectField}
                                    name="areaId"
                                    value={formData.areaId}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select an area</option>
                                    {stations.map((station) => (
                                        <option key={station.id} value={station.id}>
                                            {station.stationName}
                                        </option>
                                    ))}
                                </select>
                                {errors?.areaId && <span className={styles.error}>{errors.areaId}</span>}
                            </div>

                            <div className={styles.fieldContainer}>
                                <label>Reason for Community Service:</label>
                                <input
                                    type="text"
                                    className={styles.csInputField}
                                    name="reasonOfCs"
                                    value={formData.reasonOfCs}
                                    onChange={handleInputChange}
                                />
                                {errors?.reasonOfCs && <span className={styles.error}>{errors.reasonOfCs}</span>}
                            </div>
                        </div>

                        <div className={styles.tableContainer}>
                            <Table columns={violationColumns} data={violations} />
                        </div>

                        <div className={styles.bottomContainer}>
                            <div className={styles.totalContainer}>
                                <label>Total Hours Required: </label>
                                <input
                                    type="text"
                                    disabled
                                    className={styles.inputHours}
                                    name="hoursRequired"
                                    value={totalHoursRequired}
                                    readOnly
                                />
                            </div>

                            <button
                                type="submit"
                                className={styles.createCsslipButton}
                                disabled={!isFormValid}
                            >
                                CREATE
                            </button>
                            {message && <div className={`${styles.message} ${styles.error}`}>{message}</div>}
                            {successMessage && <div className={`${styles.message} ${styles.success}`}>{successMessage}</div>}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CsSlipPageAdmin;

