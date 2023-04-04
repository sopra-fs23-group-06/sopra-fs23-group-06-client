import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import 'styles/views/Lobby.scss';
import BaseContainer from "components/ui/BaseContainer";
import HeaderLobby from "components/views/HeaderLobby";
import PropTypes from "prop-types";
import {ButtonPurpleLobby, ButtonWhiteLobby} from "../ui/ButtonMain";
import {api, handleError} from 'helpers/api';

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
    value: PropTypes.string,
    onChange: PropTypes.func
};
const Username = () => {
    const [username, setUsername] = useState(null);
    const history = useHistory();
    const isHost = hostOrJoin();
    function getLobby() {
        return localStorage.getItem("lobbyCode");
    }



    function hostOrJoin(){
        const url = window.location.pathname
        const split = url.split("/")
        return "host" === split[split.length-2]
    }


    function goBack() {
        localStorage.removeItem("lobbyCode")
        history.go(-1)
    }

    async function createNewLobby() {
        try {
            const lobbies = await api.post('/lobbies');
            const lobby = lobbies.data
            localStorage.setItem("lobbyCode", lobby.lobbyCode)

        } catch (error) {
            alert(`Something went wrong during lobby creation: \n${handleError(error)}`);
        }
    }

    async function joinLobby() {
        try {
            await api.put(`/lobbies/${getLobby()}`);
            history.push('/host/lobby/'+getLobby()+"/code")

        } catch (error) {
            alert(`Something went wrong while joining the lobby: \n${handleError(error)}`);
        }
    }

    async function addUserToLobby() {
        try {
            const requestBody = JSON.stringify({username});
            await api.post(`/users/${getLobby()}`, requestBody);

            if(!isHost){history.push('/join/lobby/'+getLobby())}
        } catch (error) {
            alert(`Something went wrong while adding user to the lobby: \n${handleError(error)}`);
        }
    }

    function goToLobby() {
        if (isHost){
            createNewLobby().then(() =>joinLobby().then(() =>addUserToLobby()));
        }
        else {
            addUserToLobby();
        }
    }

    return (

    <BaseContainer>
      <HeaderLobby/>
          <div className="lobby container">
              <div className="lobby form">
              <FormField
                  label="Enter Username"
                  value={username}
                  onChange={un => setUsername(un)}
              />
                  <div className="lobby button-container1">
                  <ButtonPurpleLobby
                      disabled={!username}
                      width="75%"
                      onClick={() => goToLobby()}
                      >
                      Enter
                  </ButtonPurpleLobby>
                  <ButtonWhiteLobby
                      width="75%"
                      onClick={() => goBack()}
                      >
                      Cancel
                  </ButtonWhiteLobby>
                  </div>
              </div>
          </div>
    </BaseContainer>
  );
};


export default Username;
