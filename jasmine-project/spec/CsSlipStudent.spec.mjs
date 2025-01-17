import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import CsSlipStudent from '../CsSlipStudent';
import { useNavigate } from 'react-router-dom';

jest.mock('axios');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('CsSlipStudent Component', () => {
  let navigate;

  beforeEach(() => {
    navigate = useNavigate();
    sessionStorage.setItem('userId', '1');
    sessionStorage.setItem('role', 'ROLE_ROLE_STUDENT');
    localStorage.setItem('token', 'fakeToken');
    localStorage.setItem('exp', Date.now() + 100000);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(
      <MemoryRouter>
        <CsSlipStudent />
      </MemoryRouter>
    );

    expect(screen.getByText('LIST OF COMMUNITY SERVICE SLIP')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Logout' })).toBeInTheDocument();
  });

  it('loads and displays community service slips', async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        {
          student: { id: '1' },
          reports: [{ hoursCompleted: 2 }, { hoursCompleted: 3 }],
        },
      ],
    });

    render(
      <MemoryRouter>
        <CsSlipStudent />
      </MemoryRouter>
    );

    await act(async () => {
      expect(axios.get).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByText('LIST OF COMMUNITY SERVICE SLIP')).toBeInTheDocument();
    expect(screen.getByText('Total Hours Completed: 5')).toBeInTheDocument();
  });

  it('navigates to login if session expires', () => {
    localStorage.setItem('exp', Date.now() - 100000);

    render(
      <MemoryRouter>
        <CsSlipStudent />
      </MemoryRouter>
    );

    expect(navigate).toHaveBeenCalledWith('/login');
  });

  it('navigates based on user role', () => {
    sessionStorage.setItem('role', 'ROLE_ROLE_EMPLOYEE');
    render(
      <MemoryRouter>
        <CsSlipStudent />
      </MemoryRouter>
    );

    expect(navigate).toHaveBeenCalledWith('/employee/cs-list');
  });

  it('fetches total hours required', async () => {
    axios.get.mockResolvedValueOnce({ data: 10 });

    render(
      <MemoryRouter>
        <CsSlipStudent />
      </MemoryRouter>
    );

    await act(async () => {
      expect(axios.get).toHaveBeenCalledTimes(2);
    });

    expect(screen.getByText('Total Hours Required: 10')).toBeInTheDocument();
  });

  it('handles row click to toggle selected slip', async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        {
          student: { id: '1' },
          reports: [{ hoursCompleted: 2 }, { hoursCompleted: 3 }],
        },
      ],
    });

    render(
      <MemoryRouter>
        <CsSlipStudent />
      </MemoryRouter>
    );

    const row = screen.getByText('2');
    fireEvent.click(row);

    expect(screen.getByText('Total Hours Completed: 5')).toBeInTheDocument();

    fireEvent.click(row);
    expect(screen.queryByText('Total Hours Completed: 5')).not.toBeInTheDocument();
  });

  it('handles logout', () => {
    render(
      <MemoryRouter>
        <CsSlipStudent />
      </MemoryRouter>
    );

    const logoutButton = screen.getByRole('button', { name: 'Logout' });
    fireEvent.click(logoutButton);

    expect(localStorage.getItem('token')).toBe('');
    expect(sessionStorage.getItem('role')).toBe('');
    expect(localStorage.getItem('exp')).toBe('');
    expect(navigate).toHaveBeenCalledWith('/login');
  });

  it('displays error if fetching CS Slips fails', async () => {
    axios.get.mockRejectedValueOnce(new Error('Failed to fetch CS Slips'));

    render(
      <MemoryRouter>
        <CsSlipStudent />
      </MemoryRouter>
    );

    await act(async () => {
      expect(axios.get).toHaveBeenCalledTimes(1);
    });

    expect(screen.queryByText('LIST OF COMMUNITY SERVICE SLIP')).not.toBeInTheDocument();
    expect(screen.getByText('Error fetching community service slips.')).toBeInTheDocument();
  });

  it('displays error if fetching total hours required fails', async () => {
    axios.get.mockRejectedValueOnce(new Error('Failed to fetch total hours'));

    render(
      <MemoryRouter>
        <CsSlipStudent />
      </MemoryRouter>
    );

    await act(async () => {
      expect(axios.get).toHaveBeenCalledTimes(2);
    });

    expect(screen.getByText('Error getting total hours required.')).toBeInTheDocument();
  });
});
