import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import ForgotPassword from './pages/ForgotPassword';
import ViolationStudent from './pages/ViolationStudent';
import ViolationPageAdmin from './pages/ViolationPageAdmin';
import ViolationGuest from './pages/ViolationGuest';
import CsSlipPageAdmin from './pages/CsSlipPageAdmin';
import CsReportPageAdmin from './pages/CsReportPageAdmin';
import CsListPageAdmin from './pages/CsListPageAdmin';
import CsSlipGuest from './pages/CsSlipGuest';
import EmployeeCsList from './pages/EmployeeCsList';
import EmployeeCsSlip from './pages/EmployeeCsSlip';
import OffensePageAdmin from './pages/OffensePageAdmin';
import OTP from './pages/OTP';
import CreateAccount from './pages/CreateAccount';
import CsSlipStudent from './pages/CsSlipStudent';

test('renders login page', () => {
  render(<App />);

  const loginTextElements = screen.getAllByText(/login/i);
  expect(loginTextElements.length).toBeGreaterThan(0);
});

test('renders create account page', () => {
  render(
    <MemoryRouter>
      <CreateAccount />
    </MemoryRouter>
  );

  const loginLink = screen.getByRole('link', { name: /login here/i });
  expect(loginLink).toBeInTheDocument();
});

test('renders OTP  page', () => {
  render(
    <MemoryRouter>
      <OTP />
    </MemoryRouter>
  );

  const verifyOtpButton = screen.getByRole('button', { name: /verify otp/i });
  expect(verifyOtpButton).toBeInTheDocument();
});

test('renders forgot password page', () => {
  render(
    <MemoryRouter>
      <ForgotPassword />
    </MemoryRouter>
  );

  const checkUsernameButton = screen.getByRole('button', { name: /check username/i });
  expect(checkUsernameButton).toBeInTheDocument();
});

test('renders violation page student', async () => {
  render(
    <MemoryRouter>
      <ViolationStudent />
    </MemoryRouter>
  );

  const header = screen.getByText(/my violations/i);
  expect(header).toBeInTheDocument();
});

test('renders violation page admin', () => {
  render(
    <MemoryRouter>
      <ViolationPageAdmin />
    </MemoryRouter>
  );

  const addViolationButton = screen.getByRole('button', { name: /add violation/i });
  expect(addViolationButton).toBeInTheDocument();
});


test('renders violation page guest', () => {
  render(
    <MemoryRouter>
      <ViolationGuest />
    </MemoryRouter>
  );

  const violationsHeading = screen.getByText(/violations/i);
  expect(violationsHeading).toBeInTheDocument();
});


test('renders CsSlipPageAdmin', () => {
  render(
    <MemoryRouter>
      <CsSlipPageAdmin />
    </MemoryRouter>
  );

  const createButton = screen.getByRole('button', { name: /create/i });
  expect(createButton).toBeDisabled();
});

test('renders CsReportPageAdmin', () => {
  render(
    <CsReportPageAdmin data={{ reports: [] }} isOpen={true} />
  );

  const reportHeading = screen.getByText(/community service report/i);
  expect(reportHeading).toBeInTheDocument();
});

test('renders CsListPageAdmin', async () => {
  render(
    <MemoryRouter>
      <CsListPageAdmin />
    </MemoryRouter>
  );

  const headingElement = await screen.findByRole('heading', { name: /list of community service slip/i });

  expect(headingElement).toBeInTheDocument();
});

test('renders CsSlipGuest', () => {
  render(
    <MemoryRouter>
      <CsSlipGuest />
    </MemoryRouter>
  );

  expect(screen.getByText(/list of community service slip/i)).toBeInTheDocument();
});

test('renders CsSlipStudent', () => {
  render(
    <MemoryRouter>
      <CsSlipStudent />
    </MemoryRouter>
  );

  expect(screen.getByText('LIST OF COMMUNITY SERVICE SLIP')).toBeInTheDocument();
});

test('renders employee community service list page', async () => {
  render(
    <MemoryRouter>
      <EmployeeCsList />
    </MemoryRouter>
  );

  const heading = screen.getByText('Community Service Slips');
  expect(heading).toBeInTheDocument();
});

test('renders the employee community service slip page', () => {
  const mockData = {
    studentNumber: 'CT21-0073',
    name: 'Kate Ann Amulong',
    section: '1',
    head: 'Mr. Smith',
    area: 'Canteen',
    reason: 'Community Service',
    deduction: 0,
    totalHours: 40,
    reports: [],
  };

  render(
    <MemoryRouter>
      <EmployeeCsSlip data={mockData} />
    </MemoryRouter>
  );

  const studentIdInput = screen.getByDisplayValue('CT21-0073');
  expect(studentIdInput).toBeInTheDocument();
});

test('renders offense table admin', async () => {
  render(
    <MemoryRouter>
      <OffensePageAdmin />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByRole('heading', { name: /OFFENSE/i })).toBeInTheDocument();
  });

  await waitFor(() => {
    expect(screen.getByRole('button', { name: /add offense/i })).toBeInTheDocument();
  });
});
