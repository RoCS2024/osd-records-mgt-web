
import React from 'react';
import logo from '../assets/logo_new.png';
import user from '../assets/user.png';

import '../styles/offenseTableAdmin.css';
import '../styles/ViolationTableAdmin.css';
import '../styles/ListCommunityServiceReport.css';

const NavBarAdmin = ({ handleLogout }) => {
    return (
        <nav className="nav-bar">
            <img src={logo} alt="Logo" className="rc-logo"/>

            <div className="nav-links">
                <a className="nav-link" href="/admin/offense">Offense</a>
                <a className="nav-link" href="/admin/violation">Violation</a>
                <a className="nav-link" href="/admin/cs-list">CS Slip</a>
                <button className="nav-link-button" onMouseDown={handleLogout}>Logout</button>
                <img src={user} alt="profile" className="profile"/>
            </div>

        </nav>
    );
};

export default NavBarAdmin;
