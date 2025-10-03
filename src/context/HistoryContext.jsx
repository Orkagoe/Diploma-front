// src/context/HistoryContext.js
import React, { createContext, useContext, useState } from 'react';

const HistoryContext = createContext();

export const HistoryProvider = ({ children }) => {
  const userId = 'user1';
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem(`history_${userId}`);
    return saved ? JSON.parse(saved) : [];
  });

  const addToHistory = (item) => {
    setHistory((prev) => {
      const exists = prev.some((i) => i.id === item.id);
      if (exists) {
        console.log(`Фильм ${item.title} уже в истории`);
        return prev; // Не добавляем дубли
      }
      const newItem = { ...item, timestamp: Date.now() }; // Добавляем временную метку
      const updated = [newItem, ...prev].slice(0, 50); // Новые записи в начало, ограничиваем 50
      localStorage.setItem(`history_${userId}`, JSON.stringify(updated));
      console.log(`Добавлено в историю: ${item.title} (ID: ${item.id})`);
      return updated;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(`history_${userId}`);
    console.log('История очищена');
  };

  return (
    <HistoryContext.Provider value={{ history, addToHistory, clearHistory }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => useContext(HistoryContext);