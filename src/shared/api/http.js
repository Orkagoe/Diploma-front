// src/shared/api/http.js
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// базовый клиент
const http = axios.create({
  baseURL,
  withCredentials: false, // мы используем Bearer, не cookie
  timeout: 10000,
  headers: {
    Accept: 'application/json',
  },
});

// утилита: безопасно взять токен
function getToken() {
  try { return localStorage.getItem('token'); } catch { return null; }
}

// добавляем токен и корректный Content-Type при необходимости
http.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  // если отправляем тело и Content-Type не указан — ставим json
  if (config.data && !((config.headers || {})['Content-Type'] || (config.headers || {})['content-type'])) {
    config.headers = { ...(config.headers || {}), 'Content-Type': 'application/json' };
  }

  return config;
}, (err) => Promise.reject(err));

// перехват ответов: нормализуем ошибки + авто-logout на 401
http.interceptors.response.use(
  (res) => res,
  (err) => {
    // если есть ответ от сервера — попробуем вытащить понятное сообщение
    const status = err?.response?.status;
    const data = err?.response?.data || {};
    const message = data?.message || data?.error || err.message || 'Network error';

    // auto logout при 401 (token expired / invalid)
    if (status === 401) {
      try {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
      } catch (_) { /* noop */ }
      // безопасный redirect — можно убрать если не нужен автоматический редирект
      if (typeof window !== 'undefined') {
        // не делаем force-reload, просто перенаправляем на страницу логина
        window.location.pathname = '/login';
      }
      return Promise.reject(new Error(message));
    }

    return Promise.reject(new Error(message));
  }
);

export default http;
