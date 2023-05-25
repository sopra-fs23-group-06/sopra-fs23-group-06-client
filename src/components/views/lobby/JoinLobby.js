import React, { useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import 'styles/views/Lobby.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import { ButtonPurpleList, ButtonRules, ButtonCopy, ButtonSettings } from "../../ui/ButtonMain";
import { api, handleError } from "../../../helpers/api";
import User from "../../../models/User";
import { JitsiMeeting } from "@jitsi/react-sdk";
import RuleBook from "../../ui/RuleBook";
import "../../../helpers/alert";
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
const JoinLobby = () => {
    const history = useHistory();
    const [users, setUsers] = useState(null);
    const [rulesOpen, setRulesOpen] = useState(false)
    const showedInfos = useRef(false);
    const [copyButtonText, setCopyButtonText] = useState("Copy Lobby Code");
    const [settingsOpen, setSettingsOpen] = useState(false);
    const webSocket = useRef(null);
    const [recentRequest, setRecentRequest] = useState(false);

    function getLobby() {
        const url = window.location.pathname
        const split = url.split("/")
        return split[split.length - 1]
    }

    const handleMuteAudio = () => {
        localStorage.setItem('soundIsMuted', 'true');
    };
    const handleUnmuteAudio = () => {
        localStorage.setItem('soundIsMuted', 'false');
    };

    async function leaveLobby() { //removes player from the lobby and returns to main screen
        setRecentRequest(true);
        try {
            const user = new User()
            user.id = localStorage.getItem("userId");
            user.lobby = localStorage.getItem("lobbyCode");
            webSocket.current.close();
            await api.put(`/lobbies/${getLobby()}/leaveHandler`, user);
            localStorage.removeItem("lobbyCode")
            localStorage.removeItem("userId")
            localStorage.removeItem("inGame")
            history.push("/")
        } catch (error) {
            toast.error(`Something went wrong while leaving the lobby: \n${handleError(error)}`);
        }
        setTimeout(() => {
            setRecentRequest(false);
        }, 1000)
    }

    async function fetchData() {
        try {
            const response = await api.get(`/lobbies/${getLobby()}/users`);
            setUsers(response.data);
            const userExists = response.data.some(user => user.id === parseInt(localStorage.getItem("userId")));
            if (!showedInfos.current) {
                toast.warning('You are unmuted! To mute yourself press the button on the top left.')
                showedInfos.current = true;
            }
            if (!userExists) {
                localStorage.removeItem("lobbyCode")
                localStorage.removeItem("userId")
                localStorage.removeItem("inGame")
                history.push("/kicked")
            } else {
                const rounds = await api.get(`/games/${getLobby()}/rounds`);
                if (rounds.data > 0) {
                    localStorage.setItem("inGame", "yes")
                    history.push(`/game/${getLobby()}`)
                }
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
        fetchData();
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
                    <div className="lobby username">
                        {user.username} </div>
                </div>)
        }
        if (user.id % 2 === 0) {
            return (
                <div className="lobby player-container-even">
                    <div className="lobby username">
                        {user.username} </div>
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
        setCopyButtonText("Code copied!");

        setTimeout(() => {
            setCopyButtonText("Copy Lobby Code");
        }, 1000);
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
                    <div className="lobby button-container1">
                        <ButtonPurpleList
                            width="50%"
                            disabled={recentRequest}
                            onClick={() => leaveLobby()}
                        >
                            Leave
                        </ButtonPurpleList>
                    </div>
                </div>
            </div>
            <ButtonSettings
                className='corner'
                onClick={() => {
                    openSettings()
                }}>
            </ButtonSettings>
            {settingsOpen && (
                <LayoutSettings onClick={closeSettings} onHandleMuteAudio={handleMuteAudio}
                    onHandleUnmuteAudio={handleUnmuteAudio} />
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
        </BaseContainer>
    );
};


export default JoinLobby;