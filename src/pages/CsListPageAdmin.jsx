import React, { useState, useEffect } from "react";
import styles from '../styles/CsListPageAdmin.module.css';
import { useCsSlips } from '../hooks/useCsSlips';
import Table from '../components/Table2';
import NavBarAdmin from "../components/NavBarAdmin";
import SearchListCsReport from "../components/SearchListCsReport";
import DropdownCluster from "../components/DropdownCluster";

const CsListPageAdmin = () => {
  const {
    csSlips,
    selectedSlip,
    handleRowClick,
    handleLogout,
    formatDate,
    formatTime,
    calculateTotalHoursCompleted,
    fetchCsSlips
  } = useCsSlips('ROLE_ROLE_ADMIN');

  const [searchInput, setSearchInput] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  useEffect(() => {
    fetchCsSlips();
  }, [fetchCsSlips]);

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleCategoryFilterChange = (selectedValue) => {
    setCategoryFilter(selectedValue);
  };

  const filteredCsSlips = csSlips.filter(slip => {
    const searchLower = searchInput.toLowerCase();
    const matchesSearch = 
      slip.student.studentNumber.toLowerCase().includes(searchLower) ||
      `${slip.student.firstName} ${slip.student.lastName}`.toLowerCase().includes(searchLower) ||
      slip.areaOfCommServ.stationName.toLowerCase().includes(searchLower);

    const matchesFilter = 
      categoryFilter === 'All' || slip.student.section.clusterName === categoryFilter;

    return matchesSearch && matchesFilter;
  });

  const columns = [
    { 
      key: 'studentId', 
      header: 'STUDENT ID',
      className: styles.studentIdColumn,
      render: (row) => row.student.studentNumber
    },
    { 
      key: 'studentName', 
      header: 'STUDENT NAME',
      className: styles.studentNameColumn,
      render: (row) => `${row.student.firstName} ${row.student.lastName}`
    },
    { 
      key: 'area', 
      header: 'AREA OF COMMUNITY SERVICE',
      className: styles.areaColumn,
      render: (row) => row.areaOfCommServ.stationName
    },
    {
      key: 'totalHoursCompleted',
      header: 'TOTAL HOURS COMPLETED',
      className: styles.hoursColumn,
      render: (row) => {
        const hours = calculateTotalHoursCompleted(row);
        console.log('Total Hours Completed:', hours);
        return Math.round(hours);
      }
    },
  ];

  return (
    <div className={styles.csListPageAdmin}>
      <NavBarAdmin handleLogout={handleLogout} />

      <div className={styles.csListContainer}>
        <h1 className={styles.head}>LIST OF COMMUNITY SERVICE SLIP</h1>

        <div className={styles.contents}>
          <div className={styles.searchFilterContainer}>
            <SearchListCsReport
              searchInput={searchInput}
              handleSearchChange={handleSearchChange}
            />
            <DropdownCluster
              categoryFilter={categoryFilter}
              onCategoryFilterChange={handleCategoryFilterChange}
            />
          </div>
          
          <div className={styles.tableContainer}>
            <Table 
              columns={columns} 
              data={filteredCsSlips}
              onRowClick={handleRowClick}
              expandedRow={selectedSlip ? selectedSlip.id : null}
              expandedContent={(row) => (
                <div className={styles.selectedSlipDetails}>
                  <h2>Community Service Report</h2>
                  <table className={styles.reportTable}>
                    <thead>
                      <tr>
                        <th>DATE</th>
                        <th>TIME STARTED</th>
                        <th>TIME ENDED</th>
                        <th>HOURS COMPLETED</th>
                        <th>NATURE OF WORK</th>
                        <th>STATUS</th>
                        <th>REMARKS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {row.reports.map((report, index) => (
                        <tr key={index}>
                          <td>{formatDate(report.dateOfCs)}</td>
                          <td>{formatTime(report.timeIn)}</td>
                          <td>{formatTime(report.timeOut)}</td>
                          <td>{report.hoursCompleted.toFixed(0)}</td>
                          <td>{report.natureOfWork}</td>
                          <td>{report.status}</td>
                          <td>{report.remarks}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CsListPageAdmin;

