import React from 'react';
import Table from './Table2';

const TableCsSlipGuest = ({
  filteredCsSlips,
  selectedSlip,
  handleRowClick,
  formatDate,
  formatTime,
  calculateTotalHoursCompleted,
}) => {
  const columns = [
    {
      key: 'studentName',
      header: 'STUDENT NAME',
      render: (row) =>
        `${row.student.lastName}, ${row.student.firstName} ${row.student.middleName}`,
    },
    {
      key: 'stationName',
      header: 'AREA OF COMMUNITY SERVICE',
      render: (row) => row.areaOfCommServ.stationName,
    },
  ];

  const expandedContent = (csSlip) => (
    <div>
      <h2>Community Service Report</h2>
      <table className="guest-cs-report-table">
        <thead>
          <tr>
            <th>DATE</th>
            <th>TIME STARTED</th>
            <th>TIME ENDED</th>
            <th>HOURS COMPLETED</th>
            <th>NATURE OF WORK</th>
            <th>OFFICE</th>
            <th>STATUS</th>
          </tr>
        </thead>
        <tbody>
          {csSlip.reports.map((report) => (
            <tr key={report.id}>
              <td>{formatDate(report.dateOfCs)}</td>
              <td>{formatTime(report.timeIn)}</td>
              <td>{formatTime(report.timeOut)}</td>
              <td>{report.hoursCompleted}</td>
              <td>{report.natureOfWork}</td>
              <td>{csSlip.areaOfCommServ.stationName}</td>
              <td>{report.status}</td>
            </tr>
          ))}
          <tr>
            <td colSpan="7">
              <h3>
                Total Hours of Community Service Completed: {calculateTotalHoursCompleted(csSlip)}
              </h3>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  return (
    <Table
      columns={columns}
      data={filteredCsSlips}
      onRowClick={handleRowClick}
      expandedRow={selectedSlip?.id}
      expandedContent={expandedContent}
    />
  );
};

export default TableCsSlipGuest;
