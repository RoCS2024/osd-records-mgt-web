import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import CreateAccount from "./pages/CreateAccount";
import OTP from "./pages/OTP";
import Login from "./pages/Login";

import ForgotPassword from "./pages/ForgotPassword";

import OffensePageAdmin from "./pages/OffenseTableAdmin";

import ViolationStudent from "./pages/ViolationStudent";
import ViolationGuest from "./pages/ViolationsGuest";
import ViolationPageAdmin from "./pages/ViolationTableAdmin";

import CsSlipPageAdmin from "./pages/CommunityServiceSlip";


const App = () => {
  return (
      <Router>
          <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/account/create" element={<CreateAccount/>} />
              <Route path="/account/otp" element={<OTP/>} />
              <Route path="/account/forgot-password" element={<ForgotPassword/>} />

              <Route path="/student/violation" element={<ViolationStudent/>} />

              <Route path="/guest/violation" element={<ViolationGuest/>} />

              <Route path="/admin/violation" element={<ViolationPageAdmin/>} />
              <Route path="/admin/offense" element={<OffensePageAdmin/>} />

              <Route path="/admin/cs-slip" element={<CsSlipPageAdmin />} />



              <Route path="*" element={<Navigate to="/" />} />
          </Routes>
      </Router>
  );
};

export default App;