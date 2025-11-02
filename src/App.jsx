import React from 'react';
import { Routes, Route, Link, Outlet } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Genres from './pages/Genres';
import AddMovie from './pages/AddMovie';
import MovieDetails from './pages/MovieDetails';
import Favorites from './pages/Favorites';
import History from './pages/History';

export default function App() {
  return (
    <div className="app">
      <Header />
      <div className="layout">
        <aside className="sidebar"><Sidebar/></aside>
        <main className="main"><Outlet /></main>
      </div>

      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/add-movie" element={<AddMovie/>} />
        <Route path="/genres" element={<Genres/>} />
        <Route path="/movie/:imdbId" element={<MovieDetails/>} />
        <Route path="/favorites" element={<Favorites/>} />
        <Route path="/history" element={<History/>} />
        <Route path="*" element={<Home/>} />
      </Routes>
    </div>
  );
}
