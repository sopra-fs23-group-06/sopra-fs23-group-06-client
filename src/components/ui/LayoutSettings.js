import React, { useContext, useEffect } from 'react';
import { ButtonPurpleMain } from './ButtonMain';
import 'styles/ui/Settings.scss';
import { BackgroundContext } from '../../helpers/BackgroundContext';

const LayoutSettings = ({ onClick }) => {
  const { selectedBackground, handleBackgroundChange } = useContext(BackgroundContext);

  const backgrounds = [
    'skully_bg1',
    'skully_bg2',
    'skully_bg3',
    'skully_bg4',
    'skully_bg5',
    'skully_bg6',
  ];

  useEffect(() => {
    updateBodyBackground(selectedBackground);
  }, [selectedBackground]);

  const handleClick = (event) => {
    event.preventDefault();
    onClick();
  };

  const handleBackgroundClick = (background) => {
    handleBackgroundChange(background);
  };

  const updateBodyBackground = (background) => {
    const bodyElement = document.body;
    const classNames = bodyElement.className.split(' ');

    // Remove existing background classes
    classNames.forEach((className) => {
	  if (className.startsWith('background-')) {
	    bodyElement.classList.remove(className);
	  }
    });

    // Add the new background class
    bodyElement.classList.add(`background-${background}`);
  };


  return (
    <div className="settings">
      <div className="settings-content">
        <div className="settings-content-header">Settings</div>
        <div className='settings-content-label'>Choose Background</div>
        <div className="backgrounds-grid">
          {backgrounds.map((background) => (
            <img
              key={background}
              src={require(`styles/images/backgrounds/${background}.png`)}
              alt={`Background ${background}`}
              className={`background-image ${selectedBackground === background ? 'selected' : ''}`}
              onClick={() => handleBackgroundClick(background)}
            />
          ))}
        </div>
        <ButtonPurpleMain onClick={handleClick}>Close</ButtonPurpleMain>
      </div>
    </div>
  );
};

export default LayoutSettings;
