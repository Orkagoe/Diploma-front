import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchResults from './SearchResults';
import '../styles/components/Header.css';

const Header = ({ onSearch, searchResults, searchLoading }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showClear, setShowClear] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    // Поиск уже работает в реальном времени, эта форма для поддержки Enter
    if (onSearch) onSearch(searchQuery);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowClear(value.length > 0);
    // Отправляем запрос при каждом изменении текста
    if (onSearch) onSearch(value);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setShowClear(false);
    if (onSearch) onSearch('');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <>
      <header className="header">
        <div className="header-container">
          <div className="logo" onClick={() => navigate('/movies')}>
            <h1>MyTube</h1>
          </div>
          
          <form className="search-form" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="🔍 Поиск фильмов, аниме, сериалов..."
              value={searchQuery}
              onChange={handleInputChange}
              className="search-input"
            />
            {showClear && (
              <button type="button" onClick={clearSearch} className="clear-btn">
                ×
              </button>
            )}
          </form>

          <div className="user-actions">
            {localStorage.getItem('token') ? (
              <>
                <span className="username">👤 {localStorage.getItem('username')}</span>
                {localStorage.getItem('role') === 'ADMIN' && (
                  <button onClick={() => navigate('/add')} className="admin-btn">
                    ➕ Добавить
                  </button>
                )}
                <button onClick={handleLogout} className="logout-btn">
                  🚪 Выйти
                </button>
              </>
            ) : (
              <button onClick={() => navigate('/login')} className="login-btn">
                🔐 Войти
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Показываем результаты поиска только когда есть запрос */}
      {searchQuery && (
        <SearchResults 
          searchQuery={searchQuery}
          results={searchResults}
          loading={searchLoading}
        />
      )}
    </>
  );
};

export default Header;