import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/ViolationStudent.module.css';

import { getApiUrl, API_ENDPOINTS } from '../Constants';

import DateFilter from '../components/DateFilter';
import Table from '../components/Table';
import NavBarStudent from '../components/NavBarStudent';

const ViolationStudent = () => {
    const [violations, setViolations] = useState([]);
    const [filteredViolations, setFilteredViolations] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const navigate = useNavigate();

    const handleLogout = useCallback(() => {
        sessionStorage.clear();
        navigate('/login');
    }, [navigate]);

    const redirectBasedOnRole = useCallback((role) => {
        switch (role) {
            case "ROLE_ROLE_EMPLOYEE":
                navigate('/employee/cs-list');
                break;
            case "ROLE_ROLE_ADMIN":
                navigate('/admin/offense');
                break;
            case "ROLE_ROLE_GUEST":
                navigate('/guest/violation');
                break;
            default:
                navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        const Id = sessionStorage.getItem('userId');
        loadViolations(Id);

        const role = sessionStorage.getItem('role');
        const exp = localStorage.getItem('exp');
        const currentDate = new Date();

        if (!role || !exp || exp * 1000 < currentDate.getTime()) {
            handleLogout();
        } else if (role !== "ROLE_ROLE_STUDENT") {
            redirectBasedOnRole(role);
        }
    }, [handleLogout, redirectBasedOnRole]);

    const loadViolations = async (userId) => {
        try {
            const response = await axios.get(getApiUrl(`${API_ENDPOINTS.VIOLATION.BY_STUDENT_NUMBER}/${userId}`), {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
            setViolations(response.data);
        } catch (error) {
            console.error('Error fetching violations:', error);
        }
    };

    const handleDateChange = (event, setDate, opposingDate, isStartDate) => {
        const date = new Date(event.target.value);
        const opposing = new Date(opposingDate);
        const currentYear = new Date().getFullYear();

        if (date.getFullYear() > currentYear) {
            alert('Date exceeds the current year');
        } else if (!isStartDate && opposingDate && date < opposing) {
            alert('Start date cannot be earlier than end date');
        } else {
            setDate(event.target.value);
        }
    };

    const handleStartDateChange = (event) => {
        handleDateChange(event, setStartDate, endDate, true);
    };

    const handleEndDateChange = (event) => {
        handleDateChange(event, setEndDate, startDate, false);
    };

    const filterViolations = useCallback(() => {
        let filtered = violations.filter((violation) => {
            const violationDate = new Date(violation.dateOfNotice);
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;

            const matchDate = (!start || violationDate >= start) && (!end || violationDate <= end);
            return matchDate;
        });
        setFilteredViolations(filtered);
    }, [violations, startDate, endDate]);

    useEffect(() => {
        filterViolations();
    }, [filterViolations]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const columns = [
        { 
            key: 'dateOfNotice', 
            header: 'DATE', 
            className: styles.dateColumn,
            render: (row) => formatDate(row.dateOfNotice)
        },
        { 
            key: 'offense', 
            header: 'OFFENSE', 
            className: styles.offenseColumn,
            render: (row) => row.offense.description
        },
        { 
            key: 'type', 
            header: 'TYPE', 
            className: styles.typeColumn,
            render: (row) => row.offense.type
        },
        { 
            key: 'warningNumber', 
            header: 'NO. OF OCCURRENCE', 
            className: styles.statusColumn,
            render: (row) => row.warningNumber
        },
        { 
            key: 'disciplinaryAction', 
            header: 'DISCIPLINARY ACTION', 
            className: styles.statusColumn,
            render: (row) => row.disciplinaryAction
        },
        { 
            key: 'csHours', 
            header: 'CS HOURS', 
            className: styles.statusColumn,
            render: (row) => row.csHours
        },
    ];

    return (
        <div className={styles.violationStudent}>
            <NavBarStudent handleLogout={handleLogout} />

            <div className={styles.container}>
                <h1 className={styles.head}>MY VIOLATIONS</h1>

                <div className={styles.contentContainer}>
                    <DateFilter
                        startDate={startDate}
                        endDate={endDate}
                        handleStartDateChange={handleStartDateChange}
                        handleEndDateChange={handleEndDateChange}
                    />

                    

                    <div className={styles.tableContainer}>
                        <Table 
                            columns={columns} 
                            data={filteredViolations}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViolationStudent;

