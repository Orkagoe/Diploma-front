import React, { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';

/* ==== Ленивая загрузка страниц ==== */
const Home = lazy(() => import('./pages/Home'));
const Genres = lazy(() => import('./pages/Genres'));
const AddMovie = lazy(() => import('./pages/AddMovie'));
const MovieDetails = lazy(() => import('./pages/MovieDetails'));
const Favorites = lazy(() => import('./pages/Favorites'));
const History = lazy(() => import('./pages/History'));
const AdminAnalytics = lazy(() => import('./pages/AdminAnalytics'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const SubscriptionPage = lazy(() => import('./pages/SubscriptionPage'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));

/* ==== Сброс прокрутки ==== */
function ScrollToTop() {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  return null;
}

/* ==== Маршруты ==== */
export default function App() {
  return (
    <>
      <ScrollToTop />

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
          <Route path="settings" element={<SettingsPage />} />
          <Route path="subscription" element={<SubscriptionPage />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </>
  );
}
