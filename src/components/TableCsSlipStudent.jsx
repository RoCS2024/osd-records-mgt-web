import React from 'react';
import Table from './Table2';

const TableCsSlipStudent = ({ 
  csSlips, 
  selectedSlip, 
  handleRowClick, 
  formatDate, 
  formatTime, 
  totalHoursCompleted 
}) => {
  const columns = [
    {
      key: 'studentName',
      header: 'STUDENT NAME',
      render: (row) => `${row.student.lastName}, ${row.student.firstName} ${row.student.middleName}`,
    },
    {
      key: 'areaOfCommServ',
      header: 'AREA OF COMMUNITY SERVICE',
      render: (row) => row.areaOfCommServ.stationName,
    },
  ];

  // Define the expanded content for each row
  const expandedContent = (row) => (
    <div>
      <h2>Community Service Report</h2>
      <Table
        columns={[
          { key: 'dateOfCs', header: 'DATE', render: (report) => formatDate(report.dateOfCs) },
          { key: 'timeIn', header: 'TIME STARTED', render: (report) => formatTime(report.timeIn) },
          { key: 'timeOut', header: 'TIME ENDED', render: (report) => formatTime(report.timeOut) },
          { key: 'hoursCompleted', header: 'HOURS COMPLETED', render: (report) => report.hoursCompleted },
          { key: 'natureOfWork', header: 'NATURE OF WORK', render: (report) => report.natureOfWork },
          { key: 'stationName', header: 'OFFICE', render: () => row.areaOfCommServ.stationName },
          { key: 'status', header: 'STATUS', render: (report) => report.status },
        ]}
        data={row.reports}
      />
      <h3>Total Hours of Community Service Completed: {totalHoursCompleted}</h3>
    </div>
  );

  return (
    <Table
      columns={columns}
      data={csSlips}
      onRowClick={handleRowClick}
      expandedRow={selectedSlip ? selectedSlip.id : null}
      expandedContent={expandedContent}
    />
  );
};

export default TableCsSlipStudent;
