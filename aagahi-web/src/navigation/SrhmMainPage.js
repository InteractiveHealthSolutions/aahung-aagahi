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
 * @create date 2019-07-30 12:08:12
 * @modify date 2019-07-30 12:08:12
 * @desc [description]
 */
import SideNav, { NavIcon, NavItem, NavText, Toggle } from "@trendmicro/react-sidenav";
import { MDBMask, MDBView } from 'mdbreact';
import React from "react";
import { Link, MemoryRouter, Route, Switch } from "react-router-dom";
import styled from "styled-components";
import DonorRegistration from "../common/DonorRegistration";
import ProjectDetails from "../common/ProjectDetails";
import "../index.css";
import ParentOrganizationRegistration from "../lse/ParentOrganizationRegistration";
import AmplifyChangeParticipantDetail from "../shrm/AmplifyChangeParticipantDetail";
import AmplifyChangeStepDownTrainingDetails from "../shrm/AmplifyChangeStepDownTrainingDetails";
import AmplifyChangeTrainingDetails from "../shrm/AmplifyChangeTrainingDetails";
import GeneralParticipantDetail from "../shrm/GeneralParticipantDetail";
import GeneralStepDownTrainingDetails from "../shrm/GeneralStepDownTrainingDetails";
import GeneralTrainingDetails from "../shrm/GeneralTrainingDetails";
import HealthCareProviderReach from "../shrm/HealthCareProviderReach";
import InstitutionClosing from "../shrm/InstitutionClosing";
// import { Modal } from "antd";
import InstitutionDetails from "../shrm/InstitutionDetail";
import NayaQadamStepDownTraining from "../shrm/NayaQadamStepDownTraining";
import OneTouchSensitizationDetails from "../shrm/OneTouchSensitizationDetails";

const navWidthCollapsed = 64;
const navWidthExpanded = 350;

const NavHeader = styled.div`
    display: ${props => (props.expanded ? 'block' : 'none')};
    white-space: nowrap;
    background-color: #db3d44;
    color: #fff;

    > * {
        color: inherit;
        background-color: inherit;
    }
`;

// height: 20px + 10px + 10px = 40px
const NavTitle = styled.div`
    font-size: 2em;
    line-height: 20px;
    padding: 10px 0;
`;

// height: 20px + 4px = 24px;
const NavSubTitle = styled.div`
    font-size: 1em;
    line-height: 20px;
    padding-bottom: 4px;
`;

const NavInfoPane = styled.div`
    float: left;
    width: 100%;
    padding: 10px 20px;
    background-color: #eee;
`;

const Separator = styled.div`
    clear: both;
    position: relative;
    margin: .8rem 0;
    background-color: #ddd;
    height: 1px;
`;

const Main = styled.main`
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: ${navWidthCollapsed}px;
    overflow: hidden;
    transition: all .15s;
    padding: 0 20px;
    background: ${props => (props.expanded ? 'rgba(0, 0, 0, .6)' : 'inherit')};
    transition: background-color .35s cubic-bezier(.4, 0, .2, 1);
`;

// const { confirm } = Modal

// const confirmNavigation = (message, callback) => {
//   confirm({
//     title: message,
//     onOk() {
//       callback(true)
//     },
//     onCancel() {
//       callback(false)
//     }
//   })
// }


class SrhmMainPage extends React.Component {
    state = {
        selected: 'home',
        expanded: false
    };

    //   state = {
    //     sideNavLeft: false,
    //     sideNavRight: false
    //   }



    lastUpdateTime = new Date().toISOString();

    onSelect = (selected) => {
        this.setState({ selected: selected });
    };
    onToggle = (expanded) => {
        this.setState({ expanded: expanded });
    };



    sidenavToggle = sidenavId => () => {
        const sidenavNr = `sideNav${sidenavId}`
        this.setState({
            [sidenavNr]: !this.state[sidenavNr]
        });
    };



