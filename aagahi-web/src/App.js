import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import './App.css';
import LoginPage from './login/LoginPage';
import MainMenu from './navigation/MainMenu';
import SrhmMainPage from './navigation/SrhmMainPage';
import LseMainPage from './navigation/LseMainPage';
import CommsMainPage from './navigation/CommsMainPage';
import ReportMainPage from './navigation/ReportMainPage';
import AdminMainPage from './navigation/AdminMainPage';
import AdminPage from './navigation/AdminPage';
import { SessionRoute } from './access/SessionRoute';
import ReportsNav from './navigation/ReportsNav';
import SchoolDetails from './lse/SchoolDetails';
import AddUser from './admin/AddUser';

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path='/' exact={true} component={LoginPage}/>
          <SessionRoute path='/mainMenu' exact={true} component={MainMenu}/>
          <SessionRoute path='/srhmPage' component={SrhmMainPage}/>
          <SessionRoute path='/lsePage' component={LseMainPage}/>
          <SessionRoute path='/commsPage' component={CommsMainPage}/>
          <SessionRoute path='/reportNavPage' component={ReportsNav}/>
          <SessionRoute path='/reportPage' component={ReportMainPage}/>
          <SessionRoute path='/adminPage' component={AdminMainPage}/>
          <SessionRoute path='/admin' component={AdminPage}/>
          <SessionRoute path='/schoolDetails'  component={SchoolDetails}/>
          <SessionRoute path='/addUser'  component={AddUser}/>
        </Switch>
      </Router>
    );
  }
}

export default App;