
import React from 'react';

const DropdownCluster = ({ filterType, onFilterChange }) => {
    return (
        <div className="violation-search-filter">

            <select value={filterType} onChange={onFilterChange} className="filter-cluster">
                <option value="All">All</option>
                <option value="CETE">CETE</option>
                <option value="CBAM">CBAM</option>
            </select>

        </div>
    );
};

export default DropdownCluster;
