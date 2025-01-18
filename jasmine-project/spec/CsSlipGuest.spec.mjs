import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CsSlipGuest from './CsSlipGuest';
import axios from 'axios';
import '@testing-library/jest-dom/extend-expect';

jest.mock('axios');

test('renders community service slip page and dropdown', async () => {
  axios.get.mockResolvedValueOnce({
    data: [
      { id: 1, student: { studentNumber: 'CT21-0073', firstName: 'Kate', lastName: 'Amulong' }, reports: [] },
      { id: 2, student: { studentNumber: 'CT20-0022', firstName: 'Khloe', lastName: 'Amulong' }, reports: [] }
    ]
  });

  render(
    <MemoryRouter>
      <CsSlipGuest />
    </MemoryRouter>
  );

  expect(screen.getByText(/list of community service slip/i)).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByText('CT21-0073')).toBeInTheDocument();
    expect(screen.getByText('CT20-0022')).toBeInTheDocument();
  });

  const dropdown = screen.getByRole('combobox');
  fireEvent.change(dropdown, { target: { value: 'CT21-0073' } });

  await waitFor(() => {
    expect(screen.getByText('Kate Amulong')).toBeInTheDocument();
    expect(screen.queryByText('Khloe Amulong')).not.toBeInTheDocument();
  });
});

test('displays error message if API request fails', async () => {
  axios.get.mockRejectedValueOnce(new Error('Error fetching data'));

  render(
    <MemoryRouter>
      <CsSlipGuest />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(console.error).toHaveBeenCalledWith('Error fetching guest:', expect.any(Error));
  });
});

test('checks that the logout button works', () => {
  const navigate = jest.fn();

  render(
    <MemoryRouter>
      <CsSlipGuest />
    </MemoryRouter>
  );

  const logoutButton = screen.getByText(/logout/i);
  fireEvent.click(logoutButton);

  expect(navigate).toHaveBeenCalledWith('/login');
});

test('ensures the table is populated with community service slips', async () => {
  axios.get.mockResolvedValueOnce({
    data: [
      { id: 1, student: { studentNumber: 'CT21-0073', firstName: 'Kate', lastName: 'Amulong' }, reports: [] },
      { id: 2, student: { studentNumber: 'CT20-0022', firstName: 'Khloe', lastName: 'Amulong' }, reports: [] }
    ]
  });

  render(
    <MemoryRouter>
      <CsSlipGuest />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByText('Kate Amulong')).toBeInTheDocument();
    expect(screen.getByText('Khloe Amulong')).toBeInTheDocument();
  });

  expect(screen.getByText('Kate Amulong')).toBeInTheDocument();
  expect(screen.getByText('Khloe Amulong')).toBeInTheDocument();
});

test('checks if the row click toggles the selected slip', async () => {
  axios.get.mockResolvedValueOnce({
    data: [
      { id: 1, student: { studentNumber: 'CT21-0073', firstName: 'Kate', lastName: 'Amulong' }, reports: [] },
      { id: 2, student: { studentNumber: 'CT20-0022', firstName: 'Khloe', lastName: 'Amulong' }, reports: [] }
    ]
  });

  render(
    <MemoryRouter>
      <CsSlipGuest />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByText('Kate Amulong')).toBeInTheDocument();
  });

  const row = screen.getByText('Kate Amulong').closest('tr');
  fireEvent.click(row);

  expect(screen.getByText('Kate Amulong')).toHaveClass('selected');
});

test('ensures the total hours completed are calculated correctly', async () => {
  axios.get.mockResolvedValueOnce({
    data: [
      {
        id: 1,
        student: { studentNumber: 'CT21-0073', firstName: 'Kate', lastName: 'Amulong' },
        reports: [
          { id: 1, hoursCompleted: 5 },
          { id: 2, hoursCompleted: 3 }
        ]
      }
    ]
  });

  render(
    <MemoryRouter>
      <CsSlipGuest />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByText('Kate Amulong')).toBeInTheDocument();
  });

  const row = screen.getByText('Kate Amulong').closest('tr');
  fireEvent.click(row);

  expect(screen.getByText('Total Hours Completed: 8')).toBeInTheDocument();
});

test('ensures the dropdown shows all students when no student is selected', async () => {
  axios.get.mockResolvedValueOnce({
    data: [
      { id: 1, student: { studentNumber: 'CT21-0073', firstName: 'Kate', lastName: 'Amulong' }, reports: [] },
      { id: 2, student: { studentNumber: 'CT20-0022', firstName: 'Khloe', lastName: 'Amulong' }, reports: [] }
    ]
  });

  render(
    <MemoryRouter>
      <CsSlipGuest />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByText('CT21-0073')).toBeInTheDocument();
    expect(screen.getByText('CT20-0022')).toBeInTheDocument();
  });

  const dropdown = screen.getByRole('combobox');
  fireEvent.change(dropdown, { target: { value: '' } });

  await waitFor(() => {
    expect(screen.getByText('Kate Amulong')).toBeInTheDocument();
    expect(screen.getByText('Khloe Amulong')).toBeInTheDocument();
  });
});

test('checks if selecting a student from dropdown filters the table', async () => {
  axios.get.mockResolvedValueOnce({
    data: [
      { id: 1, student: { studentNumber: 'CT21-0073', firstName: 'Kate', lastName: 'Amulong' }, reports: [] },
      { id: 2, student: { studentNumber: 'CT20-0022', firstName: 'Khloe', lastName: 'Amulong' }, reports: [] }
    ]
  });

  render(
    <MemoryRouter>
      <CsSlipGuest />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByText('Kate Amulong')).toBeInTheDocument();
    expect(screen.getByText('Khloe Amulong')).toBeInTheDocument();
  });

  const dropdown = screen.getByRole('combobox');
  fireEvent.change(dropdown, { target: { value: 'CT20-0022' } });

  await waitFor(() => {
    expect(screen.queryByText('Kate Amulong')).not.toBeInTheDocument();
    expect(screen.getByText('Khloe Amulong')).toBeInTheDocument();
  });
});
