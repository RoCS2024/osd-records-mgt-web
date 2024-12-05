const prod = {
  url: {
    API_URL: 'https://myapp.osdapp.com',
    API_URL_USERS: 'https://myapp.osdapp.com/users',
    VIOLATION_LIST: 'http://localhost:8080/violation/violationList',
    ADD_VIOLATION: 'http://localhost:8080/violation/addViolation',
    EDIT_VIOLATION: 'http://localhost:8080/violation/updateViolation',

    OFFENSE_LIST: 'http://localhost:8080/offense/offenseList',
    ADD_OFFENSE: 'http://localhost:8080/offense/addOffense',
    UPDATE_OFFENSE: 'http://localhost:8080/offense/updateOffense',

    STUDENT_LIST: 'http://localhost:8080/student/studentList',
    EMPLOYEE_LIST: 'http://localhost:8080/employee/employeeList',

    VIOLATION_STUDENTNUMBER: 'http://localhost:8080/violation/studentNumber',

    VIOLATION_STUDENTID: 'http://localhost:8080/violation/studentId',

    GUEST_BENEFICIARIES: 'http://localhost:8080/guest',
  },
};

const dev = {
  url: {
    API_URL: 'http://localhost:8080/user/login',
    VIOLATION_LIST: 'http://localhost:8080/violation/violationList',
    ADD_VIOLATION: 'http://localhost:8080/violation/addViolation',
    EDIT_VIOLATION: 'http://localhost:8080/violation/updateViolation',

    OFFENSE_LIST: 'http://localhost:8080/offense/offenseList',
    ADD_OFFENSE: 'http://localhost:8080/offense/addOffense',
    UPDATE_OFFENSE: 'http://localhost:8080/offense/updateOffense',

    STUDENT_LIST: 'http://localhost:8080/student/studentList',
    EMPLOYEE_LIST: 'http://localhost:8080/employee/employeeList',

    VIOLATION_STUDENTNUMBER: 'http://localhost:8080/violation/studentNumber',
    
    VIOLATION_STUDENTID: 'http://localhost:8080/violation/studentId',

    GUEST_BENEFICIARIES: 'http://localhost:8080/guest',
  },
};

export const config = process.env.NODE_ENV === 'development' ? dev : prod;
