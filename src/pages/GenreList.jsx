import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovies } from '../utils/api';
import HeroCarousel from '../components/HeroCarousel';
import '../styles/pages/GenreList.css';

const GenreList = () => {
  const { type } = useParams();
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setLoading(true);
        const movies = await getMovies();
        
        let filtered = movies;
        
        if (type === 'anime') {
          filtered = filtered.filter(movie => movie.type === 'anime');
        } else if (type === 'movies') {
          filtered = filtered.filter(movie => 
            movie.type !== 'anime' && movie.type !== 'series'
          );
        } else if (type === 'series') {
          filtered = filtered.filter(movie => movie.type === 'series');
        }
        
        const genresSet = new Set();
        filtered.forEach(movie => {
          if (movie.genre) {
            movie.genre.split(',').forEach(g => {
              const trimmedGenre = g.trim();
              if (trimmedGenre) {
                genresSet.add(trimmedGenre);
              }
            });
          }
        });
        
        setGenres(Array.from(genresSet).sort());
      } catch (err) {
        console.error('Error fetching genres:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, [type]);

  const getTypeTitle = () => {
    switch (type) {
      case 'movies':
        return '🎬 Фильмы';
      case 'anime':
        return '🐉 Аниме';
      case 'series':
        return '📺 Сериалы';
      default:
        return '🎬 Контент';
    }
  };

  const handleGenreClick = (genre) => {
    navigate(`/${type}/genre/${encodeURIComponent(genre)}`);
  };

  // Показываем карусель только на главной странице
  const isHomePage = !type || type === 'movies';

  if (loading) {
    return (
      <div className="genre-list">
        <div className="loading">
          <div className="spinner"></div>
          <p>Загрузка жанров...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="genre-list">
      {/* Карусель на главной */}
      {isHomePage && <HeroCarousel />}

      <div className="genre-header">
        <h1>{getTypeTitle()}</h1>
        <p>Выберите жанр для просмотра {type === 'movies' ? 'фильмов' : type === 'anime' ? 'аниме' : 'сериалов'}</p>
      </div>
      
      {genres.length > 0 ? (
        <>
          <div className="genres-grid">
            {genres.map(genre => (
              <div
                key={genre}
                className="genre-card"
                onClick={() => handleGenreClick(genre)}
              >
                <div className="genre-content">
                  <h3>{genre}</h3>
                  <span className="genre-icon">
                    {type === 'movies' ? '🎭' : type === 'anime' ? '🗾' : '📺'}
                  </span>
                </div>
                <div className="genre-hover">Смотреть →</div>
              </div>
            ))}
          </div>
          
          <div className="genres-info">
            <p>Найдено жанров: {genres.length}</p>
          </div>
        </>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📺</div>
          <h3>Пока нет контента</h3>
          <p>В этой категории еще нет добавленных {type === 'movies' ? 'фильмов' : type === 'anime' ? 'аниме' : 'сериалов'}</p>
        </div>
      )}
    </div>
  );
};

export default GenreList;