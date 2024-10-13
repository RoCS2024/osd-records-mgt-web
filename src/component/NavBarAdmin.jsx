
import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo_new.png';
import user from '../assets/user.png';

import '../styles/offenseTableAdmin.css';

const NavBar = ({ handleLogout }) => {
    const navigate = useNavigate();

    return (
        <nav className="nav-bar">
            <img src={logo} alt="Logo" className="rc-logo"/>
            <div className="nav-links">
                <a className="nav-link" href="/admin/offense">Offense</a>
                <a className="nav-link" href="/admin/violation">Violation</a>
                <a className="nav-link" href="/admin/cs-list">CS Slips</a>
                <a className="nav-link" href="#" onMouseDown={handleLogout}>Logout</a>
                <img src={user} alt="profile" className="profile"/>
            </div>
        </nav>
    );
};

export default NavBar;
