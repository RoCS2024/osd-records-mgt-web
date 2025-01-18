import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ViolationStudent from '../pages/ViolationStudent';
import axios from 'axios';
import { config } from '../Constants';

jest.mock('axios');

describe('ViolationStudent', () => {
  beforeEach(() => {
    sessionStorage.setItem('token', 'fake_token');
    sessionStorage.setItem('role', 'ROLE_ROLE_STUDENT');
    sessionStorage.setItem('exp', (Date.now() / 1000 + 3600).toString()); 
    sessionStorage.setItem('userId', '1');
  });

  afterEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
  });

  test('renders violation student page with components', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    render(
      <MemoryRouter>
        <ViolationStudent />
      </MemoryRouter>
    );

    expect(screen.getByText(/my violations/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/start date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/end date/i)).toBeInTheDocument();
  });

  test('filters violations based on start and end dates', async () => {
    const mockViolations = [
      { id: 1, dateOfNotice: '2023-11-10' },
      { id: 2, dateOfNotice: '2023-11-15' }
    ];
    axios.get.mockResolvedValueOnce({ data: mockViolations });

    render(
      <MemoryRouter>
        <ViolationStudent />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/2023-11-10/i)).toBeInTheDocument();
      expect(screen.getByText(/2023-11-15/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/start date/i), { target: { value: '2023-11-10' } });
    fireEvent.change(screen.getByLabelText(/end date/i), { target: { value: '2023-11-15' } });

    await waitFor(() => {
      expect(screen.getByText(/2023-11-10/i)).toBeInTheDocument();
      expect(screen.getByText(/2023-11-15/i)).toBeInTheDocument();
    });
  });

  test('filters violations based on invalid date range', async () => {
    const mockViolations = [
      { id: 1, dateOfNotice: '2023-11-10' },
      { id: 2, dateOfNotice: '2023-11-15' }
    ];
    axios.get.mockResolvedValueOnce({ data: mockViolations });

    render(
      <MemoryRouter>
        <ViolationStudent />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/2023-11-10/i)).toBeInTheDocument();
      expect(screen.getByText(/2023-11-15/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/start date/i), { target: { value: '2023-11-15' } });
    fireEvent.change(screen.getByLabelText(/end date/i), { target: { value: '2023-11-10' } });

    jest.spyOn(window, 'alert').mockImplementation(() => {});

    await waitFor(() => {
      expect(screen.getByText(/2023-11-10/i)).toBeInTheDocument();
      expect(screen.getByText(/2023-11-15/i)).toBeInTheDocument();
    });

    expect(window.alert).toHaveBeenCalledWith('Start date cannot be earlier than end date');
  });

  test('logout clears sessionStorage and redirects to login page', async () => {
    render(
      <MemoryRouter>
        <ViolationStudent />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/logout/i)); 

    expect(sessionStorage.getItem('token')).toBeNull();
    expect(sessionStorage.getItem('role')).toBeNull();
    expect(sessionStorage.getItem('userId')).toBeNull();
    expect(window.location.pathname).toBe('/login'); 
  });

  test('redirects to the correct page based on user role', async () => {
    sessionStorage.setItem('role', 'ROLE_ROLE_EMPLOYEE');

    render(
      <MemoryRouter>
        <ViolationStudent />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(window.location.pathname).toBe('/employee/cs-list');
    });
  });

  test('shows violation data when available from the API', async () => {
    const mockViolations = [
      { id: 1, student: { firstName: 'Kate', lastName: 'Amulong' }, dateOfNotice: '2023-11-10' },
      { id: 2, student: { firstName: 'Khloe', lastName: 'Amulong' }, dateOfNotice: '2023-11-15' }
    ];
    axios.get.mockResolvedValueOnce({ data: mockViolations });

    render(
      <MemoryRouter>
        <ViolationStudent />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/kate amulong/i)).toBeInTheDocument();
      expect(screen.getByText(/khloe amulong/i)).toBeInTheDocument();
    });
  });

  test('handles date filter exceeding current year', async () => {
    render(
      <MemoryRouter>
        <ViolationStudent />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/start date/i), { target: { value: '2024-01-01' } });

    jest.spyOn(window, 'alert').mockImplementation(() => {});
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Date exceeds the current year');
    });
  });
});
