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
import LayoutSettings from 'components/ui/LayoutSettings';
import { toast } from 'react-toastify';
import {useHistory} from "react-router-dom";





const GameView = props => {
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
  const showedInfos = useRef(false);
  const history = useHistory();



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
        if(round.data===1 && !showedInfos.current){
          toast.warning('You are unmuted! To mute yourself press the button on the top left.')
          setTimeout(function() {
            toast.info(`You can open the score board on the top right`);
          }, 6500);
          setTimeout(function() {
            toast.info(`You can change the background in the top left`);
          }, 9000);
          showedInfos.current=true;
        }
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
        toast.error(`Something went wrong loading players data: \n${handleError(error)}`);
      }
    };
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/games/${lobbyCode}/order`);
        if (res.data){
        const order = res[Object.keys(res)[0]];
        const allBidsSet = order.every(player => player.bid !== null);
        const newOrder = setOrder(order)
        const players = [];
        for (const player of newOrder) {
          if (allBidsSet) {
            players.push({ name: player.username, bid: `${player.tricks}/${player.bid}`, hand: player.hand, hasTurn: player.hasTurn });
            if (showedAnimationBid.current === false) {
              showAnimation();
            }
          }
          else {
            players.push({ name: player.username, bid: ``, hand: player.hand, hasTurn: player.hasTurn});
            showedAnimationBid.current = false;
          }
        }
        setOtherPlayers(players);
        await loadData();}
        else{
          localStorage.removeItem("lobbyCode")
          localStorage.removeItem("userId")
          localStorage.removeItem("inGame")
          history.push("/closed")
        }
      } catch (error) {
        clearInterval(intervalId)
        toast.error(`Something went wrong loading players data: \n${handleError(error)}`);
      }
    }


    function showAnimation() {
      const pictures = [
        { src: require('../../styles/images/yohoho/bomb.png') },
        { src: require('../../styles/images/yohoho/yo.png') },
        { src: require('../../styles/images/yohoho/ho-1.png') },
        { src: require('../../styles/images/yohoho/ho-2.png') }
      ];
      const delay = 10000; 
    
      const container = document.createElement("div");
      container.classList.add("animation-container");
    
     const soundEffect = new Audio(require('../../styles/images/yohoho/yohoho-sound.mp3')); 
    
      pictures.forEach((picture, index) => {
        const img = document.createElement("img");
        img.classList.add("animated-picture");
        img.src = picture.src;
        img.style.animationDelay = `${index * delay + index * 1000}ms`;
    
        if (index === 0) {
          img.classList.add("bottom-middle");
          img.classList.add("bomb-animation");
        } else if (index === 1) {
          img.classList.add("middle-left");
        } else if (index === 2) {
          img.classList.add("middle-middle");
        } else if (index === 3) {
          img.classList.add("middle-right");
        }
    
        setTimeout(() => {
          container.appendChild(img);
          if (index === 1) {
            var resp = soundEffect.play();

            if (resp!== undefined) {
                resp.then(_ => {
                }).catch(error => {
                });
            }
          }
        }, index * 800);
      });
    
      document.body.appendChild(container);
    
      setTimeout(() => {
        container.remove();
      }, 3500);
    
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


    fetchOrder();
    const intervalId = setInterval(async () => {
      try {
        await fetchOrder();
      } catch (error) {
        clearInterval(intervalId); // Stop the interval loop
      }
    }, 500);

    // Clean up the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, [history]);

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
      toast.error(`Something went wrong while entering bid: \n${handleError(error)}`);
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
          startAudioOnly: true,
          startWithVideoMuted: true,
          toolbarButtons: ['microphone'],
          conferenceInfo: {
            alwaysVisible: [],
            autoHide: []
          }
        }}
        interfaceConfigOverwrite={{
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          SHOW_BRAND_WATERMARK: false,
          SHOW_CHROME_EXTENSION_BANNER: false,
          TOOLBAR_ALWAYS_VISIBLE: true,
          SHOW_POWERED_BY: false,
          SHOW_PROMOTIONAL_CLOSE_PAGE: false,
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
        <MakeBid players={otherPlayers} roundNumber={roundNumber} onSubmit={handleConfirm} />
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
          <LayoutSettings onClick={closeSettings} />
        )}
      </div>
    </BaseContainer>
  );
};

export default GameView;