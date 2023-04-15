import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import 'styles/views/Lobby.scss';
import BaseContainer from "components/ui/BaseContainer";
import HeaderLobby from "components/views/lobby/HeaderLobby";
import PropTypes from "prop-types";
import {ButtonPurpleList} from "../../ui/ButtonMain";
import {api, handleError} from "../../../helpers/api";
import User from "../../../models/User";
import {getDomain} from "../../../helpers/getDomain";

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

    function getLobby() {
        const url = window.location.pathname
        const split = url.split("/")
        return split[split.length-1]
    }


    async function leaveLobby() { //removes player from the lobby and returns to main screen
        try {
            const user = new User()
            user.id = localStorage.getItem("userId");
            user.lobby = localStorage.getItem("lobbyCode");
            await api.put(`/lobbies/${getLobby()}/leaveHandler`, user);
            localStorage.removeItem("lobbyCode")
            localStorage.removeItem("userId")
            history.push("/")
        } catch (error) {
            alert(`Something went wrong while leaving the lobby: \n${handleError(error)}`);
        }
    }
    
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await api.get(`/lobbies/${getLobby()}/users`);
                setUsers(response.data);
                const userExists = response.data.some(user => user.id === parseInt(localStorage.getItem("userId")));
                if (!userExists){
                    localStorage.removeItem("lobbyCode")
                    localStorage.removeItem("userId")
                    history.push("/")
                }
            } catch (error) {
                console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the users! See the console for details.");
            }
        }

        fetchData();

        const handleSSE = function(event) {
            if (event.data === "update") {
                fetchData();
            }
        };
        const source = new EventSource(getDomain()+'/updates');
        source.addEventListener('message', handleSSE);
        return () => {
            source.removeEventListener('message', handleSSE);
            source.close();
        };
    }, []);


    //need to figure out how to better move buttons to the right
    const Player = ({user}) => {
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
                        <Player user={user} key={user.id}/>
                    ))}
                </ul>

            </div>
        );
    }



    return (

    <BaseContainer>
      <HeaderLobby/>
          <div className="lobby container">
              <div className="lobby form">
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
    </BaseContainer>
  );
};


export default JoinLobby;
