import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import {ButtonPurpleMain, ButtonRules, ButtonWhiteMain} from 'components/ui/ButtonMain';
import 'styles/views/Home.scss';
import BaseContainer from "components/ui/BaseContainer";
import HeaderMain from "components/views/lobby/HeaderMain";
import RuleBook from "../../ui/RuleBook";



const MainMenu = props => {
    const history = useHistory();
    const [rulesOpen, setRulesOpen] = useState(false)


    function doJoin() { //start join process
        history.push('/join/code')
    }

    function doHost() {//start host process
        history.push('/host/username')
    }

    function openRules() {
        setRulesOpen(true)
    }

    function closeRules() {
        setRulesOpen(false)
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


export default MainMenu;
