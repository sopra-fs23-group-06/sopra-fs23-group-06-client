import React, { useState, useEffect } from 'react';
import 'styles/ui/Scoreboard.scss';
import { api, handleError } from "../../helpers/api";
import { ButtonPurpleMain } from './ButtonMain';
import "../../helpers/alert";
import leaveIcon from "styles/images/leave.png";
import 'styles/ui/Arrow.scss';
import { useHistory } from "react-router-dom";
import { toast } from 'react-toastify';

const Scoreboard = ({ onClose }) => {
  const [scoreboardData, setScoreboardData] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const fetchScoreboardData = async () => {
      try {
        const lobbyCode = localStorage.getItem("lobbyCode");
        const response = await api.get(`/games/${lobbyCode}/scoreboard`);
        setScoreboardData(response.data.scoreboard);
      } catch (error) {
        toast.error(`Something went wrong loading the score board: \n${handleError(error)}`);
      }
    };
    fetchScoreboardData();
  }, []);

  const handleClick = (event) => {
    event.preventDefault();
    onClose();
  };

  const handleLeaveGame = () => {
    setShowConfirmation(true);
  };

  async function confirmLeaveGame(){
    setShowConfirmation(false);
    try {
      const lobbyCode = localStorage.getItem("lobbyCode");
      await api.put(`/lobbies/${lobbyCode}/endHandler`);
      localStorage.removeItem("lobbyCode")
      localStorage.removeItem("userId")
      localStorage.removeItem("inGame")
      history.push("/")
      await new Promise(resolve => setTimeout(resolve, 500));
      await api.put(`/lobbies/${lobbyCode}/closeHandler`, null, {
        headers: {
          "userId": 1
        }
      })
    } catch (error) {
      toast.error(`Something went wrong while leaving the lobby: \n${handleError(error)}`);
    }
  }

  const cancelLeaveGame = () => {
    setShowConfirmation(false);
  };


  return (
    <div className="scoreboard">
      <div className='scoreboard-container'>
      <div className="scoreboard-content">
        <div className="scoreboard-content-header">Scoreboard</div>
        {scoreboardData && (
          <div>
            <table>
              <thead>
                <tr>
                  <th></th>
                  {scoreboardData.map((playerData, index) => (
                    <th key={index}>{playerData[0].curPlayer}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...Array(scoreboardData[0].length)].map((_, roundIndex) => (
                  <tr key={roundIndex}>
                    <td>{roundIndex + 1}</td>
                    {scoreboardData.map((playerData, playerIndex) => {
                      const score = playerData.find((score) => score.curRound === roundIndex + 1);
                      return (
                        <td key={playerIndex}>
                          {score.curPoints && (
                            <>
                              <div>Bids: {score.curBid} | Points: {score.curPoints}</div>
                            </>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                <tr>
                  <td>T</td>
                  {scoreboardData.map((playerData, playerIndex) => (
                    <td key={playerIndex}>
                      {playerData.reduce((sum, score) => sum + score.curPoints, 0)}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>

          </div>
        )}
        <div className='scoreboard-buttons'>
          <div className='button-group'>
            <ButtonPurpleMain onClick={handleClick}><div class="arrow left"></div>Back</ButtonPurpleMain>
            <ButtonPurpleMain onClick={() => handleLeaveGame()} >Leave <img className="icon" src={leaveIcon} alt="Leave Icon" /></ButtonPurpleMain>
          </div>
        </div>

      </div >
    </div>
    {showConfirmation && (
          <div className='confirmation'>
            <div className="confirmation-dialog">
              <div className="confirmation-text">Are you sure you want to leave this game?</div>
              <div className="confirmation-text"> This will end the game for all other Players.</div>
              <div className="confirmation-buttons">
                <ButtonPurpleMain onClick={confirmLeaveGame}>Yes</ButtonPurpleMain>
                <ButtonPurpleMain onClick={cancelLeaveGame}>No</ButtonPurpleMain>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default Scoreboard;