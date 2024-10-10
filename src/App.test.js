import { render, screen } from '@testing-library/react';
import App from './App';
import { act } from 'react';

test('renders login page', () => {
  act(() => {
    render(<App />);
  });
  const loginTextElements = screen.getAllByText(/login/i);
  expect(loginTextElements.length).toBeGreaterThan(0);
});
