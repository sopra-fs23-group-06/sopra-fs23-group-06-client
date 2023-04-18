import React, { useState } from 'react';
import Card from "components/ui/Card";
import "styles/ui/PlayerHand.scss";

function getImagePath(cardItem) {
  if (cardItem[0] === "SPECIAL") {
    return cardItem[0] + '/' + cardItem[1];
  }
  return cardItem[0] + '/' + cardItem[0] + cardItem[1];

  //JUST AN IDEA, NEEDS TO BE IMPROVED
}

const PlayerHand = (props) => {
  const { cards, bid } = props;
  const [selectedCard, setSelectedCard] = useState(null);

  const handleCardClick = (card, index) => {
    if (selectedCard === card) {
      setSelectedCard(null);
    } else {
      setSelectedCard(card);
    }
  };

  const handleCancel = () => {
    setSelectedCard(null);
  };

  const handlePlay = () => {

    //HANDLE WHEN CARD GETS PLAYED

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
    top: '-30%',
    right: '50%'
  } : null;

  const playButtonStyle = selectedCard ? {
    position: 'absolute',
    top: '-30%',
    left: '50%',
  } : null;

  return (
    <div className="player-hand">
      {cards.map((card, index) => (
        <div key={index} className="player-hand-card-wrapper"
          style={{ '--index': index, '--initial-angle': `${initialAngle}deg`, '--rotation-angle': `${rotationAngle}deg` }}>
          <Card className={`player-hand-card ${selectedCard === card ? 'selected' : ''}`} path={card} onClick={() => handleCardClick(card, index)} />
        </div>
      ))}
      <div className="player-hand-bid">{bid}</div>

      {selectedCard && (
        <div className="selected-card-buttons" style={selectedCardWrapperStyle}>
          <button className="selected-card-button cancel-button" style={cancelButtonStyle} onClick={handleCancel}>Cancel</button>
          <button className="selected-card-button play-button" style={playButtonStyle} onClick={handlePlay}>Play</button>
        </div>
      )}
    </div>
  );

};

export default PlayerHand;