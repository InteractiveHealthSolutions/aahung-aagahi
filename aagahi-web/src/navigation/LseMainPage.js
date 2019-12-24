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
import MasterTrainerEligibilityCriteria from "../lse/MasterTrainerEligibilityCriteria";
import MasterTrainerMockSessionEvaluation from "../lse/MasterTrainerMockSessionEvaluation";
import OneTouchSessionDetail from "../lse/OneTouchSessionDetail";
import ParentOrganizationRegistration from "../lse/ParentOrganizationRegistration";
import ParentSessions from "../lse/ParentSessions";
import ParticipantDetails from "../lse/ParticipantDetail";
import PrimaryMonitoringExit from "../lse/PrimaryMonitoringExit";
import PrimaryMonitoringNew from "../lse/PrimaryMonitoringNew";
import PrimaryMonitoringRunning from "../lse/PrimaryMonitoringRunning";
import SchoolClosing from "../lse/SchoolClosing";
import SchoolDetails from "../lse/SchoolDetails";
import SchoolUpdate from "../lse/SchoolUpdate";
import SecondaryMonitoringExit from "../lse/SecondaryMonitoringExit";
import SecondaryMonitoringNew from "../lse/SecondaryMonitoringNew";
import SecondaryMonitoringRunning from "../lse/SecondaryMonitoringRunning";
import SrhrPolicy from "../lse/SrhrPolicy";
import StakeholderMeeting from "../lse/StakeholderMeeting";
import StepDownTraining from "../lse/StepDownTraining";
import TrainingDetails from "../lse/TrainingDetails";
import "../lsecss.css";

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


class LseMainPage extends React.Component {
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

    componentDidMount() {
        window.addEventListener('beforeunload', this.beforeunload.bind(this));
    }

componentDidMount() {
    // alert("LSE: Component did mount called!");
    // this.cancelCheck = this.cancelCheck.bind(this);
    window.addEventListener('beforeunload', this.beforeunload.bind(this));

    // if no rights, redirect to main menu
    // alert("You do not have rights to view this page");
    // this.props.history.push("/mainMenu");
}

componentWillUnmount() {
    // alert("LSE: ComponentWillUnMount called!");
    window.removeEventListener('beforeunload', this.beforeunload.bind(this));
}

beforeunload(e) {
    // if (this.props.dataUnsaved) {
      e.preventDefault();
      e.returnValue = true;
    // }
  }

