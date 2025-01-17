import React, { useState } from 'react';
import styles from '../styles/CustomCollapsible.module.css';

const CustomCollapsible = ({ children, trigger, open: initialOpen = false }) => {
    const [isOpen, setIsOpen] = useState(initialOpen);

    const toggleOpen = () => setIsOpen(!isOpen);

    return (
        <div className={styles.collapsible}>
            <div className={styles.trigger} onClick={toggleOpen}>
                {trigger}
                <span className={`${styles.arrow} ${isOpen ? styles.open : ''}`}>▼</span>
            </div>
            {isOpen && <div className={styles.content}>{children}</div>}
        </div>
    );
};

export default CustomCollapsible;

