import React from 'react';
import { FaSearch } from 'react-icons/fa';
import styles from '../styles/UnifiedSearch.module.css';

const UnifiedSearch = ({ searchInput, onSearchChange, placeholder, label }) => {
  return (
    <div className={styles.searchContainer}>
      <label htmlFor="unified-search" className={styles.searchLabel}>
        {label}
      </label>
      <input
        type="text"
        id="unified-search"
        placeholder={placeholder}
        className={styles.searchInput}
        value={searchInput}
        onChange={onSearchChange}
      />
      <FaSearch className={styles.searchIcon} aria-hidden="true" />
    </div>
  );
};

export default UnifiedSearch;

