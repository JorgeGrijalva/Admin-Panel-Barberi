import React, { createContext, useState } from 'react';
export const Context = createContext(undefined);

export const ContextProvider = ({ children }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const theme = localStorage.getItem('theme');
  const [darkTheme, setDarkTheme] = useState(theme === 'dark');

  const value = {
    isModalVisible,
    setIsModalVisible,
    setDarkTheme,
    darkTheme,
  };
  return <Context.Provider value={value}>{children}</Context.Provider>;
};
