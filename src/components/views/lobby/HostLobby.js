import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import 'styles/views/Lobby.scss';
import BaseContainer from "components/ui/BaseContainer";
import HeaderLobby from "components/views/lobby/HeaderLobby";
import PropTypes from "prop-types";
import {
    ButtonKick,
    ButtonPurpleList,
    ButtonWhiteList,
    ButtonWhiteLobby,
} from "../../ui/ButtonMain";
import {api, handleError} from "../../../helpers/api";

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
    const lobbyCode = getLobby();
    const [users, setUsers] = useState(null);
    let isButtonDisabled = true;
    if (users){
        if(users.length > 1) {isButtonDisabled = false}
    }

    function getLobby() { //identifies lobby based on URL
        const url = window.location.pathname
        const split = url.split("/")
        return split[split.length-1]
    }

    function viewCode() { //route to lobby Code show screen
        history.push('/host/lobby/'+lobbyCode+"/code")
    }

    async function closeLobby() { //function to implement closing lobby, not fully functional yet
        try {
            //await api.put(`/lobbies/${getLobby()}/closeHandler`);
            localStorage.removeItem("lobbyCode")
            localStorage.removeItem("userId")
            history.push("/")

        } catch (error) {
            alert(`Something went wrong while closing the Lobby: \n${handleError(error)}`);
        }
    }

    function startGame() { //yet to be implemented, function to start game

    }

    useEffect(() => {
        async function fetchData() {  //get user list from server
            try {
                const response = await api.get(`/lobbies/${getLobby()}/users`);

                // Get the returned users and update the state.
                setUsers(response.data);
                console.log(response);
            } catch (error) {
                console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the users! See the console for details.");
            }
        }

        fetchData();
    }, []);

    function removePlayer() {//yet to be implemented, used when removing a player

    }


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
                    <div className="lobby username">{user.username}
                        <ButtonKick
                            onClick= {() => removePlayer()}
                        >Remove</ButtonKick>
                    </div>
                </div>)
        }
        if (user.id % 2 === 0) {
            return (
                <div className="lobby player-container-even">
                    <div className="lobby username">{user.username}
                    <ButtonKick
                        onClick= {() => removePlayer()}
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
                  <ButtonWhiteLobby
                      width="50%"
                      onClick={() => viewCode()}
                      >
                      View Code
                  </ButtonWhiteLobby>
                  </div>
                  <div className="lobby button-container2">
                      <ButtonWhiteList
                          width="100%"
                          onClick={() => closeLobby()}
                      >
                          Close
                      </ButtonWhiteList>
                      <ButtonPurpleList
                          disabled = {isButtonDisabled}
                          width="100%"
                          onClick={() => startGame()}
                      >
                          Start
                      </ButtonPurpleList>
                  </div>
              </div>
          </div>
    </BaseContainer>
  );
};


export default HostLobby;
