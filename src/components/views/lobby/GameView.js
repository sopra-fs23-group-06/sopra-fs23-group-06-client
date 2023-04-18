import React, { useState } from 'react';
import 'styles/views/GameView.scss';
import BaseContainer from "components/ui/BaseContainer";
import PlayerHand from 'components/ui/PlayerHand';
import OtherPlayers from 'components/ui/OtherPlayers';
import MakeBid from 'components/ui/MakeBid';
import { api } from "../../../helpers/api";
import PlayedCardsStack from 'components/ui/PlayedCardsStack';



const GameView = props => {
  //seperate player from other players while considering the order

  //DATA JUST FOR TEST PURPOSE

  const otherPlayers = [
    { name: 'Player 2', bid: '0/1' },
    { name: 'Player 3', bid: '0/0' },
    { name: 'Player 4', bid: '0/1' },
    { name: 'Player 5', bid: '0/1' },
    { name: 'Player 6', bid: '0/0' },

  ];
  const playerHand = ['Black/Black1', 'Black/Black2', 'Red/Red1', 'Special/Escape', 'Special/Scary_Mary', 'Black/Black11', 'Red/Red9', 'Special/Badeye_Joe'];
  const playedCards = ['Black/Black6', 'Red/Red7', 'Yellow/Yellow13'];

  const roundNumber = 1;
  const [bid, setBid] = useState(null);

  const [showPopup, setShowPopup] = useState(true);

  const handleConfirm = (bid) => {
    setBid(`0/${bid}`);
    api.post(`/games/${localStorage.getItem("lobbyCode")}/bidHandler`, bid);
    setShowPopup(false);

    // Send bid to server

  };

  const handleOpenPopup = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (

    <BaseContainer>
      <PlayedCardsStack cards={playedCards} />
      <PlayerHand cards={playerHand} bid={bid} />
      <OtherPlayers players={otherPlayers} />
      {showPopup && (
        <MakeBid roundNumber={roundNumber} onClose={handleClosePopup} onSubmit={handleConfirm} />
      )}
    </BaseContainer>
  );
};

export default GameView;