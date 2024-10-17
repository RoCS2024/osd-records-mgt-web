import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import CreateAccount from "./pages/CreateAccount";
import OTP from "./pages/OTP";
import ForgotPassword from "./pages/ForgotPassword";

import OffensePageAdmin from "./pages/OffenseTableAdmin";

import ForgotUsername from "./pages/ForgotUsername";


const App = () => {
  return (
      <Router>
          <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/account/create" element={<CreateAccount />} />
              <Route path="/account/otp" element={<OTP />} />
              <Route path="/account/forgot-password" element={<ForgotPassword />} />
              <Route path="/account/forgot-username" element={<ForgotUsername />} />

              <Route path="/admin/offense" element={<OffensePageAdmin />} />

              <Route path="*" element={<Navigate to="/" />} />
          </Routes>
      </Router>
  );
};

export default App;