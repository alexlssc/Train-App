import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import * as ROUTES from './constants/routes';
import SignInPage from './components/SignIn'
import MainPage from "./scenes/Dashboard";
import PlayerList from './scenes/PlayerList';
import TrainPage from './scenes/Training/AllTrainings';
import TrainingsInputContent from "./scenes/Training/TrainingsInput/";
import TacticsPage from "./scenes/Tactics"
import TacticsInput from "./scenes/Tactics/TacticsInputs";
import BestEleven from "./scenes/BestEleven";
import GameRecords from "./scenes/TacticComparator/GameRecords";
import InputGameRecords from "./scenes/TacticComparator/InputGameRecord";
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
                    <Route path={ROUTES.BESTELEVEN} exact component={BestEleven}/>
                    <Route path={ROUTES.GAMERECORDS} exact component={GameRecords}/>
                    <Route path={ROUTES.INPUTGAMERECORDS} component={InputGameRecords}/>
                </Switch>
            </Router>
            {snackbarState.status ? <CustomisedSnackBar variant={snackbarState.status.category} open={snackbarState.status !== null} onClose={() => dispatch(snackbarOff())} message={snackbarState.status.msg} /> : null}
        </div>
    )
};

export default withAuthentication(App);