import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import CsSlipPageAdmin from './CsSlipPageAdmin';
import '@testing-library/jest-dom/extend-expect';

jest.mock('axios');

describe('CsSlipPageAdmin', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true,
    });

    Object.defineProperty(window, 'sessionStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true,
    });

    localStorage.getItem.mockImplementation((key) => {
      if (key === 'token') return 'mock-token';
      if (key === 'exp') return '0';
    });

    sessionStorage.getItem.mockImplementation((key) => {
      if (key === 'role') return 'ROLE_ROLE_ADMIN';
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders CsSlipPageAdmin with form fields and submit button', async () => {
    axios.get.mockResolvedValueOnce({
      data: [{ id: 1, stationName: 'Library' }],
    }).mockResolvedValueOnce({
      data: [{ id: 1, studentNumber: 'CT21-0073', fullName: 'John Doe' }],
    });

    render(
      <MemoryRouter>
        <CsSlipPageAdmin />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/student id:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/full name:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/section:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cluster head:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/hours to deduct:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/area of community service:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/reason for community service:/i)).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /create/i })).toBeDisabled();

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(2);
    });
  });

  test('displays validation error for invalid Student ID', async () => {
    render(
      <MemoryRouter>
        <CsSlipPageAdmin />
      </MemoryRouter>
    );

    const studentIdInput = screen.getByLabelText(/student id:/i);
    fireEvent.change(studentIdInput, { target: { value: 'INVALID_ID' } });

    expect(await screen.findByText(/please try again/i)).toBeInTheDocument();
  });

  test('enables Create button when form is valid', async () => {
    axios.get.mockResolvedValueOnce({
      data: [{ id: 1, stationName: 'Station 1' }],
    }).mockResolvedValueOnce({
      data: [{ id: 1, studentNumber: 'CT21-0073', fullName: 'John Doe' }],
    });

    render(
      <MemoryRouter>
        <CsSlipPageAdmin />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/student id:/i), { target: { value: 'CT21-0073' } });
    fireEvent.change(screen.getByLabelText(/hours to deduct:/i), { target: { value: '4' } });
    fireEvent.change(screen.getByLabelText(/area of community service:/i), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText(/reason for community service:/i), { target: { value: 'Valid Reason' } });

    expect(await screen.findByRole('button', { name: /create/i })).not.toBeDisabled();
  });

  test('submits the form successfully', async () => {
    axios.get.mockResolvedValueOnce({
      data: [{ id: 1, stationName: 'Station 1' }],
    }).mockResolvedValueOnce({
      data: [{ id: 1, studentNumber: 'CT21-0073', fullName: 'John Doe' }],
    });

    axios.post.mockResolvedValueOnce({
      data: { message: 'CS slip created successfully!' },
    });

    render(
      <MemoryRouter>
        <CsSlipPageAdmin />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/student id:/i), { target: { value: 'CT21-0073' } });
    fireEvent.change(screen.getByLabelText(/hours to deduct:/i), { target: { value: '4' } });
    fireEvent.change(screen.getByLabelText(/area of community service:/i), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText(/reason for community service:/i), { target: { value: 'Valid Reason' } });

    fireEvent.click(screen.getByRole('button', { name: /create/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(screen.getByText(/cs slip created successfully!/i)).toBeInTheDocument();
    });
  });

  test('displays error message if form submission fails', async () => {
    axios.get.mockResolvedValueOnce({
      data: [{ id: 1, stationName: 'Station 1' }],
    }).mockResolvedValueOnce({
      data: [{ id: 1, studentNumber: 'CT21-0073', fullName: 'John Doe' }],
    });

    axios.post.mockRejectedValueOnce(new Error('Submission failed'));

    render(
      <MemoryRouter>
        <CsSlipPageAdmin />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/student id:/i), { target: { value: 'CT21-0073' } });
    fireEvent.change(screen.getByLabelText(/hours to deduct:/i), { target: { value: '4' } });
    fireEvent.change(screen.getByLabelText(/area of community service:/i), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText(/reason for community service:/i), { target: { value: 'Valid Reason' } });

    fireEvent.click(screen.getByRole('button', { name: /create/i }));

    await waitFor(() => {
      expect(screen.getByText(/submission failed/i)).toBeInTheDocument();
    });
  });
});
