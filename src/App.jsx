import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

// основные страницы
import Home from './pages/Home';
import Genres from './pages/Genres';
import AddMovie from './pages/AddMovie';
import MovieDetails from './pages/MovieDetails';
import Favorites from './pages/Favorites';
import History from './pages/History';

// новые страницы
import AdminAnalytics from './pages/AdminAnalytics';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import SubscriptionPage from './pages/SubscriptionPage';
import Login from './pages/Login';
import Register from './pages/Register';

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
        <Route path="/" element={<Home />} />
        <Route path="/add-movie" element={<AddMovie />} />
        <Route path="/genres" element={<Genres />} />
        <Route path="/movie/:imdbId" element={<MovieDetails />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/history" element={<History />} />

        {/* защищённые / дополнительные страницы */}
        <Route path="/analytics" element={<AdminAnalytics />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/subscription" element={<SubscriptionPage />} />

        {/* аутентификация */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* fallback */}
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  );
}
