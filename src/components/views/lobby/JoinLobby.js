import React, { useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import 'styles/views/Lobby.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import { ButtonPurpleList, ButtonRules, ButtonCopy } from "../../ui/ButtonMain";
import { api, handleError } from "../../../helpers/api";
import User from "../../../models/User";
import { JitsiMeeting } from "@jitsi/react-sdk";
import RuleBook from "../../ui/RuleBook";
import "../../../helpers/alert";
import { toast } from 'react-toastify';



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

    function getLobby() {
        const url = window.location.pathname
        const split = url.split("/")
        return split[split.length - 1]
    }


    async function leaveLobby() { //removes player from the lobby and returns to main screen
        try {
            const user = new User()
            user.id = localStorage.getItem("userId");
            user.lobby = localStorage.getItem("lobbyCode");
            await api.put(`/lobbies/${getLobby()}/leaveHandler`, user);
            localStorage.removeItem("lobbyCode")
            localStorage.removeItem("userId")
            localStorage.removeItem("inGame")
            history.push("/")
        } catch (error) {
            toast.error(`Something went wrong while leaving the lobby: \n${handleError(error)}`);
        }
    }

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await api.get(`/lobbies/${getLobby()}/users`);
                setUsers(response.data);
                const userExists = response.data.some(user => user.id === parseInt(localStorage.getItem("userId")));
                if(!showedInfos.current){
                    toast.warning('You are unmuted! To mute yourself press the button on the top left.')
                    setTimeout(function() {
                      toast.info(`You can find the rules on the bottom of your screen`);
                    }, 6500);
                    showedInfos.current=true;
                  }
                if (!userExists) {
                    localStorage.removeItem("lobbyCode")
                    localStorage.removeItem("userId")
                    localStorage.removeItem("inGame")
                    history.push("/")
                }
                else {
                    const rounds = await api.get(`/games/${getLobby()}/rounds`);
                    if (rounds.data > 0) {
                        localStorage.setItem("inGame", "yes")
                        history.push(`/game/${getLobby()}`)
                    }
                }
            } catch (error) {
                clearInterval(intervalId)
                toast.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
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
        return () => clearInterval(intervalId);

    }, [history]);


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
                    >{copyButtonText}
                    </ButtonCopy>
                    {content}
                    <div className="lobby button-container1">
                        <ButtonPurpleList
                            width="50%"
                            onClick={() => leaveLobby()}
                        >
                            Leave
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
        </BaseContainer>
    );
};


export default JoinLobby;
