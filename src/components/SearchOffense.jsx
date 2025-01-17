import React from 'react';
import UnifiedSearch from './UnifiedSearch';

const SearchOffense = ({ searchInput, onSearchChange }) => {
  return (
    <UnifiedSearch
      searchInput={searchInput}
      onSearchChange={onSearchChange}
      placeholder="Search by offense"
      label="Search Offense"
    />
  );
};

export default SearchOffense;

