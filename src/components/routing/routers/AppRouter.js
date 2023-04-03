import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import {GameGuard} from "components/routing/routeProtectors/GameGuard";
import GameRouter from "components/routing/routers/GameRouter";
import {LoginGuard} from "components/routing/routeProtectors/LoginGuard";
import MainMenu from "components/views/MainMenu";
import Username from "components/views/Username";
import LobbyCode from "components/views/LobbyCode";


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
          <LoginGuard>
            <MainMenu/>
          </LoginGuard>
        </Route>
        <Route exact path="/join/code">
          <LoginGuard>
            <LobbyCode/>
          </LoginGuard>
        </Route>
        <Route exact path="/join/username">
          <LoginGuard>
            <Username/>
          </LoginGuard>
        </Route>
        <Route exact path="/host/username">
          <LoginGuard>
            <Username/>
          </LoginGuard>
        </Route>
        <Route exact path="/">
          <Redirect to="/main"/>
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

/*
* Don't forget to export your component!
 */
export default AppRouter;
