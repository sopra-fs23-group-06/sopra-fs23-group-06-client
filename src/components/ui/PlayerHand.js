import React, { useState } from 'react';
import Card from "components/ui/Card";
import "styles/ui/PlayerHand.scss";
import { api, handleError } from "../../helpers/api";
//import { bool } from 'prop-types';
import "../../helpers/alert";
import getImagePath from "../../helpers/getImagePath";
import { toast } from 'react-toastify';





const PlayerHand = (props) => {
  const { cards, bid } = props;
  const [selectedCard, setSelectedCard] = useState(null);
  const [scarryMarry, setScaryMary] = useState(null);
  const [recentRequest, setRecentRequest] = useState(false);


  const handleCardClick = (card, index) => {
    if (card.playable) {
      if (scarryMarry){}
      else {
        setSelectedCard(card);
      }
    }
  };

  const handleCancel = () => {
    setSelectedCard(null);
  };

  const handlePlayClick = (boolean) =>{
    setScaryMary(boolean);
  }

  const Scary = (option) =>{
    selectedCard.aOption=option;
  }


  const handlePlay = async (card) => {
    try {
      const userId = localStorage.getItem("userId");
      if(selectedCard.aRank === "SCARY_MARY"){
        handlePlayClick(true)
        return;
      }
      else{handlePlayClick(false);}
      setRecentRequest(true);
      const requestBody = JSON.stringify({ color: selectedCard.color, aRank: selectedCard.aRank, aOption: selectedCard.aOption});
      const lobbyCode = localStorage.getItem("lobbyCode");
      await api.put(`/games/${lobbyCode}/cardHandler?userId=${userId}`, requestBody);
      
    } catch (error) {
      toast.error(`Something went wrong playing the card: \n${handleError(error)}`);
    }
    setTimeout(() => {
      setRecentRequest(false);
    }, 2000)
    setSelectedCard(null);
  };

  const handlePlayScary = async (card) => {
    try {
      handlePlayClick(false);
      const userId = localStorage.getItem("userId");
      const requestBody = JSON.stringify({ color: selectedCard.color, aRank: selectedCard.aRank, aOption: selectedCard.aOption});
      const lobbyCode = localStorage.getItem("lobbyCode");
      await api.put(`/games/${lobbyCode}/cardHandler?userId=${userId}`, requestBody);
    } catch (error) {
      toast.error(`Something went wrong playing the card: \n${handleError(error)}`);
    }
    setSelectedCard(null);
  };



  const cardCount = cards.length;
  const totalRotationAngle = 30;
  const rotationAngle = totalRotationAngle / cardCount;
  const initialAngle = -totalRotationAngle / 2 + rotationAngle / 2;

  const selectedCardWrapperStyle = selectedCard ? {
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)'
  } : null;

  const cancelButtonStyle = selectedCard ? {
    position: 'absolute',
    top: '100%',
    right: '50%'
  } : null;

  const playButtonStyle = selectedCard ? {
    position: 'absolute',
    top: '100%',
    left: '50%',
  } : null;


  return (
    <div className="player-hand">
      {cards.map((card, index) => (
        <div key={index} className="player-hand-card-wrapper"
          style={{ '--index': index, '--initial-angle': `${initialAngle}deg`, '--rotation-angle': `${rotationAngle}deg` }}>
          <Card className={`player-hand-card ${selectedCard === card ? 'selected' : ''} ${!card.playable ? 'unplayable' : ''}`} path={getImagePath(card)} onClick={() => handleCardClick(card, index)} disabled={!card.playable} />
        </div>
      ))}
      <div className="player-hand-bid">{bid}</div>
      
      {selectedCard && (
        <div className="selected-card-buttons" style={selectedCardWrapperStyle}>
          <Card path={getImagePath(selectedCard)} />
          <button className="selected-card-button cancel-button" style={cancelButtonStyle} onClick={handleCancel}>Cancel</button>
          <button className="selected-card-button play-button" style={playButtonStyle} onClick={handlePlay} disabled={recentRequest}>Play</button>
        </div>
      )}
      {scarryMarry &&(
        <div className="selected-card-buttons" style={selectedCardWrapperStyle}>
          <Card path={getImagePath(selectedCard)} />
          <button className="selected-card-button cancel-button" style={cancelButtonStyle} onClick={() => {
            Scary("PIRATE");
            handlePlayScary();
          }}>Pirate</button>
          <button className="selected-card-button play-button" style={playButtonStyle} onClick={() => {
            Scary("ESCAPE");
            handlePlayScary();
          }}>Escape</button>
        </div>
      )}
    </div>
  );

};

export default PlayerHand;