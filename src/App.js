import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import CreateAccount from "./pages/CreateAccount";
import OTP from "./pages/OTP";
import ForgotPassword from "./pages/ForgotPassword";


const App = () => {
  return (
      <Router>
          <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/account/create" element={<CreateAccount />} />
              <Route path="/account/otp" element={<OTP />} />
              <Route path="/account/forgot-password" element={<ForgotPassword />} />

              <Route path="*" element={<Navigate to="/" />} />
          </Routes>
      </Router>
  );
};

export default App;