import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ViolationPageAdmin from '../pages/ViolationPageAdmin';
import axios from 'axios';

jest.mock('axios');

describe('ViolationPageAdmin', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'fake_token');
    localStorage.setItem('role', 'ROLE_ROLE_ADMIN');
    localStorage.setItem('exp', `${Math.floor(Date.now() / 1000) + 3600}`); 
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('renders violation page with all components', async () => {
    axios.get.mockResolvedValueOnce({ data: [] }); 

    render(
      <MemoryRouter>
        <ViolationPageAdmin />
      </MemoryRouter>
    );

    expect(screen.getByText(/violation/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search student/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/start date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/end date/i)).toBeInTheDocument();
    expect(screen.getByText(/add violation/i)).toBeInTheDocument();
    expect(screen.getByText(/create cs slip/i)).toBeInTheDocument();
  });

  test('filters violations by search input', async () => {
    const mockViolations = [
      {
        id: 1,
        student: { firstName: 'Kate', lastName: 'Amulong', middleName: 'Ann' },
        dateOfNotice: '2023-11-10',
        offense: { description: 'Minor offense' },
      },
      {
        id: 2,
        student: { firstName: 'Khloe', lastName: 'Amulong', middleName: 'Adele' },
        dateOfNotice: '2023-11-15',
        offense: { description: 'Major offense' },
      },
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

    fireEvent.change(screen.getByPlaceholderText(/search student/i), { target: { value: 'kate' } });

    await waitFor(() => {
      expect(screen.getByText(/kate amulong/i)).toBeInTheDocument();
      expect(screen.queryByText(/khloe amulong/i)).not.toBeInTheDocument();
    });
  });

  test('filters violations by date range', async () => {
    const mockViolations = [
      {
        id: 1,
        student: { firstName: 'Kate', lastName: 'Amulong', middleName: 'Ann' },
        dateOfNotice: '2023-11-10',
        offense: { description: 'Minor offense' },
      },
      {
        id: 2,
        student: { firstName: 'Khloe', lastName: 'Amulong', middleName: 'Adele' },
        dateOfNotice: '2023-11-15',
        offense: { description: 'Major offense' },
      },
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

    fireEvent.change(screen.getByLabelText(/start date/i), { target: { value: '2023-11-10' } });
    fireEvent.change(screen.getByLabelText(/end date/i), { target: { value: '2023-11-12' } });

    await waitFor(() => {
      expect(screen.getByText(/kate amulong/i)).toBeInTheDocument();
      expect(screen.queryByText(/khloe amulong/i)).not.toBeInTheDocument();
    });
  });

  test('opens and closes add violation modal', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    render(
      <MemoryRouter>
        <ViolationPageAdmin />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/add violation/i));

    expect(screen.getByText(/add violation/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/close/i));

    expect(screen.queryByText(/add violation/i)).not.toBeInTheDocument();
  });

  test('adds a new violation', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    axios.post.mockResolvedValueOnce({ data: { success: true } });

    render(
      <MemoryRouter>
        <ViolationPageAdmin />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/add violation/i));

    fireEvent.click(screen.getByText(/submit/i));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
    });
  });

  test('edits an existing violation', async () => {
    const mockViolations = [
      {
        id: 1,
        student: { firstName: 'Kate', lastName: 'Amulong', middleName: 'Ann' },
        dateOfNotice: '2023-11-10',
        offense: { description: 'Minor offense' },
      },
    ];
    axios.get.mockResolvedValueOnce({ data: mockViolations });
    axios.put.mockResolvedValueOnce({ data: { success: true } });

    render(
      <MemoryRouter>
        <ViolationPageAdmin />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/kate amulong/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /edit/i }));

    fireEvent.click(screen.getByText(/submit/i));

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledTimes(1);
    });
  });

  test('logout clears localStorage and redirects to login', () => {
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
