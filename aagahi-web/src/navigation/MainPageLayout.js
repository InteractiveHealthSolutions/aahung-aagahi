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
 * @create date 2019-07-30 12:10:12
 * @modify date 2019-07-30 12:10:12
 * @desc [description]
 */
import React from 'react';
import { MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavbarToggler, MDBCollapse, MDBNavItem, MDBNavLink, MDBContainer, MDBView, MDBMask, MDBBtn, MDBIcon, MDBDropdown, MDBDropdownItem, MDBDropdownToggle, MDBDropdownMenu, MDBRow, MDBCol, MDBFooter } from 'mdbreact';
import { Label } from 'reactstrap';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import aahunglogo from "../img/aahung-logo.svg";
import skills from "../img/skills.svg";
import communication from "../img/communication.svg";
import dashboard from "../img/dashboard.svg";
import admin from "../img/management.svg";
import srhm from "../img/srhm.svg";
import '../index.css';
import RequirePrivilege from '../access/RequirePrivilege';

class MainPageLayout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapse: false,
            username: '',
            isWideEnough: false,
        };
        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        this.setState({
            collapse: !this.state.collapse,
        });
    }

    componentDidMount() {
        
    }

    render() {
        
        return (
            <div >
                <Router>
                    <header >
                        <MDBNavbar color="black" fixed="top" dark expand="md">
                            <MDBContainer>
                                <img src={aahunglogo} alt="thumbnail" height="60" />
                                <MDBNavbarBrand href="/">
                                    <strong>AAHUNG</strong>
                                </MDBNavbarBrand>
                                <MDBNavbarToggler onClick={this.onClick} />
                                <MDBCollapse isOpen={this.state.collapse} navbar>
                                    <MDBNavbarNav left>
                                        {/* <MDBNavItem active>
                      <MDBNavLink to="#">Home</MDBNavLink>
                    </MDBNavItem> */}
                                        {/* <MDBNavItem>
                      <MDBNavLink to="#">Link</MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem>
                      <MDBNavLink to="#">Profile</MDBNavLink>
                    </MDBNavItem> */}
                                    </MDBNavbarNav>
                                    <MDBNavbarNav right>
                                        <MDBNavItem>
                                            <MDBDropdown>
                                                <MDBDropdownToggle nav caret>
                                                <MDBIcon icon="user" />
                                                </MDBDropdownToggle>
                                                <MDBDropdownMenu className="dropdown-default">
                                                    <MDBDropdownItem >Hi, <b>{sessionStorage.getItem('username')}</b></MDBDropdownItem>
                                                    <MDBDropdownItem href="/">Logout</MDBDropdownItem>
                                                    {/* <MDBDropdownItem href="#!">Something else here</MDBDropdownItem>
                                                    <MDBDropdownItem href="#!">Something else here</MDBDropdownItem> */}
                                                </MDBDropdownMenu>
                                            </MDBDropdown>
                                        </MDBNavItem>
                                    </MDBNavbarNav>
                                </MDBCollapse>
                            </MDBContainer>
                        </MDBNavbar>

                        {/* <MDBContainer> */}
                            {/* <MDBRow> */}
                        
                        {/* </MDBRow> */}
                        {/* </MDBContainer> */}
                    </header>
                    
                </Router>

                <MDBView> 
                
                <div class="cover">
                    {/* <img src="https://mdbootstrap.com/img/Photos/Others/forest-sm.jpg" class="img-fluid" alt="placeholder"/> */}
                
                    <MDBMask overlay="purple-strong" className="flex-center flex-column text-white text-center">
                    
                                <br/>
                                <h2><p className="font-weight-bold">Improving Access to Services</p></h2>
                                <h5><p className="font-weight-bolder">Improving Institutional Provision of Comprehensive SRHR Information and Services Countrywide.</p></h5>
                                <br />
                                <MDBBtn rounded outline
                                    href="https://www.aahung.org/"
                                    target="_b  lank"
                                    color="warning">
                                    <b>Learn More!</b>
                                </MDBBtn>
                            </MDBMask>
                            </div>
                </MDBView>

                <main>
                    <MDBContainer className="text-center my-5">
                    <div>
                    <p className="font-weight-bolder">Select the field you are interested</p>
                    
                    <RequirePrivilege
                    privilegeName="View Administration Section"
                    yes={() => (
                        <Link to="/adminPage"><MDBBtn rounded outline size="lg" color="grey" className="flex-column text-white text-center"><img src={admin} alt="thumbnail" height="60" width="80"/><br/><p className="font-weight-bold">Admin</p></MDBBtn></Link>
                    )}
                    />
                    
                    <RequirePrivilege
                    privilegeName="View LSE Section"
                    yes={() => (
                        <Link to="/lsePage"><MDBBtn rounded outline size="lg" color="grey" className="flex-column text-white text-center"><img src={skills} alt="thumbnail" height="60" width="80"/><br/><p className="font-weight-bold">LSE</p></MDBBtn></Link>
                    )}
                    />
                    
                    <RequirePrivilege
                    privilegeName="View SRHM Section"
                    yes={() => (
                        <Link to="/srhmPage"><MDBBtn rounded outline size="lg" color="grey" className="flex-column text-white text-center"><img src={srhm} alt="thumbnail" height="60" width="80"/><br/><p className="font-weight-bold"> SRHM</p></MDBBtn></Link>
                    )}
                    />

                    <RequirePrivilege
                    privilegeName="View Comms Section"
                    yes={() => (
                        <Link to="/commsPage"><MDBBtn rounded outline size="lg" color="grey" className="flex-column text-white text-center"><img src={communication} alt="thumbnail" height="60" width="80"/><br/><p className="font-weight-bold"> COMMS</p></MDBBtn></Link>
                    )}
                    />
                    
                    {/* /reportPage */}
                    <Link to="/reportPage"><MDBBtn rounded outline size="lg" color="grey" className="flex-column text-white text-center"><img src={dashboard} alt="thumbnail" height="60" width="80"/><br/><p className="font-weight-bold">Reports</p></MDBBtn></Link>
                    {/* <Link to={{ pathname: '/schoolDetails', state: { xyz: true, abc: false} }}><MDBBtn rounded outline size="lg" color="grey" className="flex-column text-white text-center"><img src={dashboard} alt="thumbnail" height="60" width="80"/><br/><p className="font-weight-bold">Dashboard</p></MDBBtn></Link> */}
                    </div>
                    </MDBContainer>
                        <MDBFooter color="grey lighten-1" >
                            <div className="footer-copyright text-center py-3" >
                                &copy; {new Date().getFullYear()} Copyright: <a href="http://ihsinformatics.com"> IHSinformatics.com </a>
                            </div>
                        </MDBFooter>
                        {/* <p align="justify">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,  quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis  aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla  pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia  deserunt mollit anim id est laborum.</p> */}
                    
                </main>
            </div>
        );
    }
}

export default MainPageLayout;