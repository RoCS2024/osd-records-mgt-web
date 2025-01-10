import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/logo_new.png';
import user from '../assets/user.png';
import { getApiUrl, API_ENDPOINTS } from '../Constants';
import '../styles/CommunityServiceSlip.css';

const CsSlipPageAdmin = () => {
    const navigate = useNavigate();
    const [stations, setStations] = useState([]);
    const [students, setStudents] = useState([]);
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

    useEffect(() => {
        const role = sessionStorage.getItem('role');
        let exp = localStorage.getItem('exp');
        let currentDate = new Date();

        if (exp * 1000 < currentDate.getTime()) {
            navigate('/login');
        }
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

        const fetchInitialData = async () => {
            try {
              const token = localStorage.getItem('token');
              const headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
              };
              const [stationsResponse, studentsResponse] = await Promise.all([
                axios.get(getApiUrl(API_ENDPOINTS.STATION.LIST), { headers }),
                axios.get(getApiUrl(API_ENDPOINTS.STUDENT.LIST), { headers })
              ]);
              setStations(stationsResponse.data);
              setStudents(studentsResponse.data);
            } catch (error) {
              console.error('Error fetching data:', error);
              setMessage('An error occurred while fetching data.');
            }
          };
      
          fetchInitialData();
        }, [navigate]);

     useEffect(() => {
    const fetchStudentData = async () => {
      if (formData.studentId.trim() !== '' && !errors.studentId) {
        try {
          const [studentDetails, studentViolations, totalHours] = await Promise.all([
            fetchStudentDetails(formData.studentId),
            fetchStudentViolation(formData.studentId),
            fetchTotalHoursRequired(formData.studentId)
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
    };

    fetchStudentData();
  }, [formData.studentId, errors.studentId]);

    useEffect(() => {
        setIsFormValid(Object.keys(errors).length === 0 && formData.studentId && formData.deduction && formData.areaId && formData.reasonOfCs);
    }, [errors, formData]);

    const fetchStudentDetails = async (studentId) => {
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
      };
    
      const fetchStudentViolation = async (studentId) => {
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
      };    

      const fetchTotalHoursRequired = async (studentId) => {
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
      };

      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
          ...prevState,
          [name]: value
        }));
    
        let newErrors = { ...errors };
    
        if (name === 'studentId') {
          const studentIdPattern = /^CT\d{2}-\d{4}$/;
          if (!studentIdPattern.test(value)) {
            newErrors.studentId = 'Please try again';
          } else {
            const studentExists = students.some(student => student.studentNumber === value);
            if (!studentExists) {
              newErrors.studentId = 'Student not registered';
            } else {
              delete newErrors.studentId;
              // Trigger immediate data fetching
              fetchStudentData(value);
            }
          }
        }
    
        if (name === 'reasonOfCs') {
            const letterPattern = /^[a-zA-Z\s]*$/;
            if (!letterPattern.test(value)) {
                newErrors.reasonOfCs = 'This entry can only contain letters and spaces';
            } else {
                delete newErrors.reasonOfCs;
            }
        }
    
        if (name === 'deduction') {
            if (!value) {
                newErrors.deduction = 'Hours to Deduct are required';
            } else if (isNaN(value) || value <= 0) {
                newErrors.deduction = 'Please enter a positive number';
            } else {
                delete newErrors.deduction;
            }
        }
    
        if (name === 'areaId') {
            if (!value) {
                newErrors.areaId = 'Area of Community Service is required';
            } else {
                delete newErrors.areaId;
            }
        }
        setErrors(newErrors);
    };

    const validate = () => {
        const errors = {};
        const studentIdPattern = /^CT\d{2}-\d{4}$/;
        
        if (!formData.studentId) {
            errors.studentId = 'Student ID is required';
        } else if (!studentIdPattern.test(formData.studentId)) {
            errors.studentId = 'Please try again';
        }
    
        if (!formData.deduction) {
            errors.deduction = 'Hours to Deduct are required';
        } else if (isNaN(formData.deduction) || formData.deduction <= 0) {
            errors.deduction = 'Please enter a positive number';
        }
    
        if (!formData.areaId) {
            errors.areaId = 'Area of Community Service is required';
        }
    
        if (!formData.reasonOfCs) {
            errors.reasonOfCs = 'Reason for Community Service is required';
        } else {
            const spaceAllowedPattern = /^[a-zA-Z\s]*$/;
            if (!spaceAllowedPattern.test(formData.reasonOfCs)) {
                errors.reasonOfCs = 'This entry can only contain letters and spaces';
            }
        }
    
        return errors;
    };
    
    const fetchStudentData = async (studentId) => {
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
      };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const student = students.find(student => student.studentNumber === formData.studentId);
            const id = student && student.id;
            if (id) {
                const payload = {
                    id,
                    student: { id },
                    reasonOfCs: formData.reasonOfCs,
                    areaOfCommServ: { id: formData.areaId },
                    deduction: formData.deduction
                };
                const response = await axios.post(getApiUrl(API_ENDPOINTS.CSSLIP.CREATE), payload, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    }
                });

                if (response && response.data) {
                    setMessage('');
                    alert('CS slip created successfully!');
                    setTimeout(() => {
                        setSuccessMessage('');
                    }, 5000);
                } else {
                    console.error('Response data is Undefined:', response);
                    setMessage('Unexpected error occurred.');
                }
            }
        } catch (error) {
            console.error('Error:', error);
            if (error.response && error.response.data && error.response.data.message) {
                setMessage(error.response.data.message);
            } else {
                setMessage('An error occurred while processing the request.');
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        sessionStorage.removeItem('role');
        localStorage.removeItem('exp');
        navigate('/login');
    };

    return (
        <div className="cs-slip-page-admin">

            <nav className="nav-bar">

                <img src={logo} alt="Logo" className="rc-logo"/>

                <div className="nav-links">
                    <a className="nav-link" href="/admin/offense">Offense</a>
                    <a className="nav-link" href="/admin/violation">Violation</a>
                    <a className="nav-link" href="/admin/cs-list">CS Slips</a>
                    <a className="nav-link" href="#" onMouseDown={handleLogout} role="button" style={{ textDecoration: "none" }}>Logout</a>
                    <img src={user} alt="profile" className="profile"/>
                </div>

            </nav>
            <div className="csslip-box">

                <h1>COMMUNITY SERVICE SLIP</h1>

                <div className="cs-slip-container">

                    <form onSubmit={handleSubmit}>

                        <div className="input-container">

                            <div className="field-container">
                                <label>Student ID:</label>
                                <input type="text" className="cs-input-field" name="studentId" value={formData.studentId} onChange={handleInputChange} />
                                {errors.studentId && <span className="error-studentId">{errors.studentId}</span>}
                            </div>

                            <div className="field-container">
                                <label>Full Name:</label>
                                <input type="text" disabled className="cs-input-field" name="name" value={                                formData.name} onChange={handleInputChange} />
                            </div>

                            <div className="field-container">
                                <label>Section:</label>
                                <input type="text" disabled className="cs-input-field" name="section" value={formData.section} onChange={handleInputChange} />
                            </div>

                            <div className="field-container">
                                <label>Cluster Head:</label>
                                <input type="text" disabled className="cs-input-field" name="head" value={formData.head} onChange={handleInputChange} />
                            </div>

                            <div className="field-container">
                                <label>Hours to Deduct:</label>
                                <input type="text" className="cs-input-field" name="deduction" value={formData.deduction} onChange={handleInputChange} />
                                {errors.deduction && <span className="error-hours-deduct">{errors.deduction}</span>}
                            </div>

                            <div className="field-container">
                                <label>Area of Community Service:</label>
                                <select className="select-field" name="areaId" value={formData.areaId} onChange={handleInputChange}>
                                    <option value="">Select an area</option>
                                    {stations.map(station => (
                                        <option key={station.id} value={station.id}>{station.stationName}</option>
                                    ))}
                                </select>
                                {errors.areaId && <span className="error">{errors.areaId}</span>}
                            </div>

                            <div className="field-container">
                            <label>Reason for Community Service:</label>
                            <input type="text" className="cs-input-field" name="reasonOfCs" value={formData.reasonOfCs} onChange={handleInputChange} />
                            {errors.reasonOfCs && <span className="error-reason-cs">{errors.reasonOfCs}</span>}
                            </div>

                        </div>

                        <table className="cs-slip-table">

                            <thead>
                                <tr>
                                    <th>STUDENT</th>
                                    <th>OFFENSE</th>
                                    <th>CS HOURS</th>
                                </tr>
                            </thead>

                            <tbody>
                                {violations.map(violation => (
                                    <tr key={violation.id}>
                                        <td>{violation.student.studentNumber}</td>
                                        <td>{violation.offense.description}</td>
                                        <td>{violation.csHours}</td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>

                        <div className="bottom-container">

                            <div className="total-container">
                                <label>Total Hours Required: </label>
                                <input type="text" disabled className="input-hours" name="hoursRequired" value={totalHoursRequired} readOnly />
                            </div>

                            <button type="submit" className="create-csslip-button" disabled={!isFormValid} >CREATE</button>
                            {message && <div className="message error">{message}</div>}
                            {successMessage && <div className="message success">{successMessage}</div>}
                            
                        </div>

                    </form>

                </div>

            </div>
            
        </div>
    );
};

export default CsSlipPageAdmin;
