import React from 'react';
import UnifiedSearch from './UnifiedSearch';

const SearchListCsReport = ({ searchInput, handleSearchChange }) => {
  return (
    <UnifiedSearch
      searchInput={searchInput}
      onSearchChange={handleSearchChange}
      placeholder="Search"
      label="Search"
    />
  );
};

export default SearchListCsReport;

