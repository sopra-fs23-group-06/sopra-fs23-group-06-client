import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import 'styles/views/Lobby.scss';
import BaseContainer from "components/ui/BaseContainer";
import HeaderLobby from "components/views/lobby/HeaderLobby";
import PropTypes from "prop-types";
import {ButtonPurpleLobby, ButtonRules, ButtonWhiteLobby} from "../../ui/ButtonMain";
import {api, handleError} from 'helpers/api';
import User from "../../../models/User";
import RuleBook from "../../ui/RuleBook";

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
    const [rulesOpen, setRulesOpen] = useState(false)
    function getLobby() {
        return localStorage.getItem("lobbyCode");
    }



    function hostOrJoin(){ //differentiate if user is in host or join process
        const url = window.location.pathname
        const split = url.split("/")
        return "host" === split[split.length-2]
    }


    function goBack() { //goes back to previous screen, could be used if wrong lobby was entered on join process
        localStorage.removeItem("lobbyCode")
        history.go(-1)
    }

    const createNewLobby = async () =>{ //creates new lobby
        try {
            const lobbies = await api.post('/lobbies');
            const lobby = lobbies.data
            localStorage.setItem("lobbyCode", lobby.lobbyCode)

        } catch (error) {
            alert(`Something went wrong during lobby creation: \n${handleError(error)}`);
        }
    }



    const addUserToLobby = async () =>{ //adds user to the playerList in the lobby
        try {
            const user = new User()
            user.username = username;
            user.lobby = getLobby();
            const response = await api.post('/users', user);
            const created = new User (response.data);
            localStorage.setItem("userId", created.id)
            localStorage.setItem("username", created.username);
            if(!isHost){history.push('/join/lobby/'+getLobby())}
            else { history.push('/host/lobby/'+getLobby())}
        } catch (error) {
            alert(`Something went wrong while adding user to the lobby: \n${handleError(error)}`);
        }
    }

    function goToLobby() {
        if (isHost){
            createNewLobby().then(() =>addUserToLobby());
        }
        else {
            addUserToLobby();
        }
    }

    function openRules() {
        setRulesOpen(true)
    }

    function closeRules() {
        setRulesOpen(false)
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
        <ButtonRules
            className= "bottom"
            onClick={ ()=>{openRules()}}
        >Game Rules
        </ButtonRules>
        {rulesOpen && (
            <RuleBook onClick={closeRules} />
        )}
    </BaseContainer>
  );
};


export default Username;
