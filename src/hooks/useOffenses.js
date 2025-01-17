import { useState, useEffect } from 'react';
import axios from 'axios';
import { getApiUrl, API_ENDPOINTS } from '../Constants';

export const useOffenses = () => {
  const [offenses, setOffenses] = useState([]);
  const [filteredOffenses, setFilteredOffenses] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [filterType, setFilterType] = useState('All');

  useEffect(() => {
    loadOffenses();
  }, []);

  const loadOffenses = async () => {
    try {
      const response = await axios.get(getApiUrl(API_ENDPOINTS.OFFENSE.LIST), {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });
      setOffenses(response.data);
      setFilteredOffenses(response.data);
    } catch (error) {
      console.error('Error fetching offenses:', error);
    }
  };

  const addOffense = async (newOffense) => {
    try {
      const response = await axios.post(getApiUrl(API_ENDPOINTS.OFFENSE.ADD), newOffense, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });
      alert(response.data || "Offense successfully added!");
      await loadOffenses();
      return true;
    } catch (error) {
      console.error('Error adding offense:', error);
      alert("Offense cannot be added");
      return false;
    }
  };

  const editOffense = async (updatedOffense) => {
    try {
      const response = await axios.put(getApiUrl(API_ENDPOINTS.OFFENSE.UPDATE), updatedOffense, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });
      alert(response.data || "Offense successfully updated!");
      await loadOffenses();
      return true;
    } catch (error) {
      console.error('Error editing offense:', error);
      alert("Offense cannot be edited");
      return false;
    }
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

  const handleSearchChange = (event) => {
    const searchTerm = event.target.value;
    setSearchInput(searchTerm);
    filterAndSearchOffenses(searchTerm, filterType);
  };

  const handleFilterChange = (selectedValue) => {
    setFilterType(selectedValue);
    filterAndSearchOffenses(searchInput, selectedValue);
  };

  return {
    offenses,
    filteredOffenses,
    searchInput,
    filterType,
    addOffense,
    editOffense,
    handleSearchChange,
    handleFilterChange
  };
};

