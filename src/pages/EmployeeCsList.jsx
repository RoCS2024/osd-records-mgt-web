import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Styles
import '../styles/EmployeeCsList.css';
import '../styles/EmployeeCsSlip.css';

// Components
import EmployeeCsSlip from "./EmployeeCsSlip";

// Assets
import logo from '../assets/logo_new.png';
import user from '../assets/user.png';

const EmployeeCsList = () => {
    const navigate = useNavigate();

    // State
    const [userId, setUserId] = useState('');
    const [employee, setEmployee] = useState(null);
    const [csSlips, setCsSlips] = useState([]);
    const [selectedCsSlip, setSelectedCsSlip] = useState({
        id: "",
        studentNumber: "",
        studentId: "",
        name: "",
        section: "",
        head: "",
        deduction: "",
        area: "",
        reason: "",
        reports: []
    });

    // Effects
    useEffect(() => {
        const id = sessionStorage.getItem('userId');
        setUserId(id);
        loadUser(id);
        checkAuthentication();
    }, []);

    useEffect(() => {
        if (employee) {
            loadCsSlips(employee);
        }
    }, [employee]);

    // Authentication
    const checkAuthentication = () => {
        const exp = localStorage.getItem('exp');
        const currentDate = new Date();
        const role = sessionStorage.getItem('role');

        if (exp * 1000 < currentDate.getTime()) {
            navigate('/login');
            return;
        }

        switch (role) {
            case "ROLE_ROLE_EMPLOYEE":
                break;
            case "ROLE_ROLE_STUDENT":
                navigate('/student/violation');
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

    // API calls
    const loadUser = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:8080/employee/employeeNumber/${userId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
            setEmployee(response.data);
        } catch (error) {
            console.error('Error fetching employee:', error);
        }
    };

    const loadCsSlips = async (employee) => {
        try {
            const response = await axios.get(`http://localhost:8080/csSlip/areaOfCs/${employee.station.stationName}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
            setCsSlips(response.data);
        } catch (error) {
            console.error('Error fetching community service slips:', error);
        }
    };

    // Event handlers
    const handleRowClick = (csSlip) => {
        setSelectedCsSlip({
            id: csSlip.id,
            studentNumber: csSlip.student.studentNumber,
            studentId: csSlip.student.id,
            name: `${csSlip.student.firstName} ${csSlip.student.lastName}`,
            section: csSlip.student.section.sectionName,
            head: csSlip.student.section.clusterHead,
            deduction: csSlip.deduction,
            area: csSlip.areaOfCommServ.stationName,
            reason: csSlip.reasonOfCs,
            reports: csSlip.reports
        });
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    // Render helpers
    const renderNavBar = () => (
        <nav className="nav-bar">
            <img src={logo} alt="Logo" className="rc-logo"/>
            <div className="nav-links">
                <a href="/student/violation">Reports</a>
                <a href="#" onMouseDown={handleLogout}>Logout</a>
                <img src={user} alt="profile" className="profile"/>
            </div>
        </nav>
    );

    const renderCsSlipsTable = () => (
        <table className="csList-table">
            <thead>
                <tr>
                    <th>STUDENT ID</th>
                    <th>STUDENT NAME</th>
                    <th>AREA OF COMMUNITY SERVICE</th>
                </tr>
            </thead>
            <tbody>
                {csSlips.map((csSlip, index) => (
                    <tr key={index} onClick={() => handleRowClick(csSlip)}>
                        <td>{csSlip.student.studentNumber}</td>
                        <td>{`${csSlip.student.firstName} ${csSlip.student.lastName}`}</td>
                        <td>{csSlip.areaOfCommServ.stationName}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    return (
        <div className="list-cs-page-admin">
            {renderNavBar()}
            <div className="employee-container">
                <h1>Community Service Slips</h1>
                <div className="content-container">
                    {renderCsSlipsTable()}
                </div>
            </div>
            <div>
                <EmployeeCsSlip data={selectedCsSlip} />
            </div>
        </div>
    );
};

export default EmployeeCsList;