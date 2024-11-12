import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import Login from '../login.jsx';

jest.mock('axios');

describe('Login Component', () => {
  it('renders correctly', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  it('Handles user input correctly', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const usernameInput = screen.getByLabelText('Username');
    const passwordInput = screen.getByLabelText('Password');

    fireEvent.change(usernameInput, { target: { value: 'kateann' } });
    fireEvent.change(passwordInput, { target: { value: 'password@123' } });

    expect(usernameInput.value).toBe('kateann');
    expect(passwordInput.value).toBe('password@123');
    
    const loginButton = screen.getByRole('button', { name: 'Login' });
    fireEvent.click(loginButton);
  });

  it('Handles incorrect password', async () => {
    axios.post.mockRejectedValue({
      response: {
        data: { message: 'Wrong username or password. Please try again.' }
      }
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const usernameInput = screen.getByLabelText('Username');
    const passwordInput = screen.getByLabelText('Password');

    fireEvent.change(usernameInput, { target: { value: 'kateann' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });

    const loginButton = screen.getByRole('button', { name: 'Login' });

    await act(async () => {
      fireEvent.click(loginButton);
    });

    expect(screen.getByText('Wrong username or password. Please try again.')).toBeInTheDocument();
  });

  it('Shows error for wrong username', async () => {
    axios.post.mockRejectedValue({
      response: {
        data: { message: 'Wrong username or password. Please try again.' }
      }
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const usernameInput = screen.getByLabelText('Username');
    fireEvent.change(usernameInput, { target: { value: 'wrongusername' } });

    const loginButton = screen.getByRole('button', { name: 'Login' });

    await act(async () => {
      fireEvent.click(loginButton);
    });

    expect(screen.getByText('Wrong username or password. Please try again.')).toBeInTheDocument();
  });
});
