// ScrollContext.js o un nombre más apropiado como AppStateContext.js
import React, { createContext, useState, useContext } from 'react';

const AppStateContext = createContext();

export const useAppState = () => useContext(AppStateContext);

export const AppStateProvider = ({ children }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [storyTitle, setStoryTitle] = useState('');
    const [currentCardTitle, setCurrentCardTitle] = useState('');
    const [navigationKey, setNavigationKey] = useState(0);

    const updateTitles = (storyTitle, cardTitle) => {
        setStoryTitle(storyTitle);
        setCurrentCardTitle(cardTitle);
    };

    const refreshNavigation = () => {
        setNavigationKey(prevKey => prevKey + 1);
    };

    return (
        <AppStateContext.Provider
            value={{ isScrolled, setIsScrolled, storyTitle, currentCardTitle, updateTitles, navigationKey, refreshNavigation }}>
            {children}
        </AppStateContext.Provider>
    );
};
