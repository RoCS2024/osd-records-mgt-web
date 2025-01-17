import React from 'react';
import UnifiedDropdown from './UnifiedDropdown';

const DropdownCluster = ({ categoryFilter, onCategoryFilterChange }) => {
  const options = [
    { value: 'All', label: 'All' },
    { value: 'CETE', label: 'CETE' },
    { value: 'CBAM', label: 'CBAM' }
  ];

  return (
    <UnifiedDropdown
      options={options}
      selectedValue={categoryFilter}
      onChange={onCategoryFilterChange}
      placeholder="Select a category"
    />
  );
};

export default DropdownCluster;
