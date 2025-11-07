import React from 'react';
import { Routes, Route, Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Genres from './pages/Genres';
import AddMovie from './pages/AddMovie';
import MovieDetails from './pages/MovieDetails';
import Favorites from './pages/Favorites';
import History from './pages/History';
import AdminAnalytics from './pages/AdminAnalytics';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import SubscriptionPage from './pages/SubscriptionPage';
import Login from './pages/Login';
import Register from './pages/Register';

function RequireAuth({ children }) {
  const { user } = useAuth();
  const loc = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: loc }} replace />;
  return children;
}

function Layout() {
  return (
    <div className="app">
      <Header />
      <div className="layout">
        <aside className="sidebar"><Sidebar /></aside>
        <main className="main">
          <React.Suspense fallback={<p>Загрузка...</p>}>
            <Outlet />
          </React.Suspense>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="add-movie" element={<AddMovie />} />
        <Route path="genres" element={<Genres />} />
        <Route path="movie/:imdbId" element={<MovieDetails />} />
        <Route path="favorites" element={<Favorites />} />
        <Route path="history" element={<History />} />

        <Route path="analytics" element={<RequireAuth><AdminAnalytics /></RequireAuth>} />
        <Route path="profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
        <Route path="settings" element={<RequireAuth><SettingsPage /></RequireAuth>} />
        <Route path="subscription" element={<RequireAuth><SubscriptionPage /></RequireAuth>} />

        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  );
}
