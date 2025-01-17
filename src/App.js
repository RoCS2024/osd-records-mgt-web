import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import OTP from "./pages/OTP";
import ForgotPassword from "./pages/ForgotPassword";
import CreateAccount from "./pages/CreateAccount";

import OffensePageAdmin from "./pages/OffensePageAdmin";
import ViolationPageAdmin from "./pages/ViolationPageAdmin";
import CsSlipPageAdmin from "./pages/CsSlipPageAdmin";
import CsListPageAdmin from "./pages/CsListPageAdmin";
import CsReportPageAdmin from "./pages/CsReportPageAdmin";

import ViolationStudent from "./pages/ViolationStudent";
import CsSlipStudent from "./pages/CsSlipStudent";

import ViolationGuest from "./pages/ViolationGuest";
import CsSlipGuest from "./pages/CsSlipGuest";

import EmployeeCsList from "./pages/EmployeeCsList";

const App = () => {
  return (
      <Router>
          <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/account/otp" element={<OTP/>} />
              <Route path="/account/forgot-password" element={<ForgotPassword/>} />
              <Route path="/account/create" element={<CreateAccount/>} />

              <Route path="/admin/offense" element={<OffensePageAdmin/>} />
              <Route path="/admin/violation" element={<ViolationPageAdmin/>} />
              <Route path="/admin/cs-slip" element={<CsSlipPageAdmin />} />
              <Route path="/admin/cs-list" element={<CsListPageAdmin />} />
              <Route path="/admin/cs-report" element={<CsReportPageAdmin />} />

              <Route path="/student/cs-slip" element={<CsSlipStudent />} />
              <Route path="/student/violation" element={<ViolationStudent/>} />

              <Route path="/guest/cs-slip" element={<CsSlipGuest />} />
              <Route path="/guest/violation" element={<ViolationGuest/>} />

              <Route path="/employee/cs-list" element={<EmployeeCsList />} />

              <Route path="*" element={<Navigate to="/" />} />
          </Routes>
      </Router>
  );
};

export default App;