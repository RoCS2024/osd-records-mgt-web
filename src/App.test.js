import { render, screen } from '@testing-library/react';
import App from './App';
import { act } from 'react';

test('renders learn react link', () => {
  act(() => {
    render(<App />);
  });
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
