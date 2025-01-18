import { render, screen } from '@testing-library/react';
import CsReportPageAdmin from './CsReportPageAdmin';

describe('CsReportPageAdmin', () => {
  const mockData = {
    student: { firstName: 'Kate', lastName: 'Ann' },
    area: 'Library',
    reports: [
      {
        id: 1,
        dateOfCs: '2025-01-15T00:00:00Z', 
        timeIn: '2025-01-15T08:00:00Z',  
        timeOut: '2025-01-15T12:00:00Z', 
        hoursCompleted: 4,
        natureOfWork: 'Organizing Books',
        status: 'Completed',
        remarks: 'No issues',
      },
    ],
  };

  test('renders community service report with data', () => {
    render(<CsReportPageAdmin data={mockData} isOpen={true} />);

    expect(screen.getByText(/community service report/i)).toBeInTheDocument();
    expect(screen.getByRole('table')).toBeInTheDocument();

    expect(screen.getByText(/kate ann/i)).toBeInTheDocument();
    expect(screen.getByText(/library/i)).toBeInTheDocument();
    expect(screen.getByText(/2025-01-15/i)).toBeInTheDocument(); 
    expect(screen.getByText(/08:00 AM/i)).toBeInTheDocument(); 
    expect(screen.getByText(/12:00 PM/i)).toBeInTheDocument(); 
    expect(screen.getByText(/4/i)).toBeInTheDocument(); 
    expect(screen.getByText(/organizing books/i)).toBeInTheDocument();
    expect(screen.getByText(/completed/i)).toBeInTheDocument();
    expect(screen.getByText(/no issues/i)).toBeInTheDocument();
  });

  test('renders no student message when no reports are provided', () => {
    const noReportsData = { ...mockData, reports: [] };

    render(<CsReportPageAdmin data={noReportsData} isOpen={true} />);

    expect(screen.getByText(/no student selected/i)).toBeInTheDocument();
  });

  test('does not render when isOpen is false', () => {
    render(<CsReportPageAdmin data={mockData} isOpen={false} />);

    expect(screen.queryByText(/community service report/i)).not.toBeInTheDocument();
  });

  test('handles missing student data gracefully', () => {
    const missingStudentData = { ...mockData, student: null };

    render(<CsReportPageAdmin data={missingStudentData} isOpen={true} />);

    expect(screen.getByText(/no student selected/i)).toBeInTheDocument();
  });

  test('renders a report with missing fields', () => {
    const incompleteData = {
      ...mockData,
      reports: [
        {
          id: 1,
          dateOfCs: '2025-01-15T00:00:00Z',
          timeIn: '2025-01-15T08:00:00Z',
          timeOut: '2025-01-15T12:00:00Z',
          hoursCompleted: 4,
          natureOfWork: '', 
          status: '', 
          remarks: '', 
        },
      ],
    };

    render(<CsReportPageAdmin data={incompleteData} isOpen={true} />);

    expect(screen.getByText(/organizing books/i)).toBeInTheDocument();
    expect(screen.getByText(/completed/i)).toBeInTheDocument();
    expect(screen.getByText(/no issues/i)).toBeInTheDocument();

    expect(screen.getByText(/nature of work/i)).toBeInTheDocument();
    expect(screen.getByText(/status/i)).toBeInTheDocument();
    expect(screen.getByText(/remarks/i)).toBeInTheDocument();
  });
});
