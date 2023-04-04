import React from 'react';
import {useHistory} from 'react-router-dom';
import 'styles/views/Lobby.scss';
import BaseContainer from "components/ui/BaseContainer";
import HeaderLobby from "components/views/HeaderLobby";
import PropTypes from "prop-types";
import {ButtonPurpleLobby} from "../ui/ButtonMain";

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
const ShowCode = () => {
    const history = useHistory();
    const lobbyCode = getLobby();

    function getLobby() {

        return localStorage.getItem("lobbyCode");
    }


    function goToLobby() {
        history.push('/host/lobby/'+lobbyCode)
    }

    return (

    <BaseContainer>
      <HeaderLobby/>
          <div className="lobby container">
              <div className="lobby form">
                  <div className= "lobby label">
                      Lobby Code:
                  </div>
              <div className= "lobby code">
                  {lobbyCode}
              </div>
                  <div className="lobby button-container1">
                  <ButtonPurpleLobby
                      width="75%"
                      onClick={() => goToLobby()}
                      >
                      View Lobby
                  </ButtonPurpleLobby>
                  </div>
              </div>
          </div>
    </BaseContainer>
  );
};


export default ShowCode;
