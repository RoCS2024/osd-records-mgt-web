import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import OffensePageAdmin from "./pages/OffenseTableAdmin";
import ViolationPageAdmin from "./pages/ViolationTableAdmin";
import CsSlipPageAdmin from "./pages/CommunityServiceSlip";
import CsListPageAdmin from "./pages/ListCommunityServiceReport";
import CsReportPageAdmin from "./pages/CommunityServiceReport";
import CreateAccount from "./pages/CreateAccount";
import ForgotPassword from "./pages/ForgotPassword";
import ViolationStudent from "./pages/ViolationStudent";
import CsSlipStudent from "./pages/CsSlipStudent";
import ViolationGuest from "./pages/ViolationsGuest";
import CsSlipGuest from "./pages/CsSlipGuest";
import EmployeeCsList from "./pages/EmployeeCsList";
import EmployeeCsSlip from "./pages/EmployeeCsSlip";



const App = () => {
  return (
      <Router>
          <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/create-account" element={<CreateAccount/>} />
              <Route path="/forgot-password" element={<ForgotPassword/>} />
              <Route path="/offense-admin" element={<OffensePageAdmin />} />
              <Route path="/violation-admin" element={<ViolationPageAdmin />} />
              <Route path="/cs-slip-admin" element={<CsSlipPageAdmin />} />
              <Route path="/list-cs-admin" element={<CsListPageAdmin/>} />
              <Route path="/cs-report-admin" element={<CsReportPageAdmin/>} />
        
              <Route path="/violation-student" element={<ViolationStudent/>} />
              <Route path="/cs-slip-student" element={<CsSlipStudent/>} />
              <Route path="/violation-guest" element={<ViolationGuest/>} />
              <Route path="/cs-slip-guest" element={<CsSlipGuest/>} />
              <Route path="/employee-cs-list" element={<EmployeeCsList/>} />
              <Route path="/employee-cs-slip" element={<EmployeeCsSlip/>} />

              <Route path="*" element={<Navigate to="/" />} />
          </Routes>
      </Router>
  );
};

export default App;
