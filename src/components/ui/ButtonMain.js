import "styles/ui/MainButton.scss";
import settingsIcon from "styles/images/settings.png";
import trophyIcon from "styles/images/trophy.png";
import copyIcon from "styles/images/copy.png";
import gameSettingsIcon from "styles/images/gameSettings.png";
import muteIcon from "styles/images/mute.png";
import unmuteIcon from "styles/images/unmute.png";

export const ButtonPurpleMain = props => (
    <button
        {...props}
        style={{ width: props.width, ...props.style }}
        className={`button-purple-main ${props.className}`}>
        {props.children}
    </button>
);

export const ButtonWhiteMain = props => (
    <button
        {...props}
        style={{ width: props.width, ...props.style }}
        className={`button-white-main ${props.className}`}>
        {props.children}
    </button>
);

export const ButtonPurpleLobby = props => (
    <button
        {...props}
        style={{ width: props.width, ...props.style }}
        className={`button-purple-lobby ${props.className}`}>
        {props.children}
    </button>
);

export const ButtonWhiteLobby = props => (
    <button
        {...props}
        style={{ width: props.width, ...props.style }}
        className={`button-white-lobby ${props.className}`}>
        {props.children}
    </button>
);

export const ButtonPurpleList = props => (
    <button
        {...props}
        style={{ width: props.width, ...props.style }}
        className={`button-purple-list ${props.className}`}>
        {props.children}
    </button>
);

export const ButtonWhiteList = props => (
    <button
        {...props}
        style={{ width: props.width, ...props.style }}
        className={`button-white-list ${props.className}`}>
        {props.children}
    </button>
);

export const ButtonKick = props => (
    <button
        {...props}
        style={{ width: props.width, ...props.style }}
        className={`button-kick ${props.className}`}>
        {props.children}
    </button>
);

export const ButtonScoreboard = props => (
    <button
        {...props}
        style={{ width: props.width, ...props.style }}
        className="button-scoreboard"
    >
        <img className="icon" src={trophyIcon} alt="Trophy Icon" />
    </button>
);

export const ButtonRules = props => (
    <button
        {...props}
        style={{ width: props.width, ...props.style }}
        className={`button-rules ${props.className}`}>
        {props.children}
    </button>
);

export const ButtonCopy = props => (
    <button
        {...props}
        style={{ width: props.width, ...props.style }}
        className={`button-copy ${props.className}`}>
        <img className="icon" src={copyIcon} alt="Copy Icon" />

        {props.children}
    </button>
);

export const ButtonGameSettings = props => (
    <button
        {...props}
        style={{ width: props.width, ...props.style }}
        className={`button-gameSettings ${props.className}`}>
        <img className="icon" src={gameSettingsIcon} alt="GameSettings Icon" />

        {props.children}
    </button>
);


export const ButtonSettings = props => (
    <button
        {...props}
        style={{ width: props.width, ...props.style }}
        className={`button-settings ${props.className}`}>
        <img className="icon" src={settingsIcon} alt="Settings" />

        {props.children}
    </button>
);

export const ToggleButton = ({ isOn, onToggle }) => (
    <button
        className={`toggle-button ${isOn ? 'on' : 'off'}`}
        onClick={onToggle}
    >
        <img
            className="icon"
            src={isOn ? unmuteIcon : muteIcon}
            alt={isOn ? "On" : "Off"}
        />
        {isOn ? "ON" : "OFF"}
    </button>
);