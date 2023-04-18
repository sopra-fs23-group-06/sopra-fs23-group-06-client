import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import {GameGuard} from "components/routing/routeProtectors/GameGuard";
import GameRouter from "components/routing/routers/GameRouter";
import {CodeGuard, LobbyGuard, NameGuard} from "components/routing/routeProtectors/LoginGuard";
import MainMenu from "../../views/lobby/MainMenu";
import EnterCode from "../../views/lobby/EnterCode";
import Username from "../../views/lobby/Username";
import ShowCode from "../../views/lobby/ShowCode";
import HostLobby from "../../views/lobby/HostLobby";
import JoinLobby from "../../views/lobby/JoinLobby";
import GameView from "components/views/lobby/GameView";


const AppRouter = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/game">
          <GameGuard>
            <GameRouter base="/game"/>
          </GameGuard>
        </Route>
        <Route exact path="/main">
          <LobbyGuard>
            <MainMenu/>
          </LobbyGuard>
        </Route>
        <Route exact path="/join/code">
          <LobbyGuard>
            <EnterCode/>
          </LobbyGuard>
        </Route>
        <Route exact path="/join/username">
          <CodeGuard>
            <Username/>
          </CodeGuard>
        </Route>
        <Route exact path="/host/username">
          <LobbyGuard>
            <Username/>
          </LobbyGuard>
        </Route>
        <Route exact path="/host/lobby/:id/code">
          <NameGuard>
            <ShowCode/>
          </NameGuard>
        </Route>
        <Route exact path="/gameview">
          
          {/*ADD GAME GUARD*/}
          
          <GameView/>          
        </Route>
        <Route exact path="/host/lobby/:id/">
          <NameGuard>
            <HostLobby/>
          </NameGuard>
        </Route>
        <Route exact path="/join/lobby/:id/">
          <NameGuard>
            <JoinLobby/>
          </NameGuard>
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
