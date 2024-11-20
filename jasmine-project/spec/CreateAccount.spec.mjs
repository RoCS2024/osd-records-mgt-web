import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import Axios from 'axios';
import CreateAccount from '../pages/CreateAccount'; 
import { BrowserRouter } from 'react-router-dom'; 

jest.mock('axios');

describe('CreateAccount Component', () => {
  const mockNavigate = jest.fn();

  it('renders the form with correct fields', () => {
    render(
      <BrowserRouter>
        <CreateAccount />
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/user type/i)).toBeInTheDocument();
  });

  it('handles user input correctly', () => {
    render(
      <BrowserRouter>
        <CreateAccount />
      </BrowserRouter>
    );

    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const userTypeSelect = screen.getByLabelText(/user type/i);

    fireEvent.change(usernameInput, { target: { value: 'Kate Ann' } });
    fireEvent.change(passwordInput, { target: { value: 'Password@123' } });
    fireEvent.change(userTypeSelect, { target: { value: 'student' } });

    expect(usernameInput.value).toBe('Kate Ann');
    expect(passwordInput.value).toBe('Password@123');
    expect(userTypeSelect.value).toBe('student');
    
    const registerButton = screen.getByRole('button', { name: /register/i });
    fireEvent.click(registerButton);
  });

  it('shows an error when username is invalid', async () => {
    const submitButton = screen.getByRole('button', { name: /register/i });

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: '' } });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/please enter a valid username/i)).toBeInTheDocument();
  });

  it('toggles password visibility', () => {
    const passwordInput = screen.getByLabelText(/password/i);
    const eyeClosedIcon = screen.getByTestId('eye-closed-icon');

    expect(passwordInput.type).toBe('password');

    fireEvent.click(eyeClosedIcon);
    expect(passwordInput.type).toBe('text');

    fireEvent.click(eyeClosedIcon);
    expect(passwordInput.type).toBe('password');
  });

  it('shows modal when guest is selected as userType and registers guest', async () => {
    fireEvent.change(screen.getByLabelText(/user type/i), { target: { value: 'guest' } });

    Axios.post.mockResolvedValue({ status: 200 });

    const submitButton = screen.getByRole('button', { name: /register/i });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/add guest details/i)).toBeInTheDocument();

    const guestNameInput = screen.getByLabelText(/guest name/i);
    fireEvent.change(guestNameInput, { target: { value: 'Guest User' } });

    const guestSubmitButton = screen.getByRole('button', { name: /submit guest/i });
    fireEvent.click(guestSubmitButton);

    await waitFor(() => {
      expect(Axios.post).toHaveBeenCalledWith(expect.stringContaining('/Guest/addGuest'), expect.anything());
    });
  });

  it('shows an error for invalid email when userType is not guest', async () => {
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /register/i });

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/please enter a valid email address/i)).toBeInTheDocument();
  });

  it('submits form for valid student user', async () => {
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'Kate Ann' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'Password@123' } });
    fireEvent.change(screen.getByLabelText(/user type/i), { target: { value: 'student' } });
    fireEvent.change(screen.getByLabelText(/student number/i), { target: { value: 'CT21-0073' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'student@example.com' } });

    Axios.post.mockResolvedValue({ status: 200 });

    const submitButton = screen.getByRole('button', { name: /register/i });
    
    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(Axios.post).toHaveBeenCalledWith(
        'http://localhost:8080/user/register',
        expect.objectContaining({
          username: 'Kate Ann',
          password: 'Password@123',
          student: {
            studentNumber: 'CT21-0073',
            email: 'student@example.com'
          }
        })
      );
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/account/otp');
    });
  });
});
