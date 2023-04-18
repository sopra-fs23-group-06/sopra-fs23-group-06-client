import React from 'react';
import 'styles/ui/PlayedCardsStack.scss';

const PlayedCardsStack = ({ cards }) => {
  const totalRotationAngle = 5;
  const rotationAngleVariation = 10;

  return (
    <div className="played-cards-stack">
      {cards.map((card, index) => {
        const rotationAngle = totalRotationAngle - Math.random() * rotationAngleVariation * 2;
        const transformStyle = `rotate(${rotationAngle}deg)`;

        return (
          <div className="played-card" key={index} style={{ transform: transformStyle }}>
            <img src={require(`styles/images/cards/${card}.png`)} alt={card} />
          </div>
        );
      })}
    </div>
  );
};

export default PlayedCardsStack;
