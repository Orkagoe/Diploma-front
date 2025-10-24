import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AddMovie() {
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [imdbId, setImdbId] = useState('');
  const [genreId, setGenreId] = useState('');
  const [genres, setGenres] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get('http://localhost:8080/genres');
        setGenres(response.data);
      } catch (err) {
        setError('Failed to load genres');
      }
    };

    fetchGenres();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !year || !imdbId || !genreId) {
      setError('All fields are required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://localhost:8080/movies', {
        title,
        year: parseInt(year),
        imdbId,
        genreId: parseInt(genreId),
      });
      setSuccess(`Movie "${response.data.title}" added successfully`);
      setTitle('');
      setYear('');
      setImdbId('');
      setGenreId('');
    } catch (err) {
      setError('Failed to add movie');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-movie">
      <h1>Add a Movie</h1>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="year">Year</label>
          <input
            id="year"
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="imdbId">IMDb ID</label>
          <input
            id="imdbId"
            type="text"
            value={imdbId}
            onChange={(e) => setImdbId(e.target.value)}
            className="input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="genre">Genre</label>
          <select
            id="genre"
            value={genreId}
            onChange={(e) => setGenreId(e.target.value)}
            className="input"
          >
            <option value="">Select a genre</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="button" disabled={loading}>
          {loading ? 'Adding...' : 'Add Movie'}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
    </div>
  );
}