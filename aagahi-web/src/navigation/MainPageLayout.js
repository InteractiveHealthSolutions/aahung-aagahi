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
import { MDBBtn, MDBCollapse, MDBContainer, MDBDropdown, MDBDropdownItem, MDBDropdownMenu, MDBDropdownToggle, MDBFooter, MDBIcon, MDBMask, MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavbarToggler, MDBNavItem, MDBView } from 'mdbreact';
import React from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import RequirePrivilege from '../access/RequirePrivilege';
import aahunglogo from "../img/aahung-logo.svg";
import communication from "../img/communication.svg";
import document from "../img/document.svg";
import admin from "../img/management.svg";
import skills from "../img/skills.svg";
import srhm from "../img/srhm.svg";
import graph from "../img/graph.svg";
import '../index.css';

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
                                                    <RequirePrivilege
                                                        privilegeName="View Administration Section"
                                                        yes={() => (
                                                            <MDBDropdownItem href="/addUser">Add User</MDBDropdownItem>
                                                        )}
                                                    />
                                                    <MDBDropdownItem href="/">Logout</MDBDropdownItem>
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

                            <br />
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
                                privilegeName="View Search Section"
                                yes={() => (
                                    <Link to="/admin"><MDBBtn rounded outline size="lg" color="grey" className="flex-column text-center"><img src={admin} alt="thumbnail" height="60" width="70" /><br /><p className="font-weight-bold" style={{fontSize: "85%"}}>Search</p></MDBBtn></Link>
                                )}
                            />

                            <RequirePrivilege
                                privilegeName="View LSE Section"
                                yes={() => (
                                    <Link to="/lsePage"><MDBBtn rounded outline size="lg" color="grey" className="flex-column text-center"><img src={skills} alt="thumbnail" height="60" width="70" /><br /><p className="font-weight-bold" style={{fontSize: "85%"}}>LSE</p></MDBBtn></Link>
                                )}
                            />

                            <RequirePrivilege
                                privilegeName="View SRHM Section"
                                yes={() => (
                                    <Link to="/srhmPage"><MDBBtn rounded outline size="lg" color="grey" className="flex-column text-center"><img src={srhm} alt="thumbnail" height="60" width="70" /><br /><p className="font-weight-bold" style={{fontSize: "85%"}}> SRHM</p></MDBBtn></Link>
                                )}
                            />

                            <RequirePrivilege
                                privilegeName="View Comms Section"
                                yes={() => (
                                    <Link to="/commsPage"><MDBBtn rounded outline size="lg" color="grey" className="flex-column text-center"><img src={communication} alt="thumbnail" height="60" width="70" /><br /><p className="font-weight-bold" style={{fontSize: "85%"}}> COMMS</p></MDBBtn></Link>
                                )}
                            />

                            <RequirePrivilege
                                privilegeName="View Reports Section"
                                yes={() => (
                                    <Link to="/reportNavPage"><MDBBtn rounded outline size="lg" color="grey" className="flex-column text-center"><img src={document} alt="thumbnail" height="60" width="70" /><br /><p className="font-weight-bold" style={{fontSize: "85%"}}>Reports</p></MDBBtn></Link>
                                )}
                            />

                            <RequirePrivilege
                                privilegeName="View Dashboard Section"
                                yes={() => (
                                    <Link to="/dashboard"><MDBBtn rounded outline size="lg" color="grey" className="flex-column text-center"><img src={graph} alt="thumbnail" height="60" width="70" /><br /><p className="font-weight-bold" style={{fontSize: "84%"}}>Dashboard</p></MDBBtn></Link>
                                )}
                            />
                        </div>
                    </MDBContainer>
                    <MDBFooter color="grey lighten-1" >
                        <div className="footer-copyright text-center py-3" >
                            &copy; {new Date().getFullYear()} Copyright: <a href="http://ihsinformatics.com"> IHSinformatics.com </a>
                        </div>
                    </MDBFooter>
                </main>
            </div>
        );
    }
}

export default MainPageLayout;