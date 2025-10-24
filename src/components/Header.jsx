import { Link } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-title">
          Cinema App
        </Link>
        <nav className="header-nav">
          <Link to="/" className="header-link">
            Search
          </Link>
          <Link to="/genres" className="header-link">
            Genres
          </Link>
          <Link to="/add-movie" className="header-link">
            Add Movie
          </Link>
          <button onClick={toggleTheme} className="theme-toggle">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </nav>
      </div>
    </header>
  );
}