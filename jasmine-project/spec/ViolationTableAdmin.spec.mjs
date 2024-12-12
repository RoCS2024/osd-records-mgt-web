import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ViolationPageAdmin from '../pages/ViolationPageAdmin'; // Adjust the import path if needed
import axios from 'axios';
import { config } from '../Constants';

jest.mock('axios');

describe('ViolationPageAdmin', () => {

  beforeEach(() => {
    localStorage.setItem('token', 'fake_token');
    localStorage.setItem('role', 'ROLE_ROLE_ADMIN');
    localStorage.setItem('exp', Date.now() / 1000 + 3600); 
  });

  test('renders violation page with components', async () => {
    axios.get.mockResolvedValueOnce({ data: [] }); 

    render(
      <MemoryRouter>
        <ViolationPageAdmin />
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText(/search student/i);
    const startDateInput = screen.getByLabelText(/start date/i);
    const endDateInput = screen.getByLabelText(/end date/i);

    expect(searchInput).toBeInTheDocument();
    expect(startDateInput).toBeInTheDocument();
    expect(endDateInput).toBeInTheDocument();
  });

  test('filters violations based on search input', async () => {
    const mockViolations = [
      { id: 1, student: { firstName: 'Kate', lastName: 'Amulong' }, dateOfNotice: '2024-02-07' },
      { id: 2, student: { firstName: 'Khloe', lastName: 'Amulong' }, dateOfNotice: '2024-04-12' }
    ];
    axios.get.mockResolvedValueOnce({ data: mockViolations });

    render(
      <MemoryRouter>
        <ViolationPageAdmin />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/kate amulong/i)).toBeInTheDocument();
      expect(screen.getByText(/khloe amulong/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText(/search student/i), { target: { value: 'Kate' } });

    await waitFor(() => {
      expect(screen.queryByText(/khloe amulong/i)).not.toBeInTheDocument();
      expect(screen.getByText(/kate amulong/i)).toBeInTheDocument();
    });
  });

  test('handles date filtering correctly', async () => {
    const mockViolations = [
      { id: 1, student: { firstName: 'Kate', lastName: 'Amulong' }, dateOfNotice: '2024-02-07' },
      { id: 2, student: { firstName: 'Khloe', lastName: 'Amulong' }, dateOfNotice: '2024-04-12' }
    ];
    axios.get.mockResolvedValueOnce({ data: mockViolations });

    render(
      <MemoryRouter>
        <ViolationPageAdmin />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/kate amulong/i)).toBeInTheDocument();
      expect(screen.getByText(/khloe amulong/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/start date/i), { target: { value: '2024-02-07' } });
    fireEvent.change(screen.getByLabelText(/end date/i), { target: { value: '2024-04-12' } });

    await waitFor(() => {
      expect(screen.getByText(/kate amulong/i)).toBeInTheDocument();
      expect(screen.getByText(/khloe amulong/i)).toBeInTheDocument();
    });
  });

  test('opens and closes add violation modal', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    render(
      <MemoryRouter>
        <ViolationPageAdmin />
      </MemoryRouter>
    );

    const addViolationButton = screen.getByText(/add violation/i);
    expect(addViolationButton).toBeInTheDocument();

    fireEvent.click(addViolationButton);

    expect(screen.getByText(/add violation/i)).toBeInTheDocument();

    const closeButton = screen.getByText(/close/i); 
    fireEvent.click(closeButton);

    expect(screen.queryByText(/add violation/i)).not.toBeInTheDocument();
  });

  test('logout clears localStorage and redirects to login page', () => {
    render(
      <MemoryRouter>
        <ViolationPageAdmin />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/logout/i)); 

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('role')).toBeNull();
    expect(localStorage.getItem('exp')).toBeNull();
  });

});
