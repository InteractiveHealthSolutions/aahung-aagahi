import React, {Component} from 'react';
import { Route, MemoryRouter} from 'react-router-dom';
import { MDBBtn, MDBIcon, MDBNavbar, MDBNavbarBrand} from 'mdbreact';
import { css } from '@emotion/core';

// Can be a string as well. Need to ensure each key-value pair ends with ;
const override = css`
    display: block;
    margin: 0 auto;
    border-color: purple;
`;
 
class FormNavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: this.props.isVisible,
      componentName: this.props.componentName
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ data: nextProps.data });  

    this.state = {
      isVisible: nextProps.isVisible,
      componentName: nextProps.componentName
    }
  }

  onClick = () =>  {
    this.props.history.push('/mainMenu');
  }

  render() {

    const navBarStyle = this.state.isVisible ? "block" : "none";

    return (
      <MemoryRouter>
        <MDBNavbar style={{backgroundColor: "#522A71", display: navBarStyle}} dark expand="md">
            <MDBNavbarBrand>
                <strong className="white-text">Aahung Aagahi - {this.state.componentName}</strong>
            </MDBNavbarBrand>
            <MDBBtn size="sm" onClick={this.onClick} style={{backgroundColor: "#ef6c00", marginBottom: '1em', marginLeft: "68%", marginTop: "-1% !important"}} >Home<MDBIcon icon="home" className="ml-2" /></MDBBtn>
        </MDBNavbar>
      </MemoryRouter>
    )
  }
}

export default FormNavBar;