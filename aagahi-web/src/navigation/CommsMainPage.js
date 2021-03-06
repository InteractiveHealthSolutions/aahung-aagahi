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

import SideNav, { NavIcon, NavItem, NavText, Toggle } from "@trendmicro/react-sidenav";
import { MDBMask, MDBView } from 'mdbreact';
import React from "react";
import { Link, MemoryRouter, Route, Switch } from "react-router-dom";
import styled from "styled-components";
import CommsTrainingDetails from "../comms/CommsTrainingDetails";
import DistributionCommunicationMaterial from "../comms/DistributionCommunicationMaterial";
import MobileCinemaDetails from "../comms/MobileCinemaDetails";
import RadioAppearance from "../comms/RadioAppearance";
import SocialMediaDetail from "../comms/SocialMediaDetail";
import "../index.css";
// import { Modal } from "antd";

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


class CommsMainPage extends React.Component {
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
                        <p className="font-weight-bold" style={{color: '#f7901d' }}>COMMS</p></NavTitle>
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
          
          <NavItem eventKey="comms">
              <NavIcon>
                  <i className="fa fa-newspaper fa-5x" style={{ fontSize: '1.75em'}} />
              </NavIcon>
              <NavText>
                <b >Comms Forms</b>
                  
              </NavText>

              <NavItem eventKey="/socialMediaDetails" className="navItemSeparator" onClick={this.toggleSidebar}>
                  <NavText>
                  
                  <Link className="link formLink" to="/socialMediaDetails">
                  Social Media Details
                  </Link>
                  
                  </NavText>
              </NavItem>

              <NavItem eventKey="/distributionMaterial" className="navItemSeparator" onClick={this.toggleSidebar}>
                  <NavText>
                  
                  <Link className="link formLink" to="/distributionMaterial">
                  Distribution of Communication Material
                  </Link>
                  
                  </NavText>
              </NavItem>

              <NavItem eventKey="/trainingDetailsComms" className="navItemSeparator" onClick={this.toggleSidebar}>
                  <NavText>
                  
                  <Link className="link formLink" to="/trainingDetailsComms">
                  Training Details Form - Communications
                  </Link>
                  
                  </NavText>
              </NavItem>
              <NavItem eventKey="/radioAppearance" className="navItemSeparator" onClick={this.toggleSidebar}>
                  <NavText>
                  
                  <Link className="link formLink" to="/radioAppearance">
                  Radio Appearance Form
                  </Link>
                  </NavText>
              </NavItem>
              <NavItem eventKey="/mobileCinemaDetails" className="navItemSeparator" onClick={this.toggleSidebar}>
                  <NavText>
                  
                  <Link className="link formLink" to="/mobileCinemaDetails">
                  Mobile Cinema/Theatre Details Form
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
        {/* <div class="sideSrhmHeaderDiv">
        <p className="font-weight-bold" style={{color: '#f7901d', fontSize:30 }}>COMMS</p>

        </div> */}
                            <MDBView>
                                <div className="sideSrhmHeaderDiv">
                                    {/* <img src="https://mdbootstrap.com/img/Photos/Others/forest-sm.jpg" class="img-fluid" alt="placeholder"/> */}

                                    <MDBMask overlay="purple-strong" className="flex-column text-white">

                                        {/* <br/> */}
                                        <p className="font-weight-bold" style={{ color: '#f7901d', fontSize: 30 }}>COMMS</p>
                                    </MDBMask>
                                </div>
                            </MDBView>

                            <div >

                                <Switch>

                                    <Route path='/socialMediaDetails' component={SocialMediaDetail} />
                                    <Route path='/distributionMaterial' component={DistributionCommunicationMaterial} />
                                    <Route path='/trainingDetailsComms' component={CommsTrainingDetails} />
                                    <Route path='/radioAppearance' component={RadioAppearance} />
                                    <Route path='/mobileCinemaDetails' component={MobileCinemaDetails} />
                                    {/* <Route path='/trainingDetails' component={TrainingDetails} />
                    <Route path='/participantDetails' component={ParticipantDetails}/> */}
                                </Switch>

                            </div>

                        </Main>

                    </div>
                </MemoryRouter>
            </div>
        );
    }
}

export default CommsMainPage;