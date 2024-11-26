import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import OtpForm from '../components/OtpForm'; // Adjust the import path if needed
import Axios from 'axios';
import { jest } from '@jest/globals';

jest.mock('axios');

describe('OtpForm Component', () => {

  test('renders OTP form with username and OTP inputs and verify button', () => {
    render(
      <MemoryRouter>
        <OtpForm />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/enter otp/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /verify otp/i })).toBeInTheDocument();
  });

  test('disables the submit button when form is empty or submitting', () => {
    render(
      <MemoryRouter>
        <OtpForm />
      </MemoryRouter>
    );

    const submitButton = screen.getByRole('button', { name: /verify otp/i });

    expect(submitButton).toBeEnabled();

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/enter otp/i), { target: { value: '123456' } });

    expect(submitButton).toBeEnabled();

    fireEvent.click(submitButton);

    expect(submitButton).toHaveTextContent('Submitting...');
    expect(submitButton).toBeDisabled();
  });

  test('shows success message on successful OTP verification', async () => {
    Axios.post.mockResolvedValue({ status: 200 });

    render(
      <MemoryRouter>
        <OtpForm />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/enter otp/i), { target: { value: '123456' } });

    const submitButton = screen.getByRole('button', { name: /verify otp/i });
    fireEvent.click(submitButton);

    await waitFor(() => expect(screen.getByText(/otp verified successfully/i)).toBeInTheDocument());
  });

  test('shows error message on failed OTP verification', async () => {
    Axios.post.mockRejectedValue({
      response: {
        data: { message: 'Invalid OTP' }
      }
    });

    render(
      <MemoryRouter>
        <OtpForm />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/enter otp/i), { target: { value: 'wrongotp' } });

    const submitButton = screen.getByRole('button', { name: /verify otp/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => expect(screen.getByText(/invalid otp/i)).toBeInTheDocument());
  });
});
