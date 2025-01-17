import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getApiUrl, API_ENDPOINTS } from '../Constants';

export const useCsSlips = (role) => {
  const [csSlips, setCsSlips] = useState([]);
  const [selectedSlip, setSelectedSlip] = useState(null);
  const navigate = useNavigate();

  const fetchCsSlips = useCallback(async () => {
    try {
      const userId = sessionStorage.getItem('userId');
      const token = localStorage.getItem('token');

      if (!token || !userId) {
        console.warn('Missing authentication details');
        return;
      }

      let response;
      if (role === 'ROLE_ROLE_STUDENT') {
        response = await axios.get(getApiUrl(`${API_ENDPOINTS.CSSLIP.BY_STUDENT_NUMBER}${userId}`), {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else if (role === 'ROLE_ROLE_GUEST') {
        const guestResponse = await axios.get(getApiUrl(`/guest/${userId}/Beneficiaries`), {
          headers: { Authorization: `Bearer ${token}` },
        });
        const beneficiaries = guestResponse.data.flatMap((guest) => guest.beneficiary || []);
        const studentIds = beneficiaries.map((beneficiary) => beneficiary.id);

        const slipPromises = studentIds.map((studentId) =>
          axios.get(getApiUrl(`${API_ENDPOINTS.CSSLIP.BY_STUDENT_ID}${studentId}`), {
            headers: { Authorization: `Bearer ${token}` },
          })
        );

        const slipResponses = await Promise.all(slipPromises);
        const allCsSlips = slipResponses.flatMap((res) => res.data);
        setCsSlips(allCsSlips);
        return;
      } else if (role === 'ROLE_ROLE_ADMIN') {
        response = await axios.get(getApiUrl(`${API_ENDPOINTS.CSSLIP.CS_LIST}`), {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
      }

      if (response?.data) {
        setCsSlips(response.data);
      }
    } catch (error) {
      console.error('Error fetching community service slips:', error);
    }
  }, [role]);

  useEffect(() => {
    fetchCsSlips();
  }, [fetchCsSlips]);

  const handleRowClick = useCallback(
    (csSlip) => {
      setSelectedSlip((prevSlip) => (prevSlip?.id === csSlip.id ? null : csSlip));
    },
    []
  );

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('role');
    localStorage.removeItem('exp');
    navigate('/login');
  }, [navigate]);

  const formatDate = useCallback((dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, []);

  const formatTime = useCallback((timeString) => {
    return new Date(timeString).toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    });
  }, []);

  const calculateTotalHoursCompleted = useCallback((slip) => {
    if (!slip.reports) return 0;  // Prevents accessing reports if it's undefined
    return slip.reports.reduce((total, report) => total + report.hoursCompleted, 0).toFixed(0);
  }, []);

  return {
    csSlips,
    selectedSlip,
    handleRowClick,
    handleLogout,
    formatDate,
    formatTime,
    calculateTotalHoursCompleted,
    fetchCsSlips,
  };
};
