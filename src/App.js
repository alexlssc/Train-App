import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { LoginPage } from './LoginPage'
import { MainPage } from "./main";


function App() {
  return (
      <Router>
        <Switch>
          <Route path="/" exact component={MainPage} />
          <Route path="/login" exact component={LoginPage}/>
        </Switch>
      </Router>
  );
}

export default App;
