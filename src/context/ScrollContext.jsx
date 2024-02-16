// ScrollContext.js o un nombre más apropiado como AppStateContext.js
import React, { createContext, useState, useContext } from 'react';

const AppStateContext = createContext();

export const useAppState = () => useContext(AppStateContext);

export const AppStateProvider = ({ children }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [storyTitle, setStoryTitle] = useState('');
    const [currentCardTitle, setCurrentCardTitle] = useState('');

    const updateTitles = (storyTitle, cardTitle) => {
        setStoryTitle(storyTitle);
        setCurrentCardTitle(cardTitle);
    };

    return (
        <AppStateContext.Provider value={{ isScrolled, setIsScrolled, storyTitle, currentCardTitle, updateTitles }}>
            {children}
        </AppStateContext.Provider>
    );
};
