import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './Home';
import UserList from './UserList';
import UserEdit from './UserEdit';
// import './App.css';
import LoginPage from './login/LoginPage';
import MainMenu from './navigation/MainMenu';
import SrhmMainPage from './navigation/SrhmMainPage';
import LseMainPage from './navigation/LseMainPage';
import CommsMainPage from './navigation/CommsMainPage';
import SchoolDetails from './lse/SchoolDetails';
import { SessionRoute } from './SessionRoute';

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          {/* <Route path='/' exact={true} component={Home}/> */}
          {/* <Route path='/users' exact={true} component={UserList}/> */}
          {/* <Route path='/users/:uuid' component={UserEdit}/> */}

          <Route path='/' exact={true} component={LoginPage}/>
          <SessionRoute path='/mainMenu' exact={true} component={MainMenu}/>
          <SessionRoute path='/srhmPage'  component={SrhmMainPage}/>
          <SessionRoute path='/lsePage'  component={LseMainPage}/>
          <SessionRoute path='/commsPage'  component={CommsMainPage}/>
          <SessionRoute path='/schoolDetails'  component={SchoolDetails}/>
        </Switch>
      </Router>
    );
  }
}

export default App;
