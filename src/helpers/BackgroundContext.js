import { createContext, useState } from 'react';

const BackgroundContext = createContext();

const BackgroundProvider = ({ children }) => {
    const [selectedBackground, setSelectedBackground] = useState('skully_bg1');

    const handleBackgroundChange = (background) => {
        setSelectedBackground(background);
    };

    return (
        <BackgroundContext.Provider value={{ selectedBackground, handleBackgroundChange }}>
            {children}
        </BackgroundContext.Provider>
    );
};

export { BackgroundProvider, BackgroundContext };