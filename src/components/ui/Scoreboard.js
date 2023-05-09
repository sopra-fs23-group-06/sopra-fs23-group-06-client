import React, { useState, useEffect } from 'react';
import 'styles/ui/Scoreboard.scss';
import { api, handleError } from "../../helpers/api";
import { ButtonPurpleMain } from './ButtonMain';
import "../../helpers/alert";


const Scoreboard = ({ onClose }) => {
  const [scoreboardData, setScoreboardData] = useState(null);

  useEffect(() => {
    const fetchScoreboardData = async () => {
      try {
        const lobbyCode = localStorage.getItem("lobbyCode");
        const response = await api.get(`/games/${lobbyCode}/scoreboard`);
        setScoreboardData(response.data.scoreboard);
      } catch (error) {
        alert(`Something went wrong loading the score board: \n${handleError(error)}`);
      }
    };
    fetchScoreboardData();
  }, []);

  const handleClick = (event) => {
    event.preventDefault();
    onClose();
  };

  return (
    <div className="scoreboard">
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
                {[...Array(10)].map((_, roundIndex) => (
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
            <ButtonPurpleMain onClick={handleClick}>Back</ButtonPurpleMain>
          </div>
        )}
      </div>
    </div>
  );
};

export default Scoreboard;