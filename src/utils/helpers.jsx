import { GENRE_ICONS, DEFAULT_MOVIE_IMAGE } from './constants';

export const getGenreIcon = (genre) => {
  if (!genre) return '🎬';
  const mainGenre = genre.split(',')[0].trim();
  return GENRE_ICONS[mainGenre] || '🎬';
};

export const formatDuration = (minutes) => {
  if (!minutes) return 'N/A';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

export const getImageUrl = (url) => {
  return url || DEFAULT_MOVIE_IMAGE;
};

export const highlightText = (text, query) => {
  if (!query.trim()) return text;
  const re = new RegExp(`(${query})`, 'gi');
  return text.replace(re, '<mark class="highlight">$1</mark>');
};

export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};