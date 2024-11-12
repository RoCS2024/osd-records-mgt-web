import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';


test('renders login page', () => {
  render(<App />);

  const loginTextElements = screen.getAllByText(/login/i);
  expect(loginTextElements.length).toBeGreaterThan(0);
});

