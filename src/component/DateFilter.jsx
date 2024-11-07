import React from 'react';

const DateFilter = ({ startDate, endDate, handleStartDateChange, handleEndDateChange }) => {
    return (
        <div className="date-filter">
            <input
                type="date"
                className="date-input"
                id="start-date"
                name="start-date"
                value={startDate}
                onChange={handleStartDateChange}
            />
            <p id="to">to</p>
            <input
                type="date"
                className="date-input"
                id="end-date"
                name="end-date"
                value={endDate}
                onChange={handleEndDateChange}
            />
        </div>
    );
};

export default DateFilter;