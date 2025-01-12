import React, { useRef, useState, useEffect } from "react";
import CommunityServiceReport from "../pages/CommunityServiceReport";

const TableListCsReport = ({ csSlipsToDisplay, csReport, setCsReport }) => {
    const collapsibleRef = useRef(null);
    const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(false);
    const [collapsibleHeight, setCollapsibleHeight] = useState("0px");

    useEffect(() => {
        if (isCollapsibleOpen) {
            setCollapsibleHeight(`${collapsibleRef.current.scrollHeight}px`);
        } else {
            setCollapsibleHeight("0px");
        }
    }, [isCollapsibleOpen]);

    const handleRowClick = (csSlip) => {
        if (csReport?.id === csSlip.id && isCollapsibleOpen) {
            setIsCollapsibleOpen(false);
        } else {
            setCsReport({
                id: csSlip.id,
                studentNumber: csSlip.student.studentNumber,
                name: `${csSlip.student.firstName} ${csSlip.student.lastName}`,
                section: csSlip.student.section.sectionName,
                head: csSlip.student.section.clusterHead,
                deduction: csSlip.deduction,
                area: csSlip.areaOfCommServ.stationName,
                reason: csSlip.reasonOfCs,
                reports: csSlip.reports
            });
            setIsCollapsibleOpen(true);
        }
    };

    return (
        <table className="list-cs-table">
            <thead>
                <tr>
                    <th>STUDENT ID</th>
                    <th>STUDENT NAME</th>
                    <th>AREA OF COMMUNITY SERVICE</th>
                </tr>
            </thead>

            <tbody>
                {csSlipsToDisplay.map((csSlip, index) => (
                    <React.Fragment key={index}>
                        <tr onClick={() => handleRowClick(csSlip)}>
                            <td>{csSlip.student.studentNumber}</td>
                            <td>{`${csSlip.student.firstName} ${csSlip.student.lastName}`}</td>
                            <td>{csSlip.areaOfCommServ.stationName}</td>
                        </tr>
                        {csReport?.id === csSlip.id && (
                            <tr
                                ref={collapsibleRef}
                                style={{ maxHeight: `${collapsibleHeight}` }}
                                className={`collapsible-section ${isCollapsibleOpen ? 'open' : ''}`}
                            >
                                <td colSpan="3">
                                    <CommunityServiceReport data={csReport} isOpen={isCollapsibleOpen} />
                                </td>
                            </tr>
                        )}
                    </React.Fragment>
                ))}
                {csSlipsToDisplay.length === 0 && (
                    <tr>
                        <td colSpan="3">No results found.</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};

export default TableListCsReport;
