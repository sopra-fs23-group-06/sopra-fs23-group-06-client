import React from 'react';
import {useHistory} from 'react-router-dom';
import {ButtonPurpleMain, ButtonWhiteMain} from 'components/ui/ButtonMain';
import 'styles/views/Home.scss';
import BaseContainer from "components/ui/BaseContainer";
import HeaderMain from "components/views/HeaderMain";



const MainMenu = props => {
    const history = useHistory();


    function doJoin() {
        history.push('/join/code')
    }

    function doHost() {
        history.push('/host/username')
    }

    return (

    <BaseContainer>
      <HeaderMain/>
          <div className="home button-container">
            <ButtonPurpleMain
                width="20%"
                onClick={() => doJoin()}
            >
              Join
            </ButtonPurpleMain>
            <ButtonWhiteMain
                width="20%"
                onClick={() => doHost()}
            >
              Host
            </ButtonWhiteMain>
      </div>
    </BaseContainer>
  );
};


export default MainMenu;
