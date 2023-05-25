import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import 'styles/views/Lobby.scss';
import BaseContainer from "components/ui/BaseContainer";
import HeaderLobby from "components/views/lobby/Helpers/HeaderLobby";
import PropTypes from "prop-types";
import { ButtonPurpleLobby, ButtonRules, ButtonWhiteLobby } from "../../ui/ButtonMain";
import { api, handleError } from "../../../helpers/api";
import RuleBook from "../../ui/RuleBook";
import "../../../helpers/alert";
import { toast } from 'react-toastify';

const FormField = props => {
  const handleKeyDown = e => {
    if (e.key === 'Enter' && props.value.length > 0) {
      props.onEnterPress();
    }
  };

  const handleChange = e => {
    let numericValue = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
    numericValue = numericValue.slice(0, 6); // Limit the length to 6 characters
    props.onChange(numericValue);
  };

  return (
    <div className="lobby field">
      <label className="lobby label">
        {props.label}
      </label>
      <input
        className="lobby input"
        value={props.value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        inputMode="numeric"
        minLength={6}
        maxLength={6}
      />
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onEnterPress: PropTypes.func,
};

const EnterCode = () => {
  const [lobbyCode, setLobbyCode] = useState('');
  const history = useHistory();
  const [rulesOpen, setRulesOpen] = useState(false);

  function goBack() {
    history.go(-1);
  }

  async function joinLobby() {
    try {
      await api.get(`/lobbies/${lobbyCode}`);
      await api.put(`/lobbies/${lobbyCode}`);
      localStorage.setItem("lobbyCode", lobbyCode);
      history.push('/join/username');
    } catch (error) {
      toast.error(`Something went wrong while joining the lobby: \n${handleError(error)}`);
    }
  }

  function openRules() {
    setRulesOpen(true);
  }

  function closeRules() {
    setRulesOpen(false);
  }

  return (
    <BaseContainer>
      <HeaderLobby />
      <div className="lobby container">
        <div className="lobby form2">
          <FormField
            label="Enter Code"
            value={lobbyCode}
            onChange={un => setLobbyCode(un)}
            onEnterPress={joinLobby}
          />
          <div className="lobby button-container1">
            <ButtonPurpleLobby
              disabled={lobbyCode.length !== 6}
              width="75%"
              onClick={joinLobby}
            >
              Enter
            </ButtonPurpleLobby>
            <ButtonWhiteLobby
              width="75%"
              onClick={goBack}
            >
              Cancel
            </ButtonWhiteLobby>
          </div>
        </div>
      </div>
      <ButtonRules
        className="bottom"
        onClick={openRules}
      >
        Game Rules
      </ButtonRules>
      {rulesOpen && (
        <RuleBook onClick={closeRules} />
      )}
    </BaseContainer>
  );
};

export default EnterCode;
