import React, { useState } from 'react';
import 'styles/ui/MakeBid.scss';
import { ButtonPurpleMain } from './ButtonMain';

const MakeBid = ({ roundNumber, onSubmit }) => {
  const [bid, setBid] = useState('');
  const [isValid, setIsValid] = useState(false);
  const maxBid = roundNumber;

  const handleChange = (event) => {
    const value = parseInt(event.target.value);
    setBid(value);
    setIsValid(value >= 0 && value <= maxBid);
  };

  const handleConfirm = (event) => {
    showScream();
    event.preventDefault();
    onSubmit(bid);
  };

  function showScream() {
    const scream = document.createElement("div");
    scream.classList.add("scream");
  
    const screamContent = document.createElement("div");
    screamContent.classList.add("scream-content");
    screamContent.innerText = "YO-HO-HO!";
  
    scream.appendChild(screamContent);
    document.body.appendChild(scream);
  }

  return (
    <div className="make-bid">
      <div className="make-bid-header">
        <h2>Round {roundNumber}</h2>
      </div>
      <div className="make-bid-content">
        <label htmlFor="bid-input">Make bid:</label>
        <input type="number" id="bid-input" min="0" max={maxBid} value={bid} onChange={handleChange} />
        <ButtonPurpleMain onClick={handleConfirm} disabled={!isValid}>Confirm</ButtonPurpleMain>
      </div>
    </div>
  );
};

export default MakeBid