import React from 'react';
import Collapsible from 'react-collapsible';

const TableCsSlipGuest = ({
    csSlips,
    filteredCsSlips,
    selectedSlip,
    handleRowClick,
    formatDate,
    formatTime,
    calculateTotalHoursCompleted
}) => {

    return (
        <table className="list-table">

            <thead>
                <tr>
                    <th>STUDENT NAME</th>
                    <th>AREA OF COMMUNITY SERVICE</th>
                </tr>
            </thead>

            <tbody>
                {filteredCsSlips.map(csSlip => (
                    <React.Fragment key={csSlip.id}>
                        <tr onClick={() => handleRowClick(csSlip)}>
                            <td>{`${csSlip.student.lastName}, ${csSlip.student.firstName} ${csSlip.student.middleName}`}</td>
                            <td>{csSlip.areaOfCommServ.stationName}</td>
                        </tr>
                        {selectedSlip && selectedSlip.id === csSlip.id && (
                            <tr>
                                <td colSpan="2">
                                    <Collapsible open={true}>
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
                                                    {selectedSlip.reports.map(report => (
                                                        <tr key={report.id}>
                                                            <td>{formatDate(report.dateOfCs)}</td>
                                                            <td>{formatTime(report.timeIn)}</td>
                                                            <td>{formatTime(report.timeOut)}</td>
                                                            <td>{report.hoursCompleted}</td>
                                                            <td>{report.natureOfWork}</td>
                                                            <td>{selectedSlip.areaOfCommServ.stationName}</td>
                                                            <td>{report.status}</td>
                                                        </tr>
                                                    ))}
                                                    <tr>
                                                        <td colSpan="7">
                                                            <h3>Total Hours of Community Service Completed: {calculateTotalHoursCompleted()}</h3>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </Collapsible>
                                </td>
                            </tr>
                        )}
                    </React.Fragment>
                ))}
            </tbody>
        </table>
    );
};

export default TableCsSlipGuest;
