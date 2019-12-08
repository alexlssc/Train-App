import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import * as ROUTES from './constants/routes';
import SignInPage from './components/SignIn'
import MainPage from "./components/Main";
import PlayerList from './components/PlayerList';
import TrainPage from './components/Training/AllTrainings';
import TrainingsInputContent from "./components/Training/TrainingsInput/";
import { withAuthentication } from './components/Session';

const App = () => (
    <Router>
        <Switch>
            <Route path={ROUTES.LANDING} exact component={MainPage} />
            <Route path={ROUTES.SIGN_IN} exact component={SignInPage}/>
            <Route path={ROUTES.PLAYER_LIST} exact component={PlayerList}/>
            <Route path={ROUTES.TRAININGS} exact component={TrainPage}/>
            <Route path={ROUTES.INPUTTRAININGS} component={TrainingsInputContent}/>
        </Switch>
    </Router>
);

export default withAuthentication(App);