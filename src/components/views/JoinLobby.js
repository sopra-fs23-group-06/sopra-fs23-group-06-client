import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import 'styles/views/Lobby.scss';
import BaseContainer from "components/ui/BaseContainer";
import HeaderLobby from "components/views/HeaderLobby";
import PropTypes from "prop-types";
import {
    ButtonPurpleList,
    ButtonPurpleLobby,
    ButtonPurpleMain, ButtonWhiteList,
    ButtonWhiteLobby,
    ButtonWhiteMain
} from "../ui/ButtonMain";
import {api, handleError} from "../../helpers/api";

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

    function getLobby() {
        const url = window.location.pathname
        const split = url.split("/")
        return split[split.length-1]
    }
    function goBack() {
        history.go(-1)
    }



    async function leaveLobby() {
        try {
            await api.put(`/lobbies/${getLobby()}/closeHandler`);
            localStorage.removeItem("lobbyCode")
            history.push("/")
        } catch (error) {
            alert(`Leaving is not implemented yet: \n${handleError(error)}`);
        }
    }

    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchData() {
            try {
                const response = await api.get(`/users/${getLobby()}`);

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


export default HostLobby;
