import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ButtonPurpleMain } from './ButtonMain';
import 'styles/ui/Settings.scss';

const GameSettings = ({initialRoundsToPlay, initialPlayerSize, onRoundChange, onPlayerSizeChange, onClose, onSave }) => {
  const [roundsToPlay, setRoundsToPlay] = useState(initialRoundsToPlay);
  const [playerSize, setPlayerSize] = useState(initialPlayerSize);

  const handleRoundChange = event => {
    const value = parseInt(event.target.value);
    setRoundsToPlay(value);
    onRoundChange(value);
  };
  
  const handleSave = () => {
    onSave(roundsToPlay, playerSize);
  };

  const handlePlayerSizeChange = event => {
    const value = parseInt(event.target.value);
    setPlayerSize(value);
    onPlayerSizeChange(value);
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="settings">
      <div className="settings-content">
        <div className="settings-content-header">Game Settings:</div>
        <div className="settings-content-label">Rounds to Play:</div>
        <input
          type="range"
          min={3}
          max={10}
          value={roundsToPlay}
          onChange={handleRoundChange}
          className="settings-slider slider-round"
        />
        <div className="settings-value">{roundsToPlay}</div>
        <div className="settings-space"></div>
        <div className="settings-content-label">Player Size:</div>
        <input
          type="range"
          min={2}
          max={6}
          value={playerSize}
          onChange={handlePlayerSizeChange}
          className="settings-slider slider-player"
        />
        <div className="settings-value">{playerSize}</div>
        <div className="settings-space"></div>
        <div className="settings-button-container">
          <ButtonPurpleMain onClick={handleSave}>Save</ButtonPurpleMain>
          <ButtonPurpleMain onClick={handleClose}>Close</ButtonPurpleMain>
        </div>
      </div>
    </div>
  );
};

GameSettings.propTypes = {
  initialRoundsToPlay: PropTypes.number.isRequired,
  initialPlayerSize: PropTypes.number.isRequired,
  onRoundChange: PropTypes.func.isRequired,
  onPlayerSizeChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default GameSettings;