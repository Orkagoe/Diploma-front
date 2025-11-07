// src/pages/MovieDetails.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useMovie } from '../hooks/useMovie';
import { useHistoryStorage } from '../utils/localHistory';
import { useAuth } from '../hooks/useAuth';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { getMyFavorites, addFavoriteByImdb, removeFavoriteByImdb } from '../shared/api/favorites';

export default function MovieDetails() {
  const { imdbId } = useParams();
  const navigate = useNavigate();
  const { data: movie, isLoading, isError, error } = useMovie(imdbId);
  const { push, read } = useHistoryStorage();
  const { user } = useAuth(); // { token, username, role } or null
  const username = user?.username ?? null;
  const qc = useQueryClient();

  // local fallback key
  const localKey = (u = 'guest') => `favorites_${u}`;

  // --- remote favorites (only when logged) ---
  const { data: remoteFavs = [], isLoading: remoteLoading } = useQuery({
    queryKey: ['favorites', username],
    queryFn: async () => {
      if (!username) return [];
      const data = await getMyFavorites();
      return Array.isArray(data) ? data.map(m => m.imdbId ?? m.imdbID ?? null).filter(Boolean) : [];
    },
    enabled: !!username,
    staleTime: 1000 * 30,
  });

  const addMut = useMutation({
    mutationFn: (id) => addFavoriteByImdb(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ['favorites', username] });
      const prev = qc.getQueryData(['favorites', username]) || [];
      qc.setQueryData(['favorites', username], (old = []) => (old.includes(id) ? old : [id, ...old]));
      return { prev };
    },
    onError: (err, id, context) => {
      if (context?.prev) qc.setQueryData(['favorites', username], context.prev);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['favorites', username] }),
  });

  const delMut = useMutation({
    mutationFn: (id) => removeFavoriteByImdb(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ['favorites', username] });
      const prev = qc.getQueryData(['favorites', username]) || [];
      qc.setQueryData(['favorites', username], (old = []) => old.filter(x => x !== id));
      return { prev };
    },
    onError: (err, id, context) => {
      if (context?.prev) qc.setQueryData(['favorites', username], context.prev);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['favorites', username] }),
  });

  // --- local favorites (guest) ---
  const [localFavs, setLocalFavs] = useState(() => {
    try {
      const raw = localStorage.getItem(localKey());
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  });

  useEffect(() => {
    if (!username) {
      try { localStorage.setItem(localKey(), JSON.stringify(localFavs)); } catch {}
    }
  }, [localFavs, username]);

  // push to local history when movie loaded
  useEffect(() => {
    if (!movie) return;
    push({
      imdbId: movie.imdbId,
      title: movie.title,
      posterUrl: movie.poster || '',
      timestamp: Date.now(),
    });
    document.title = `${movie.title} — Cinema App`;
  }, [movie, push]);

  // effective favorites list (remote if logged else local)
  const favs = username ? (remoteFavs || []) : localFavs;

  // memoized check
  const isFavorite = useMemo(() => movie && favs.includes(movie.imdbId), [movie, favs]);

  // toggle handler (remote when logged)
  const toggleFavorite = () => {
    if (!movie) return;
    const id = movie.imdbId;
    if (username) {
      if (favs.includes(id)) {
        delMut.mutate(id);
      } else {
        addMut.mutate(id);
      }
      return;
    }

    // guest local toggle
    setLocalFavs(prev => {
      const exists = prev.includes(id);
      const updated = exists ? prev.filter(x => x !== id) : [id, ...prev];
      try { localStorage.setItem(localKey(), JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  const lastViewedEntry = (() => {
    try {
      const list = read();
      return list.find((i) => i.imdbId === imdbId);
    } catch { return null; }
  })();

  const formatTimestamp = (ts) => {
    try {
      return new Date(ts).toLocaleString('ru-RU', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Almaty'
      });
    } catch { return ''; }
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
            <button
              className="button"
              onClick={toggleFavorite}
              disabled={addMut.isLoading || delMut.isLoading}
            >
              {isFavorite ? '✓ В избранном' : 'Добавить в избранное'}
            </button>

            <button
              className="button button--ghost"
              onClick={() => alert('Функция «Смотреть» пока не реализована (плеер).')}
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
              <small>Последний просмотр: {formatTimestamp(lastViewedEntry.timestamp)}</small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
