import React, { useState, useEffect } from 'react';
import 'styles/ui/MakeBid.scss';
import { ButtonPurpleMain } from './ButtonMain';

const MakeBid = ({ roundNumber, onSubmit, players }) => {
  const [bid, setBid] = useState('');
  const [isValid, setIsValid] = useState(false);
  const maxBid = roundNumber;
  const [secondsLeft, setSecondsLeft] = useState(35);
  const [bidSubmitted, setBidSubmitted] = useState(false);
  const [startingPlayer, setStartingPlayer] = useState('');
  const [recentRequest, setRecentRequest] = useState(false);


  useEffect(() => {
    if (secondsLeft === 0 && !bidSubmitted) {
      onSubmit(0);
    }
  }, [secondsLeft, bidSubmitted, onSubmit]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      if (secondsLeft > 0) {
        setSecondsLeft(secondsLeft - 1);
      }
    }, 1000);
    return () => clearTimeout(timerId);
  }, [secondsLeft]);

  useEffect(() => {
    const startingPlayer = players.find((player) => player.hasTurn);
    if (startingPlayer) {
      setStartingPlayer(startingPlayer.name);
    } else {
      setStartingPlayer("You start!");
    }
  }, [players]);
  

  const handleChange = (event) => {
    const value = parseInt(event.target.value);
    setBid(value);
    setIsValid(value >= 0 && value <= maxBid);
  };

  const handleConfirm = (event) => {
    setRecentRequest(true);
    event.preventDefault();
    setBidSubmitted(true);
    onSubmit(bid);
    setTimeout(() => {
      setRecentRequest(false);
    }, 1000)
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && isValid) {
      handleConfirm(event);
    }
  };

  return (
    <div className="make-bid" onKeyDown={handleKeyDown}>
      <div className="make-bid-header">
        <h2>Round {roundNumber}</h2>
        <h3>Starting Player: {startingPlayer}</h3>
      </div>
      <div className="make-bid-content">
        <label htmlFor="bid-input">Make bid:</label>
        <input type="number" id="bid-input" min="0" max={maxBid} value={bid} onChange={handleChange} />
        <div className="timer">Time left: {secondsLeft}s</div>
        <ButtonPurpleMain onClick={handleConfirm} disabled={!isValid || recentRequest}>
          Confirm
        </ButtonPurpleMain>
      </div>
    </div>
  );
};

export default MakeBid;
