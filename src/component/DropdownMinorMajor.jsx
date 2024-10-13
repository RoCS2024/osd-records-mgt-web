
import React from 'react';

const DropdownMajorMinor = ({ filterType, onFilterChange }) => {
    return (
        <div className="search-offense-filter">

            <select value={filterType} onChange={onFilterChange} className="filter-dropdown">
                <option value="All">All</option>
                <option value="Major">Major</option>
                <option value="Minor">Minor</option>
            </select>

        </div>
    );
};

export default DropdownMajorMinor;
