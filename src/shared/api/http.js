import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// базовый клиент
const http = axios.create({
  baseURL,
  withCredentials: false, // JWT не требует cookies
  timeout: 10000,
});

// добавляем токен из localStorage
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// перехватываем ошибки
http.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err.message ||
      'Network error';
    return Promise.reject(new Error(message));
  }
);

export default http;
