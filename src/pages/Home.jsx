import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [imdbId, setImdbId] = useState('');
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!imdbId.trim()) {
      setError('Please enter a valid IMDb ID');
      return;
    }

    setLoading(true);
    setError('');
    setMovie(null);

    try {
      const response = await axios.get(`http://localhost:8080/api/movies/${imdbId}`);
      setMovie(response.data);
    } catch (err) {
      setError('Failed to fetch movie. Please check the IMDb ID.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">
      <h1>Search for a Movie</h1>
      <div className="search-form">
        <input
          type="text"
          value={imdbId}
          onChange={(e) => setImdbId(e.target.value)}
          placeholder="Enter IMDb ID (e.g., tt0111161)"
          className="input"
        />
        <button onClick={handleSearch} className="button" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>
      {error && <p className="error">{error}</p>}
      {movie && (
        <div className="movie-details">
          <h2>{movie.title}</h2>
          <p><strong>Year:</strong> {movie.year}</p>
          <p><strong>Description:</strong> {movie.description}</p>
          {movie.posterUrl && (
            <img src={movie.posterUrl} alt={movie.title} className="poster" />
          )}
        </div>
      )}
    </div>
  );
}