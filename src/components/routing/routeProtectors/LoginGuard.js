import {Redirect} from "react-router-dom";
import PropTypes from "prop-types";

/**
 *
 * Another way to export directly your functional component.
 */
export const LobbyGuard = props => {  // if user is already logged in, redirects him to his lobby
  if (!localStorage.getItem("userId")) {
    return props.children;
  }
  const id = localStorage.getItem("userId")
  const lobby = localStorage.getItem("lobbyCode")



  if (id === "1") {
   return <Redirect to={`/host/lobby/${lobby}`}/>
  }
  else return <Redirect to={`/join/lobby/${lobby}`}/>;
};

LobbyGuard.propTypes = {
  children: PropTypes.node
}


export const NameGuard = props => { //if user has not entered a name, redirect to main
  if (localStorage.getItem("userId")) {
    return props.children;
  }
  return <Redirect to="/main"/>;
};

NameGuard.propTypes = {
  children: PropTypes.node
};

export const CodeGuard = props => { //if user has no lobby, redirect to main
  if (localStorage.getItem("lobbyCode")) {
    if(localStorage.getItem("userId") === "1"){return <Redirect to="/main"/>}
    return props.children;
  }
  return <Redirect to="/join/code"/>;
};

NameGuard.propTypes = {
  children: PropTypes.node
};