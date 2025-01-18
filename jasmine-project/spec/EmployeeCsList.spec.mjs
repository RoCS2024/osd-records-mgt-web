import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import EmployeeCsList from '../EmployeeCsList';
import axios from 'axios';

jest.mock('axios');
jest.mock('../hooks/useAuth', () => ({
  useAuth: jest.fn(() => ({
    handleLogout: jest.fn(),
  })),
}));

jest.mock('../hooks/useEmployeeCsData', () => ({
  useEmployeeCsData: jest.fn(() => ({
    csSlips: [
      {
        id: 1,
        student: { studentNumber: 'CT21-0073', firstName: 'Kate', lastName: 'Amulong' },
        areaOfCommServ: { stationName: 'Station 1' },
      },
      {
        id: 2,
        student: { studentNumber: 'CT20-0022', firstName: 'Khloe', lastName: 'Amulong' },
        areaOfCommServ: { stationName: 'Station 2' },
      },
    ],
  })),
}));

describe('EmployeeCsList Component', () => {
  it('renders Community Service Slips page with the correct heading and data', async () => {
    render(
      <MemoryRouter>
        <EmployeeCsList />
      </MemoryRouter>
    );

    const heading = screen.getByText('Community Service Slips');
    expect(heading).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Kate Amulong')).toBeInTheDocument();
      expect(screen.getByText('Khloe Amulong')).toBeInTheDocument();
    });

    expect(screen.getByText('CT21-0073')).toBeInTheDocument();
    expect(screen.getByText('CT20-0022')).toBeInTheDocument();
    expect(screen.getByText('Station 1')).toBeInTheDocument();
    expect(screen.getByText('Station 2')).toBeInTheDocument();
  });

  it('handles API error correctly', async () => {
    axios.get.mockRejectedValueOnce(new Error('Failed to fetch data'));

    render(
      <MemoryRouter>
        <EmployeeCsList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('Community Service Slips')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Error fetching data')).toBeInTheDocument();
  });

  it('renders the navbar and handles logout correctly', async () => {
    const { handleLogout } = require('../hooks/useAuth');

    render(
      <MemoryRouter>
        <EmployeeCsList />
      </MemoryRouter>
    );

    expect(screen.getByAltText('Logo')).toBeInTheDocument();
    expect(screen.getByText('Reports')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();

    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    expect(handleLogout).toHaveBeenCalled();
  });

  it('selects a row and displays the slip details', async () => {
    render(
      <MemoryRouter>
        <EmployeeCsList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Kate Amulong')).toBeInTheDocument();
    });

    const row = screen.getByText('CT21-0073');
    fireEvent.click(row);

    expect(screen.getByText('Kate Amulong')).toBeInTheDocument();
    expect(screen.getByText('Station 1')).toBeInTheDocument();
    expect(screen.getByText('Reason: N/A')).toBeInTheDocument(); 
  });
});
