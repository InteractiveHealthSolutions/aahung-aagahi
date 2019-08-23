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
import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from "@trendmicro/react-sidenav";
import { MDBView, MDBMask } from 'mdbreact';
import  "../index.css";
import styled from "styled-components";
import SchoolDetails from "../lse/SchoolDetails";
import SchoolDetailsB from "../lse/SchoolDetailsB";
import SchoolDetailsC from "../lse/SchoolDetailsC";
import SchoolDetailsD from "../lse/SchoolDetailsD";
import TrainingDetails from "../lse/TrainingDetails";
import ParticipantDetails from "../lse/ParticipantDetail";
import PrimaryMonitoringNew from "../lse/PrimaryMonitoringNew";
import PrimaryMonitoringRunning from "../lse/PrimaryMonitoringRunning";
import PrimaryMonitoringExit from "../lse/PrimaryMonitoringExit";
import SecondaryMonitoringNew from "../lse/SecondaryMonitoringNew";
import SecondaryMonitoringRunning from "../lse/SecondaryMonitoringRunning";
import SecondaryMonitoringExit from "../lse/SecondaryMonitoringExit";
import StepDownTraining from "../lse/StepDownTraining";
import SrhrPolicy from "../lse/SrhrPolicy";
import MasterTrainerMockSessionEvaluation from "../lse/MasterTrainerMockSessionEvaluation";
import ParentSessions from "../lse/ParentSessions";
import MasterTrainerEligibilityCriteria from "../lse/MasterTrainerEligibilityCriteria";
import StakeholderMeeting from "../lse/StakeholderMeeting";
import OneTouchSessionDetail from "../lse/OneTouchSessionDetail";
import ParentOrganizationRegistration from "../lse/ParentOrganizationRegistration";
import DonorDetail from "../lse/DonorDetail";
import SchoolClosing from "../lse/SchoolClosing";
import { MemoryRouter } from "react-router-dom";
import { Prompt } from "react-router";
// import { Modal } from "antd";

