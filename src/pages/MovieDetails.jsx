// src/pages/MovieDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useMovie } from '../hooks/useMovie';
import { useHistoryStorage } from '../utils/localHistory';

export default function MovieDetails() {
  const { imdbId } = useParams();
  const navigate = useNavigate();
  const { data: movie, isLoading, isError, error } = useMovie(imdbId);
  const { push, read } = useHistoryStorage();

  // favorites stored as array of imdbId under key 'favorites_guest'
  const favKey = 'favorites_guest';
  const [favorites, setFavorites] = useState(() => {
    try {
      const raw = localStorage.getItem(favKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // push into local history when movie data is available
  useEffect(() => {
    if (!movie) return;
    push({
      imdbId: movie.imdbId,
      title: movie.title,
      posterUrl: movie.poster || '',
      timestamp: Date.now(),
    });
    // update document title for UX
    document.title = `${movie.title} — Cinema App`;
  }, [movie, push]);

  // helper to toggle favorite
  const toggleFavorite = () => {
    if (!movie) return;
    setFavorites((prev) => {
      const exists = prev.includes(movie.imdbId);
      let updated;
      if (exists) {
        updated = prev.filter((id) => id !== movie.imdbId);
      } else {
        updated = [movie.imdbId, ...prev];
      }
      try {
        localStorage.setItem(favKey, JSON.stringify(updated));
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('Failed to save favorites', e);
      }
      return updated;
    });
  };

  // get last viewed info for this imdbId from local history
  const lastViewedEntry = (() => {
    try {
      const list = read();
      return list.find((i) => i.imdbId === imdbId);
    } catch {
      return null;
    }
  })();

  const formatTimestamp = (ts) => {
    try {
      return new Date(ts).toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Almaty',
      });
    } catch {
      return '';
    }
  };

  if (isLoading) return <div className="loading container">Загрузка фильма...</div>;
  if (isError) {
    return (
      <div className="container">
        <div className="error">Ошибка: {error?.message || 'Не удалось загрузить фильм'}</div>
        <button className="button button--ghost" onClick={() => navigate(-1)}>← Назад</button>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container">
        <div className="error">Фильм не найден</div>
        <Link to="/" className="button button--ghost">← На главную</Link>
      </div>
    );
  }

  const posterSrc =
    movie.poster ||
    `https://via.placeholder.com/400x600/333/fff?text=${encodeURIComponent(movie.title)}`;

  return (
    <div className="container movie-details-page">
      <Link to="/" className="back-link">← Назад</Link>

      <div className="details-layout">
        <div>
          <img
            className="details-poster"
            src={posterSrc}
            alt={movie.title}
            loading="lazy"
            onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/400x600/333/fff?text=No+Image'; }}
          />

          <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
            <button className="button" onClick={toggleFavorite}>
              {favorites.includes(movie.imdbId) ? '✓ В избранном' : 'Добавить в избранное'}
            </button>

            <button
              className="button button--ghost"
              onClick={() => {
                // пример: можно в будущем стартовать сессию просмотра
                alert('Функция «Смотреть» пока не реализована (плеер).');
              }}
            >
              ▶ Смотреть
            </button>
          </div>
        </div>

        <div className="details-info">
          <h2>{movie.title}</h2>

          <div style={{ marginBottom: 8 }}>
            <strong>Год:</strong> {movie.year ?? '—'} &nbsp;·&nbsp;
            <strong>Жанр:</strong> {movie.genre || '—'} &nbsp;·&nbsp;
            <strong>IMDb:</strong> {movie.imdbRating ?? '—'}
          </div>

          <p style={{ whiteSpace: 'pre-line' }}>
            <strong>Описание:</strong>
            <br />
            {movie.description || 'Описание отсутствует.'}
          </p>

          <div style={{ marginTop: 12 }}>
            <p><strong>Длительность:</strong> {movie.runtime ?? '—'}</p>
            <p><strong>Режиссёр:</strong> {movie.raw?.director || movie.raw?.Director || '—'}</p>
            <p><strong>Актёры:</strong> {movie.raw?.actors || movie.raw?.Actors || '—'}</p>
            <p><strong>Язык:</strong> {movie.raw?.language || movie.raw?.Language || '—'}</p>
            <p><strong>Страна:</strong> {movie.raw?.country || movie.raw?.Country || '—'}</p>
          </div>

          {lastViewedEntry && (
            <div style={{ marginTop: 14, color: 'var(--muted)' }}>
              <small>
                Последний просмотр: {formatTimestamp(lastViewedEntry.timestamp)}
              </small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
