import React, { useState, useEffect } from 'react';
import MovieGrid from '../components/MovieGrid';
import { useMovies } from '../hooks/useMovies';

const key = (user='guest') => `favorites_${user}`;

export default function Favorites(){
  const { data: movies = [] } = useMovies();
  const [favorites, setFavorites] = useState(() => {
    const s = localStorage.getItem(key());
    return s ? JSON.parse(s) : [];
  });

  useEffect(()=> localStorage.setItem(key(), JSON.stringify(favorites)), [favorites]);

  const favMovies = movies.filter(m => favorites.includes(m.imdbId));

  const toggle = (imdbId) => {
    setFavorites(prev => prev.includes(imdbId) ? prev.filter(x=>x!==imdbId) : [imdbId, ...prev]);
  };

  return (
    <div className="container">
      <h1>Избранное</h1>
      {favMovies.length === 0 ? <div>Пусто</div> : <MovieGrid movies={favMovies} />}
      <div style={{marginTop:20}}>
        <small>Управление избранным доступно на карточках и деталях.</small>
      </div>
    </div>
  );
}
