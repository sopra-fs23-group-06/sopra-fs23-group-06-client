import React, { useEffect, useState } from 'react';
import 'styles/views/GameView.scss';
import BaseContainer from "components/ui/BaseContainer";
import PlayerHand from 'components/ui/PlayerHand';
import OtherPlayers from 'components/ui/OtherPlayers';
import MakeBid from 'components/ui/MakeBid';
import { api, handleError } from "../../helpers/api";
import PlayedCardsStack from 'components/ui/PlayedCardsStack';
import User from "../../models/User";
import { JitsiMeeting } from "@jitsi/react-sdk";
import { ButtonRules } from "../ui/ButtonMain";
import RuleBook from "../ui/RuleBook";
import { ButtonScoreboard } from 'components/ui/ButtonMain';
import Scoreboard from "components/ui/Scoreboard";
import RoundSummary from 'components/ui/RoundSummary';
import FinalScoreboard from 'components/ui/FinalScoreboard';
import "helpers/alert";




const GameView = props => {
  const [otherPlayers, setOtherPlayers] = useState([]);
  const [playedCards, setPlayedCards] = useState([]);
  const [roundNumber, setRoundNumber] = useState(1)
  const [playerHand, setPlayerHand] = useState([]);
  const [rulesOpen, setRulesOpen] = useState(false)
  const [bid, setBid] = useState(null);
  const [tricks, setTricks] = useState("");
  const [showScoreboard, setShowScoreboard] = useState(false);
  const [showRoundSummary, setShowRoundSummary] = useState(false);
  const [showFinalScoreboard, setShowFinalScoreboard]= useState(false);



    useEffect(() => {
      const lobbyCode = localStorage.getItem("lobbyCode");
      const loadData = async () => {
          try {
              const userId = localStorage.getItem("userId");
              const response = await api.get(`/games/${lobbyCode}/cardHandler?userId=${userId}`);
              setPlayerHand(response.data);
              const tableCards = await api.get(`/games/${lobbyCode}/playedCards`);
              setPlayedCards(tableCards.data)
              const round = await api.get(`/games/${lobbyCode}/rounds`);
              setRoundNumber(round.data)
          } catch (error) {
              clearInterval(intervalId)
              alert (`Something went wrong loading players data: \n${handleError(error)}`);
          }
      };
      const fetchOrder = async () => {
          try {
              const res = await api.get(`/games/${lobbyCode}/order`);
              const order = res[Object.keys(res)[0]];
              const allBidsSet = order.every(player => player.bid !== null);
              const newOrder = setOrder(order)
              const players = [];
              for (const player of newOrder) {
                  if (allBidsSet){players.push({ name: player.username, bid: `${player.tricks}/${player.bid}`,hand: player.hand });}
                  else{players.push({ name: player.username, bid: ``, hand: player.hand });}
              }
              setOtherPlayers(players);
          } catch (error) {
              clearInterval(intervalId)
              alert (`Something went wrong loading players data: \n${handleError(error)}`);
          }
      }
    loadData();
    fetchOrder();
    const intervalId = setInterval(async () => {
      try {
        await loadData();
        await fetchOrder();
      } catch (error) {
        clearInterval(intervalId); // Stop the interval loop
      }
    }, 500);

    // Clean up the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (roundNumber !== 1 && roundNumber !== 10) {
      setShowRoundSummary(true);
    }
    if (roundNumber === 11) {
      setShowFinalScoreboard(true);
    }
  }, [roundNumber]);

  function setOrder(order) {
    const currentPlayerId = parseInt(localStorage.getItem("userId"));
    const currentPlayerIndex = order.findIndex(player => player.id === currentPlayerId); 
    if (currentPlayerIndex === -1) {
      return order;
    }
    const newOrder = [...order];
    const currentPlayer = newOrder.splice(currentPlayerIndex, 1)[0];
    setBid(currentPlayer.bid)
    setTricks(currentPlayer.tricks)
    newOrder.unshift(currentPlayer);

    newOrder.sort((a, b) => {
      const aIndex = order.indexOf(a);
      const bIndex = order.indexOf(b);
      const relativeIndexA = (aIndex >= currentPlayerIndex) ? aIndex - currentPlayerIndex : order.length - currentPlayerIndex + aIndex;
      const relativeIndexB = (bIndex >= currentPlayerIndex) ? bIndex - currentPlayerIndex : order.length - currentPlayerIndex + bIndex;
      return relativeIndexA - relativeIndexB;
    });
    newOrder.splice(0, 1);

    return newOrder;
  }

    const toggleScoreboard = () => {
      setShowScoreboard(prevState => !prevState);
    };

  const handleConfirm = async (bid) => {
    try {
      const user = new User();
      user.id = localStorage.getItem("userId");
      user.bid = bid;
      await api.put(`/games/${localStorage.getItem("lobbyCode")}/bidHandler`, user);
  }catch (error){
      alert(`Something went wrong while entering bid: \n${handleError(error)}`);
  }
    // Send bid to server

  };


  function getGame() { //identifies lobby based on URL
    const url = window.location.pathname
    const split = url.split("/")
    return split[split.length - 1]
  }

  const displayBid = () => {
    if (bid === null) { return "" }
    return tricks + "/" + bid
  }

  function openRules() {
    setRulesOpen(true)
  }

  function closeRules() {
    setRulesOpen(false)
  }

  function closeRoundSummary() {
    setShowRoundSummary(false);
  }


  return (
    <BaseContainer>
      <JitsiMeeting
        configOverwrite={{
          startWithAudioMuted: false,
          hiddenPremeetingButtons: ['microphone'],
          prejoinPageEnabled: false,
          startAudioOnly: false,
          startWithVideoMuted: true,
          toolbarButtons: ['microphone']
        }}
        interfaceConfigOverwrite={{
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          SHOW_BRAND_WATERMARK: false,
          SHOW_CHROME_EXTENSION_BANNER: false,
          TOOLBAR_ALWAYS_VISIBLE: true
        }}
        userInfo={{
          displayName: localStorage.getItem("username")
        }}
        roomName={"SkullKingLobby" + getGame()}
        getIFrameRef={node => { node.style.height = '50px'; node.style.width = '50px'; }}
      />
      <PlayedCardsStack cards={playedCards} />
      <PlayerHand cards={playerHand} bid={displayBid()} />
      <OtherPlayers players={otherPlayers} />
      {bid == null && (
        <MakeBid roundNumber={roundNumber} onSubmit={handleConfirm} />
      )}
      {showRoundSummary && (
        <RoundSummary curRound={roundNumber-1} onContinue={closeRoundSummary}/>
      )}
      {showFinalScoreboard && (
        <FinalScoreboard/>
      )}
      <ButtonRules
        className="corner"
        onClick={() => { openRules() }}
      >?
      </ButtonRules>
      {rulesOpen && (
        <RuleBook onClick={closeRules} />
      )}
      <ButtonScoreboard onClick={toggleScoreboard} ></ButtonScoreboard>
      {showScoreboard && (
        <Scoreboard onClose={toggleScoreboard} />
      )}
    </BaseContainer>
  );
};

export default GameView;