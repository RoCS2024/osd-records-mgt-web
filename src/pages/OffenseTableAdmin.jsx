import React, { useState, useEffect } from 'react';
import '../styles/offenseTableAdmin.css';

import { useNavigate } from "react-router-dom";
import axios from 'axios';

import { getApiUrl, API_ENDPOINTS } from '../Constants';

import AddOffenseModal from '../component/AddOffenseModal';
import EditOffenseModal from '../component/EditOffenseModal';

import SearchOffense from '../component/SearchOffense';
import DropdownMajorMinor from '../component/DropdownMinorMajor';
import TableOffenseAdmin from '../component/TableOffenseAdmin';
import NavBarAdmin from '../component/NavBarAdmin';

const OffensePageAdmin = () => {
    const [offenses, setOffenses] = useState([]);
    const [filteredOffenses, setFilteredOffenses] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [filterType, setFilterType] = useState('All');
    const navigate = useNavigate();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [message] = useState("");
    const [offenseToEdit, setOffenseToEdit] = useState(null);

    useEffect(() => {
        loadOffenses();
        let exp = localStorage.getItem('exp');
        let currentDate = new Date();
        const role = sessionStorage.getItem('role');
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

    const loadOffenses = async () => {
        try {
            const response = await axios.get(getApiUrl(API_ENDPOINTS.OFFENSE.LIST), {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
            console.log('Fetched offenses:', response.data); 
            setOffenses(response.data);
            setFilteredOffenses(response.data); 
        } catch (error) {
            console.error('Error fetching offenses:', error);
        }
    };

    const openAddModal = () => {
        setIsAddModalOpen(true);
    };

    const closeAddModal = () => {
        setIsAddModalOpen(false);
    };

    const openEditModal = (offense) => {
        setOffenseToEdit(offense);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setOffenseToEdit(null);
    };

    const handleAddOffense = async (newOffense) => {
        try {
            let params = {
                description: newOffense.description,
                type: newOffense.type
            };

            const response = await axios.post(getApiUrl(API_ENDPOINTS.OFFENSE.ADD), params, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
            alert(response.data || "Offense successfully added!");
            closeAddModal();
            loadOffenses();
        } catch (error) {
            console.error('Error adding offense:', error);
            alert("Offense cannot be added");
        }
    };

    const handleEditOffense = async (updatedOffense) => {
        try {
            const response = await axios.put(getApiUrl(API_ENDPOINTS.OFFENSE.UPDATE), updatedOffense, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
            alert(response.data || "Offense successfully updated!");
            closeEditModal();
            loadOffenses();
        } catch (error) {
            console.error('Error editing offense:', error);
            alert("Offense cannot be edited");
        }
    };

    const handleSearchChange = (event) => {
        setSearchInput(event.target.value);
        filterAndSearchOffenses(event.target.value, filterType);
    };

    const handleFilterChange = (event) => {
        setFilterType(event.target.value);
        filterAndSearchOffenses(searchInput, event.target.value);
    };

    const filterAndSearchOffenses = (searchTerm, filter) => {
        let filtered = offenses;

        if (filter !== 'All') {
            filtered = filtered.filter(offense => offense.type === filter);
        }

        if (searchTerm) {
            filtered = filtered.filter(offense => 
                offense.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredOffenses(filtered);
    };

    const handleLogout = () => {
        localStorage.setItem('token', '');
        sessionStorage.setItem('role', '');
        localStorage.setItem('exp', '');
        navigate('/login');
    };
    
    return (
        <div className="offense-page-admin">

            {/*  NavBar component */}
            <NavBarAdmin handleLogout={handleLogout} />

            <div className="offense-container">

                {/* Display message at the top of the page */}
                {message && <div className="message">{message}</div>}

                <h1 className='head'>OFFENSE</h1>

                <div className="contents">

                    <div className="search-filter-container">

                        {/* Search Component */}
                        <SearchOffense
                            searchInput={searchInput}
                            onSearchChange={handleSearchChange}
                            filterType={filterType}
                            onFilterChange={handleFilterChange}
                        />

                        {/* Dropdown Component */}
                        <DropdownMajorMinor
                            filterType={filterType}
                            onFilterChange={handleFilterChange}
                        />
                        
                    </div>
                    
                    {/* Table Component */}
                    <TableOffenseAdmin
                        offenses={filteredOffenses}
                        onEdit={openEditModal}
                    />

                    <div className="add-offense-btn">
                        <button className="add-offense-button" onClick={openAddModal}>ADD OFFENSE</button>
                    </div>

                </div>

            </div>

            {/* Modal Component */}
            <AddOffenseModal
                isOpen={isAddModalOpen}
                onClose={closeAddModal}
                onSubmit={handleAddOffense}
            />

            {/* Modal Component */}
            <EditOffenseModal
                isOpen={isEditModalOpen}
                onClose={closeEditModal}
                onSubmit={handleEditOffense}
                offenseToEdit={offenseToEdit}
            />

        </div>

    );
    
};

export default OffensePageAdmin;
