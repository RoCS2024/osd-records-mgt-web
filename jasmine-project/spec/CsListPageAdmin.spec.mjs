import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CsListPageAdmin from './CsListPageAdmin';
import axios from 'axios';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('axios');

beforeEach(() => {
  localStorage.setItem('token', 'mockToken');
  localStorage.setItem('exp', (Date.now() / 1000 + 3600).toString());
  sessionStorage.setItem('role', 'ROLE_ROLE_ADMIN');
});

test('renders CsListPageAdmin and performs search and filter', async () => {
  const mockResponse = {
    data: [
      { 
        student: { firstName: 'Kate', lastName: 'Amulong', section: { clusterName: 'CETE' }, studentNumber: '1' }, 
        id: 1, 
        areaOfCommServ: { stationName: 'Station 1' }
      },
      { 
        student: { firstName: 'Khloe', lastName: 'Amulong', section: { clusterName: 'CBAM' }, studentNumber: '2' }, 
        id: 2, 
        areaOfCommServ: { stationName: 'Station 2' }
      },
    ],
  };
  axios.get.mockResolvedValue(mockResponse);

  render(
    <Router>
      <CsListPageAdmin />
    </Router>
  );

  expect(screen.getByText(/list of community service slips/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/filter/i)).toBeInTheDocument();

  const searchInput = screen.getByPlaceholderText(/search/i);
  fireEvent.change(searchInput, { target: { value: 'Kate' } });

  const filterDropdown = screen.getByLabelText(/filter/i);
  fireEvent.change(filterDropdown, { target: { value: 'CETE' } });

  await waitFor(() => {
    expect(screen.getByText(/kate amulong/i)).toBeInTheDocument();
    expect(screen.queryByText(/khloe amulong/i)).not.toBeInTheDocument(); 
  });

  expect(axios.get).toHaveBeenCalledTimes(1);
  expect(axios.get).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
    headers: expect.objectContaining({
      Authorization: 'Bearer mockToken',
    }),
  }));

  const studentName = screen.getByText(/kate amulong/i);
  expect(studentName).toBeInTheDocument();

  const studentRow = screen.getByText(/kate amulong/i).closest('tr');
  expect(studentRow).toBeInTheDocument();
  expect(studentRow).toHaveTextContent('1'); 
  expect(studentRow).toHaveTextContent('Station 1'); 
});
