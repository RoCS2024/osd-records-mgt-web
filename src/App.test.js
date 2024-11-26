import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';


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
