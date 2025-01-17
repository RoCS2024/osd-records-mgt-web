import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { getApiUrl, API_ENDPOINTS } from '../Constants';

export const useViolations = () => {
  const [violations, setViolations] = useState([]);
  const [filteredViolations, setFilteredViolations] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [filterType, setFilterType] = useState('All');

  // Load violations from the server
  const loadViolations = async () => {
    try {
      const response = await axios.get(getApiUrl(API_ENDPOINTS.VIOLATION.LIST), {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setViolations(response.data);
      setFilteredViolations(response.data);
    } catch (error) {
      console.error('Error fetching violations:', error);
    }
  };

  useEffect(() => {
    loadViolations();
  }, []);

  // Filter violations based on criteria
  const filterViolations = useCallback(() => {
    const filtered = violations.filter((violation) => {
      const violationDate = new Date(violation.dateOfNotice);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      const matchDate =
        (!start || violationDate >= start) &&
        (!end || violationDate <= end);

      const matchSearch =
        !searchInput ||
        (violation.student &&
          `${violation.student.lastName}, ${violation.student.firstName} ${violation.student.middleName}`
            .toLowerCase()
            .includes(searchInput.toLowerCase()));

      const matchCluster =
        filterType === 'All' ||
        violation.student.section?.clusterName === filterType;

      return matchDate && matchSearch && matchCluster;
    });
    setFilteredViolations(filtered);
  }, [violations, startDate, endDate, searchInput, filterType]);

  useEffect(() => {
    filterViolations();
  }, [filterViolations]);

  // Add a new violation
  const addViolation = async (newViolation) => {
    try {
      const formattedViolation = {
        dateOfNotice: newViolation.dateOfNotice,
        student: { id: parseInt(newViolation.studentId, 10) },
        offense: { id: parseInt(newViolation.offenseId, 10) },
        csHours: parseInt(newViolation.csHours, 10),
        disciplinaryAction: newViolation.disciplinaryAction,
        approvedBy: { id: parseInt(newViolation.approvedById, 10) },
      };

      const response = await axios.post(
        getApiUrl(API_ENDPOINTS.VIOLATION.ADD),
        formattedViolation,
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      console.log('Violation added:', response.data);
      await loadViolations();
      return true;
    } catch (error) {
      console.error('Error adding violation:', error);
      return false;
    }
  };

  // Edit an existing violation
  const editViolation = async (updatedViolation) => {
    try {
      const response = await axios.put(
        getApiUrl(API_ENDPOINTS.VIOLATION.EDIT),
        updatedViolation,
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      console.log('Violation updated:', response.data);
      if (response.status === 200) {
        alert('Violation updated successfully!');
      }
      await loadViolations();
      return true;
    } catch (error) {
      console.error('Error editing violation:', error);
      return false;
    }
  };

  // Handle date change with validation
  const handleDateChange = (event, setDate, opposingDate, isStartDate) => {
    const date = new Date(event.target.value);
    const opposing = opposingDate ? new Date(opposingDate) : null;
    const currentYear = new Date().getFullYear();

    if (date.getFullYear() > currentYear) {
      alert('Date cannot be in the future');
    } else if (!isStartDate && opposing && date < opposing) {
      alert('End date cannot be earlier than start date');
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

  // Handle search input change
  const handleSearchChange = (input) => {
    if (typeof input === 'string') {
      setSearchInput(input);
    } else if (input?.target?.value !== undefined) {
      setSearchInput(input.target.value);
    }
  };

  // Handle filter type change
  const handleFilterChange = (input) => {
    if (typeof input === 'string') {
      setFilterType(input);
    } else if (input?.target?.value !== undefined) {
      setFilterType(input.target.value);
    }
  };

  return {
    filteredViolations,
    startDate,
    endDate,
    searchInput,
    filterType,
    addViolation,
    editViolation,
    handleStartDateChange,
    handleEndDateChange,
    handleSearchChange,
    handleFilterChange,
  };
};
