import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import * as ROUTES from './constants/routes';
import SignInPage from './components/SignIn'
import MainPage from "./components/Main";
import { withAuthentication } from './components/Session';

const App = () => (
    <Router>
        <Switch>
            <Route path={ROUTES.LANDING} exact component={MainPage} />
            <Route path={ROUTES.SIGN_IN} exact component={SignInPage}/>
        </Switch>
    </Router>
);

export default withAuthentication(App);