import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import OtpForm from './pages/OTP';
import ForgotPassword from './pages/ForgotPassword';


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

test('renders OTP form page', () => {
  render(
    <MemoryRouter>
      <OtpForm />
    </MemoryRouter>
  );

  const verifyOtpButton = screen.getByRole('button', { name: /verify otp/i });
  expect(verifyOtpButton).toBeInTheDocument();
});

test('renders forgot password page with check username button', () => {
  render(
    <MemoryRouter>
      <ForgotPassword />
    </MemoryRouter>
  );

  const checkUsernameButton = screen.getByRole('button', { name: /check username/i });
  expect(checkUsernameButton).toBeInTheDocument();
});
