// src/pages/MovieList.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovies } from '../utils/api';
import { useHistory } from '../context/HistoryContext'; // Импорт хука
import '../styles/pages/MovieList.css';

const MovieList = () => {
  const { type, genre } = useParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToHistory } = useHistory(); // Получаем метод из контекста

  const userId = 'user1'; // Пример ID пользователя
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem(`favorites_${userId}`);
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const allMovies = await getMovies();
        const normalizedType = type === 'movies' ? 'movie' : 'anime';
        
        let filtered = allMovies.filter(movie =>
          movie.type && movie.type.toLowerCase() === normalizedType
        );
        
        if (genre) {
          filtered = filtered.filter(movie =>
            movie.genre && movie.genre.toLowerCase().includes(genre.toLowerCase())
          );
        }
        
        setMovies(filtered);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [type, genre]);

  const handleAddToFavorites = (movieId) => {
    if (!favorites.includes(movieId)) {
      const updatedFavorites = [...favorites, movieId];
      setFavorites(updatedFavorites);
      localStorage.setItem(`favorites_${userId}`, JSON.stringify(updatedFavorites));
      console.log(`Добавлено в избранное: ${movieId}`);
    } else {
      console.log(`Фильм ${movieId} уже в избранном`);
    }
  };

  if (loading) {
    return <div className="loading">Загрузка фильмов...</div>;
  }

  return (
    <div className="movie-list">
      <div className="movie-list-header">
        <h1>
          {genre ? `🎯 ${genre}` : '🎬 Все'} {type === 'movies' ? 'фильмы' : 'аниме'}
        </h1>
        <p>{movies.length} результатов</p>
      </div>
      
      <div className="movies-grid">
        {movies.map(movie => (
          <div key={movie.id} className="movie-card-container">
            <div
              className="movie-card"
              onClick={() => {
                navigate(`/${type}/movie/${movie.id}`);
                addToHistory({
                  id: movie.id,
                  title: movie.title,
                  type: type,
                  thumbnailUrl: movie.thumbnailUrl
                });
              }}
            >
              <img
                src={movie.thumbnailUrl || '/placeholder.jpg'}
                alt={movie.title}
                className="movie-image"
              />
              <div className="movie-info">
                <h3 className="movie-title">{movie.title}</h3>
                <p className="movie-year">{movie.year}</p>
                <p className="movie-genre">{movie.genre?.split(',')[0]}</p>
                <div className="movie-rating">
                  ⭐ {movie.rating || 'N/A'}
                </div>
              </div>
            </div>
            <button
              className="favorite-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleAddToFavorites(movie.id);
              }}
            >
              {favorites.includes(movie.id) ? '✓ Избранное' : 'Добавить в избранное'}
            </button>
          </div>
        ))}
      </div>
      
      {movies.length === 0 && (
        <div className="empty-state">
          <h3>Фильмы не найдены</h3>
          <p>Попробуйте выбрать другой жанр</p>
        </div>
      )}
    </div>
  );
};

export default MovieList;