  toggleSidebar = event => {
      this.setState({ 
          expanded: false 
        });
    //   event.preventDefault();
  }

render() {
    const { expanded, selected } = this.state;
    return (
     <div>
         <MemoryRouter>
             <div>
      <SideNav
        onSelect={(selected) => {
            
            const to = '/' + selected;
            if (window.location.pathname !== to) {
                if(selected === "mainMenu"){
                    this.props.history.push(to);
                } else if(selected === "/")
                    this.props.history.push("/");
            }
        }}
        style={{ minWidth: expanded ? navWidthExpanded : navWidthCollapsed, transition: "0.3s" }}
        class={ this.state.expanded ? 'sidenav---sidenav---_2tBP sidenav---expanded---1KdUL' : 'sidenav---sidenav---_2tBP sidenav---collapsed---LQDEv'}
        onToggle={this.onToggle}
        >
    <Toggle />
    <NavHeader expanded={expanded}>
                        <NavTitle>
                        <p className="font-weight-bold" style={{color: '#f7901d' }}>LSE</p></NavTitle>
                        <NavSubTitle>  </NavSubTitle>
                    </NavHeader>
      <SideNav.Nav defaultSelected={selected}>
          <NavItem eventKey="mainMenu">
              <NavIcon>
                  <i className="fa fa-fw fa-home" style={{ fontSize: '1.75em' }} />
              </NavIcon>
              <NavText>
                  <b>Home - Aagahi</b>
              </NavText>
          </NavItem>
          
          <NavItem eventKey="lse">
              <NavIcon>
                  <i className="fa fa-newspaper fa-5x" style={{ fontSize: '1.75em'}} />
              </NavIcon>
              <NavText>
                <b >LSE Forms</b>
                  
              </NavText>

              <NavItem eventKey="/donorRegistration" className="navItemSeparator" onClick={this.toggleSidebar}>
                  <NavText>
                  
                  <Link className="link formLink" to="/donorRegistration" >
                  <b>Donor Registration</b>
                  </Link>
                  
                  </NavText>
              </NavItem>

              
              <NavItem eventKey="/projectDetails" className="navItemSeparator" onClick={this.toggleSidebar}>
                  <NavText>
                  
                  <Link className="link formLink" to="/projectDetails">
                  <b>Project Details</b>
                  </Link>
                  
                  </NavText>
              </NavItem>

              <NavItem eventKey="/parentOrganization" className="navItemSeparator" onClick={this.toggleSidebar}>
                  <NavText>
                  
                  <Link className="link formLink" to="/parentOrganization">
                  <b>Parent Organization Registration</b>
                  </Link>
                  
                  </NavText>
              </NavItem>

              <NavItem eventKey="/schoolDetails" className="navItemSeparator" onClick={this.toggleSidebar}>
                  <NavText>
                  
                  <Link className="link formLink" to="/schoolDetails">
                  <b>School Details</b>
                  </Link>
                  
                  </NavText>
              </NavItem>

              <NavItem eventKey="/schoolUpdate" className="navItemSeparator" onClick={this.toggleSidebar}>
                  <NavText>
                  
                  <Link className="link formLink" to="/schoolUpdate">
                  <b>School Update</b>
                  </Link>
                  
                  </NavText>
              </NavItem>

              <NavItem eventKey="/participantDetails" className="navItemSeparator" onClick={this.toggleSidebar}>
                  <NavText>
                  
                  <Link className="link formLink" to="/participantDetails">
                  <b>Participant Details</b>
                  </Link>
                  
                  </NavText>
              </NavItem>

              <NavItem eventKey="/trainingDetails" className="navItemSeparator" onClick={this.toggleSidebar}>
                  <NavText>
                  <Link className="link formLink" to="/trainingDetails">
                  <b>Training Detail</b>
                  </Link>
                  </NavText>
              </NavItem>

              <NavItem eventKey="/primaryMonitoringNew" className="navItemSeparator" onClick={this.toggleSidebar}>
                  <NavText>
                  <Link className="link formLink" to="/primaryMonitoringNew">
                  <b>Primary Monitoring Form - New</b>
                  </Link>
                  </NavText>
              </NavItem>
              
              <NavItem eventKey="/primaryMonitoringRunning" className="navItemSeparator" onClick={this.toggleSidebar}>
                  <NavText>
                  <Link className="link formLink" to="/primaryMonitoringRunning">
                  <b>Primary Monitoring Form - Running</b>
                  </Link>
                  </NavText>
              </NavItem>
              
              <NavItem eventKey="/primaryMonitoringExit" className="navItemSeparator" onClick={this.toggleSidebar}>
                  <NavText>
                  <Link className="link formLink" to="/primaryMonitoringExit">
                  <b>Primary Monitoring Form - Exit</b>
                  </Link>
                  </NavText>
              </NavItem>

              <NavItem eventKey="/secondaryMonitoringNew" className="navItemSeparator" onClick={this.toggleSidebar}>
                  <NavText>
                  <Link className="link formLink" to="/secondaryMonitoringNew">
                  <b>Secondary Monitoring Form - New</b>
                  </Link>
                  </NavText>
              </NavItem>

              <NavItem eventKey="/secondaryMonitoringRunning" className="navItemSeparator" onClick={this.toggleSidebar}>
                  <NavText>
                  <Link className="link formLink" to="/secondaryMonitoringRunning">
                  <b>Secondary Monitoring Form - Running</b>
                  </Link>
                  </NavText>
              </NavItem>

              <NavItem eventKey="/secondaryMonitoringExit" className="navItemSeparator" onClick={this.toggleSidebar}>
                  <NavText>
                  <Link className="link formLink" to="/secondaryMonitoringExit">
                  <b>Secondary Monitoring Form - Exit</b>
                  </Link>
                  </NavText>
              </NavItem>

              <NavItem eventKey="/srhrPolicy" className="navItemSeparator" onClick={this.toggleSidebar}>
                  <NavText>
                  <Link className="link formLink" to="/srhrPolicy">
                  <b>SRHR Policy</b>
                  </Link>
                  </NavText>
              </NavItem>

              <NavItem eventKey="/parentSessions" className="navItemSeparator" onClick={this.toggleSidebar}>
                  <NavText>
                  <Link className="link formLink" to="/parentSessions">
                  <b>Parent Sessions</b>
                  </Link>
                  </NavText>
              </NavItem>

              <NavItem eventKey="/masterTrainerEligibilityCriteria" className="navItemSeparator" onClick={this.toggleSidebar}>
                  <NavText>
                  <Link className="link formLink" to="/masterTrainerEligibilityCriteria">
                  <b>MT Eligibility Criteria Assessment</b>
                  </Link>
                  </NavText>
              </NavItem>

              <NavItem eventKey="/masterTrainerMockSessionEvaluation" className="navItemSeparator" onClick={this.toggleSidebar}>
                  <NavText>
                  <Link className="link formLink" to="/masterTrainerMockSessionEvaluation">
                  <b>MT Mock Session Evaluation</b>
                  </Link>
                  </NavText>
              </NavItem>

              <NavItem eventKey="/stepDownTraining" className="navItemSeparator" onClick={this.toggleSidebar}>
                  <NavText>
                  <Link className="link formLink" to="/stepDownTraining">
                  <b>Step Down Training Monitoring</b>
                  </Link>
                  </NavText>
              </NavItem>

              <NavItem eventKey="/schoolClosing" className="navItemSeparator" onClick={this.toggleSidebar}>
                  <NavText>
                  <Link className="link formLink" to="/schoolClosing">
                  <b>School Closing</b>
                  </Link>
                  </NavText>
              </NavItem>

              <NavItem eventKey="/stakeholderMeeting" className="navItemSeparator" onClick={this.toggleSidebar}>
                  <NavText>
                  <Link className="link formLink" to="/stakeholderMeeting">
                  <b>Stakeholder Meetings</b>
                  </Link>
                  </NavText>
              </NavItem>

              <NavItem eventKey="/oneTouchSessionDetail" className="navItemSeparator" onClick={this.toggleSidebar}>
                  <NavText>
                  <Link className="link formLink" to="/oneTouchSessionDetail">
                  <b>One-Touch Session Detail Form</b>
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
    <Main expanded={expanded} style={{ marginLeft: expanded ? 286 : 0, transition: "0.3s"}} >
        <div >
            {/* <div class="sideSrhmHeaderDiv">
            <p className="font-weight-bold" style={{color: '#f7901d', fontSize:30 }}>LSE</p>

            </div> */}
            <MDBView>
            <div className="sideSrhmHeaderDiv">
                {/* <img src="https://mdbootstrap.com/img/Photos/Others/forest-sm.jpg" class="img-fluid" alt="placeholder"/> */}
            
                <MDBMask overlay="purple-strong" className="flex-column text-white">
                
                            {/* <br/> */}
                            <p className="font-weight-bold" style={{color: '#f7901d', fontSize:30 }}>LSE</p>
                </MDBMask>
            </div>
            </MDBView>
                <div >
                    <Switch>
                        <Route path='/projectDetails' component={ProjectDetails} />
                        <Route path='/donorRegistration' component={DonorRegistration} />
                        <Route path='/parentOrganization' component={ParentOrganizationRegistration} />
                        <Route path='/schoolDetails' component={SchoolDetails} />
                        <Route path='/schoolUpdate' component={SchoolUpdate} />
                        <Route path='/trainingDetails' component={TrainingDetails} />
                        <Route path='/participantDetails' component={ParticipantDetails}/>
                        <Route path='/primaryMonitoringNew' component={PrimaryMonitoringNew}/>
                        <Route path='/primaryMonitoringRunning' component={PrimaryMonitoringRunning}/>
                        <Route path='/primaryMonitoringExit' component={PrimaryMonitoringExit}/>
                        <Route path='/secondaryMonitoringNew' component={SecondaryMonitoringNew}/>
                        <Route path='/secondaryMonitoringRunning' component={SecondaryMonitoringRunning}/>
                        <Route path='/secondaryMonitoringExit' component={SecondaryMonitoringExit}/>
                        <Route path='/srhrPolicy' component={SrhrPolicy}/>
                        <Route path='/stepDownTraining' component={StepDownTraining}/>
                        <Route path='/masterTrainerMockSessionEvaluation' component={MasterTrainerMockSessionEvaluation}/>
                        <Route path='/parentSessions' component={ParentSessions}/>
                        <Route path='/masterTrainerEligibilityCriteria' component={MasterTrainerEligibilityCriteria}/>
                        <Route path='/stakeholderMeeting' component={StakeholderMeeting}/>
                        <Route path='/schoolClosing' component={SchoolClosing}/>
                        <Route path='/oneTouchSessionDetail' component={OneTouchSessionDetail}/>
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

export default LseMainPage;