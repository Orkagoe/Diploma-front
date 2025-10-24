import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Genres() {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get('http://localhost:8080/genres');
        setGenres(response.data);
      } catch (err) {
        setError('Failed to load genres');
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  if (loading) return <p>Loading genres...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="genres">
      <h1>Genres</h1>
      {genres.length === 0 ? (
        <p>No genres available.</p>
      ) : (
        <ul className="genre-list">
          {genres.map((genre) => (
            <li key={genre.id} className="genre-item">
              {genre.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}