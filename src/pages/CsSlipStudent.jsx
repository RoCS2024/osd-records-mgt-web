import React, { useState, useEffect, useCallback } from 'react';
import axios from "axios";
import '../styles/CsSlipStudent.css';
import { useNavigate } from "react-router-dom";

import TableCsSlipStudent from '../component/TableCsSlipStudent';
import NavBar from '../component/NavBar';


const CsSlipStudent = () => {

    const [csSlips, setCsSlips] = useState([]);
    const [userId,setUserId] = useState('');

    const [selectedSlip, setSelectedSlip] = useState(null);
    const [totalHoursRequired,setTotalHoursRequired] = useState(0);
    const [totalHoursCompleted, setTotalHoursCompleted] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {

        const id = sessionStorage.getItem('userId');
        setUserId(id);
        loadCsSlips(id);

        fetchTotalHoursRequired(id); 
        let exp = localStorage.getItem('exp');
        let currentDate = new Date();
        const role = sessionStorage.getItem('role');
        if (exp * 1000 < currentDate.getTime()) {
            navigate('/login');
        }
        if (role !== "ROLE_ROLE_STUDENT") {
            if (role === "ROLE_ROLE_EMPLOYEE") {
                navigate('/employee/cs-list');
            } else if (role === "ROLE_ROLE_ADMIN") {
                navigate('/admin/offense');
            } else if (role === "ROLE_ROLE_GUEST") {
                navigate('/guest/violation');
            } else {
                navigate('/login');
            }
        }
    },[navigate]);

    const loadCsSlips = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:8080/csSlip/studentNumber/${userId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });

            const csSlipsMap = new Map();
            response.data.forEach(csSlip => {
                const studentId = csSlip.student.id;
                if (!csSlipsMap.has(studentId)) {
                    csSlipsMap.set(studentId, {
                        ...csSlip,
                        reports: [],
                    });
                }
                csSlipsMap.get(studentId).reports.push(...csSlip.reports);
            });

            const updatedCsSlips = Array.from(csSlipsMap.values());

            setCsSlips(updatedCsSlips);
        } catch (error) {
            console.error('Error fetching community service slips:', error);
        }
    };

    const fetchTotalHoursRequired = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:8080/csSlip/totalCsHours/${userId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });
            setTotalHoursRequired(response.data);
        } catch (error) {
            console.error('Error getting total hours required:', error);
        }
    };

    const handleRowClick = (csSlip) => {
        setSelectedSlip(selectedSlip === csSlip ? null : csSlip);
    };

    const handleLogout = () => {
        localStorage.setItem('token', '');
        sessionStorage.setItem('role', '');
        localStorage.setItem('exp', '');
        navigate('/login');
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const formatTime = (timeString) => {
        const options = { hour: '2-digit', minute: '2-digit' };
        return new Date(timeString).toLocaleTimeString(undefined, options);
    };

    const calculateTotalHoursCompleted = useCallback(() => {
        let totalHours = 0;
        if (selectedSlip) {
            selectedSlip.reports.forEach(report => {
                totalHours += report.hoursCompleted;
            });
        }
        return totalHours;
    }, [selectedSlip]);

    useEffect(() => {
        const totalHours = calculateTotalHoursCompleted();
        setTotalHoursCompleted(totalHours);
    }, [csSlips, selectedSlip, calculateTotalHoursCompleted]);

    useEffect(() => {
        console.log('Loaded userId:', userId);
    }, [userId]);

    useEffect(() => {
        console.log('Total Hours Required:', totalHoursRequired);
    }, [totalHoursRequired]);

    return (
        <div className="csreport-student">

            {/*  NavBar component */}
            <NavBar handleLogout={handleLogout} />

            <div className="container">

                <h1>LIST OF COMMUNITY SERVICE SLIP</h1>

                <div className="content-container">

                    <TableCsSlipStudent
                    csSlips={csSlips}
                    selectedSlip={selectedSlip}
                    handleRowClick={handleRowClick}
                    formatDate={formatDate}
                    formatTime={formatTime}
                    totalHoursCompleted={totalHoursCompleted}
                    />
                </div>

            </div>

        </div>
    );
};
         
export default CsSlipStudent;