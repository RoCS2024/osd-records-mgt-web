import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import OffensePageAdmin from './pages/OffenseTableAdmin';
import ForgotPassword from './pages/ForgotPassword';
import ViolationPageAdmin from './pages/ViolationTableAdmin';
import OtpForm from './pages/OTP';


test('renders login page', () => {
  render(<App />);

  const loginTextElements = screen.getAllByText(/login/i);
  expect(loginTextElements.length).toBeGreaterThan(0);
});

test('renders create account page', () => {
  render(<App />); 

  const createAccountTextElements = screen.getAllByText(/click here/i);
  expect(createAccountTextElements.length).toBeGreaterThan(0);

});

test('renders OTP page', () => {
  render(
    <MemoryRouter>
      <OtpForm />
    </MemoryRouter>
  );

  const verifyOtpButton = screen.getByRole('button', { name: /verify otp/i });
  expect(verifyOtpButton).toBeInTheDocument();
});

