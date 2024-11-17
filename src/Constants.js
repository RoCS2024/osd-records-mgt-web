const prod = {
    url: {
      API_URL: 'https://myapp.osdapp.com',
      API_URL_USERS: 'https://myapp.osdapp.com/users',
      VIOLATION_LIST:'http://localhost:8080/violation/violationList',
      ADD_VIOLATION:'http://localhost:8080/violation/addViolation',
      EDIT_VIOLATION: 'http://localhost:8080/violation/updateViolation',
      OFFENSE_LIST:'http://localhost:8080/offense/offenseList',
      STUDENT_LIST:'http://localhost:8080/student/studentList',
      EMPLOYEE_LIST:'http://localhost:8080/employee/employeeList',
    },
  };
  
  const dev = {
    url: {
      API_URL: 'http://localhost:8080/user/login',
      VIOLATION_LIST:'http://localhost:8080/violation/violationList',
      ADD_VIOLATION:'http://localhost:8080/violation/addViolation',
      EDIT_VIOLATION:'http://localhost:8080/violation/updateViolation',
      OFFENSE_LIST:'http://localhost:8080/offense/offenseList',
      STUDENT_LIST:'http://localhost:8080/student/studentList',
      EMPLOYEE_LIST:'http://localhost:8080/employee/employeeList',
    },
  };
  
  
  export const config = process.env.NODE_ENV === 'development' ? dev : prod;
  