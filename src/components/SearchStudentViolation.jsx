import React from 'react';
import UnifiedSearch from './UnifiedSearch';

const SearchStudentViolation = ({ searchInput, setSearchInput }) => {
  const handleSearchChange = (e) => setSearchInput(e.target.value);

  return (
    <UnifiedSearch
      searchInput={searchInput}
      onSearchChange={handleSearchChange}
      placeholder="Search by Student Name"
      label="Search Student Violation"
    />
  );
};

export default SearchStudentViolation;

