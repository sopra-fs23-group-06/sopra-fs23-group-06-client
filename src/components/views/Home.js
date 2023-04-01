import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import User from 'models/User';
import {useHistory} from 'react-router-dom';
import {ButtonPurple, ButtonPurpleMain, ButtonWhiteMain} from 'components/ui/ButtonMain';
import {ButtonWhite} from 'components/ui/ButtonMain';
import 'styles/views/Home.scss';
import BaseContainer from "components/ui/BaseContainer";
import HeaderMain from "components/views/HeaderMain";

const Home = props => {


  return (

    <BaseContainer>
      <HeaderMain/>
          <div className="home button-container">
            <ButtonPurpleMain
                width="20%"
            >
              Join
            </ButtonPurpleMain>
            <ButtonWhiteMain
                width="20%"
            >
              Host
            </ButtonWhiteMain>
      </div>
    </BaseContainer>
  );
};


export default Home;
