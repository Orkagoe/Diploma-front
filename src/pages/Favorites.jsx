// src/pages/Favorites.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMovies } from '../utils/api';
import '../styles/pages/Favorites.css';

const Favorites = () => {
  const navigate = useNavigate();
  const userId = 'user1'; // Пример ID пользователя, можно заменить на реальный
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem(`favorites_${userId}`);
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const allMovies = await getMovies();
        const favoriteMovies = allMovies.filter(movie =>
          favorites.includes(movie.id)
        );
        setMovies(favoriteMovies);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [favorites]);

  const handleRemoveFromFavorites = (movieId) => {
    const updatedFavorites = favorites.filter(id => id !== movieId);
    setFavorites(updatedFavorites);
    localStorage.setItem(`favorites_${userId}`, JSON.stringify(updatedFavorites));
    console.log(`Удалено из избранного: ${movieId}`);
  };

  if (loading) {
    return <div className="loading">Загрузка избранного...</div>;
  }

  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <h1>⭐ Избранное</h1>
        <p>{movies.length} фильмов</p>
      </div>
      
      {movies.length === 0 ? (
        <div className="empty-state">
          <h3>Избранное пусто</h3>
          <p>Добавьте фильмы из каталога</p>
        </div>
      ) : (
        <div className="favorites-grid">
          {movies.map(movie => (
            <div key={movie.id} className="favorite-card">
              <img
                src={movie.thumbnailUrl || '/placeholder.jpg'}
                alt={movie.title}
                className="favorite-image"
              />
              <div className="favorite-info">
                <h3 className="favorite-title">{movie.title}</h3>
                <p className="favorite-year">{movie.year}</p>
                <p className="favorite-genre">{movie.genre?.split(',')[0]}</p>
                <div className="favorite-rating">
                  ⭐ {movie.rating || 'N/A'}
                </div>
              </div>
              <button
                className="remove-btn"
                onClick={() => handleRemoveFromFavorites(movie.id)}
              >
                Удалить из избранного
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;