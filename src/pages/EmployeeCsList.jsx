import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useEmployeeCsData } from "../hooks/useEmployeeCsData";
import styles from "../styles/EmployeeCsList.module.css";
import EmployeeCsSlip from "./EmployeeCsSlip";
import Table from "../components/Table2";
import NavBarEmployee from "../components/NavBarEmployee";

const EmployeeCsList = () => {
  const { handleLogout } = useAuth();
  const [userId] = useState(sessionStorage.getItem("userId"));

  // Default empty slip
  const defaultSlip = {
    id: "",
    studentNumber: "",
    studentId: "",
    name: "N/A",
    section: "N/A",
    head: "N/A",
    deduction: "0",
    area: "N/A",
    reason: "N/A",
    reports: [],
  };

  const [selectedCsSlip, setSelectedCsSlip] = useState(defaultSlip); // Initialize with default slip
  const { csSlips } = useEmployeeCsData(userId);

  const handleRowClick = (csSlip) => {
    setSelectedCsSlip({
      id: csSlip.id,
      studentNumber: csSlip.student.studentNumber,
      studentId: csSlip.student.id,
      name: `${csSlip.student.firstName} ${csSlip.student.lastName}`,
      section: csSlip.student.section.sectionName,
      head: csSlip.student.section.clusterHead,
      deduction: csSlip.deduction,
      area: csSlip.areaOfCommServ.stationName,
      reason: csSlip.reasonOfCs,
      reports: csSlip.reports,
    });
  };

  const columns = [
    { key: "studentNumber", header: "STUDENT ID", className: styles.nameColumn, 
      render: (row) => `${row.student.studentNumber}`,
    },
    {
      key: "name",
      header: "STUDENT NAME",
      className: styles.typeColumn,
      render: (row) => `${row.student.firstName} ${row.student.lastName}`,
    },
    {
      key: "area",
      header: "AREA OF COMMUNITY SERVICE",
      className: styles.areaColumn,
      render: (row) => row.areaOfCommServ.stationName,
    },
  ];

  return (
    <div className={styles.listCsPageAdmin}>
      <NavBarEmployee handleLogout={handleLogout} />
      <div className={styles.employeeContainer}>
        <h1>Community Service Slips</h1>
        <div className={styles.contentContainer}>
          <Table columns={columns} data={csSlips} onRowClick={handleRowClick} />
        </div>
        <div className={styles.slipContainer}>
          <EmployeeCsSlip data={selectedCsSlip} />
        </div>
      </div>
    </div>
  );
};

export default EmployeeCsList;
