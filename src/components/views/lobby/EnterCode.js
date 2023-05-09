import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import 'styles/views/Lobby.scss';
import BaseContainer from "components/ui/BaseContainer";
import HeaderLobby from "components/views/lobby/HeaderLobby";
import PropTypes from "prop-types";
import {ButtonPurpleLobby, ButtonRules, ButtonWhiteLobby} from "../../ui/ButtonMain";
import {api, handleError} from "../../../helpers/api";
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
    value: PropTypes.number,
    onChange: PropTypes.func
}
const EnterCode = () => {
    const [lobbyCode, setLobbyCode] = useState(null);
    const history = useHistory();
    const [rulesOpen, setRulesOpen] = useState(false)
    function goBack() { //goes back to previous screen
        history.go(-1)
    }

    async function joinLobby() { //checks if lobby exists and is joinable (e.g. has less than 6 players)
        try {
            await api.get(`/lobbies/${lobbyCode}`)
            await api.put(`/lobbies/${lobbyCode}`);
            localStorage.setItem("lobbyCode", lobbyCode)
            history.push('/join/username')

        } catch (error) {
            window.alert(`Something went wrong while joining the lobby: \n${handleError(error)}`);
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
                  label="Enter Code"
                  value={lobbyCode}
                  onChange={un => setLobbyCode(un)}
              />
                  <div className="lobby button-container1">
                  <ButtonPurpleLobby
                      disabled={!lobbyCode}
                      width="75%"
                      onClick={() => joinLobby()}
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


export default EnterCode;
