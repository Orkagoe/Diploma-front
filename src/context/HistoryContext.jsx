// src/context/HistoryContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const HistoryContext = createContext();

export const HistoryProvider = ({ children }) => {
  const userId = 'user1'; // Пример ID пользователя, можно заменить на реальный
  const [history, setHistory] = useState(() => {
    const savedHistory = localStorage.getItem(`history_${userId}`);
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  useEffect(() => {
    localStorage.setItem(`history_${userId}`, JSON.stringify(history));
  }, [history]);

  const addToHistory = (item) => {
    setHistory(prevHistory => {
      const newHistory = [item, ...prevHistory.filter(h => h.id !== item.id)].slice(0, 20); // Ограничение до 20
      return newHistory;
    });
  };

  return (
    <HistoryContext.Provider value={{ history, addToHistory }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => useContext(HistoryContext);