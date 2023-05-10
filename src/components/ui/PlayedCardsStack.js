import React from 'react';
import 'styles/ui/PlayedCardsStack.scss';

function getImagePath(cardItem) {
  if (cardItem.color === "SPECIAL") {
    if (cardItem.aRank === "PIRATE") {
      return cardItem.color.toLowerCase() + '/'+ cardItem.aOption.toLowerCase();
    }
    return cardItem.color.toLowerCase() + '/' + cardItem.aRank.toLowerCase();
  }
  return cardItem.color.toLowerCase() + '/' + cardItem.color.toLowerCase() + '_' + cardItem.aRank.toLowerCase();

  //JUST AN IDEA, NEEDS TO BE IMPROVED
}

const PlayedCardsStack = ({ cards }) => {
  //const totalRotationAngle = 5;
  //const rotationAngleVariation = 10;

  return (
    <div className="played-cards-stack">
      {cards.map((card, index) => {
        const rotationAngle = 0;//totalRotationAngle - Math.random() * rotationAngleVariation * 2;
        const transformStyle = `rotate(${rotationAngle}deg)`;

        return (
          <div className="played-card" key={index} style={{ transform: transformStyle }}>
            <img src={require(`../../styles/images/cards/${getImagePath(card)}.png`)} alt={card} />
          </div>
        );
      })}
    </div>
  );
};

export default PlayedCardsStack;