import React from 'react';
import PropTypes from 'prop-types';
import 'styles/ui/OtherPlayers.scss';

const OtherPlayers = ({ players }) => {
  const renderPlayer = (player, position) => (
    <div className={`other-player ${position}`}>
      <div className="other-player-name">{player.name}</div>
      <div className="other-player-bid">{player.bid}</div>
    </div>
  );

  const renderPlayers = () => {
    const numPlayers = players.length;
    if (numPlayers === 1) {
      return (
        <>
          {renderPlayer(players[0], 'upper')}
        </>
      );
    } else if (numPlayers === 2) {
      return (
        <>
          {renderPlayer(players[0], 'left')}
          {renderPlayer(players[1], 'upper')}
        </>
      );
    } else if (numPlayers === 3) {
      return (
        <>
          {renderPlayer(players[0], 'left')}
          {renderPlayer(players[1], 'upper')}
          {renderPlayer(players[2], 'right')}
        </>
      );
    } else if (numPlayers === 4) {
      return (
        <>
          {renderPlayer(players[0], 'left')}
          {renderPlayer(players[1], 'upper')}
          {renderPlayer(players[2], 'upper')}
          {renderPlayer(players[3], 'right')}
        </>
      );
    } else if (numPlayers === 5) {
      return (
        <>
          {renderPlayer(players[0], 'left')}
          {renderPlayer(players[1], 'upper')}
          {renderPlayer(players[2], 'upper')}
          {renderPlayer(players[3], 'upper')}
          {renderPlayer(players[4], 'right')}
        </>
      );
    }
    return null;
  };

  return (
    <div className="other-players-container">
      {renderPlayers()}
    </div>
  );
};

OtherPlayers.propTypes = {
  players: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      bid: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default OtherPlayers;
