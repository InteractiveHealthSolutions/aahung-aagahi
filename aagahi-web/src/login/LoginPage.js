// Copyright 2019 Interactive Health Solutions
//
// This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 3 of the License (GPLv3), or any later version.
//
// This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
// See the GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License along with this program; if not, write to the Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301  USA.
// You can also access the license on the internet at the address: http://www.gnu.org/licenses/gpl-3.0.html
//
// Interactive Health Solutions, hereby disclaims all copyright interest in the program `Aahung-Aagahi' written by the contributors.

// Contributors: Tahira Niazi

/**
 * @author Tahira Niazi
 * @email tahira.niazi@ihsinformatics.com
 * @create date 2019-07-30 11:52:58
 * @modify date 2019-07-30 11:52:58
 * @desc [description]
 */
import { MDBBtn, MDBCardBody, MDBCol, MDBContainer, MDBInput, MDBModal, MDBModalBody, MDBModalFooter, MDBModalHeader, MDBRow } from "mdbreact";
import React from "react";
import { Loader, LoadingOverlay } from 'react-overlay-loader';
import 'react-overlay-loader/styles.css';
import { Label } from 'reactstrap';
import aahunglogo from "../img/aahung-logo.svg";
import "../index.css";
import { UserService } from '../service/UserService';
import CarouselPage from "./LoginCarousel";
import { appVersion } from "../util/AahungUtil";

class LoginPage extends React.Component {

  constructor(props) {
    super(props);
    UserService.logout();

    this.state = {
      loading: false,
      modal: false,
      errorText: '',
    };
    // this.loading = true;
    this.callModal = this.callModal.bind(this);
  }

  componentWillUnmount() {

  }


  callModal = () => {
    this.setState({ modal: !this.state.modal });
  }

  handleSubmit = event => {
    event.preventDefault();
    this.setState({ loading: true });
    const data = new FormData(event.target);
    console.log(data.get('username'));
    console.log(data.get('password'));
    var username = data.get('username');
    var password = data.get('password');

    UserService.login(username, password)
      .then(
        responseData => {

          console.log(responseData);
          if (!(String(responseData).includes("Error"))) {
            this.setState({ loading: false });
            this.props.history.push('/mainMenu');
          }
          else {
            var errorMsg = '';
            if (String(responseData).includes("401"))
              errorMsg = "Incorrect credentials. Please check your username and password.";
            else if (String(responseData).includes("Network Error") || String(responseData).includes("500"))
              errorMsg = "Login unsuccessful. Server error occured, please check server settings and try again!";
            else if (String(responseData).includes("404"))
              errorMsg = "Login unsuccessful. Request failed with status code 404.";
            else
              errorMsg = "Login unsuccessful. Please check your internet connection.";
            this.setState({
              loading: false,
              errorText: errorMsg
            });
            UserService.logout();
            this.setState({
              modal: !this.state.modal
            });
          }
        }
      );
  }

  ticker() {
    setTimeout(function () {
      this.setState({ loading: false });

    }.bind(this), 20000);
  }

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  }

  render() {
    return (


      <MDBContainer className="mt-5">

        <LoadingOverlay >

          <MDBRow>
            <MDBCol >
              <CarouselPage />
            </MDBCol>
            <MDBCol md="3">

              <MDBCardBody>
                {/* <MDBCardHeader className="form-header deep-blue-gradient rounded"> */}
                <img id="loginAahungLogo" src={aahunglogo} className="App-logo" alt="logo" class="center" />
                <h4 id="loginHeading" className="my-4" >
                  Login
                  </h4>
                {/* </MDBCardHeader> */}
                <form onSubmit={this.handleSubmit}>
                  <div className="grey-text">
                    <MDBInput nam
                      label="Type your username"
                      icon="user"
                      group
                      type="text"
                      validate
                      error="wrong"
                      success="right"
                      id="username"
                      name="username"
                      required
                    />
                    <MDBInput
                      label="Type your password"
                      icon="lock"
                      group
                      type="password"
                      id="password"
                      name="password"
                      validate
                      required
                    />
                  </div>

                  <div className="text-center mt-4">
                    <MDBBtn
                      color="purple"
                      className="mb-3"
                      type="submit"
                    >
                      Login
                  </MDBBtn>
                  </div>
                </form>
                <MDBModalFooter id="loginPageFooter">
                  <Label style={{ fontSize: '0.8em' }}>?? {new Date().getFullYear()} Aahung-Aagahi {appVersion}</Label>
                </MDBModalFooter>
              </MDBCardBody>

            </MDBCol>
          </MDBRow>

          <MDBContainer>
            <MDBModal isOpen={this.state.modal} toggle={this.toggle}>
              <MDBModalHeader toggle={this.toggle}>Could not login!</MDBModalHeader>
              <MDBModalBody>
                {this.state.errorText}
              </MDBModalBody>
              <MDBModalFooter>
                <MDBBtn color="secondary" onClick={this.toggle}>OK!</MDBBtn>
              </MDBModalFooter>
            </MDBModal>
          </MDBContainer>
          <Loader text="Saving Trees..." textStyle={{ color: "#616161", display: "inline-block", width: "100%", textAlign: "center" }} loading={this.state.loading} />
        </LoadingOverlay>
      </MDBContainer>
    );
  }
};

export default LoginPage;