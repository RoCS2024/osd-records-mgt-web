import React from 'react';
import styles from '../styles/DateFilter.module.css';

const DateFilter = ({ startDate, endDate, handleStartDateChange, handleEndDateChange }) => {
    return (
        <div className={styles.dateFilterContainer}>
            <div className={styles.dateInputGroup}>
                {/* <label htmlFor="start-date" className={styles.dateLabel}>Start Date</label> */}
                <input
                    type="date"
                    className={styles.dateInput}
                    id="start-date"
                    name="start-date"
                    value={startDate}
                    onChange={handleStartDateChange}
                />
            </div>
            <span className={styles.dateRangeSeparator}>to</span>
            <div className={styles.dateInputGroup}>
                {/* <label htmlFor="end-date" className={styles.dateLabel}>End Date</label> */}
                <input
                    type="date"
                    className={styles.dateInput}
                    id="end-date"
                    name="end-date"
                    value={endDate}
                    onChange={handleEndDateChange}
                />
            </div>
        </div>
    );
};

export default DateFilter;

