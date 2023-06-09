import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { ButtonPurpleMain, ButtonRules, ButtonSettings, ButtonWhiteMain } from 'components/ui/ButtonMain';
import 'styles/views/Home.scss';
import BaseContainer from 'components/ui/BaseContainer';
import HeaderMain from 'components/views/lobby/Helpers/HeaderMain';
import RuleBook from '../../ui/RuleBook';
import '../../../helpers/alert';
import LayoutSettings from 'components/ui/LayoutSettings';

const MainMenu = (props) => {
    const history = useHistory();
    const [rulesOpen, setRulesOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);

    const handleMuteAudio = () => {
        localStorage.setItem('soundIsMuted', 'true');
    };

    const handleUnmuteAudio = () => {
        localStorage.setItem('soundIsMuted', 'false');
    };

    useEffect(() => {
        const firstLoad = localStorage.getItem('firstLoad');
        if (firstLoad === null) {
            localStorage.setItem('firstLoad', 'true');
            localStorage.setItem('soundIsMuted', 'true');
            console.log('Action executed.');
        }
    }, []);

    function doJoin() {
        history.push('/join/code');
    }

    function doHost() {
        history.push('/host/username');
    }

    function openRules() {
        setRulesOpen(true);
    }

    function closeRules() {
        setRulesOpen(false);
    }

    function openSettings() {
        setSettingsOpen(true);
    }

    function closeSettings() {
        setSettingsOpen(false);
    }

    return (
        <BaseContainer>
            <HeaderMain />
            <div className="home button-container">
                <ButtonPurpleMain width="20%" onClick={() => doJoin()}>
                    Join
                </ButtonPurpleMain>
                <ButtonWhiteMain width="20%" onClick={() => doHost()}>
                    Host
                </ButtonWhiteMain>
            </div>
            <ButtonRules className="bottom" onClick={() => openRules()}>
                Game Rules
            </ButtonRules>
            {rulesOpen && <RuleBook onClick={closeRules} />}
            <ButtonSettings className="corner" onClick={() => openSettings()}></ButtonSettings>
            {settingsOpen && (
                <LayoutSettings
                    onClick={closeSettings}
                    onHandleMuteAudio={handleMuteAudio}
                    onHandleUnmuteAudio={handleUnmuteAudio}
                />
            )}
        </BaseContainer>
    );
};

export default MainMenu;