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
import React from "react";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCardBody,
  MDBModalFooter,
  MDBBtn,
  MDBInput
} from "mdbreact";

import CarouselPage from "./LoginCarousel";
import aahunglogo from "../img/aahung-logo.svg";
import createHistory from 'history/createBrowserHistory';
import LoadingIndicator from "../widget/LoadingIndicator";
import { LoadingOverlay, Loader } from 'react-overlay-loader';
import { ClipLoader, ClimbingBoxLoader, GridLoader, HashLoader } from 'react-spinners';
import 'react-overlay-loader/styles.css'; 
import  "../index.css";



class LoginPage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: false 
    };
    // this.loading = true;
    
  }

  // TODO: just testing login, refactor this code
  login() {

    let axios = require('axios');
    let base64 = require('base-64');
    let username = "admin";
    let password = "admin123";

    let URL =  'http://199.172.1.76:8080/aahung-aagahi/api/users?search=admin';

    axios.get(URL, { 'headers': {
        'Authorization': 'Basic ' + base64.encode(username + ":" + password),
        } 
      }
    )
    .then(response => {
        console.log(URL);
        console.log(response.data[0]);
        console.log(" >>>>>>> authenticated");
        this.setState({ loading: false });
        this.props.history.push('/mainMenu');
    })
    .catch((error) => {
      console.log('error ' + error);
      this.setState({ loading: false });
      // TODO: refactor this , implement complete login functionality
      this.props.history.push('/mainMenu');
    }); 
  }
  
  submitHandler = event => {
    event.preventDefault();
    // event.target.className += " was-validated";
    
    const history = createHistory();
    this.setState({ loading: true });
    this.login()
    
    
    
    // return <Redirect to='/loggedin' />
    
  };

  ticker() {
    setTimeout(function(){
      this.setState({ loading: false });
      
    }.bind(this),20000);
  }

  render() {
  return (

    
    <MDBContainer className="mt-5">
    
    {/* { this.state.loading ? <LoadingIndicator loading={true}/> :  */}

    <LoadingOverlay > 
            
      
        <MDBRow>
        <MDBCol md="">
        <CarouselPage/>
        </MDBCol>
          <MDBCol md="3">
            
              <MDBCardBody>
                {/* <MDBCardHeader className="form-header deep-blue-gradient rounded"> */}
                  
                    <img src={aahunglogo} className="App-logo" alt="logo"  class="center"/>
                    <h4 className="my-4">
                    Login
                  </h4>
                {/* </MDBCardHeader> */}
                <form onSubmit={this.submitHandler}>
                  <div className="grey-text">
                    <MDBInput nam
                      label="Type your username"
                      icon="user"
                      group
                      type="text"
                      validate
                      error="wrong"
                      success="right"
                      required
                    />
                    <MDBInput
                      label="Type your password"
                      icon="lock"
                      group
                      type="password"
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
                  {/* <Route exact path="/loggedin" component={MainMenu} /> */}
                </div>
                </form>
                <MDBModalFooter>
                  {/* <div className="font-weight-light">
                    <p>© 2019 Aahung.  </p>
                  </div> */}
                </MDBModalFooter>
              </MDBCardBody>
            
          </MDBCol>
          </MDBRow>

        {/* }   */}
        {/* closing tertiary operator */}

        <Loader text ="Saving Trees..."  textStyle={{color: "#616161", display: "inline-block", width: "100%", textAlign: "center"}}  loading={this.state.loading}/>
        </LoadingOverlay>
      </MDBContainer>

              
  );
}
};

export default LoginPage;