import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import EmployeeCsSlip from './EmployeeCsSlip';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('axios');

jest.mock('../components/AddCsReportModal', () => {
  return ({ isOpen, onClose, onSubmit, csSlipId }) => {
    return isOpen ? (
      <div>
        <h2>Add CS Report Modal</h2>
        <button onClick={() => onSubmit(csSlipId, { dateOfCs: '2025-01-01', timeIn: '09:00', timeOut: '12:00', natureOfWork: 'Cleaning', status: 'Completed', remarks: 'No remarks' })}>
          Submit Report
        </button>
        <button onClick={onClose}>Close Modal</button>
      </div>
    ) : null;
  };
});

describe('EmployeeCsSlip', () => {
  const mockData = {
    id: 1,
    studentNumber: 'CT21-0073',
    name: 'Kate Amulong',
    section: 'Section A',
    head: 'Cluster Head',
    deduction: '2',
    area: 'Community Area',
    reason: 'Community Service Reason',
    reports: [
      {
        id: 1,
        dateOfCs: '2025-01-01',
        timeIn: '09:00',
        timeOut: '12:00',
        hoursCompleted: '3',
        natureOfWork: 'Cleaning',
        status: 'Completed',
        remarks: 'No remarks'
      }
    ]
  };

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: '10' }); 
    axios.post.mockResolvedValue({
      data: {
        id: 2,
        dateOfCs: '2025-01-02',
        timeIn: '09:00',
        timeOut: '12:00',
        hoursCompleted: '3',
        natureOfWork: 'Teaching',
        status: 'Completed',
        remarks: 'No remarks'
      }
    });
  });

  test('renders Community Service Slip page with correct student details', () => {
    render(
      <Router>
        <EmployeeCsSlip data={mockData} />
      </Router>
    );

    expect(screen.getByLabelText(/Student ID/)).toHaveValue(mockData.studentNumber);
    expect(screen.getByLabelText(/Full Name/)).toHaveValue(mockData.name);
    expect(screen.getByLabelText(/Section/)).toHaveValue(mockData.section);
    expect(screen.getByLabelText(/Cluster Head/)).toHaveValue(mockData.head);
    expect(screen.getByLabelText(/Hours Required/)).toHaveValue('10');
    expect(screen.getByLabelText(/Hours to deduct/)).toHaveValue(mockData.deduction);
    expect(screen.getByLabelText(/Area of Community Service/)).toHaveValue(mockData.area);
    expect(screen.getByLabelText(/Reason for Community Service/)).toHaveValue(mockData.reason);
  });

  test('displays the reports in the table', () => {
    render(
      <Router>
        <EmployeeCsSlip data={mockData} />
      </Router>
    );

    expect(screen.getByText(/2025-01-01/)).toBeInTheDocument();
    expect(screen.getByText(/09:00/)).toBeInTheDocument();
    expect(screen.getByText(/12:00/)).toBeInTheDocument();
    expect(screen.getByText(/3/)).toBeInTheDocument();
    expect(screen.getByText(/Cleaning/)).toBeInTheDocument();
    expect(screen.getByText(/Completed/)).toBeInTheDocument();
    expect(screen.getByText(/No remarks/)).toBeInTheDocument();
  });

  test('calculates total and remaining hours correctly', async () => {
    render(
      <Router>
        <EmployeeCsSlip data={mockData} />
      </Router>
    );

    await waitFor(() => screen.getByText(/Total Hours of Community Service Completed/));
    expect(screen.getByText(/Total Hours of Community Service Completed/)).toHaveTextContent('3');
    expect(screen.getByText(/Remaining Hours of Community Service/)).toHaveTextContent('7');
  });

  test('opens and closes the Add CS Report Modal', async () => {
    render(
      <Router>
        <EmployeeCsSlip data={mockData} />
      </Router>
    );

    fireEvent.click(screen.getByText(/ADD REPORT/));
    expect(screen.getByText(/Add CS Report Modal/)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Close Modal/));
    expect(screen.queryByText(/Add CS Report Modal/)).not.toBeInTheDocument();
  });

  test('adds a new CS report and updates the hours', async () => {
    render(
      <Router>
        <EmployeeCsSlip data={mockData} />
      </Router>
    );

    fireEvent.click(screen.getByText(/ADD REPORT/));

    fireEvent.click(screen.getByText(/Submit Report/));

    await waitFor(() => screen.getByText(/CS Report added successfully/));
    expect(screen.getByText(/CS Report added successfully/)).toBeInTheDocument();

    expect(screen.getByText(/Remaining Hours of Community Service/)).toHaveTextContent('4');
  });

  test('shows error message if hours exceed remaining hours', async () => {
    render(
      <Router>
        <EmployeeCsSlip data={mockData} />
      </Router>
    );

    fireEvent.click(screen.getByText(/ADD REPORT/));

    fireEvent.click(screen.getByText(/Submit Report/));

    await waitFor(() => screen.getByText(/Hours completed cannot exceed remaining hours/));
    expect(screen.getByText(/Hours completed cannot exceed remaining hours/)).toBeInTheDocument();
  });
});
