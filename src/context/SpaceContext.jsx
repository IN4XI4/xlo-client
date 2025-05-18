import React, { createContext, useState, useContext, useEffect } from 'react';

const SpaceContext = createContext();

export const useSpace = () => useContext(SpaceContext);

export const SpaceProvider = ({ children }) => {
  const storedSpace = localStorage.getItem('activeSpace');
  const [activeSpace, setActiveSpace] = useState(storedSpace ? JSON.parse(storedSpace) : null);

  useEffect(() => {
    if (activeSpace) {
      localStorage.setItem('activeSpace', JSON.stringify(activeSpace));
    } else {
      localStorage.removeItem('activeSpace');
    }
  }, [activeSpace]);

  return (
    <SpaceContext.Provider value={{ activeSpace, setActiveSpace }}>
      {children}
    </SpaceContext.Provider>
  );
};
