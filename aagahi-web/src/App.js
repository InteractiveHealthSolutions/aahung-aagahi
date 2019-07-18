import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './Home';
import UserList from './UserList';
import UserEdit from './UserEdit';
import './App.css';

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path='/' exact={true} component={Home}/>
          <Route path='/users' exact={true} component={UserList}/>
          <Route path='/users/:uuid' component={UserEdit}/>
        </Switch>
      </Router>
    );
  }
}

export default App;
