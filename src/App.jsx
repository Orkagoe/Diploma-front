import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Genres from './pages/Genres';
import AddMovie from './pages/AddMovie';
import { useTheme } from './hooks/useTheme';

function App() {
  const { theme } = useTheme();

  return (
    <div className={`app ${theme}`}>
      <Header />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/genres" element={<Genres />} />
          <Route path="/add-movie" element={<AddMovie />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;