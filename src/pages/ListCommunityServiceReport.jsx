import React, { useState, useEffect } from "react";
import axios from "axios";
import '../styles/ListCommunityServiceReport.css';
import { useNavigate } from "react-router-dom";

import SearchListCsReport from "../component/SearchListCsReport";
import TableListCsReport from "../component/TableListCsReport";
import NavBarAdmin from "../component/NavBarAdmin";
import { API_ENDPOINTS, getApiUrl } from "../Constants";

import DropdownCluster from "../component/DropdownCluster";

const CsListPageAdmin = () => {
    const [csReport, setCsReport] = useState(null);
    const [csSlips, setCsSlips] = useState([]);
    const [filteredCsSlips, setFilteredCsSlips] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [filterType, setFilterType] = useState('All');

    const navigate = useNavigate();

    useEffect(() => {
        loadCsSlips();
        let exp = localStorage.getItem('exp');
        let currentDate = new Date();
        if (exp * 1000 < currentDate.getTime()) {
            navigate('/login');
        }
        const role = sessionStorage.getItem('role');
        if (role !== "ROLE_ROLE_ADMIN") {
            if (role === "ROLE_ROLE_EMPLOYEE") {
                navigate('/employee/cs-list');
            } else if (role === "ROLE_ROLE_STUDENT") {
                navigate('/student/violation');
            } else if (role === "ROLE_ROLE_GUEST") {
                navigate('/guest/violation');
            } else {
                navigate('/login');
            }
        }
    }, [navigate]);

    useEffect(() => {
        filterCsSlips();
    }, [searchInput, csSlips]);

    const loadCsSlips = async () => {
        try {
            const response = await axios.get(getApiUrl(`${API_ENDPOINTS.CSSLIP.CS_LIST}`), {
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

    const handleSearchChange = (event) => {
        setSearchInput(event.target.value);
    };

    const filterCsSlips = () => {
        const filtered = csSlips.filter(csSlip => {
            const studentName = `${csSlip.student.firstName} ${csSlip.student.lastName}`.toLowerCase();
            return studentName.includes(searchInput.toLowerCase());
        });
        setFilteredCsSlips(filtered);
    };

    const csSlipsToDisplay = searchInput ? filteredCsSlips : csSlips;

    const filterByCluster = (filter) => {
        let filtered = csSlips;

        if (filter !== 'All') {
            filtered = filtered.filter(csSlip => csSlip.student.section.clusterName === filter);
        }
        setFilterType(filtered);
    };

    const handleFilterChange = (event) => {
        setFilterType(event.target.value);
        filterByCluster(event.target.value);
    };

    const handleLogout = () => {
        localStorage.setItem('token', '');
        sessionStorage.setItem('role', '');
        localStorage.setItem('exp', '');
        navigate('/login');
    };

    return (
        <div className="list-cs-page-admin">

           {/*  NavBar component */}
           <NavBarAdmin handleLogout={handleLogout} />

            <div className="list-cs-container">

                <h1>List of Community Service Slips</h1>

                <div className="content-container">
                    <div className="search-and-filter">
                        {/* Search Component */}
                        <SearchListCsReport
                            searchInput={searchInput} handleSearchChange={handleSearchChange}
                        />
                        
                        {/* Dropdown Component */}
                        <DropdownCluster
                            filterType={filterType}
                            onFilterChange={handleFilterChange}
                        />
                    </div>
                    
                    {/* Table Component */}
                    <TableListCsReport
                        csSlipsToDisplay={csSlipsToDisplay}
                        csReport={csReport}
                        setCsReport={setCsReport}
                    />

                </div>

            </div>

        </div>

    );
};

export default CsListPageAdmin;
