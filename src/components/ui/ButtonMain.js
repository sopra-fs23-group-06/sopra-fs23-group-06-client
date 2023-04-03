import "styles/ui/ButtonMain.scss";

export const ButtonPurpleMain = props => (
  <button
    {...props}
    style={{width: props.width, ...props.style}}
    className={`button-purple-main ${props.className}`}>
    {props.children}
  </button>
);

export const ButtonWhiteMain = props => (
    <button
        {...props}
        style={{width: props.width, ...props.style}}
        className={`button-white-main ${props.className}`}>
      {props.children}
    </button>
);

export const ButtonPurpleLobby = props => (
    <button
        {...props}
        style={{width: props.width, ...props.style}}
        className={`button-purple-lobby ${props.className}`}>
        {props.children}
    </button>
);

export const ButtonWhiteLobby = props => (
    <button
        {...props}
        style={{width: props.width, ...props.style}}
        className={`button-white-lobby ${props.className}`}>
        {props.children}
    </button>
);
