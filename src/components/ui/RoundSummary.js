import React, { useState, useEffect } from 'react';
import 'styles/ui/RoundSummary.scss';
import 'styles/ui/Arrow.scss';
import { api, handleError } from "../../helpers/api";
import "../../helpers/alert";
import { toast } from 'react-toastify';
import {ButtonPurpleList, ButtonPurpleLobby, ButtonPurpleMain} from "./ButtonMain";



const RoundSummary = ({ curRound, onContinue }) => {
  const [roundScoreboardData, setScoreboardData] = useState(null);

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
    onContinue();
  };

  return (
    <div className="round-summary">
      <div className="round-summary-content">
        <div className="round-summary-content-header">Round {curRound}</div>
        <div className="round-summary-content-header2">Summary</div>
        {roundScoreboardData && (
          <div>
            <table>
              <thead>
                <tr>
                  <th></th>
                  {roundScoreboardData.map((playerData, index) => (
                    <th key={index}>{playerData[0].curPlayer}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Bid</td>
                  {roundScoreboardData.map((playerData, playerIndex) => (
                    <td key={playerIndex}>{playerData[curRound - 1].curBid}</td>
                  ))}
                </tr>
                <tr>
                  <td>Tricks</td>
                  {roundScoreboardData.map((playerData, playerIndex) => (
                    <td key={playerIndex}>{playerData[curRound - 1].curTricks}</td>
                  ))}
                </tr>
                <tr>
                  <td>Score</td>
                  {roundScoreboardData.map((playerData, playerIndex) => (
                    <td key={playerIndex}>{playerData[curRound - 1].curPoints}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
        <ButtonPurpleList onClick={handleClick}>Continue</ButtonPurpleList>
      </div>
    </div>
  );
};

export default RoundSummary;