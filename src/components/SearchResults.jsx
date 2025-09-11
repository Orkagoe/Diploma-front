import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/components/SearchResults.css';

const SearchResults = ({ searchQuery, results, loading }) => {
  const navigate = useNavigate();

  // Функция для подсветки совпадений
  const highlightText = (text, query) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<span class="search-highlight">$1</span>');
  };

  const handleMovieClick = (movie) => {
    const type = movie.type === 'anime' ? 'anime' : 
                 movie.type === 'series' ? 'series' : 'movies';
    navigate(`/${type}/movie/${movie.id}`);
  };

  if (!searchQuery) return null;

  return (
    <div className="search-results-overlay">
      <div className="search-results">
        <div className="search-results-content">
          <div className="search-header">
            <h3>🔍 Результаты поиска</h3>
            <span className="search-query">"{searchQuery}"</span>
          </div>
          
          {loading ? (
            <div className="search-loading">
              <div className="search-spinner"></div>
              <p>Ищем...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="search-empty">
              <p>😔 Ничего не найдено</p>
              <small>Попробуйте другой запрос</small>
            </div>
          ) : (
            <>
              <div className="search-stats">
                Найдено: {results.length} {results.length === 1 ? 'результат' : 
                         results.length < 5 ? 'результата' : 'результатов'}
              </div>
              
              <div className="search-results-grid">
                {results.map(movie => (
                  <div
                    key={movie.id}
                    className="search-result-card"
                    onClick={() => handleMovieClick(movie)}
                  >
                    <img
                      src={movie.thumbnailUrl}
                      alt={movie.title}
                      className="search-result-image"
                    />
                    <div className="search-result-info">
                      <h4 
                        dangerouslySetInnerHTML={{ 
                          __html: highlightText(movie.title, searchQuery) 
                        }} 
                      />
                      <p className="search-result-year">{movie.year}</p>
                      <p className="search-result-genre">{movie.genre}</p>
                      <div className="search-result-rating">
                        ⭐ {movie.rating || 'N/A'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;