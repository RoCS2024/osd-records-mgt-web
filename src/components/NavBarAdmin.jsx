import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import logo from '../assets/logo_new.png';
import user from '../assets/user.png';
import styles from '../styles/NavBar.module.css';

const NavBarAdmin = ({ handleLogout }) => {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState('');

  useEffect(() => {
    const path = location.pathname.split('/')[2];
    setActiveLink(path || 'offense');
  }, [location]);

  return (
    <nav className={styles.navBar}>
      <div className={styles.logoContainer}>
        <img src={logo || "/placeholder.svg"} alt="Logo" className={styles.rcLogo}/>
      </div>
      <div className={styles.navLinks}>
        <a 
          className={`${styles.navLink} ${activeLink === 'offense' ? styles.active : ''}`} 
          href="/admin/offense"
        >
          Offense
        </a>
        <a 
          className={`${styles.navLink} ${activeLink === 'violation' ? styles.active : ''}`} 
          href="/admin/violation"
        >
          Violation
        </a>
        <a 
          className={`${styles.navLink} ${activeLink === 'cs-list' ? styles.active : ''}`} 
          href="/admin/cs-list"
        >
          CS Slip
        </a>
        <button className={styles.navLinkButton} onClick={handleLogout}>Logout</button>
        <div className={styles.profileContainer}>
          <img src={user || "/placeholder.svg"} alt="profile" className={styles.profile}/>
        </div>
      </div>
    </nav>
  );
};

export default NavBarAdmin;

