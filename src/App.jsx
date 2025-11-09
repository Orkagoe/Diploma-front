// src/App.jsx
import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import { ThemeProvider } from './hooks/useTheme';
import './styles/theme.css';

const Home = lazy(() => import('./pages/Home'));
const Genres = lazy(() => import('./pages/Genres'));
const AddMovie = lazy(() => import('./pages/AddMovie'));
const MovieDetails = lazy(() => import('./pages/MovieDetails'));
const Favorites = lazy(() => import('./pages/Favorites'));
const History = lazy(() => import('./pages/History'));
const AdminAnalytics = lazy(() => import('./pages/AdminAnalytics'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const Settings = lazy(() => import('./pages/SettingsPage'));        // << здесь
const SubscriptionPage = lazy(() => import('./pages/SubscriptionPage'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));

function ScrollToTop() {
  const location = useLocation();
  React.useEffect(() => { window.scrollTo(0, 0); }, [location.pathname]);
  return null;
}

export default function App() {
  return (
    <ThemeProvider>
      <ScrollToTop />
      <Suspense fallback={<div style={{padding:20}}>Загрузка…</div>}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Home />} />
            <Route path="genres" element={<Genres />} />
            <Route path="add-movie" element={<AddMovie />} />
            <Route path="movie/:imdbId" element={<MovieDetails />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="history" element={<History />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<Settings />} />
            <Route path="subscription" element={<SubscriptionPage />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </ThemeProvider>
  );
}