    render() {
        const { expanded, selected } = this.state;
        return (
            <div id="test1"  >
                <MemoryRouter>
                    <div>
                        <SideNav
                            onSelect={(selected) => {

                                const to = '/' + selected;
                                if (window.location.pathname !== to) {
                                    if (selected === "mainMenu") {
                                        this.props.history.push(to);
                                        // history.push(to);
                                    } else if (selected === "/")
                                        this.props.history.push("/");
                                    //  else {
                                    // alert(selected);
                                    // this.props.history.push(selected);
                                    //  }
                                }
                            }}
                            style={{ minWidth: expanded ? navWidthExpanded : navWidthCollapsed, transition: "0.3s" }}
                            // onSelect={this.onSelect}
                            onToggle={this.onToggle}
                        >
                            <Toggle />
                            <NavHeader expanded={expanded}>
                                <NavTitle>
                                    <p className="font-weight-bold" style={{ color: '#f7901d' }}>SRHM</p></NavTitle>
                                <NavSubTitle>  </NavSubTitle>
                            </NavHeader>
                            {/* <SideNav.Toggle /> */}
                            <SideNav.Nav defaultSelected={selected}>
                                <NavItem eventKey="mainMenu">
                                    <NavIcon>
                                        <i className="fa fa-fw fa-home" style={{ fontSize: '1.75em' }} />
                                        {/* <img src={aahunglogo} alt="thumbnail" height="40" /> */}
                                    </NavIcon>
                                    <NavText>
                                        <b>Home - Aagahi</b>
                                    </NavText>
                                </NavItem>
                                {/* <Link to="/about">About</Link> */}

                                <NavItem eventKey="shrm">
                                    <NavIcon>
                                        <i className="fa fa-newspaper fa-5x" style={{ fontSize: '1.75em' }} />
                                    </NavIcon>
                                    <NavText>
                                        <b >SRHM Forms</b>

                                    </NavText>

                                    <NavItem eventKey="/donorRegistration" className="navItemSeparator">
                                        <NavText>

                                            <Link className="link formLink" to="/donorRegistration">
                                                <b>Donor Registration</b>
                                            </Link>

                                        </NavText>
                                    </NavItem>


                                    <NavItem eventKey="/projectDetails" className="navItemSeparator">
                                        <NavText>

                                            <Link className="link formLink" to="/projectDetails">
                                                <b>Project Details</b>
                                            </Link>

                                        </NavText>
                                    </NavItem>

                                    <NavItem eventKey="/parentOrganization" className="navItemSeparator">
                                        <NavText>

                                            <Link className="link formLink" to="/parentOrganization">
                                                <b>Parent Organization Registration</b>
                                            </Link>

                                        </NavText>
                                    </NavItem>

                                    <NavItem eventKey="/institutionDetails" className="navItemSeparator">
                                        <NavText>
                                            <Link className="link formLink" to="/institutionDetails">
                                                <b>Institution Details Form</b>
                                            </Link>
                                        </NavText>
                                    </NavItem>

                                    <NavItem eventKey="/institutionClosing" className="navItemSeparator"  >
                                        <NavText>
                                            <Link className="link formLink" to="/institutionClosing">
                                                <b>Institution Closing Form</b>
                                            </Link>
                                        </NavText>
                                    </NavItem>

                                    <NavItem eventKey="/generalParticipantDetail" className="navItemSeparator"  >
                                        <NavText>
                                            <Link className="link formLink" to="/generalParticipantDetail">
                                                <b>General Participant Details</b>
                                            </Link>
                                        </NavText>
                                    </NavItem>


                                    <NavItem eventKey="/amplifyChangeParticipantDetail" className="navItemSeparator"  >
                                        <NavText>
                                            <Link className="link formLink" to="/amplifyChangeParticipantDetail">
                                                <b>Amplify Change Participant Details</b>
                                            </Link>
                                        </NavText>
                                    </NavItem>

                                    <NavItem eventKey="/oneTouchSensitizationDetails" className="navItemSeparator">
                                        <NavText>

                                            <Link className="link formLink" to="/oneTouchSensitizationDetails">
                                                <b>One Touch Sensitization Details</b>
                                            </Link>

                                        </NavText>
                                    </NavItem>


                                    <NavItem eventKey="/nayaQadamStepDownTraining" className="navItemSeparator">
                                        <NavText>

                                            <Link className="link formLink" to="/nayaQadamStepDownTraining">
                                                <b>Naya Qadam Step Down Training</b>
                                            </Link>

                                        </NavText>
                                    </NavItem>

                                    <NavItem eventKey="/generalTrainingDetails" className="navItemSeparator">
                                        <NavText>

                                            <Link className="link formLink" to="/generalTrainingDetails">
                                                <b>General Training Details</b>
                                            </Link>

                                        </NavText>
                                    </NavItem>

                                    <NavItem eventKey="/amplifyChangeTrainingDetails" className="navItemSeparator">
                                        <NavText>
                                            <Link className="link formLink" to="/amplifyChangeTrainingDetails">
                                                <b>Amplify Change Training Details Form</b>
                                            </Link>
                                        </NavText>
                                    </NavItem>

                                    <NavItem eventKey="/generalStepDownTrainingDetails" className="navItemSeparator">
                                        <NavText>

                                            <Link className="link formLink" to="/generalStepDownTrainingDetails">
                                                <b>General Step Down Training Details</b>
                                            </Link>

                                        </NavText>
                                    </NavItem>

                                    <NavItem eventKey="/amplifyChangeStepDownTrainingDetails" className="navItemSeparator">
                                        <NavText>

                                            <Link className="link formLink" to="/amplifyChangeStepDownTrainingDetails">
                                                <b>Amplify Change Step Down Training Details</b>
                                            </Link>

                                        </NavText>
                                    </NavItem>

                                    <NavItem eventKey="/healthCareProviderReach" className="navItemSeparator">
                                        <NavText>

                                            <Link className="link formLink" to="/healthCareProviderReach">
                                                <b>Health Care Provider Reach</b>
                                            </Link>

                                        </NavText>
                                    </NavItem>


                                </NavItem>

                                <NavItem eventKey="/">
                                    <NavIcon>
                                        <i className="fa fa-fw fa-power-off" style={{ fontSize: '1.75em' }} />
                                    </NavIcon>
                                    <NavText>
                                        <b>Logout</b>
                                    </NavText>
                                </NavItem>
                            </SideNav.Nav>
                        </SideNav>
                        <Main expanded={expanded} style={{ marginLeft: expanded ? 286 : 0, transition: "0.3s" }} >
                            <div >
                                <MDBView>
                                    <div className="sideSrhmHeaderDiv">
                                        <MDBMask overlay="purple-strong" className="flex-column text-white">

                                            {/* <br/> */}
                                            <p className="font-weight-bold" style={{ color: '#f7901d', fontSize: 30 }}>SRHM</p>
                                        </MDBMask>
                                    </div>
                                </MDBView>

                                <div >
                                    <Switch>
                                        <Route path='/projectDetails' component={ProjectDetails} />
                                        <Route path='/donorRegistration' component={DonorRegistration} />
                                        <Route path='/parentOrganization' component={ParentOrganizationRegistration} />
                                        <Route path='/institutionDetails' component={InstitutionDetails} />
                                        <Route path='/institutionClosing' component={InstitutionClosing} />
                                        <Route path='/generalParticipantDetail' component={GeneralParticipantDetail} />
                                        <Route path='/oneTouchSensitizationDetails' component={OneTouchSensitizationDetails} />
                                        <Route path='/generalTrainingDetails' component={GeneralTrainingDetails} />
                                        <Route path='/amplifyChangeTrainingDetails' component={AmplifyChangeTrainingDetails} />
                                        <Route path='/amplifyChangeParticipantDetail' component={AmplifyChangeParticipantDetail} />
                                        <Route path='/nayaQadamStepDownTraining' component={NayaQadamStepDownTraining} />
                                        <Route path='/generalStepDownTrainingDetails' component={GeneralStepDownTrainingDetails} />
                                        <Route path='/amplifyChangeStepDownTrainingDetails' component={AmplifyChangeStepDownTrainingDetails} />
                                        <Route path='/healthCareProviderReach' component={HealthCareProviderReach} />
                                    </Switch>
                                </div>
                            </div>
                        </Main>
                    </div>
                </MemoryRouter>
            </div>
        );
    }
}

export default SrhmMainPage;