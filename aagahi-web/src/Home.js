import React, { Component } from 'react';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import { Button, Container } from 'reactstrap';
import './App.css';

class Home extends Component {
  render() {
    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <Button color="link"><Link to="/users">Manage Users</Link></Button>
          {/* <Button color="link"><Link to="/participants">Manage Participants</Link></Button> */}
        </Container>
      </div>
    );
  }
}

export default Home;
