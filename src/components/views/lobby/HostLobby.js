import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import 'styles/views/Lobby.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import {
    ButtonKick,
    ButtonPurpleList, ButtonRules,
    ButtonWhiteList,
    ButtonCopy, ButtonSettings, ButtonGameSettings
} from "../../ui/ButtonMain";
import { api, handleError } from "../../../helpers/api";
import User from "../../../models/User";
import { JitsiMeeting } from "@jitsi/react-sdk";
import RuleBook from "../../ui/RuleBook";
import "../../../helpers/alert";
import GameSettings from 'components/ui/GameSettings';
import { toast } from 'react-toastify';
import LayoutSettings from 'components/ui/LayoutSettings';
import { isProduction } from "../../../helpers/isProduction";
import { getDomain } from "../../../helpers/getDomain";

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
    const [gameSettingsOpen, setGameSettingsOpen] = useState(false);
    const [initialRoundsToPlay, setInitialRoundsToPlay] = useState(10);
    const [initialPlayerSize, setInititalPlayerSize] = useState(6);
    const showedInfos = useRef(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [copyButtonText, setCopyButtonText] = useState("Copy Lobby Code");
    const webSocket = useRef(null);
    const [recentKickRequest, setRecentKickRequest] = useState(false);
    const [recentStartRequest, setRecentStartRequest] = useState(false);
    const [recentCloseRequest, setRecentCloseRequest] = useState(false);

    const [reloadCount, setReloadCount] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setReloadCount((prevCount) => prevCount + 1);
        }, 300000); // 20 seconds

        return () => {
            clearInterval(intervalId);
        };
    }, []);


    let isButtonDisabled = true;

    if (users) {
        if (users.length > 1) {
            isButtonDisabled = false
        }
    }

    const getLobby = useCallback(() => { //identifies lobby based on URL
        const url = window.location.pathname;
        const split = url.split("/");
        return split[split.length - 1];
    }, []);

    const handleMuteAudio = () => {
        localStorage.setItem('soundIsMuted', 'true');
        if (localStorage.getItem('soundIsMuted') === 'true') {
            console.log("working")
        }
      }; 
      const handleUnmuteAudio = () => {
        localStorage.setItem('soundIsMuted', 'false');
        console.log(localStorage.getItem('soundIsMuted'));
      }; 

    async function removePlayer(leavingUser) {
        setRecentKickRequest(true);
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
            toast.error(`Something went wrong while leaving the lobby: \n${handleError(error)}`);
        }
        setTimeout(() => {
            setRecentKickRequest(false);
        }, 1000)
    }

    async function closeLobby() {
        setRecentCloseRequest(true);
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
            webSocket.current.close();
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
            toast.error(`Something went wrong while closing the Lobby: \n${handleError(error)}`);
        }
        setTimeout(() => {
            setRecentCloseRequest(false);
        }, 1000)
    }

    const startGame = useCallback(async () => {
        setRecentStartRequest(true);
        try {
            const user = new User();
            user.id = localStorage.getItem("userId");
            await api.post(`/games/${getLobby()}`, user);
        } catch (error) {
            toast.error(`Something went wrong while starting the Game: \n${handleError(error)}`);
        }
        setTimeout(() => {
            setRecentStartRequest(false);
        }, 2000)
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


    async function fetchData() {
        try {
            const response = await api.get(`/lobbies/${getLobby()}/users`);
            setUsers(response.data);
            const rounds = await api.get(`/games/${getLobby()}/rounds`);
            if (rounds.data > 0) {
                localStorage.setItem("inGame", "yes")
                history.push(`/game/${getLobby()}`)
            }
            if (!showedInfos.current) {
                toast.warning('You are unmuted! To mute yourself press the button on the top left.')
                showedInfos.current = true;
            }
        } catch (error) {
            toast.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
        }
    }

    useEffect(() => {
        let domain = getDomain().replace(/^https?:\/\//, '');
        if (isProduction()) {
            webSocket.current = new WebSocket(`wss://${domain}/sockets`);
        } else {
            webSocket.current = new WebSocket(`ws://${domain}/sockets`);
        }
        fetchData()
        const openWebSocket = () => {
            webSocket.current.onopen = (event) => {
            }
            webSocket.current.onclose = (event) => {
            }
        }
        openWebSocket();
        return () => {
            webSocket.current.close();
        }
    }, []);

    useEffect(() => {
        webSocket.current.onmessage = (event) => {
            const chatMessageDto = event.data;
            let lobby = chatMessageDto.split(" ")[0]
            if (lobby === getLobby()) {
                fetchData();
            }
        }
    }, []);
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
                            disabled={recentKickRequest}
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
                            disabled={recentKickRequest}
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

    function openGameSettings() {
        setGameSettingsOpen(true);
    }

    function closeGameSettings() {
        setGameSettingsOpen(false);
    }

    function openSettings() {
        setSettingsOpen(true);
    }

    function closeSettings() {
        setSettingsOpen(false);
    }

    function copyId() {
        navigator.clipboard.writeText(getLobby());
        setCopyButtonText("Code copied!");

        setTimeout(() => {
            setCopyButtonText("Copy Lobby Code");
        }, 1000);
    }

    const handleSaveSettings = async (roundsToPlay, playerSize) => {
        try {
            const player = new User();
            player.id = localStorage.getItem("userId");
            const lobbyCode = localStorage.getItem("lobbyCode");
            await api.post(`/lobbies/${lobbyCode}/gameSettings?roundToEndGame=${roundsToPlay}&maxPlayerSize=${playerSize}`, player);
            toast.success(`Saved new game settings!`)
            closeGameSettings();
        } catch (error) {
            toast.error(`Something went wrong while saving the settings: \n${handleError(error)}`);
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
            <JitsiMeeting key={reloadCount}
                configOverwrite={{
                    startWithAudioMuted: false,
                    hiddenPremeetingButtons: ['microphone'],
                    prejoinPageEnabled: false,
                    startAudioOnly: true,
                    startWithVideoMuted: true,
                    enableClosePage: false,
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
                roomName={"SkullKingLobby" + getLobby()}
                getIFrameRef={node => {
                    node.style.height = '50px';
                    node.style.width = '50px';
                }}
            />
            <div className="lobby container">
                <div className="lobby form">
                    <div className="lobby code">
                        Lobby: {getLobby()}
                    </div>
                    <ButtonCopy width="100%" onClick={() => copyId()}
                    >{copyButtonText}
                    </ButtonCopy>
                    {content}
                    <ButtonGameSettings
                        onClick={() => {
                            openGameSettings()
                        }}>
                        <span className="text">Game settings</span>
                    </ButtonGameSettings>
                    <div className="lobby button-container2">
                        <ButtonWhiteList
                            width="100%"
                            disabled={recentCloseRequest}
                            onClick={() => closeLobby()}
                        >
                            Close
                        </ButtonWhiteList>
                        <ButtonPurpleList
                            disabled={isButtonDisabled || recentStartRequest}
                            width="100%"
                            onClick={() => startGame()}
                        >
                            Start
                        </ButtonPurpleList>
                    </div>
                </div>
            </div>
            {gameSettingsOpen && (
                <GameSettings
                    onSave={handleSaveSettings}
                    onClose={closeGameSettings}
                    onRoundChange={handleRoundChange}
                    onPlayerSizeChange={handlePlayerSizeChange}
                    initialRoundsToPlay={initialRoundsToPlay}
                    initialPlayerSize={initialPlayerSize}
                />
            )}
            <ButtonRules
                className="bottom"
                onClick={() => {
                    openRules()
                }}
            >Game Rules
            </ButtonRules>
            {rulesOpen && (
                <RuleBook onClick={closeRules} />
            )}
        <ButtonSettings
          className='corner'
          onClick={() => { openSettings() }}>
        </ButtonSettings>
        {settingsOpen && (
          <LayoutSettings onClick={closeSettings} onHandleMuteAudio={handleMuteAudio} onHandleUnmuteAudio={handleUnmuteAudio} />
        )}
        </BaseContainer>
    );
};

export default HostLobby;