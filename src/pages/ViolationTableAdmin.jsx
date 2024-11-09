import React, { useState, useEffect } from "react";
import axios from "axios";
import '../styles/ViolationTableAdmin.css';
import { useNavigate } from "react-router-dom";


import AddViolationModal from '../component/AddViolationModal';
import EditViolationModal from '../component/EditViolationModal';

import DateFilter from "../component/DateFilter";
import SearchStudentViolation from "../component/SearchStudentViolation";
import TableViolationAdmin from "../component/TableViolationAdmin";
import NavBar from "../component/NavBarAdmin";


const ViolationPageAdmin = () => {
    const [violations, setViolations] = useState([]);
    const [filteredViolations, setFilteredViolations] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [violationToEdit, setViolationToEdit] = useState(null);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    

    useEffect(() => {
        loadViolations();
        let exp = localStorage.getItem('exp');
        let currentDate = new Date();
        const role = localStorage.getItem('role');
        if(exp * 1000 < currentDate.getTime()){
            navigate('/login');
        }
        if(role !== "ROLE_ROLE_ADMIN"){
            if(role === "ROLE_ROLE_EMPLOYEE"){
                navigate('/employee/cs-list');
            } else if (role === "ROLE_ROLE_STUDENT"){
                navigate('/student/violation');
            } else if (role === "ROLE_ROLE_GUEST"){
                navigate('/guest/violation');
            } else {
                navigate('/login');
            }
        }
    }, [navigate]);

    useEffect(() => {
        filterViolations();
    }, [startDate, endDate, searchInput, violations]);
    

    const loadViolations = async () => {
        try {
            const response = await axios.get("http://localhost:8080/violation/violationList", {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
            setViolations(response.data);
            setFilteredViolations(response.data);
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
            const matchSearch = !searchInput || (violation.student && `${violation.student.lastName}, ${violation.student.firstName} ${violation.student.middleName}`.toLowerCase().includes(searchInput.toLowerCase()));
            return matchDate && matchSearch;
        });
        setFilteredViolations(filtered);
    };

    const openAddModal = () => {
        setIsAddModalOpen(true);
    };

    const closeAddModal = () => {
        setIsAddModalOpen(false);
    };

    const openEditModal = (violation) => {
        setViolationToEdit(violation);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setViolationToEdit(null);
    };

    const handleAddViolation = async (newViolation) => {
        try {
            const formattedViolation = {
                dateOfNotice: newViolation.dateOfNotice,
                student: {
                    id: parseInt(newViolation.studentId)
                },
                offense: {
                    id: parseInt(newViolation.offenseId)
                },
                warningNumber: parseInt(newViolation.warningNumber),
                csHours: parseInt(newViolation.csHours),
                disciplinaryAction: newViolation.disciplinaryAction,
                approvedBy: {
                    id: parseInt(newViolation.approvedById)
                },
            };

            const response = await axios.post("http://localhost:8080/violation/addViolation", formattedViolation, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
            console.log(response.data);
            closeAddModal();
            loadViolations();
        } catch (error) {
            console.error('Error Adding Violation:', error);
            setMessage("Violation cannot be Added");
        }
    };

    const handleEditViolation = async (updatedViolation) => {
        try {
            const response = await axios.put("http://localhost:8080/violation/updateViolation", updatedViolation, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
            setMessage(response.data);
            closeEditModal();
            loadViolations();
        } catch (error) {
            console.error('Error editing violation:', error);
            setMessage("Violation cannot be edited");
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="violation-page-admin">

           {/*  NavBar component */}
           <NavBar handleLogout={handleLogout} />

            <div className="container">

                <h1>VIOLATION</h1>

                <div className="content-container">

                    <div className="violation-search-filter">

                        {/* Search Component*/}
                        <SearchStudentViolation
                            searchInput={searchInput}
                            setSearchInput={setSearchInput}
                        />

                        {/* Date Filter Component*/}
                        <DateFilter
                            startDate={startDate}
                            endDate={endDate}
                            handleStartDateChange={handleStartDateChange}
                            handleEndDateChange={handleEndDateChange}
                        />

                    </div>

                    <h2>List of Violation</h2>

                    {/* Table Component */}
                    <TableViolationAdmin
                        filteredViolations={filteredViolations}
                        openEditModal={openEditModal}
                        formatDate={formatDate}
                    />

                    <div className="btns-container">
                        <a href="/admin/cs-slip"><button className="create-cs-button">CREATE CS SLIP</button></a>
                        <button className="add-violation-button" onClick={openAddModal}>ADD VIOLATION</button>
                    </div>

                </div>

            </div>

            {/* Modal Component */}
            <AddViolationModal
                isOpen={isAddModalOpen}
                onClose={closeAddModal}
                onSubmit={handleAddViolation}
            />

            {/* Modal Component */}
            <EditViolationModal
                isOpen={isEditModalOpen}
                onClose={closeEditModal}
                onSubmit={handleEditViolation}
                violationToEdit={violationToEdit}
            />

        </div>

    );
    
};

export default ViolationPageAdmin;
