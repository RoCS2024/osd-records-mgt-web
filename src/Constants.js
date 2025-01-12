const prod = {
  BASE_URL: 'https://myapp.osdapp.com',
};

const dev = {
  BASE_URL: 'http://localhost:8080',
};

const config = process.env.NODE_ENV === 'development' ? dev : prod;

export const API_ENDPOINTS = {
  LOGIN: '/user/login',
  USER: {
    VERIFY_OTP: '/user/verify-otp',
    FORGOT_PASSWORD: '/user/forgot-password',
    VERIFY_PASSWORD: '/user/verify-forgot-password',
    REGISTER: '/user/register',
  },
  VIOLATION: {
    LIST: '/violation/violationList',
    ADD: '/violation/addViolation',
    EDIT: '/violation/updateViolation',
    BY_STUDENT_NUMBER: '/violation/studentNumber',
    BY_STUDENT_ID: '/violation/studentId',
  },
  OFFENSE: {
    LIST: '/offense/offenseList',
    ADD: '/offense/addOffense',
    UPDATE: '/offense/updateOffense',
  },
  STUDENT: {
    LIST: '/student/studentList',
    DETAILS: '/student/studentId',
  },
  EMPLOYEE: {
    LIST: '/employee/employeeList',
  },
  GUEST: {
    BENEFICIARIES: '/guest',
  },
  CSSLIP:{
    TOTAL_CS_HOURS: '/csSlip/totalCsHours/', 
    CREATE: '/csSlip/addCsSlip', 
    CS_LIST: '/csSlip/commServSlipList',
  },
  STATION:{
    LIST: '/station/stationList',
  }
};

export const getApiUrl = (endpoint) => `${config.BASE_URL}${endpoint}`;

export default config;