import React, { useEffect, useState } from 'react';
import 'styles/views/GameView.scss';
import BaseContainer from "components/ui/BaseContainer";
import PlayerHand from 'components/ui/PlayerHand';
import OtherPlayers from 'components/ui/OtherPlayers';
import MakeBid from 'components/ui/MakeBid';
import {api, handleError} from "../../helpers/api";
import PlayedCardsStack from 'components/ui/PlayedCardsStack';
import User from "../../models/User";
import { JitsiMeeting } from "@jitsi/react-sdk";

function setOrder(order) {
  const currentPlayerId = localStorage.getItem("userId");
  const currentPlayerIndex = order.findIndex(player => player.id == currentPlayerId); // eslint-disable-line eqeqeq

  if (currentPlayerIndex == -1) {
    return order;
  }
  const newOrder = [...order];

  const currentPlayer = newOrder.splice(currentPlayerIndex, 1)[0];
  newOrder.unshift(currentPlayer);

  newOrder.sort((a, b) => {
    const aIndex = order.indexOf(a);
    const bIndex = order.indexOf(b);
    const relativeIndexA = (aIndex >= currentPlayerIndex) ? aIndex - currentPlayerIndex : order.length - currentPlayerIndex + aIndex;
    const relativeIndexB = (bIndex >= currentPlayerIndex) ? bIndex - currentPlayerIndex : order.length - currentPlayerIndex + bIndex;
    return relativeIndexA - relativeIndexB;
  });
  console.log(newOrder);
  newOrder.splice(0,1);

  return newOrder;
}


const GameView = props => {

    const [otherPlayers, setOtherPlayers] = useState([]);

    const fetchOrder = async () => {
      try {
        const res = await api.get(`/games/${localStorage.getItem("lobbyCode")}/Order`);
        const order = res[Object.keys(res)[0]];
        const newOrder = setOrder(order)
        const players = [];
  
        for (const player of newOrder) {
            players.push({ name: player.username, bid: `0/${player.bid}` });
        }
        

        setOtherPlayers(players);
      } catch (error) {
        console.error(error);
      }
    }
  
    useEffect(() => {
      fetchOrder();
    }, [])

    
  //const playerHand = ['black/Black1', 'special/Skull_King', 'red/Red1', 'special/Escape', 'special/Scary_Mary', 'black/Black11', 'red/Red9', 'special/Badeye_Joe'];
  const playedCards = [/*'black/Black6', 'red/Red7', 'yellow/Yellow13'*/];
  const roundNumber = 1;

  const [playerHand, setPlayerHand] = useState([]);

  const loadData = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const lobbyCode = localStorage.getItem("lobbyCode");
      const response = await api.get(`/games/${lobbyCode}/cardHandler?userId=${userId}`);
      setPlayerHand(response.data);
      console.log(playerHand);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);


  const [bid, setBid] = useState(null);
  const [tricks, setTricks] = useState("")
  const [showPopup, setShowPopup] = useState(true);


  const handleConfirm = async (bid) => {
    try {
      const user = new User();
      user.id = localStorage.getItem("userId");
      user.bid = bid;
      const response = await api.put(`/games/${localStorage.getItem("lobbyCode")}/bidHandler`, user);
      const bidIsSet = new User(response.data)
      setBid(bidIsSet.bid);
      setTricks(0)
      setShowPopup(false);
  }catch (error){
      alert(`Something went wrong while entering bid: \n${handleError(error)}`);
  }
    // Send bid to server

  };

  /*const handleOpenPopup = () => {
    setShowPopup(true);
  };*/

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  function getGame() { //identifies lobby based on URL
    const url = window.location.pathname
    const split = url.split("/")
    return split[split.length - 1]
  }

const displayBid = () => {
      if(bid === null){return ""}
      return tricks + "/" + bid
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
      {showPopup && (
        <MakeBid roundNumber={roundNumber} onClose={handleClosePopup} onSubmit={handleConfirm} />
      )}
    </BaseContainer>
  );
};

export default GameView;