import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import 'styles/views/Inputs.scss';
import BaseContainer from "components/ui/BaseContainer";
import HeaderLobby from "components/views/HeaderLobby";
import PropTypes from "prop-types";
import {ButtonPurpleLobby, ButtonWhiteLobby} from "../ui/ButtonMain";

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
const LobbyCode = () => {
    const [code, setCode] = useState(null);
    const history = useHistory();
    function goBack() {
        history.go(-1)
    }

    function doJoin() {
        history.push('/join/username')
    }

    return (

    <BaseContainer>
      <HeaderLobby/>
          <div className="lobby container">
              <div className="lobby form">
              <FormField
                  label="Enter Code"
                  value={code}
                  onChange={un => setCode(un)}
              />
                  <div className="lobby button-container">
                  <ButtonPurpleLobby
                      disabled={!code}
                      width="75%"
                      onClick={() => doJoin()}
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


export default LobbyCode;
