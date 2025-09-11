import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/components/Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: 'Фильмы', icon: '🎬', path: '/movies' },
    { name: 'Аниме', icon: '🐉', path: '/anime' },
    { name: 'Сериалы', icon: '📺', path: '/series' },
    { name: 'Избранное', icon: '⭐', path: '/favorites' },
    { name: 'История', icon: '📜', path: '/history' }
  ];

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <aside className="sidebar">
      <nav>
        <ul>
          {menuItems.map((item, index) => (
            <li key={index}>
              <button
                className={`sidebar-item ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => navigate(item.path)}
              >
                <span className="icon">{item.icon}</span>
                <span className="name">{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;