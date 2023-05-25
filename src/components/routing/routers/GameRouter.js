import { Redirect, Route } from "react-router-dom";
import PropTypes from 'prop-types';

const GameRouter = props => {
    /**
     * "this.props.base" is "/app" because as been passed as a prop in the parent of GameRouter, i.e., App.js
     */
    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Route exact path={`${props.base}/dashboard`}>
            </Route>
            <Route exact path={`${props.base}`}>
                <Redirect to={`${props.base}/dashboard`} />
            </Route>
        </div>
    );
};

GameRouter.propTypes = {
    base: PropTypes.string
}

export default GameRouter;