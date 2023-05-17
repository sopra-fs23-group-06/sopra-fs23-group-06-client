import React, {useCallback, useEffect, useState} from 'react';
import { useHistory } from 'react-router-dom';
import 'styles/views/Lobby.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import {
    ButtonKick,
    ButtonPurpleList, ButtonRules,
    ButtonWhiteList,
    ButtonCopy,ButtonSettings
} from "../../ui/ButtonMain";
import { api, handleError } from "../../../helpers/api";
import User from "../../../models/User";
import { JitsiMeeting } from "@jitsi/react-sdk";
import RuleBook from "../../ui/RuleBook";
import "../../../helpers/alert";
import GameSettings from 'components/ui/GameSettings';




const FormField = props => {


    return (
        <div className="lobby field">
            <label className="lobby label">
                {props.label}
            </label>
            <input
                className="lobby input"
                value={props.value}
                onChange={e => props.onChange(e.target.value)}
            />
        </div>
    );
};

FormField.propTypes = {
    label: PropTypes.string,
    value: PropTypes.number,
    onChange: PropTypes.func
};
const HostLobby = () => {
    const history = useHistory();
    const [users, setUsers] = useState(null);
    const [rulesOpen, setRulesOpen] = useState(false)
    const [SettingsOpen, setSettingsOpen] = useState(false);
    const [initialRoundsToPlay, setInitialRoundsToPlay] = useState(10);
    const [initialPlayerSize, setInititalPlayerSize] = useState(6);

    let isButtonDisabled = true;

    if (users) {
        if (users.length > 1) { isButtonDisabled = false }
    }

    const getLobby = useCallback(() => { //identifies lobby based on URL
        const url = window.location.pathname;
        const split = url.split("/");
        return split[split.length - 1];
    }, []);


    async function removePlayer(leavingUser) {
        try {
            const userId = localStorage.getItem('userId'); // retrieve userId from localStorage
            const user = new User()
            user.id = leavingUser.id
            user.lobby = leavingUser.lobby
            await api.put(`/lobbies/${getLobby()}/kickHandler`, user, {
                headers: {
                    'userId': userId, // set userId as a header in the request
                },
            });
        } catch (error) {
            alert(`Something went wrong while leaving the lobby: \n${handleError(error)}`);
        }
    }


    async function closeLobby() {
        try {
            const userId = localStorage.getItem("userId");
            if (users) {
                for (let i = 0; i < users.length; i++) {
                    const user = users[i];
                    if (user.id !== parseInt(userId)) {
                        await removePlayer(user);
                    }
                }
            }
            await new Promise(resolve => setTimeout(resolve, 500));
            await api.put(`/lobbies/${getLobby()}/closeHandler`, null, {
                headers: {
                    "userId": userId
                }
            });
            localStorage.removeItem("lobbyCode");
            localStorage.removeItem("userId");
            localStorage.removeItem("inGame");
            history.push("/");
        } catch (error) {
            alert(`Something went wrong while closing the Lobby: \n${handleError(error)}`);
        }
    }


    const startGame = useCallback(async () => {
        try {
            const user = new User();
            user.id = localStorage.getItem("userId");
            await api.post(`/games/${getLobby()}`, user);
        } catch (error) {
            alert(`Something went wrong while starting the Game: \n${handleError(error)}`);
        }
        //JUST FOR TEST PURPOSE
        //yet to be implemented, function to start game

    }, [getLobby]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Enter' && !isButtonDisabled) {
                startGame();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isButtonDisabled, startGame]);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await api.get(`/lobbies/${getLobby()}/users`);
                setUsers(response.data);
                const rounds = await api.get(`/games/${getLobby()}/rounds`);
                if (rounds.data > 0) {
                    localStorage.setItem("inGame", "yes")
                    history.push(`/game/${getLobby()}`)
                }
            } catch (error) {
                clearInterval(intervalId)
                alert(`Something went wrong while fetching the users: \n${handleError(error)}`);
            }
        }

        fetchData();

        const intervalId = setInterval(async () => {
            try {
                await fetchData();
            } catch (error) {
                clearInterval(intervalId); // Stop the interval loop
            }
        }, 500);

        // Clean up the interval when the component is unmounted
        return () => { clearInterval(intervalId); };

    }, [history, getLobby]);



    //need to figure out how to better move buttons to the right
    const Player = ({ user }) => {
        if (user.id === 1) {
            return (
                <div className="lobby player-container-host">
                    <div className="lobby username">{user.username}
                        <div className="lobby host">★</div>
                    </div>
                </div>)
        }
        if (user.id % 2 === 1) {
            return (
                <div className="lobby player-container-odd">
                    <div className="lobby username">{user.username}
                        <ButtonKick
                            onClick={() => removePlayer(user)}
                        >Remove</ButtonKick>
                    </div>
                </div>)
        }
        if (user.id % 2 === 0) {
            return (
                <div className="lobby player-container-even">
                    <div className="lobby username">{user.username}
                        <ButtonKick
                            onClick={() => removePlayer(user)}
                        >Remove</ButtonKick>
                    </div>
                </div>)
        }
    }


    Player.propTypes = {
        user: PropTypes.object
    };

    let content =
        <div className="lobby player-container">
            <div className="lobby username">
                Loading...
            </div>
        </div>

    if (users) {
        content = (
            <div className="lobby">
                <ul className="lobby user-list">
                    {users.map(user => (
                        <Player user={user} key={user.id} />
                    ))}
                </ul>

            </div>
        );
    }

    function openRules() {
        setRulesOpen(true)
    }

    function closeRules() {
        setRulesOpen(false)
    }

    function openSettings() {
        setSettingsOpen(true);
      }
    
      function closeSettings() {
        setSettingsOpen(false);
      }

    function copyId() {
        navigator.clipboard.writeText(getLobby());
    }

    const handleSaveSettings = async (roundsToPlay, playerSize) => {
        try {
          const player = new User();
          player.id = localStorage.getItem("userId");
          const lobbyCode = localStorage.getItem("lobbyCode");
          await api.post(`/games/${lobbyCode}/gameSettings?roundToEndGame=${roundsToPlay}&maxPlayerSize=${playerSize}`, player);
          closeSettings();
        } catch (error) {
          alert(`Something went wrong while saving the settings: \n${handleError(error)}`);
        }
      };
      

    const handleRoundChange = (roundsToPlay) => {
        setInitialRoundsToPlay(roundsToPlay);
    }

    const handlePlayerSizeChange = (playerSize) => {
        setInititalPlayerSize(playerSize);
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
                roomName={"SkullKingLobby" + getLobby()}
                getIFrameRef={node => { node.style.height = '50px'; node.style.width = '50px'; }}
            />
            <div className="lobby container">
                <div className="lobby form">
                    <div className="lobby code">
                        Lobby: {getLobby()}
                    </div>
                    <ButtonCopy width="100%" onClick={() => copyId()}
                    >Copy Lobby Code
                    </ButtonCopy>
                    {content}
                    <div className="lobby button-container2">
                        <ButtonWhiteList
                            width="100%"
                            onClick={() => closeLobby()}
                        >
                            Close
                        </ButtonWhiteList>
                        <ButtonPurpleList
                            disabled={isButtonDisabled}
                            width="100%"
                            onClick={() => startGame()}
                        >
                            Start
                        </ButtonPurpleList>
                    </div>
                </div>
            </div>
            <ButtonRules
                className="bottom"
                onClick={() => { openRules() }}
            >Game Rules
            </ButtonRules>
            {rulesOpen && (
                <RuleBook onClick={closeRules} />
            )}
            <ButtonSettings
                className='corner'
                onClick={() => { openSettings() }}>
            </ButtonSettings>
            {SettingsOpen && (
                <GameSettings
                    onSave={handleSaveSettings}
                    onClose={closeSettings}
                    onRoundChange={handleRoundChange}
                    onPlayerSizeChange={handlePlayerSizeChange}
                    initialRoundsToPlay={initialRoundsToPlay}
                    initialPlayerSize={initialPlayerSize}
                />
            )}
        </BaseContainer>
    );
};


export default HostLobby;
