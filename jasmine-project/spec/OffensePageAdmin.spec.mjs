import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import OffensePageAdmin from '../pages/OffensePageAdmin';
import axios from 'axios';

jest.mock('axios');
jest.mock('../hooks/useOffenses', () => ({
  useOffenses: jest.fn(() => ({
    filteredOffenses: [
      { id: 1, description: 'Theft', type: 'Major' },
      { id: 2, description: 'Littering', type: 'Minor' },
    ],
    searchInput: '',
    filterType: '',
    addOffense: jest.fn(() => Promise.resolve(true)),
    editOffense: jest.fn(() => Promise.resolve(true)),
    handleSearchChange: jest.fn(),
    handleFilterChange: jest.fn(),
  })),
}));

jest.mock('../hooks/useAuth', () => ({
  useAuth: jest.fn(() => ({
    handleLogout: jest.fn(),
  })),
}));

jest.mock('../components/AddOffenseModal', () => (props) => (
  props.isOpen ? <div>Add Offense Modal</div> : null
));

jest.mock('../components/EditOffenseModal', () => (props) => (
  props.isOpen ? <div>Edit Offense Modal</div> : null
));

jest.mock('../components/SearchOffense', () => (props) => (
  <input
    placeholder="Search offenses"
    value={props.searchInput}
    onChange={(e) => props.onSearchChange(e.target.value)}
  />
));

jest.mock('../components/DropdownMinorMajor', () => (props) => (
  <select value={props.filterType} onChange={(e) => props.onFilterChange(e.target.value)}>
    <option value="">All</option>
    <option value="Major">Major</option>
    <option value="Minor">Minor</option>
  </select>
));

jest.mock('../components/Table', () => (props) => (
  <table>
    <thead>
      <tr>
        {props.columns.map((col) => (
          <th key={col.key}>{col.header}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {props.data.map((row) => (
        <tr key={row.id}>
          <td>{row.description}</td>
          <td>{row.type}</td>
          <td>{props.columns.find((col) => col.key === 'action').render(row)}</td>
        </tr>
      ))}
    </tbody>
  </table>
));

describe('OffensePageAdmin Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component with the correct fields', () => {
    render(
      <MemoryRouter>
        <OffensePageAdmin />
      </MemoryRouter>
    );

    expect(screen.getByText(/OFFENSE/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search offenses/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add offense/i })).toBeInTheDocument();
  });

  it('handles search input correctly', () => {
    const mockHandleSearchChange = jest.fn();
    render(
      <MemoryRouter>
        <OffensePageAdmin />
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText(/search offenses/i);
    fireEvent.change(searchInput, { target: { value: 'Theft' } });

    expect(searchInput.value).toBe('Theft');
  });

  it('handles filter change correctly', () => {
    render(
      <MemoryRouter>
        <OffensePageAdmin />
      </MemoryRouter>
    );

    const filterDropdown = screen.getByRole('combobox');
    fireEvent.change(filterDropdown, { target: { value: 'Major' } });

    expect(filterDropdown.value).toBe('Major');
  });

  it('opens and closes the add offense modal', () => {
    render(
      <MemoryRouter>
        <OffensePageAdmin />
      </MemoryRouter>
    );

    const addButton = screen.getByRole('button', { name: /add offense/i });
    fireEvent.click(addButton);

    expect(screen.getByText(/Add Offense Modal/i)).toBeInTheDocument();
  });

  it('opens and closes the edit offense modal', () => {
    render(
      <MemoryRouter>
        <OffensePageAdmin />
      </MemoryRouter>
    );

    const editButton = screen.getAllByRole('button')[0]; 
    fireEvent.click(editButton);

    expect(screen.getByText(/Edit Offense Modal/i)).toBeInTheDocument();
  });

  it('logs out and redirects to login page', () => {
    const mockHandleLogout = jest.fn();
    render(
      <MemoryRouter>
        <OffensePageAdmin />
      </MemoryRouter>
    );

    const logoutButton = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(logoutButton);

    expect(mockHandleLogout).toHaveBeenCalled();
  });

  it('adds a new offense and closes the modal', async () => {
    const mockAddOffense = jest.fn(() => Promise.resolve(true));
    render(
      <MemoryRouter>
        <OffensePageAdmin />
      </MemoryRouter>
    );

    const addButton = screen.getByRole('button', { name: /add offense/i });
    fireEvent.click(addButton);

    expect(screen.getByText(/Add Offense Modal/i)).toBeInTheDocument();

    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockAddOffense).toHaveBeenCalled());
  });
});
