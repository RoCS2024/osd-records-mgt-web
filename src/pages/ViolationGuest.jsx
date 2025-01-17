import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import styles from '../styles/ViolationGuest.module.css';
import { useNavigate } from "react-router-dom";

import { getApiUrl, API_ENDPOINTS } from '../Constants';

import DateFilter from '../components/DateFilter';
import Dropdown from '../components/DropdownViolationGuest';
import Table from '../components/Table';
import NavBarGuest from '../components/NavBarGuest';

const ViolationGuest = () => {
    const [violations, setViolations] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedStudentNumber, setSelectedStudentNumber] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [filteredViolations, setFilteredViolations] = useState([]);
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.clear();
        navigate('/login');
    };

    const loadBeneficiaries = useCallback(async () => {
        try {
            const guestId = sessionStorage.getItem('userId');
            const response = await axios.get(getApiUrl(`${API_ENDPOINTS.GUEST.BENEFICIARIES}/${guestId}/Beneficiaries`), {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
            const beneficiaries = response.data.flatMap(guest => guest.beneficiary);
            const studentIds = beneficiaries.map(beneficiary => beneficiary.id);
            loadViolations(studentIds);
        } catch (error) {
            console.error('Error fetching beneficiaries:', error);
        }
    }, []);

    useEffect(() => {
        loadBeneficiaries();
        let exp = localStorage.getItem('exp');
        let currentDate = new Date();
        const role = sessionStorage.getItem('role');
        if (exp * 1000 < currentDate.getTime()) {
            navigate('/login');
        }
        if (role !== "ROLE_ROLE_GUEST") {
            if (role === "ROLE_ROLE_EMPLOYEE") {
                navigate('/employee/cs-list');
            } else if (role === "ROLE_ROLE_STUDENT") {
                navigate('/student/violation');
            } else if (role === "ROLE_ROLE_ADMIN") {
                navigate('/admin/offense');
            } else {
                navigate('/login');
            }
        }
    }, [navigate, loadBeneficiaries]);

    const loadViolations = async (studentIds) => {
        try {
            const promises = studentIds.map(studentId =>
                axios.get(getApiUrl(`${API_ENDPOINTS.VIOLATION.BY_STUDENT_ID}/${studentId}`), {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    }
                })
            );
            const responses = await Promise.all(promises);
            const violationsData = responses.flatMap(response => response.data);
            setViolations(violationsData);

            const uniqueStudentNumbers = Array.from(new Set(violationsData.map(violation => violation.student.studentNumber)));
            setStudents(uniqueStudentNumbers);
        } catch (error) {
            console.error('Error fetching violations:', error);
        }
    };

    const handleDateChange = (event, setDate, opposingDate, isStartDate) => {
        const date = new Date(event.target.value);
        const opposing = new Date(opposingDate);
        const currentYear = new Date().getFullYear();

        if (date.getFullYear() > currentYear) {
            alert('Date Exceeds the current year');
        } else if (!isStartDate && opposingDate && date < opposing) {
            alert('Start date cannot be earlier than End date');
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
        let filtered = violations.filter(violation => {
            const violationDate = new Date(violation.dateOfNotice);
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;
    
            const matchDate = (!start || violationDate >= start) && (!end || violationDate <= end);
            const matchStudent = !selectedStudentNumber || violation.student.studentNumber === selectedStudentNumber;
            return matchDate && matchStudent;
        });
        setFilteredViolations(filtered);
    }, [startDate, endDate, violations, selectedStudentNumber]);

    useEffect(() => {
        filterViolations();
    }, [filterViolations]);

    const handleStudentChange = (event) => {
        setSelectedStudentNumber(event.target.value);
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const columns = [
        { 
            key: 'studentNumber', 
            header: 'STUDENT NUMBER', 
            className: styles.studentNumberColumn,
            render: (row) => row.student.studentNumber
        },
        { 
            key: 'studentName', 
            header: 'STUDENT NAME', 
            className: styles.studentNameColumn,
            render: (row) => `${row.student.lastName}, ${row.student.firstName} ${row.student.middleName}`
        },
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
        <div className={styles.violationGuest}>
            <NavBarGuest handleLogout={handleLogout} />

            <div className={styles.container}>
                <h1 className={styles.head}>VIOLATIONS</h1>

                <div className={styles.contentContainer}>
                    <div className={styles.filterContainer}>
                        <DateFilter
                            startDate={startDate}
                            endDate={endDate}
                            handleStartDateChange={handleStartDateChange}
                            handleEndDateChange={handleEndDateChange}
                        />
                        <Dropdown
                            students={students}
                            selectedStudentNumber={selectedStudentNumber}
                            handleStudentChange={handleStudentChange}
                            violations={violations}
                        />
                    </div>
                    
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

export default ViolationGuest;

