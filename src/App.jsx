// src/App.js
import React, { useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import GenreList from './pages/GenreList';
import MovieList from './pages/MovieList';
import MovieDetails from './pages/MovieDetails';
import AddMovie from './pages/AddMovie';
import AuthorPage from './pages/AuthorPage';
import Authors from './pages/Authors';
import Favorites from './pages/Favorites';
import History from './pages/History';
import { searchMovies } from './utils/api';
import { HistoryProvider } from './context/HistoryContext'; // Импорт
import './App.css';

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const handleSearch = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    try {
      const results = await searchMovies(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  return (
    <HistoryProvider> {/* Обертываем приложение */}
      <Router>
        <div className="app">
          <Header 
            onSearch={handleSearch}
            searchResults={searchResults}
            searchLoading={searchLoading}
          />
          <div className="main-container">
            <Sidebar />
            <main className="main-content">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/add" element={
                  <PrivateRoute roleRequired="ADMIN">
                    <AddMovie />
                  </PrivateRoute>
                } />
                <Route path="/author/:id" element={<AuthorPage />} />
                <Route path="/authors" element={<Authors />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/history" element={<History />} />
                <Route path="/:type" element={<GenreList />} />
                <Route path="/:type/genre/:genre" element={<MovieList />} />
                <Route path="/:type/movie/:id" element={<MovieDetails />} />
                <Route path="/" element={<GenreList />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </HistoryProvider>
  );
}

export default App;