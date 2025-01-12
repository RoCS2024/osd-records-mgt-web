import React, { useState, useEffect } from 'react';
import axios from "axios";
import '../styles/CsSlipGuest.css';
import { useNavigate } from "react-router-dom";

import DropdownCsSlipGuest from '../component/DropdownCsSlipGuest';
import TableCsSlipGuest from '../component/TableCsSlipGuest';
import NavBar from '../component/NavBar';

const CsSlipGuest = () => {

    const [csSlips, setCsSlips] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedSlip, setSelectedSlip] = useState(null);
    const [selectedStudentNumber, setSelectedStudentNumber] = useState('');
    const navigate = useNavigate();

    useEffect(() => {

        const loadBeneficiaries = async () => {
            try {
                const userId = sessionStorage.getItem('userId');
                const response = await axios.get(`http://localhost:8080/guest/${userId}/Beneficiaries`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    }
                });
                const beneficiaries = response.data.flatMap(guest => guest.beneficiary);
                const studentIds = beneficiaries.map(beneficiary => beneficiary.id);
                loadCsSlips(studentIds);
            } catch (error) {
                handleLoadError(error);
            }
        };

        const handleLoadError = (error) => {
            console.error('Error fetching guest:', error);
            
        }

        const loadCsSlips = async (studentIds) => {
            try {
                const responses = await Promise.all(studentIds.map(studentId =>
                    axios.get(`http://localhost:8080/csSlip/studentId/${studentId}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        }
                    })
                ));

                const csSlipsByStudent = new Map();
                responses.forEach(response => {
                    response.data.forEach(csSlip => {
                        const studentId = csSlip.student.id;
                        if (!csSlipsByStudent.has(studentId)) {
                            csSlipsByStudent.set(studentId, {
                                ...csSlip,
                                reports: [],
                            });
                        }
                        csSlipsByStudent.get(studentId).reports.push(...csSlip.reports);
                    });
                });

                const updatedCsSlips = Array.from(csSlipsByStudent.values());
                setCsSlips(updatedCsSlips);

                const uniqueStudentNumbers = Array.from(new Set(updatedCsSlips.map(csSlip => csSlip.student.studentNumber)));
                setStudents(uniqueStudentNumbers);
            } catch (error) {
                handleLoadError(error);
            }
        };

        loadBeneficiaries();

        const exp = localStorage.getItem('exp');
        const currentDate = new Date();
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
    }, [navigate]);

    const handleRowClick = (csSlip) => {
        setSelectedSlip(selectedSlip => (selectedSlip && selectedSlip.id === csSlip.id) ? null : csSlip);
    };

    const handleStudentChange = (event) => {
        setSelectedStudentNumber(event.target.value);
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

    const calculateTotalHoursCompleted = () => {
        let totalHours = 0;
        if (selectedSlip) {
            selectedSlip.reports.forEach(report => {
                totalHours += report.hoursCompleted;
            });
        }
        return totalHours;
    };

    const filteredCsSlips = selectedStudentNumber
        ? csSlips.filter(csSlip => csSlip.student.studentNumber === selectedStudentNumber)
        : csSlips;

    return (
        <div className="csreport-guest">

            {/* NavBar component */}
            <NavBar handleLogout={handleLogout} /> 

            <div className="list-container">

                <h1>LIST OF COMMUNITY SERVICE SLIP</h1>

                <div className="content-container">
                    
                   {/* Dropdown component */}
                    <DropdownCsSlipGuest
                        students={students}
                        selectedStudentNumber={selectedStudentNumber}
                        handleStudentChange={handleStudentChange}
                        csSlips={csSlips}
                    />

                     {/* Table component */}
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
    );
};

export default CsSlipGuest;
