import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';

class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = {users: [], isLoading: true};
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});
    fetch('api/users')
      .then(response => response.json())
      .then(data => this.setState({users: data, isLoading:  false}));
  }

  async remove(uuid) {
    await fetch(`/api/user/${uuid}`, {
      method: 'DELETE', headers: {'Accept': 'application/json', 'Content-Type': 'application/json'}
    }).then(() => {
      let updatedUsers = [...this.state.users].filter(i => i.uuid !== uuid);
      this.setState({users: updatedUsers});
    });
  }

  render() {
    const {groups: users, isLoading} = this.state;
    if (isLoading || !users) {
      return <p>Loading...</p>;
    }
    const userList = users.map(users => {
      const address = `${users.address || ''} ${users.city || ''} ${users.stateOrProvince || ''} `;
      return <tr key={users.uuid}>
        <td>{users.name}</td>
        <td>{address}</td>
        <td>
          <ButtonGroup>
            <Button size="sm" color="primary" tag={Link} to={"/users/" + users.uuid}>Edit</Button>
            <Button size="sm" color="danger" onClick={() => this.remove(users.uuid)}>Delete</Button>
          </ButtonGroup>
        </td>
      </tr>
    });
    return (
      <div>
        <AppNavbar></AppNavbar>
          <Container fluid>
          <div className="float-right">
            <Button color="success" tag={Link} to="/users/new">Add Group</Button>
          </div>
          <h3>Groups</h3>
          <Table className="mt-4">
            <thead>
            <tr>
              <th width="20%">Name</th>
              <th width="20%">Location</th>
              <th width="10%">Actions</th>
            </tr>
            </thead>
            <tbody>{userList}</tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default UserList;
