// src/shared/api/http.js
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const http = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 10000,
});

http.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err?.response?.data?.message || err.message || 'Network error';
    return Promise.reject(new Error(message));
  }
);

export default http;
