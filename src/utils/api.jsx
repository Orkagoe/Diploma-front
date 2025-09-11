const API_BASE = 'http://localhost:8080';

// Моковые данные для разработки
const mockMovies = [
  {
    id: 1,
    title: "Крестный отец",
    year: "1972",
    genre: "Криминал, Драма",
    type: "movie",
    rating: 9.2,
    duration: 175,
    country: "США",
    description: "Эпическая сага о сицилийской мафиозной семье Корлеоне.",
    thumbnailUrl: "https://via.placeholder.com/300x450/333/fff?text=Крестный+отец"
  },
  {
    id: 2,
    title: "Наруто",
    year: "2002",
    genre: "Аниме, Приключения, Фэнтези",
    type: "anime",
    rating: 8.3,
    duration: 24,
    country: "Япония",
    description: "История молодого ниндзя, мечтающего стать Хокаге.",
    thumbnailUrl: "https://via.placeholder.com/300x450/333/fff?text=Наруто"
  },
  {
    id: 3,
    title: "Во все тяжкие",
    year: "2008",
    genre: "Криминал, Драма, Триллер",
    type: "series",
    rating: 9.5,
    duration: 49,
    country: "США",
    description: "Учитель химии начинает производить метамфетамин.",
    thumbnailUrl: "https://via.placeholder.com/300x450/333/fff?text=Во+все+тяжкие"
  },
  {
    id: 4,
    title: "Аватар: Легенда об Аанге",
    year: "2005",
    genre: "Аниме, Приключения, Фэнтези",
    type: "anime",
    rating: 9.3,
    duration: 23,
    country: "США",
    description: "Мальчик-аватар должен спасти мир от огненной нации.",
    thumbnailUrl: "https://via.placeholder.com/300x450/333/fff?text=Аватар"
  },
  {
    id: 5,
    title: "Интерстеллар",
    year: "2014",
    genre: "Фантастика, Драма, Приключения",
    type: "movie",
    rating: 8.6,
    duration: 169,
    country: "США",
    description: "Путешествие через червоточину в поисках нового дома для человечества.",
    thumbnailUrl: "https://via.placeholder.com/300x450/333/fff?text=Интерстеллар"
  }
];

// Функция для эмуляции задержки сети
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// Auth API - моковая авторизация
export const login = async (username, password) => {
  await delay(1000); // Имитация задержки сети
  
  // Демо доступ
  if (username === 'admin' && password === 'admin') {
    return {
      token: 'mock-jwt-token-for-development',
      roles: ['ADMIN'],
      username: 'admin'
    };
  }
  
  if (username === 'user' && password === 'user') {
    return {
      token: 'mock-jwt-token-for-user',
      roles: ['USER'],
      username: 'user'
    };
  }
  
  throw new Error('Неверный логин или пароль');
};

export const register = async (username, password) => {
  await delay(1000);
  return { message: 'Регистрация успешна' };
};

// Movies API - возвращаем моковые данные
export const getMovies = async () => {
  await delay(800); // Имитация загрузки
  return mockMovies;
};

export const getMovieDetails = async (id) => {
  await delay(500);
  const movie = mockMovies.find(m => m.id === parseInt(id));
  if (!movie) throw new Error('Фильм не найден');
  return movie;
};

export const getMovieReviews = async (id) => {
  await delay(400);
  // Моковые отзывы
  return [
    {
      id: 1,
      rating: 9,
      comment: "Отличный фильм!",
      author: "user1"
    },
    {
      id: 2,
      rating: 8,
      comment: "Очень понравилось",
      author: "user2"
    }
  ];
};

export const addMovieFromImdb = async (imdbId) => {
  await delay(1000);
  // Моковый ответ для добавления фильма
  return {
    id: Math.random() * 1000,
    title: `Фильм из IMDb ${imdbId}`,
    year: "2023",
    genre: "Драма",
    message: "Фильм успешно добавлен"
  };
};

export const searchMovies = async (query) => {
  await delay(300);
  
  const excludedWords = ['профиль', 'настройки', ' '];
  const lowerQuery = query.toLowerCase();
  const isExcluded = excludedWords.some(word => lowerQuery.includes(word));
  
  if (isExcluded) return [];
  
  return mockMovies.filter(movie =>
    movie.title.toLowerCase().includes(lowerQuery) ||
    movie.genre.toLowerCase().includes(lowerQuery) ||
    movie.description?.toLowerCase().includes(lowerQuery)
  );
};