
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate} from 'react-router-dom';
import '../styles/ViolationStudent.css';

import DateFilter from '../component/DateFilter';
import TableViolationStudent from '../component/TableViolationStudent';
import NavBar from '../component/NavBar';

const ViolationStudent = () => {
    const [violations, setViolations] = useState([]);
    const [userId, setUserId] = useState('');

    const [filteredViolations, setFilteredViolations] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const Id = localStorage.getItem('userId');
        setUserId(Id);
        loadViolations(Id);

        const role = localStorage.getItem('role');
        const exp = localStorage.getItem('exp');
        const currentDate = new Date();
        
        if (!role || !exp || exp * 1000 < currentDate.getTime()) {
            handleLogout();
        } else if (role !== "ROLE_ROLE_STUDENT") {
            redirectBasedOnRole(role);
        }

    }, [navigate]);

    const loadViolations = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:8080/violation/studentNumber/${userId}`, {
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

    // Date Filter codes
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

    const filterViolations = () => {
        let filtered = violations.filter(violation => {
            const violationDate = new Date(violation.dateOfNotice);
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;

            const matchDate = (!start || violationDate >= start) && (!end || violationDate <= end);
            return matchDate;
        });
        setFilteredViolations(filtered);
    };

    useEffect(() => {
        filterViolations();
    }, [startDate, endDate, violations]);

    useEffect(() => {
        filterViolations();
    }, [startDate, endDate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('exp');
        navigate('/login');
    };

    const redirectBasedOnRole = (role) => {
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
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="violation-student">

             {/*  NavBar component */}
             <NavBar handleLogout={handleLogout} />
            
            <div className="container">

                <h1>MY VIOLATIONS</h1>

                <div className="content-container">
                    
                    {/* Date Filter Component */}
                    <DateFilter
                        startDate={startDate}
                        endDate={endDate}
                        handleStartDateChange={handleStartDateChange}
                        handleEndDateChange={handleEndDateChange}
                    />

                     {/* Table component */}
                     <TableViolationStudent
                        filteredViolations={filteredViolations}
                        formatDate={formatDate}
                    />

                </div>
                
            </div>
        </div>
    );
};

export default ViolationStudent;