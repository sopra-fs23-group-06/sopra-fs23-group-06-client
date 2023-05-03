import "styles/ui/MainButton.scss";
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

export const ButtonPurpleList = props => (
    <button
        {...props}
        style={{width: props.width, ...props.style}}
        className={`button-purple-list ${props.className}`}>
        {props.children}
    </button>
);

export const ButtonWhiteList = props => (
    <button
        {...props}
        style={{width: props.width, ...props.style}}
        className={`button-white-list ${props.className}`}>
        {props.children}
    </button>
);

export const ButtonKick = props => (
    <button
        {...props}
        style={{width: props.width, ...props.style}}
        className={`button-kick ${props.className}`}>
        {props.children}
    </button>
);

export const ButtonRules = props => (
    <button
        {...props}
        style={{width: props.width, ...props.style}}
        className={`button-rules ${props.className}`}>
        {props.children}
    </button>
);