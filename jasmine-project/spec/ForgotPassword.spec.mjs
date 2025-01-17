import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ForgotPassword from '../pages/ForgotPassword';
import axios from 'axios';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('axios');

describe('ForgotPassword Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders forgot password page with Check Username button', () => {
    render(
      <Router>
        <ForgotPassword />
      </Router>
    );

    const checkUsernameButton = screen.getByRole('button', { name: /check username/i });
    expect(checkUsernameButton).toBeInTheDocument();
  });

  test('shows error message for invalid username input', () => {
    render(
      <Router>
        <ForgotPassword />
      </Router>
    );

    const usernameInput = screen.getByLabelText(/username/i);
    fireEvent.change(usernameInput, { target: { value: 'kateAnn!' } });

    const errorMessage = screen.getByText(/please enter a valid input/i);
    expect(errorMessage).toBeInTheDocument();
  });

  test('handles valid username and successfully requests OTP', async () => {
    axios.post.mockResolvedValue({ status: 200 });

    render(
      <Router>
        <ForgotPassword />
      </Router>
    );

    const usernameInput = screen.getByLabelText(/username/i);
    const checkUsernameButton = screen.getByRole('button', { name: /check username/i });

    fireEvent.change(usernameInput, { target: { value: 'KateAnn' } });
    fireEvent.click(checkUsernameButton);

    await waitFor(() => {
      expect(screen.getByLabelText(/otp/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/new password/i)).toBeInTheDocument();
    });
  });

  test('displays error when forgot password API request fails', async () => {
    axios.post.mockRejectedValue({ response: { data: { message: 'Request failed' } } });

    render(
      <Router>
        <ForgotPassword />
      </Router>
    );

    const usernameInput = screen.getByLabelText(/username/i);
    const checkUsernameButton = screen.getByRole('button', { name: /check username/i });

    fireEvent.change(usernameInput, { target: { value: 'KateAnn' } });
    fireEvent.click(checkUsernameButton);

    await waitFor(() => {
      expect(screen.getByText(/request failed/i)).toBeInTheDocument();
    });
  });

  test('submits password change form successfully', async () => {
    axios.post.mockResolvedValue({ status: 200 });

    render(
      <Router>
        <ForgotPassword />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'KateAnn' } });
    fireEvent.click(screen.getByRole('button', { name: /check username/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/otp/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/new password/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/otp/i), { target: { value: 'abcd1234' } });
    fireEvent.change(screen.getByLabelText(/new password/i), { target: { value: 'Password@1234' } });

    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.any(String), 
        { username: 'KateAnn', otp: 'abcd1234', password: 'Password@1234' }
      );
      expect(screen.queryByText(/request failed/i)).toBeNull();
    });
  });

  test('toggles password visibility when clicking the eye icon', () => {
    render(
      <Router>
        <ForgotPassword />
      </Router>
    );

    const passwordInput = screen.getByLabelText(/new password/i);
    const toggleIcon = screen.getByRole('img');

    expect(passwordInput.type).toBe('password');

    fireEvent.click(toggleIcon);
    expect(passwordInput.type).toBe('text');

    fireEvent.click(toggleIcon);
    expect(passwordInput.type).toBe('password');
  });

  test('disables submit button during form submission', async () => {
    axios.post.mockResolvedValue({ status: 200 });

    render(
      <Router>
        <ForgotPassword />
      </Router>
    );

    const usernameInput = screen.getByLabelText(/username/i);
    const checkUsernameButton = screen.getByRole('button', { name: /check username/i });

    fireEvent.change(usernameInput, { target: { value: 'KateAnn' } });
    fireEvent.click(checkUsernameButton);

    expect(checkUsernameButton).toBeDisabled();

    await waitFor(() => {
      expect(screen.getByLabelText(/otp/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/new password/i)).toBeInTheDocument();
    });
  });

  test('cancels password reset and navigates back to login page', () => {
    const mockNavigate = jest.fn();
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate,
    }));

    render(
      <Router>
        <ForgotPassword />
      </Router>
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
