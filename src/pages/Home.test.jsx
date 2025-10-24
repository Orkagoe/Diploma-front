import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from './Home';
import axios from 'axios';

vi.mock('axios');

describe('Home', () => {
  it('renders search input and button', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>,
    );
    expect(screen.getByPlaceholderText('Enter IMDb ID (e.g., tt0111161)')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
  });

  it('shows error on empty input', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>,
    );
    fireEvent.click(screen.getByText('Search'));
    expect(screen.getByText('Please enter a valid IMDb ID')).toBeInTheDocument();
  });

  it('fetches and displays movie', async () => {
    axios.get.mockResolvedValue({
      data: {
        title: 'Test Movie',
        year: 1999,
        description: 'A test movie',
        posterUrl: 'test.jpg',
        imdbId: 'tt1234567',
      },
    });

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText('Enter IMDb ID (e.g., tt0111161)'), {
      target: { value: 'tt1234567' },
    });
    fireEvent.click(screen.getByText('Search'));

    expect(await screen.findByText('Test Movie')).toBeInTheDocument();
    expect(screen.getByText('Year: 1999')).toBeInTheDocument();
    expect(screen.getByText('Description: A test movie')).toBeInTheDocument();
  });
});