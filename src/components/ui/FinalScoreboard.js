import React, { useState, useEffect } from 'react';
import 'styles/ui/Scoreboard.scss';
import { api, handleError } from "../../helpers/api";
import { ButtonPurpleMain } from './ButtonMain';
import { useHistory } from "react-router-dom";
import GoldMedal from "styles/images/medals/gold_medal.png";
import SilverMedal from "styles/images/medals/silver_medal.png";
import BronzeMedal from "styles/images/medals/bronze_medal.png";
import "helpers/alert";



const FinalScoreboard = () => {
  const [scoreboardData, setScoreboardData] = useState(null);
  const [rankings, setRankings] = useState([]);
  const history = useHistory();

  useEffect(() => {
    const fetchScoreboardData = async () => {
      try {
        const lobbyCode = localStorage.getItem("lobbyCode");
        const response = await api.get(`/games/${lobbyCode}/scoreboard`);
        const scoreboardData = response.data.scoreboard;

        const summedScores = scoreboardData.reduce((acc, playerData) => {
          const totalPoints = playerData.reduce((sum, score) => sum + score.curPoints, 0);
          return [...acc, { player: playerData[0].curPlayer, points: totalPoints }];
        }, []);
        const sortedRankings = summedScores
          .slice()
          .sort((a, b) => b.points - a.points)
          .map((score, index) => ({ ...score, rank: index + 1 }));
        const rankingsWithOriginalIndex = sortedRankings.map((ranking) => {
          const originalIndex = scoreboardData.findIndex(
            (playerData) => playerData[0].curPlayer === ranking.player
          );
          return { ...ranking, originalIndex };
        });

        const sortedRankingsByOriginalIndex = rankingsWithOriginalIndex.sort(
          (a, b) => a.originalIndex - b.originalIndex
        );

        setScoreboardData(scoreboardData);
        setRankings(sortedRankingsByOriginalIndex);
      } catch (error) {
        alert(`Something went wrong loading the score board: \n${handleError(error)}`);
      }
    };
    fetchScoreboardData();
  }, []);

  const formatRank = (rank) => {
    if (rank === 1) {
      return '1st';
    } else if (rank === 2) {
      return '2nd';
    } else if (rank === 3) {
      return '3rd';
    } else {
      return `${rank}th`;
    }
  };

  const getMedal = (rank) => {
    if (rank === 1) {
      return <img className="medal" src={GoldMedal} alt="Gold Medal" />;
    } else if (rank === 2) {
      return <img className="medal" src={SilverMedal} alt="Silver Medal" />;
    } else if (rank === 3) {
      return <img className="medal" src={BronzeMedal} alt="Bronze Medal" />;
    } else { return ""; }

  }

  function leaveGame() {
    localStorage.removeItem("lobbyCode")
    localStorage.removeItem("userId")
    localStorage.removeItem("inGame")
    history.push("/")
  }

  return (
    <div className="scoreboard">
      <div className="scoreboard-content">
        <div className="scoreboard-content-header">End of Game</div>
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
                <tr>
                  <td className='no-border'></td>
                  {rankings.map((player, index) => (
                    <td className='no-border' key={index}>{formatRank(player.rank)} {getMedal(player.rank)}</td>
                  ))}
                </tr>
              </tbody>
            </table>
            <ButtonPurpleMain onClick={leaveGame}>End</ButtonPurpleMain>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinalScoreboard;