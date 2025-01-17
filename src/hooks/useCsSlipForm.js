import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { getApiUrl, API_ENDPOINTS } from '../Constants';

export const useCsSlipForm = (students) => {
  const [formData, setFormData] = useState({
    studentId: '',
    deduction: '',
    areaId: '',
    reasonOfCs: '',
    name: '',
    section: '',
    head: ''
  });
  const [errors, setErrors] = useState({});
  const [violations, setViolations] = useState([]);
  const [totalHoursRequired, setTotalHoursRequired] = useState('');
  const [message, setMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  const validate = useCallback(() => {
    const newErrors = {};
    const studentIdPattern = /^CT\d{2}-\d{4}$/;
    
    if (!formData.studentId) {
      newErrors.studentId = 'Student ID is required';
    } else if (!studentIdPattern.test(formData.studentId)) {
      newErrors.studentId = 'Please try again';
    }

    if (formData.deduction === undefined || formData.deduction === null || formData.deduction === '') {
      newErrors.deduction = 'Hours to Deduct are required';
    } else if (isNaN(formData.deduction) || formData.deduction < 0) {
      newErrors.deduction = 'Please enter a number greater than or equal to 0';
    }    

    if (!formData.areaId) {
      newErrors.areaId = 'Area of Community Service is required';
    }

    if (!formData.reasonOfCs) {
      newErrors.reasonOfCs = 'Reason for Community Service is required';
    } else {
      const spaceAllowedPattern = /^[a-zA-Z\s]*$/;
      if (!spaceAllowedPattern.test(formData.reasonOfCs)) {
        newErrors.reasonOfCs = 'This entry can only contain letters and spaces';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  useEffect(() => {
    setIsFormValid(validate());
  }, [formData, validate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const fetchStudentDetails = useCallback(async (studentId) => {
    const student = students.find(student => student.studentNumber === studentId);
    const id = student && student.id;
    if (id) {
      const token = localStorage.getItem('token');
      const response = await axios.get(getApiUrl(`${API_ENDPOINTS.STUDENT.DETAILS}/${id}`), {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      return response.data;
    }
    return null;
  }, [students]);

  const fetchStudentViolation = useCallback(async (studentId) => {
    const student = students.find(student => student.studentNumber === studentId);
    const id = student && student.id;
    if (id) {
      const token = localStorage.getItem('token');
      const response = await axios.get(getApiUrl(`${API_ENDPOINTS.VIOLATION.BY_STUDENT_ID}/${id}`), {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      return response.data;
    }
    return [];
  }, [students]);    

  const fetchTotalHoursRequired = useCallback(async (studentId) => {
    const student = students.find(student => student.studentNumber === studentId);
    const id = student && student.studentNumber;
    if (id) {
      const token = localStorage.getItem('token');
      const response = await axios.get(getApiUrl(`${API_ENDPOINTS.CSSLIP.TOTAL_CS_HOURS}${id}`), {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      return response.data;
    }
    return '';
  }, [students]);

  const fetchStudentData = useCallback(async (studentId) => {
    try {
      const [studentDetails, studentViolations, totalHours] = await Promise.all([
        fetchStudentDetails(studentId),
        fetchStudentViolation(studentId),
        fetchTotalHoursRequired(studentId)
      ]);

      setFormData(prevState => ({
        ...prevState,
        name: studentDetails ? `${studentDetails.lastName}, ${studentDetails.firstName} ${studentDetails.middleName}` : '',
        section: studentDetails ? studentDetails.section.sectionName : '',
        head: studentDetails ? studentDetails.section.clusterHead : ''
      }));
      setViolations(studentViolations);
      setTotalHoursRequired(totalHours);
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred while fetching data.');
    }
  }, [fetchStudentDetails, fetchStudentViolation, fetchTotalHoursRequired]);

  useEffect(() => {
    if (formData.studentId.trim() !== '' && !errors.studentId) {
      fetchStudentData(formData.studentId);
    } else {
      setFormData(prevState => ({
        ...prevState,
        name: '',
        section: '',
        head: ''
      }));
      setViolations([]);
      setTotalHoursRequired('');
    }
  }, [formData.studentId, errors.studentId, fetchStudentData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (!validationErrors) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const student = students.find(student => student.studentNumber === formData.studentId);
      const id = student && student.id;
      
      if (id) {
        const payload = {
          student: { id },
          reasonOfCs: formData.reasonOfCs,
          areaOfCommServ: { id: formData.areaId },
          deduction: formData.deduction
        };
        
        const response = await axios.post(
          getApiUrl(API_ENDPOINTS.CSSLIP.CREATE), 
          payload, 
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`,
            }
          }
        );

        console.log('API Response:', response.data);

        if (response && response.data) {
          setMessage('');
          alert('CS slip created successfully!');
          setSuccessMessage('CS slip created successfully!');
          setTimeout(() => {
            setSuccessMessage('');
          }, 5000);
          clearForm();
        } else {
          console.error('Response data is Undefined:', response);
          setMessage('Unexpected error occurred.');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      if (error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage('An error occurred while processing the request.');
      }
    }
  };

  const clearForm = useCallback(() => {
    setFormData({
      studentId: '',
      deduction: '',
      areaId: '',
      reasonOfCs: '',
      name: '',
      section: '',
      head: ''
    });
    setViolations([]);
    setTotalHoursRequired('');
    setSuccessMessage('');
  }, []);

  return {
    formData,
    errors,
    violations,
    totalHoursRequired,
    message,
    successMessage,
    isFormValid,
    handleInputChange,
    handleSubmit,
    clearForm
  };
};