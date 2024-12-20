import React from 'react';

import logo from '../assets/logo_new.png';
import user from '../assets/user.png';

import '../styles/ViolationStudent.css'; 
import '../styles/ViolationGuest.css';

const NavBar = ({ handleLogout }) => {
    return (
        <nav className="nav-bar">
            <img src={logo} alt="Logo" className="rc-logo" />
            <div className="nav-links">
                <a href="/student/violation">Violation</a>
                <a href="/student/cs-slip">Cs Slips</a>
                <button onClick={handleLogout} className="logout-button">Logout</button>
                <img src={user} alt="profile" className="profile" />
            </div>
        </nav>
    );
};

export default NavBar;
