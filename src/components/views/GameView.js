import React, { useEffect, useState, useRef } from 'react';
import 'styles/views/GameView.scss';
import BaseContainer from "components/ui/BaseContainer";
import PlayerHand from 'components/ui/PlayerHand';
import OtherPlayers from 'components/ui/OtherPlayers';
import MakeBid from 'components/ui/MakeBid';
import { api, handleError } from "../../helpers/api";
import PlayedCardsStack from 'components/ui/PlayedCardsStack';
import User from "../../models/User";
import { JitsiMeeting } from "@jitsi/react-sdk";
import { ButtonRules, ButtonSettings } from "../ui/ButtonMain";
import RuleBook from "../ui/RuleBook";
import { ButtonScoreboard } from 'components/ui/ButtonMain';
import Scoreboard from "components/ui/Scoreboard";
import RoundSummary from 'components/ui/RoundSummary';
import FinalScoreboard from 'components/ui/FinalScoreboard';
import "helpers/alert";
import "components/views/GameView"
import Settings from 'components/ui/Settings';




const GameView = props => {
  const [backgroundImage, setBackgroundImage] = useState('skully_bg1');
  const [otherPlayers, setOtherPlayers] = useState([]);
  const [playedCards, setPlayedCards] = useState([]);
  const [roundNumber, setRoundNumber] = useState(1)
  const [playerHand, setPlayerHand] = useState([]);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [SettingsOpen, setSettingsOpen] = useState(false);
  const [bid, setBid] = useState(null);
  const [tricks, setTricks] = useState("");
  const [showScoreboard, setShowScoreboard] = useState(false);
  const [showRoundSummary, setShowRoundSummary] = useState(false);
  const [showFinalScoreboard, setShowFinalScoreboard] = useState(false);
  const showedAnimationBid = useRef(false);
  const showedAnimationTrickWinner = useRef(false);

  const handleBackgroundChange = (background) => {
    setBackgroundImage(background);
  };

  useEffect(() => {
    //DOESN'T WORK CORRECTLY YET!
    document.documentElement.style.setProperty('--selected-background', `url("styles/images/backgrounds/${backgroundImage}.png")`);
  }, [backgroundImage]);


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
        const playerSize = (await api.get(`/games/${lobbyCode}/order`)).data.length;
        if (tableCards.data.length === playerSize) {
          if (showedAnimationTrickWinner.current === false) {
            const trickWinner = await api.get(`/games/${lobbyCode}/trickWinner`);
            showedAnimationTrickWinner.current = true;
            displayTrickWinner(trickWinner.data);
          }
        }
        else {
          showedAnimationTrickWinner.current = false;
        }
        setRoundNumber(round.data)
        if (round.data > 10) { clearInterval(intervalId); }
      } catch (error) {
        clearInterval(intervalId)
        alert(`Something went wrong loading players data: \n${handleError(error)}`);
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
          if (allBidsSet) {
            players.push({ name: player.username, bid: `${player.tricks}/${player.bid}`, hand: player.hand, hasTurn: player.hasTurn });
            if (showedAnimationBid.current === false) {
              showAnimation("YO-HO-HO!");
            }
          }
          else {
            players.push({ name: player.username, bid: ``, hand: player.hand });
            showedAnimationBid.current = false;
          }
        }
        setOtherPlayers(players);
      } catch (error) {
        clearInterval(intervalId)
        alert(`Something went wrong loading players data: \n${handleError(error)}`);
      }
    }
    function showAnimation(content) {
      const scream = document.createElement("div");
      scream.classList.add("scream");

      const screamContent = document.createElement("div");
      screamContent.classList.add("scream-content");
      screamContent.innerText = content;

      scream.appendChild(screamContent);
      document.body.appendChild(scream);
      showedAnimationBid.current = true;
    }

    function displayTrickWinner(trickWinner) {
      const trophyAnimation = document.createElement("div");
      trophyAnimation.classList.add("trophy-animation");

      const trophyImg = document.createElement("img");
      trophyImg.src = require('../../styles/images/pokal.png');
      trophyImg.classList.add("trophy-img");
      trophyAnimation.appendChild(trophyImg);

      const username = document.createElement("div");
      username.textContent = trickWinner.username;
      username.classList.add("trophy-username");
      trophyAnimation.appendChild(username);

      document.body.appendChild(trophyAnimation);

      setTimeout(() => {
        trophyAnimation.remove();
      }, 3000);
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
    if (roundNumber !== 1 && roundNumber !== 11) {
      setShowRoundSummary(true);
      setTimeout(() => {
        setShowRoundSummary(false);
      }, 6000); // Display for 6 seconds (6000 milliseconds)
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
    } catch (error) {
      alert(`Something went wrong while entering bid: \n${handleError(error)}`);
    }
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
    setRulesOpen(true);
  }

  function closeRules() {
    setRulesOpen(false);
  }

  function openSettings() {
    setSettingsOpen(true);
  }

  function closeSettings() {
    setSettingsOpen(false);
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
      {(bid == null && roundNumber < 11) && (
        <MakeBid roundNumber={roundNumber} onSubmit={handleConfirm} />
      )}
      {showRoundSummary && (
        <RoundSummary curRound={roundNumber - 1} />
      )}
      {showFinalScoreboard && (
        <FinalScoreboard />
      )}
      <div className='buttons'>
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
        <ButtonSettings
          className='corner'
          onClick={() => { openSettings() }}>
        </ButtonSettings>
        {SettingsOpen && (
          <Settings onClick={closeSettings} onBackgroundChange={handleBackgroundChange} />
        )}
      </div>
    </BaseContainer>
  );
};

export default GameView;