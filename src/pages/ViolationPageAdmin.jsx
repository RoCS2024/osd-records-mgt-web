import React, { useState } from 'react';
import styles from '../styles/ViolationPageAdmin.module.css';
import { MdEdit } from 'react-icons/md';

import { useViolations } from '../hooks/useViolations';
import { useAuth } from '../hooks/useAuth';

import AddViolationModal from '../components/AddViolationModal';
import EditViolationModal from '../components/EditViolationModal';
import DateFilter from '../components/DateFilter';
import SearchStudentViolation from '../components/SearchStudentViolation';
import Table from '../components/Table';
import NavBarAdmin from '../components/NavBarAdmin';
import DropdownCluster from '../components/DropdownCluster';

const ViolationPageAdmin = () => {
  const { handleLogout } = useAuth();
  const {
    filteredViolations,
    startDate,
    endDate,
    searchInput,
    filterType,
    addViolation,
    editViolation,
    handleStartDateChange,
    handleEndDateChange,
    handleSearchChange,
    handleFilterChange,
  } = useViolations();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [violationToEdit, setViolationToEdit] = useState(null);

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);

  const openEditModal = (violation) => {
    setViolationToEdit(violation);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setViolationToEdit(null);
  };

  const handleAddViolation = async (newViolation) => {
    const success = await addViolation(newViolation);
    if (success) closeAddModal();
  };

  const handleEditViolation = async (updatedViolation) => {
    const success = await editViolation(updatedViolation);
    if (success) closeEditModal();
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const columns = [
    { 
      key: 'student', 
      header: 'STUDENT', 
      className: styles.nameColumn,
      render: (row) => `${row.student.lastName}, ${row.student.firstName} ${row.student.middleName}`
    },
    { 
      key: 'dateOfNotice', 
      header: 'DATE', 
      className: styles.dateColumn,
      render: (row) => formatDate(row.dateOfNotice)
    },
    { 
      key: 'offense', 
      header: 'OFFENSE', 
      className: styles.offenseColumn,
      render: (row) => row.offense.description
    },
    {
      key: 'action',
      header: 'ACTION',
      className: styles.actionColumn,
      render: (row) => (
        <button className={styles.editButton} onClick={() => openEditModal(row)}>
            <MdEdit size={24} />
        </button>
      ),
    },
  ];

  return (
    <div className={styles.violationPageAdmin}>
      <NavBarAdmin handleLogout={handleLogout} />

      <div className={styles.violationContainer}>
        <h1 className={styles.head}>VIOLATION</h1>

        <div className={styles.contents}>
          <div className={styles.searchFilterContainer}>
            <div className={styles.leftContainer}>
              <SearchStudentViolation
                searchInput={searchInput}
                setSearchInput={handleSearchChange}
              />
              <DateFilter
                startDate={startDate}
                endDate={endDate}
                handleStartDateChange={handleStartDateChange}
                handleEndDateChange={handleEndDateChange}
              />
            </div>  
            <DropdownCluster
              categoryFilter={filterType}
              onCategoryFilterChange={(newFilter) => handleFilterChange({ target: { value: newFilter } })}
            />             
          </div>
          
          <div className={styles.tableContainer}>
            <Table columns={columns} data={filteredViolations} />
          </div>

          <div className={styles.addViolationBtn}>
            <a href="/admin/cs-slip"><button className={styles.createCsButton}>
              CREATE CS SLIP
            </button></a>
            <button className={styles.addViolationButton} onClick={openAddModal}>
              ADD VIOLATION
            </button>
          </div>
        </div>
      </div>

      <AddViolationModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onSubmit={handleAddViolation}
      />

      <EditViolationModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onSubmit={handleEditViolation}
        violationToEdit={violationToEdit}
      />
    </div>
  );
};

export default ViolationPageAdmin;
