// src/pages/MovieDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieDetails, getMovieReviews } from '../utils/api';
import { useHistory } from '../context/HistoryContext';
import '../styles/pages/MovieDetails.css';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToHistory } = useHistory();

  const userId = 'user1'; // Пример ID пользователя
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem(`favorites_${userId}`);
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  useEffect(() => {
    let isMounted = true; // Флаг для предотвращения обновления состояния после размонтирования

    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        setError(''); // Сбрасываем предыдущую ошибку
        console.log(`Fetching details for movie ID: ${id}`); // Лог для диагностики

        const [movieData, reviewsData] = await Promise.all([
          getMovieDetails(id),
          getMovieReviews(id)
        ]);

        console.log('Movie data:', movieData); // Лог данных фильма
        console.log('Reviews data:', reviewsData); // Лог отзывов

        if (!isMounted) return; // Проверяем, смонтирован ли компонент

        if (!movieData || Object.keys(movieData).length === 0) {
          throw new Error('Фильм не найден в данных API');
        }

        setMovie(movieData);
        setReviews(reviewsData || []);
        if (movieData) {
          addToHistory({
            id: movieData.id,
            title: movieData.title,
            type: 'movie',
            thumbnailUrl: movieData.thumbnailUrl
          });
        }
      } catch (err) {
        if (isMounted) {
          console.error('Detailed error:', err.message);
          setError(`Не удалось загрузить информацию о фильме: ${err.message}`);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchMovieDetails();

    return () => {
      isMounted = false; // Очистка при размонтировании
    };
  }, [id, addToHistory]);

  const handleAddToFavorites = () => {
    if (movie && !favorites.includes(movie.id)) {
      const updatedFavorites = [...favorites, movie.id];
      setFavorites(updatedFavorites);
      localStorage.setItem(`favorites_${userId}`, JSON.stringify(updatedFavorites));
      console.log(`Добавлено в избранное: ${movie.id}`);
    } else if (movie) {
      console.log(`Фильм ${movie.id} уже в избранном`);
    }
  };

  if (loading) {
    return <div className="loading">Загрузка фильма...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!movie) {
    return <div className="error">Фильм не найден</div>;
  }

  return (
    <div className="movie-details">
      <div className="movie-hero">
        <img
          src={movie.thumbnailUrl || '/placeholder.jpg'}
          alt={movie.title}
          className="hero-image"
        />
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>{movie.title}</h1>
            <div className="movie-meta">
              <span>⭐ {movie.rating || 'N/A'}</span>
              <span>📅 {movie.year}</span>
              <span>⏱️ {movie.duration} мин</span>
              <span>🌍 {movie.country}</span>
            </div>
            <p className="movie-genre">🎭 {movie.genre}</p>
            <button
              className="favorite-btn"
              onClick={handleAddToFavorites}
            >
              {favorites.includes(movie.id) ? '✓ Избранное' : 'Добавить в избранное'}
            </button>
          </div>
        </div>
      </div>

      <div className="movie-content">
        <div className="movie-description">
          <h2>📖 Описание</h2>
          <p>{movie.description || 'Описание отсутствует'}</p>
        </div>

        <div className="movie-reviews">
          <h2>💬 Отзывы ({reviews.length})</h2>
          {reviews.length === 0 ? (
            <p className="no-reviews">Отзывов пока нет</p>
          ) : (
            <div className="reviews-grid">
              {reviews.map(review => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <span className="review-rating">⭐ {review.rating}/10</span>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="comment-section">
        <button className="comment-btn">Оставить комментарий</button>
      </div>
    </div>
  );
};

export default MovieDetails;