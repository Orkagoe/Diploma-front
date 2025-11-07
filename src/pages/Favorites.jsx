import React, { useEffect, useState } from 'react';
import MovieGrid from '../components/MovieGrid';
import { useMovies } from '../hooks/useMovies';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyFavorites, addFavoriteByImdb, removeFavoriteByImdb } from '../shared/api/favorites';
import { useAuth } from '../hooks/useAuth';

const localKey = (user='guest') => `favorites_${user}`;

export default function Favorites(){
  const { data: movies = [] } = useMovies();
  const qc = useQueryClient();
  const { user } = useAuth(); // { token, username, role } или null
  const username = user?.username ?? null;

  // --- remote favorites (if logged) ---
  const { data: remoteFavs = [], isLoading: favsLoading } = useQuery({
    queryKey: ['favorites', username],
    queryFn: async () => {
      if (!username) return [];
      const data = await getMyFavorites();
      // Нормализуем в массив imdbId если бэк возвращает Movie[]
      return Array.isArray(data) ? data.map(m => m.imdbId ?? m.imdbID ?? null).filter(Boolean) : [];
    },
    enabled: !!username,
    staleTime: 1000 * 30,
  });

  const addMut = useMutation({
    mutationFn: (imdbId) => addFavoriteByImdb(imdbId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['favorites', username] })
  });
  const delMut = useMutation({
    mutationFn: (imdbId) => removeFavoriteByImdb(imdbId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['favorites', username] })
  });

  // --- local fallback (guest) ---
  const [localFavs, setLocalFavs] = useState(() => {
    try {
      const s = localStorage.getItem(localKey());
      return s ? JSON.parse(s) : [];
    } catch { return []; }
  });

  useEffect(() => {
    // persist local only if not logged
    if (!username) {
      try { localStorage.setItem(localKey(), JSON.stringify(localFavs)); } catch {}
    }
  }, [localFavs, username]);

  // Effective favorites: remote if logged else local
  const favs = username ? remoteFavs : localFavs;

  // Filter movies
  const favMovies = movies.filter(m => favs.includes(m.imdbId));

  // Toggle handler (uses backend when logged)
  const toggle = (imdbId) => {
    if (username) {
      // if currently in remoteFavs -> delete else add
      if (remoteFavs.includes(imdbId)) {
        delMut.mutate(imdbId);
      } else {
        addMut.mutate(imdbId);
      }
      return;
    }

    // guest local toggle
    setLocalFavs(prev => prev.includes(imdbId) ? prev.filter(x=>x!==imdbId) : [imdbId, ...prev]);
  };

  return (
    <div className="container">
      <h1>Избранное</h1>

      {username && favsLoading && <div>Загрузка...</div>}

      {favMovies.length === 0
        ? <div>Пусто</div>
        : <MovieGrid movies={favMovies} />
      }

      <div style={{marginTop:20}}>
        <small>Управление избранным доступно на карточках и деталях.</small>
      </div>

      {/* Кнопка для теста: показать массив id */}
      <div style={{marginTop:12, color:'#666', fontSize:13}}>
        <div>Текущее избранное (ids): {JSON.stringify(favs)}</div>
      </div>
    </div>
  );
}
