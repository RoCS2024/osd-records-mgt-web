import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import logo from '../assets/logo_new.png';
import user from '../assets/user.png';
import styles from '../styles/NavBar.module.css';

const NavBarEmployee = ({ handleLogout }) => {
  const location = useLocation();
  const [activeLink, setActiveLink] = React.useState('');

  useEffect(() => {
    const path = location.pathname.split('/')[2];
    setActiveLink(path || 'violation');
  }, [location]);

  return (
    <nav className={styles.navBar}>
      <div className={styles.logoContainer}>
        <img src={logo || "/placeholder.svg"} alt="Logo" className={styles.rcLogo}/>
      </div>
      <div className={styles.navLinks}>
        <a 
          className={`${styles.navLink} ${activeLink === 'violation' ? styles.active : ''}`} 
          href="/employee/cs-list"
        >
          Reports
        </a>
        <button className={styles.navLinkButton} onClick={handleLogout}>Logout</button>
        <div className={styles.profileContainer}>
          <img src={user || "/placeholder.svg"} alt="profile" className={styles.profile}/>
        </div>
      </div>
    </nav>
  );
};

export default NavBarEmployee;

