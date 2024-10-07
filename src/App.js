import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import CreateAccount from "./pages/CreateAccount";
import OTP from "./pages/OTP";


const App = () => {
  return (
      <Router>
          <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/account/create" element={<CreateAccount />} />
              <Route path="/account/otp" element={<OTP />} />

              <Route path="*" element={<Navigate to="/" />} />
          </Routes>
      </Router>
  );
};

export default App;