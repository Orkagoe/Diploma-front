import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const http = axios.create({
  baseURL,
  timeout: 10000,
  withCredentials: false,
});

// если при старте уже есть токен — установим в defaults
try {
  const initialToken = localStorage.getItem('token');
  if (initialToken) {
    http.defaults.headers.common.Authorization = `Bearer ${initialToken}`;
  }
} catch (e) {
  // ignored (например during SSR, но у тебя dev)
}

// логирование исходящих запросов (удали/закомментируй после отладки)
http.interceptors.request.use(
  (config) => {
    const token = (() => {
      try { return localStorage.getItem('token'); } catch { return null; }
    })();
    // eslint-disable-next-line no-console
    console.debug('[http] ->', (config.method || 'get').toUpperCase(), config.url, token ? `token=${token.slice(0,10)}...` : 'no-token');
    config.headers = config.headers || {};
    if (token && !config.headers.Authorization) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (err) => Promise.reject(err)
);

http.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    if (status === 401) {
      // eslint-disable-next-line no-console
      console.warn('[http] HTTP 401 received:', err?.config?.url);
    }
    return Promise.reject(err);
  }
);

export default http;
