import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
//import GameRouter from "components/routing/routers/GameRouter";
import {CodeGuard, MenuGuard, HostGuard, JoinGuard} from "components/routing/routeProtectors/LoginGuard";
import MainMenu from "../../views/lobby/MainMenu";
import EnterCode from "../../views/lobby/EnterCode";
import Username from "../../views/lobby/Username";
import HostLobby from "../../views/lobby/HostLobby";
import JoinLobby from "../../views/lobby/JoinLobby";
import GameView from "components/views/GameView";
import {GameGuard} from "../routeProtectors/GameGuard";
import Kicked from "../../views/lobby/Helpers/Kicked";
import Closed from "../../views/lobby/Helpers/Closed";


const AppRouter = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/kicked">
          <MenuGuard>
            <Kicked/>
          </MenuGuard>
        </Route>
        <Route exact path="/closed">
          <MenuGuard>
            <Closed/>
          </MenuGuard>
        </Route>
        <Route exact path="/game/:id">
          <GameGuard>
            <GameView/>
          </GameGuard>
        </Route>
        <Route exact path="/main">
          <MenuGuard>
            <MainMenu/>
          </MenuGuard>
        </Route>
        <Route exact path="/join/code">
          <MenuGuard>
            <EnterCode/>
          </MenuGuard>
        </Route>
        <Route exact path="/join/username">
          <CodeGuard>
            <Username/>
          </CodeGuard>
        </Route>
        <Route exact path="/join/lobby/:id/">
          <JoinGuard>
            <JoinLobby/>
          </JoinGuard>
        </Route>
        <Route exact path="/host/username">
          <MenuGuard>
            <Username/>
          </MenuGuard>
        </Route>
        <Route exact path="/host/lobby/:id/">
          <HostGuard>
            <HostLobby/>
          </HostGuard>
        </Route>
        <Route exact path="/">
          <Redirect to="/main"/>
        </Route>
      </Switch>
    </BrowserRouter>
  );
};
//can be divided into Join Router and Host router, follow Game Router as an example


export default AppRouter;
