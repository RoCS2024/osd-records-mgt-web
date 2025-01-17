import { useState, useEffect } from 'react';
import axios from 'axios';
import { getApiUrl, API_ENDPOINTS } from '../Constants';

export const useEmployeeCsData = (userId) => {
  const [employee, setEmployee] = useState(null);
  const [csSlips, setCsSlips] = useState([]);

  useEffect(() => {
    if (userId) {
      loadEmployee(userId);
    }
  }, [userId]);

  useEffect(() => {
    if (employee) {
      loadCsSlips(employee);
    }
  }, [employee]);

  const loadEmployee = async (userId) => {
    try {
      const response = await axios.get(getApiUrl(`${API_ENDPOINTS.EMPLOYEE.DETAILS}/${userId}`), {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setEmployee(response.data);
    } catch (error) {
      console.error('Error fetching employee:', error);
    }
  };

  const loadCsSlips = async (employee) => {
    try {
      const response = await axios.get(getApiUrl(`${API_ENDPOINTS.CSSLIP.BY_AREA}/${employee.station.stationName}`), {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setCsSlips(response.data);
    } catch (error) {
      console.error('Error fetching community service slips:', error);
    }
  };

  return { employee, csSlips };
};
