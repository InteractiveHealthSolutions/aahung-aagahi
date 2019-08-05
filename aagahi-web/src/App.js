import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './Home';
import UserList from './UserList';
import UserEdit from './UserEdit';
// import './App.css';
import LoginPage from './Login/LoginPage';
import MainMenu from './navigation/MainMenu';
import SrhmMainPage from './navigation/SrhmMainPage';
import LseMainPage from './navigation/LseMainPage';
import SchoolDetails from './lse/SchoolDetails';

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          {/* <Route path='/' exact={true} component={Home}/> */}
          {/* <Route path='/users' exact={true} component={UserList}/> */}
          {/* <Route path='/users/:uuid' component={UserEdit}/> */}

          <Route path='/' exact={true} component={LoginPage}/>
          <Route path='/mainMenu' exact={true} component={MainMenu}/>
          <Route path='/srhmPage'  component={SrhmMainPage}/>
          <Route path='/lsePage'  component={LseMainPage}/>
          <Route path='/schoolDetails'  component={SchoolDetails}/>
        </Switch>
      </Router>
    );
  }
}

export default App;
