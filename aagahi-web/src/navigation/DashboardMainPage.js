/**
 * @author Tahira Niazi
 * @email tahira.niazi@ihsinformatics.com
 * @create date 2019-08-26 12:54:33
 * @modify date 2019-08-26 12:54:33
 * @desc [description]
 */


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

import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from "@trendmicro/react-sidenav";
import { MDBView, MDBMask } from 'mdbreact';
import  "../index.css";
import styled from "styled-components";
import SocialMediaDetail from "../comms/SocialMediaDetail";
import DistributionCommunicationMaterial from "../comms/DistributionCommunicationMaterial";
import CommsTrainingDetails from "../comms/CommsTrainingDetails";
import RadioAppearance from "../comms/RadioAppearance";
import MobileCinemaDetails from "../comms/MobileCinemaDetails";
import DonorRegistration from "../common/DonorRegistration";
import ProjectDetails from "../common/ProjectDetails";
import ParentOrganizationRegistration from "../lse/ParentOrganizationRegistration";
import { MemoryRouter } from "react-router-dom";
import { Prompt } from "react-router";
// import { Modal } from "antd";
import Download from "../dump/Download";

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


class DashboardMainPage extends React.Component {
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
    // alert("Comms: Component did mount called!");
    // this.cancelCheck = this.cancelCheck.bind(this);
    window.addEventListener('beforeunload', this.beforeunload.bind(this));
    
    // if no rights, redirect to main menu
    // alert("You do not have rights to view this page");
    // this.props.history.push("/mainMenu");
}

componentWillUnmount() {
    // alert("Comms: ComponentWillUnMount called!");
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
                        <p className="font-weight-bold" style={{color: '#f7901d' }}>REPORTS</p></NavTitle>
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
          
          <NavItem eventKey="comms">
              <NavIcon>
                  <i className="fa fa-newspaper fa-5x" style={{ fontSize: '1.75em'}} />
              </NavIcon>
              <NavText>
                <b >Data Dumps</b>
                  
              </NavText>

              <NavItem eventKey="/download" className="navItemSeparator">
                  <NavText>
                  
                  <Link className="link" to="/download">
                  <b>Download Data Dumps</b>
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
        <p className="font-weight-bold" style={{color: '#f7901d', fontSize:30 }}>COMMS</p>

        </div> */}
        <MDBView>
        <div className="sideSrhmHeaderDiv">
            {/* <img src="https://mdbootstrap.com/img/Photos/Others/forest-sm.jpg" class="img-fluid" alt="placeholder"/> */}
        
            <MDBMask overlay="purple-strong" className="flex-column text-white">
            
                        {/* <br/> */}
                        <p className="font-weight-bold" style={{color: '#f7901d', fontSize:30 }}>REPORT</p>
            </MDBMask>
        </div>
        </MDBView>

            <div >
            
                <Switch>
                
                    {/* <Route path='/socialMediaDetails' component={SocialMediaDetail} /> */}
                    {/* <Route path='/distributionMaterial' component={DistributionCommunicationMaterial} /> */}
                    {/* <Route path='/trainingDetailsComms' component={CommsTrainingDetails} /> */}
                    {/* <Route path='/radioAppearance' component={RadioAppearance} /> */}
                    <Route path='/download' component={Download} />
                    {/* <Route path='/trainingDetails' component={TrainingDetails} />
                    <Route path='/download' component={About}/> */}
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

        {/* /api/report/donors.csv */}
        
        <a href="http://ihs.ihsinformatics.com:9990/aahung-aagahi/api/report/definitions.csv" target="_blank">Download Definitions</a> <br/>
        <a href="http://ihs.ihsinformatics.com:9990/aahung-aagahi/api/report/donors.csv" target="_blank">Download Donors</a>
      </div>
    );
  }

export default DashboardMainPage;