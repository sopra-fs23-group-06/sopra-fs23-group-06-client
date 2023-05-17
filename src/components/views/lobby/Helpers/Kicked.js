import React from 'react';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import HeaderLobby from "components/views/lobby/Helpers/HeaderLobby";
import {ButtonPurpleLobby} from "../../../ui/ButtonMain";
import 'styles/ui/Kicked.scss';

const Kicked = () => {
    const history = useHistory();
    return (
    <BaseContainer>
      <HeaderLobby/>
              <div className='kicked'>
                  <div className="kicked-dialog">
                      <div className="kicked-text">The Host has removed you from the Lobby.</div>
                      <ButtonPurpleLobby
                          width="45%"
                          onClick={() => history.push("/")}
                      >
                          OK
                      </ButtonPurpleLobby>
                  </div>
              </div>
    </BaseContainer>
  );
};


export default Kicked;
