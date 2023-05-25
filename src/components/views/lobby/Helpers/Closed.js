import React from 'react';
import { useHistory } from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import HeaderLobby from "components/views/lobby/Helpers/HeaderLobby";
import { ButtonPurpleLobby } from "../../../ui/ButtonMain";
import 'styles/ui/Kicked.scss';

const Closed = () => {
    const history = useHistory();
    return (
        <BaseContainer>
            <HeaderLobby />
            <div className='kicked'>
                <div className="kicked-dialog">
                    <div className="kicked-text">
                        <div>A Player has left.</div>
                        <div>Game can not be continued.</div>
                        You have been returned to the Main Menu.
                    </div>
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

export default Closed;