import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import * as ROUTES from './constants/routes';
import SignInPage from './components/SignIn'
import MainPage from "./components/Dashboard";
import PlayerList from './components/PlayerList';
import TrainPage from './components/Training/AllTrainings';
import TrainingsInputContent from "./components/Training/TrainingsInput/";
import TacticsPage from "./components/Tactics"
import TacticsInput from "./components/Tactics/TacticsInputs";
import BestEleven from "./components/BestEleven";
import { withAuthentication } from './components/Session';
import CustomisedSnackBar from "./components/SnackBarContent";
import {useSelector, useDispatch} from "react-redux";
import {snackbarOff} from "./actions";

const App = () => {
    const dispatch = useDispatch();
    const snackbarState = useSelector(state => state.snackbarState);
    return (
        <div>
            <Router>
                <Switch>
                    <Route path={ROUTES.LANDING} exact component={MainPage}/>
                    <Route path={ROUTES.SIGN_IN} exact component={SignInPage}/>
                    <Route path={ROUTES.PLAYER_LIST} exact component={PlayerList}/>
                    <Route path={ROUTES.TRAININGS} exact component={TrainPage}/>
                    <Route path={ROUTES.INPUTTRAININGS} component={TrainingsInputContent}/>
                    <Route path={ROUTES.TACTICS} exact component={TacticsPage}/>
                    <Route path={ROUTES.INPUTTACTICS} component={TacticsInput}/>
                    <Route path={ROUTES.BESTELEVEN} component={BestEleven}/>
                </Switch>
            </Router>
            {snackbarState.status ? <CustomisedSnackBar variant={snackbarState.status.category} open={snackbarState.status !== null} onClose={() => dispatch(snackbarOff())} message={snackbarState.status.msg} /> : null}
        </div>
    )
};

export default withAuthentication(App);