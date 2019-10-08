import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import './App.css';
import LoginPage from './login/LoginPage';
import MainMenu from './navigation/MainMenu';
import SrhmMainPage from './navigation/SrhmMainPage';
import LseMainPage from './navigation/LseMainPage';
import CommsMainPage from './navigation/CommsMainPage';
import DashboardMainPage from './navigation/DashboardMainPage';
import { SessionRoute } from './access/SessionRoute';

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path='/' exact={true} component={LoginPage}/>
          <SessionRoute path='/mainMenu' exact={true} component={MainMenu}/>
          <SessionRoute path='/srhmPage'  component={SrhmMainPage}/>
          <SessionRoute path='/lsePage'  component={LseMainPage}/>
          <SessionRoute path='/commsPage'  component={CommsMainPage}/>
          <SessionRoute path='/reportPage'  component={DashboardMainPage}/>
          {/* <SessionRoute path='/schoolDetails'  component={SchoolDetails}/> */}
        </Switch>
      </Router>
    );
  }
}

export default App;