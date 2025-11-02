import React from 'react';
import { Link } from 'react-router-dom';

const items = [
  { to: '/', label: 'Главная' },
  { to: '/genres', label: 'Жанры' },
  { to: '/favorites', label: 'Избранное' },
  { to: '/history', label: 'История' },
  { to: '/add-movie', label: 'Добавить фильм' }
];

export default function Sidebar(){
  return (
    <nav>
      <ul className="navlist">
        {items.map(i => (
          <li key={i.to}><Link className="navitem" to={i.to}>{i.label}</Link></li>
        ))}
      </ul>
    </nav>
  );
}
