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

  test('renders forgot password page with check username button', () => {
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
    fireEvent.change(usernameInput, { target: { value: 'kateAnn' } });

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

    fireEvent.change(usernameInput, { target: { value: 'Kate Ann' } });
    fireEvent.click(checkUsernameButton);

    await waitFor(() => {
      expect(screen.getByLabelText(/otp/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });
  });

  test('displays error when forgot password API request fails', async () => {
    axios.post.mockRejectedValue(new Error('Request Failed'));

    render(
      <Router>
        <ForgotPassword />
      </Router>
    );

    const usernameInput = screen.getByLabelText(/username/i);
    const checkUsernameButton = screen.getByRole('button', { name: /check username/i });

    fireEvent.change(usernameInput, { target: { value: 'validUser123' } });
    fireEvent.click(checkUsernameButton);

    await waitFor(() => {
      expect(screen.getByText(/request failed/i)).toBeInTheDocument();
    });
  });

  test('displays OTP and password fields after valid username', async () => {
    axios.post.mockResolvedValue({ status: 200 }); 

    render(
      <Router>
        <ForgotPassword />
      </Router>
    );

    const usernameInput = screen.getByLabelText(/username/i);
    fireEvent.change(usernameInput, { target: { value: 'Kate Ann' } });
    fireEvent.click(screen.getByRole('button', { name: /check username/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/otp/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });
  });

  test('submits password change form successfully', async () => {
    axios.post.mockResolvedValue({ status: 200 }); 

    render(
      <Router>
        <ForgotPassword />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'Kate Ann' } });
    fireEvent.click(screen.getByRole('button', { name: /check username/i }));

    fireEvent.change(screen.getByLabelText(/otp/i), { target: { value: 'abcd1234' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'Password@123' } });

    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:8080/user/verify-forgot-password',
        { username: 'Kate Ann', otp: 'abcd1234', password: 'Password@123' }
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

    const passwordInput = screen.getByLabelText(/password/i);
    const toggleIcon = screen.getByRole('img'); 

    expect(passwordInput.type).toBe('password');

    fireEvent.click(toggleIcon);
    expect(passwordInput.type).toBe('text');

    fireEvent.click(toggleIcon);
    expect(passwordInput.type).toBe('password');
  });

});
