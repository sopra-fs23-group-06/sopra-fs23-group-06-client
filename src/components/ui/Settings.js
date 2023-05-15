import React from 'react';
import { ButtonPurpleMain } from './ButtonMain';
import 'styles/ui/Settings.scss';


const Settings = ({ onBackgroundChange, onClick }) => {

  const backgrounds = [
    'skully_bg1',
    'skully_bg2',
    'skully_bg3',
    'skully_bg4',
    'skully_bg5',
    'skully_bg6',
  ];
  const handleClick = (event) => {
    event.preventDefault();
    onClick();
  };

  const handleBackgroundClick = (background) => {
    onBackgroundChange(background);
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
              className='background-image'
              onClick={() => handleBackgroundClick(background)}
            />
          ))}
        </div>
        <ButtonPurpleMain onClick={handleClick}>Close</ButtonPurpleMain>
      </div>
    </div>
  );
};

export default Settings;
