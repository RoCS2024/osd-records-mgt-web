import React from 'react';
import UnifiedDropdown from './UnifiedDropdown';

const DropdownMajorMinor = ({ filterType, onFilterChange, label = "Filter by Type" }) => {
    const options = [
        { value: 'All', label: 'All' },
        { value: 'Major', label: 'Major' },
        { value: 'Minor', label: 'Minor' }
    ];

    return (
            <UnifiedDropdown
                options={options}
                selectedValue={filterType}
                onChange={onFilterChange}
                placeholder={label}
                isSearchable={false}
            />
    );
};

export default DropdownMajorMinor;

