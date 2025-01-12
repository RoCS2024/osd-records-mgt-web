import React from 'react';

const SearchListCsReport = ({ searchInput, handleSearchChange }) => {
    return (
        <div className="list-cs-search-filter">
            <input
                type="text"
                placeholder="Search by student name"
                className="list-cs-search-input"
                value={searchInput}
                onChange={handleSearchChange}
            />
        </div>
    );
};

export default SearchListCsReport;
