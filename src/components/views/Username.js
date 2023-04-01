import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import User from 'models/User';
import {useHistory} from 'react-router-dom';
import 'styles/views/Username.scss';
import BaseContainer from "components/ui/BaseContainer";
import HeaderLobby from "components/views/HeaderLobby";
import PropTypes from "prop-types";
import {ButtonPurpleLobby, ButtonWhiteLobby} from "../ui/ButtonMain";

const FormField = props => {


    return (
        <div className="name field">
            <label className="name label">
                {props.label}
            </label>
            <input
                className="name input"
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
const Username = props => {
    const [username, setUsername] = useState(null);

  return (

    <BaseContainer>
      <HeaderLobby/>
          <div className="name container">
              <div className="name form">
              <FormField
                  label="Enter Username"
                  value={username}
                  onChange={un => setUsername(un)}
              />
                  <div className="name button-container">
                  <ButtonPurpleLobby
                      disabled={!username}
                      width="75%"
                      >
                      Enter
                  </ButtonPurpleLobby>
                  <ButtonWhiteLobby
                      width="75%"
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
