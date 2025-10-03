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
      const existsIndex = prev.findIndex((i) => i.id === item.id);
      const newItem = { ...item, timestamp: Date.now() }; // Новый timestamp для текущего просмотра

      if (existsIndex !== -1) {
        // Если запись существует, обновляем её с новым timestamp и перемещаем в начало
        const updated = [
          newItem,
          ...prev.slice(0, existsIndex),
          ...prev.slice(existsIndex + 1),
        ];
        console.log(`Обновлено в истории: ${item.title} (ID: ${item.id})`);
        localStorage.setItem(`history_${userId}`, JSON.stringify(updated));
        return updated;
      } else {
        // Если записи нет, добавляем в начало
        const updated = [newItem, ...prev].slice(0, 50); // Ограничиваем 50 записей
        console.log(`Добавлено в историю: ${item.title} (ID: ${item.id})`);
        localStorage.setItem(`history_${userId}`, JSON.stringify(updated));
        return updated;
      }
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