import {Redirect, useParams} from "react-router-dom";
import PropTypes from "prop-types";

/**
 *
 * Another way to export directly your functional component.
 */
export const MenuGuard = props => {  // if user is already logged in, redirects him to his lobby
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

MenuGuard.propTypes = {
  children: PropTypes.node
}


export const JoinGuard = props => {//if user has not entered all info, redirect to main
  const lobbyCode = localStorage.getItem("lobbyCode");
  const { id } = useParams()
  if (localStorage.getItem("userId") > "1" && id === lobbyCode) {
    return props.children;
  }
  return <Redirect to="/"/>;
};

JoinGuard.propTypes = {
  children: PropTypes.node
};

export const HostGuard = props => {//if user has not entered all info, redirect to main
  const lobbyCode = localStorage.getItem("lobbyCode");
  const { id } = useParams()
  if (localStorage.getItem("userId") === "1" && id === lobbyCode) {
    return props.children;
  }
  return <Redirect to="/"/>;
};

HostGuard.propTypes = {
  children: PropTypes.node
};

export const CodeGuard = props => { //if user has no lobby, redirect to main
  if (localStorage.getItem("lobbyCode")) {
    if(localStorage.getItem("userId") === "1"){return <Redirect to="/main"/>}
    return props.children;
  }
  return <Redirect to="/join/code"/>;
};

CodeGuard.propTypes = {
  children: PropTypes.node
};