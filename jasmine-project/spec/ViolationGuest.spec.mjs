import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ViolationGuest from '../pages/ViolationGuest';
import axios from 'axios';

jest.mock('axios');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('ViolationGuest', () => {
  let mockNavigate;

  beforeEach(() => {
    sessionStorage.setItem('userId', 'guest123');
    sessionStorage.setItem('role', 'ROLE_ROLE_GUEST');
    localStorage.setItem('token', 'fake_token');
    localStorage.setItem('exp', `${Math.floor(Date.now() / 1000) + 3600}`);
    mockNavigate = require('react-router-dom').useNavigate;
    mockNavigate.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
    localStorage.clear();
  });

  test('renders ViolationGuest with all components', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    render(
      <MemoryRouter>
        <ViolationGuest />
      </MemoryRouter>
    );

    expect(screen.getByText(/violations/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/start date/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/end date/i)).toBeInTheDocument();
    expect(screen.getByText(/select student/i)).toBeInTheDocument();
  });

  test('filters violations based on date and student selection', async () => {
    const mockBeneficiaries = [{ beneficiary: [{ id: '1' }, { id: '2' }] }];
    const mockViolations = [
      {
        id: 1,
        student: { studentNumber: 'CT21-0073', lastName: 'Doe', firstName: 'John', middleName: 'A' },
        dateOfNotice: '2023-11-10',
        offense: { description: 'Littering', type: 'Minor' },
        warningNumber: 1,
        disciplinaryAction: 'Warning',
        csHours: 0,
      },
      {
        id: 2,
        student: { studentNumber: 'CT20-0022', lastName: 'Smith', firstName: 'Jane', middleName: 'B' },
        dateOfNotice: '2023-11-15',
        offense: { description: 'Theft', type: 'Major' },
        warningNumber: 2,
        disciplinaryAction: 'Suspension',
        csHours: 10,
      },
    ];

    axios.get
      .mockResolvedValueOnce({ data: mockBeneficiaries })
      .mockResolvedValueOnce({ data: mockViolations });

    render(
      <MemoryRouter>
        <ViolationGuest />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/CT21-0073/i)).toBeInTheDocument();
      expect(screen.getByText(/CT20-0022/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText(/start date/i), { target: { value: '2023-11-01' } });
    fireEvent.change(screen.getByPlaceholderText(/end date/i), { target: { value: '2023-11-12' } });

    await waitFor(() => {
      expect(screen.getByText(/CT21-0073/i)).toBeInTheDocument();
      expect(screen.queryByText(/CT20-0022/i)).not.toBeInTheDocument();
    });

    fireEvent.change(screen.getByText(/select student/i), { target: { value: 'CT21-0073' } });

    await waitFor(() => {
      expect(screen.getByText(/CT21-0073/i)).toBeInTheDocument();
      expect(screen.queryByText(/CT20-0022/i)).not.toBeInTheDocument();
    });
  });

  test('logout clears sessionStorage and redirects to login page', () => {
    render(
      <MemoryRouter>
        <ViolationGuest />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/logout/i));

    expect(sessionStorage.getItem('userId')).toBeNull();
    expect(sessionStorage.getItem('role')).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('handles unauthorized role redirection', () => {
    sessionStorage.setItem('role', 'ROLE_ROLE_STUDENT');

    render(
      <MemoryRouter>
        <ViolationGuest />
      </MemoryRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/student/violation');
  });

  test('redirects to login if token is expired', () => {
    localStorage.setItem('exp', `${Math.floor(Date.now() / 1000) - 3600}`); 

    render(
      <MemoryRouter>
        <ViolationGuest />
      </MemoryRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('handles error gracefully when fetching beneficiaries', async () => {
    axios.get.mockRejectedValueOnce(new Error('Error fetching beneficiaries'));

    render(
      <MemoryRouter>
        <ViolationGuest />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText(/CT21-0073/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/CT20-0022/i)).not.toBeInTheDocument();
    });
  });

  test('handles error gracefully when fetching violations', async () => {
    const mockBeneficiaries = [{ beneficiary: [{ id: '1' }] }];

    axios.get
      .mockResolvedValueOnce({ data: mockBeneficiaries }) 
      .mockRejectedValueOnce(new Error('Error fetching violations')); 

    render(
      <MemoryRouter>
        <ViolationGuest />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText(/CT21-0073/i)).not.toBeInTheDocument();
    });
  });
});