const navWidthCollapsed = 64;
const navWidthExpanded = 280;

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
    // alert("LSE: Component did mount called!");
    // this.cancelCheck = this.cancelCheck.bind(this);
    window.addEventListener('beforeunload', this.beforeunload.bind(this));
    // alert("trying to login");
    // console.log(this.login("admin", "admin123"));


    // trying get request via fetch and axios
    let base64 = require('base-64');
    let axios = require('axios');
    let headers = new Headers();
    let response = '';
    let username = "admin";
    let password = "admin123";
    var basicAuth = 'Basic ' + btoa(username + ':' + password);
    var auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');
    // let URL = 'https://jsonplaceholder.typicode.com/posts/42';
    let URL =  'http://199.172.1.211:8080/aahung-aagahi/api/users?search=admin';
    // let URL =  'http://199.172.1.76:8080/aahung-aagahi/api/users?search=admin';

    // fetch('http://199.172.1.211:8080/aahung-aagahi/api/users?search=admin', {
    //     method: 'GET', 
    //     headers: headers.append('Authorization', 'Basic ' + base64.encode(username + ":" + password))
    // })
    // .then(response => response.json())
    // .then(json => console.log(json));

    // works
    // alert(base64.encode(username + ":" + password));

    // const AuthStr = 'Bearer '.concat(USER_TOKEN); 
        axios.get(URL, { 'headers': {
            'Authorization': 'Basic YWRtaW46YWRtaW4xMjM=',
            } 
        }
    )
        .then(response => {
            console.log(response.data[0]);
        })
        .catch((error) => {
        console.log('error ' + error);
    });

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
        style={{ minWidth: expanded ? navWidthExpanded : navWidthCollapsed }}
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
                  <b>Home - Aahung</b>
              </NavText>
          </NavItem>
          
          <NavItem eventKey="lse">
              <NavIcon>
                  <i className="fa fa-newspaper fa-5x" style={{ fontSize: '1.75em'}} />
              </NavIcon>
              <NavText>
                <b >LSE Forms</b>
                  
              </NavText>

              <NavItem eventKey="/donorDetails" className="navItemSeparator">
                  <NavText>
                  
                  <Link className="link" to="/donorDetails">
                  <b>Donor Details</b>
                  </Link>
                  
                  </NavText>
              </NavItem>

              <NavItem eventKey="/parentOrganization" className="navItemSeparator">
                  <NavText>
                  
                  <Link className="link" to="/parentOrganization">
                  <b>Parent Organization Registration</b>
                  </Link>
                  
                  </NavText>
              </NavItem>

              <NavItem eventKey="/schoolDetails" className="navItemSeparator">
                  <NavText>
                  
                  <Link className="link" to="/schoolDetails">
                  <b>School Details</b>
                  </Link>
                  
                  </NavText>
              </NavItem>
              <NavItem eventKey="/participantDetails" className="navItemSeparator">
                  <NavText>
                  
                  <Link className="link" to="/participantDetails">
                  <b>Participant Details</b>
                  </Link>
                  
                  </NavText>
              </NavItem>
              <NavItem eventKey="/parentOrganization" className="navItemSeparator">
                  <NavText>
                  
                  <Link className="link" to="/parentOrganization">
                  <b>Parent Organization</b>
                  </Link>
                  
                  </NavText>
              </NavItem>

              <NavItem eventKey="/trainingDetails" className="navItemSeparator">
                  <NavText>
                  <Link className="link" to="/trainingDetails">
                  <b>Training Detail</b>
                  </Link>
                  </NavText>
              </NavItem>

              <NavItem eventKey="/primaryMonitoringNew" className="navItemSeparator">
                  <NavText>
                  <Link className="link" to="/primaryMonitoringNew">
                  <b>Primary Monitoring Form - New</b>
                  </Link>
                  </NavText>
              </NavItem>
              
              <NavItem eventKey="/primaryMonitoringRunning" className="navItemSeparator">
                  <NavText>
                  <Link className="link" to="/primaryMonitoringRunning">
                  <b>Primary Monitoring Form - Running</b>
                  </Link>
                  </NavText>
              </NavItem>
              
              <NavItem eventKey="/primaryMonitoringExit" className="navItemSeparator">
                  <NavText>
                  <Link className="link" to="/primaryMonitoringExit">
                  <b>Primary Monitoring Form - Exit</b>
                  </Link>
                  </NavText>
              </NavItem>

              <NavItem eventKey="/secondaryMonitoringNew" className="navItemSeparator">
                  <NavText>
                  <Link className="link" to="/secondaryMonitoringNew">
                  <b>Secondary Monitoring Form - New</b>
                  </Link>
                  </NavText>
              </NavItem>

              <NavItem eventKey="/secondaryMonitoringRunning" className="navItemSeparator">
                  <NavText>
                  <Link className="link" to="/secondaryMonitoringRunning">
                  <b>Secondary Monitoring Form - Running</b>
                  </Link>
                  </NavText>
              </NavItem>

              <NavItem eventKey="/secondaryMonitoringExit" className="navItemSeparator">
                  <NavText>
                  <Link className="link" to="/secondaryMonitoringExit">
                  <b>Secondary Monitoring Form - Exit</b>
                  </Link>
                  </NavText>
              </NavItem>

              <NavItem eventKey="/srhrPolicy" className="navItemSeparator">
                  <NavText>
                  <Link className="link" to="/srhrPolicy">
                  <b>SRHR Policy</b>
                  </Link>
                  </NavText>
              </NavItem>

              <NavItem eventKey="/parentSessions" className="navItemSeparator">
                  <NavText>
                  <Link className="link" to="/parentSessions">
                  <b>Parent Sessions</b>
                  </Link>
                  </NavText>
              </NavItem>

              <NavItem eventKey="/masterTrainerEligibilityCriteria" className="navItemSeparator">
                  <NavText>
                  <Link className="link" to="/masterTrainerEligibilityCriteria">
                  <b>Master Trainer Eligibility Criteria Assessment</b>
                  </Link>
                  </NavText>
              </NavItem>

              <NavItem eventKey="/masterTrainerMockSessionEvaluation" className="navItemSeparator">
                  <NavText>
                  <Link className="link" to="/masterTrainerMockSessionEvaluation">
                  <b>Master Trainer Mock Session Evaluation</b>
                  </Link>
                  </NavText>
              </NavItem>

              <NavItem eventKey="/stepDownTraining" className="navItemSeparator">
                  <NavText>
                  <Link className="link" to="/stepDownTraining">
                  <b>Step Down Training Monitoring</b>
                  </Link>
                  </NavText>
              </NavItem>

              <NavItem eventKey="/schoolClosing" className="navItemSeparator">
                  <NavText>
                  <Link className="link" to="/schoolClosing">
                  <b>School Closing</b>
                  </Link>
                  </NavText>
              </NavItem>

              <NavItem eventKey="/stakeholderMeeting" className="navItemSeparator">
                  <NavText>
                  <Link className="link" to="/stakeholderMeeting">
                  <b>Stakeholder Meetings</b>
                  </Link>
                  </NavText>
              </NavItem>

              <NavItem eventKey="/oneTouchSessionDetail" className="navItemSeparator">
                  <NavText>
                  <Link className="link" to="/oneTouchSessionDetail">
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
    <Main expanded={expanded}>
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
                
                    <Route path='/parentOrganization' component={ParentOrganizationRegistration} />
                    <Route path='/donorDetails' component={DonorDetail} />
                    <Route path='/schoolDetails' component={SchoolDetails} />
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
        
    </Main>
    
    </div>
    </MemoryRouter>
    </div>
    );
  }
}

function About() {
    return (
      <div>
        <h2>About</h2>
      </div>
    );
  }

export default LseMainPage;