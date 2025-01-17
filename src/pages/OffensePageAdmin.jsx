import React, { useState } from 'react';
import styles from '../styles/OffensePageAdmin.module.css';
import { MdEdit } from 'react-icons/md';

import { useOffenses } from '../hooks/useOffenses';
import { useAuth } from '../hooks/useAuth';

import AddOffenseModal from '../components/AddOffenseModal';
import EditOffenseModal from '../components/EditOffenseModal';
import SearchOffense from '../components/SearchOffense';
import DropdownMajorMinor from '../components/DropdownMinorMajor';
import Table from '../components/Table';
import NavBarAdmin from '../components/NavBarAdmin';

const OffensePageAdmin = () => {
  const { handleLogout } = useAuth();
  const {
    filteredOffenses,
    searchInput,
    filterType,
    addOffense,
    editOffense,
    handleSearchChange,
    handleFilterChange
  } = useOffenses();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [offenseToEdit, setOffenseToEdit] = useState(null);

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);

  const openEditModal = (offense) => {
    setOffenseToEdit(offense);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setOffenseToEdit(null);
  };

  const handleAddOffense = async (newOffense) => {
    const success = await addOffense(newOffense);
    if (success) closeAddModal();
  };

  const handleEditOffense = async (updatedOffense) => {
    const success = await editOffense(updatedOffense);
    if (success) closeEditModal();
  };

  const columns = [
    { key: 'description', header: 'OFFENSE', className: styles.nameColumn },
    { key: 'type', header: 'TYPE', className: styles.typeColumn },
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
    <div className={styles.offensePageAdmin}>
      <NavBarAdmin handleLogout={handleLogout} />

      <div className={styles.offenseContainer}>
        <h1 className={styles.head}>OFFENSE</h1>

        <div className={styles.contents}>
          <div className={styles.searchFilterContainer}>
            <SearchOffense
              searchInput={searchInput}
              onSearchChange={handleSearchChange}
              filterType={filterType}
              onFilterChange={handleFilterChange}
            />
            <DropdownMajorMinor
              filterType={filterType}
              onFilterChange={handleFilterChange}
            />
          </div>
          
          <div className={styles.tableContainer}>
            <Table columns={columns} data={filteredOffenses} />
          </div>

          <div className={styles.addOffenseBtn}>
            <button className={styles.addOffenseButton} onClick={openAddModal}>ADD OFFENSE</button>
          </div>
        </div>
      </div>

      <AddOffenseModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onSubmit={handleAddOffense}
      />

      <EditOffenseModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onSubmit={handleEditOffense}
        offenseToEdit={offenseToEdit}
      />
    </div>
  );
};

export default OffensePageAdmin;

