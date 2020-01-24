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

// Contributors: Owais Hussain

/**
 * @author Owais Hussain
 * @email owais.hussain@ihsinformatics.com
 * @create date 2019-12-18
 * @desc [description]
 */

import React from "react";
import ReactDOM from 'react-dom';
import '../css/dashboard.css';
import 'bootstrap-4-grid/css/grid.min.css';
import { Button } from '@progress/kendo-react-buttons';
import { savePDF } from '@progress/kendo-react-pdf';
import { MDBBtn, MDBCard, MDBCardBody, MDBCardHeader, MDBCol, MDBContainer, MDBIcon, MDBMask, MDBNav, MDBNavbar, MDBNavbarBrand, MDBNavItem, MDBNavLink, MDBRow, MDBTabContent, MDBTable, MDBTableBody, MDBTableHead, MDBTabPane, MDBView } from "mdbreact";
import '@progress/kendo-theme-material/dist/all.css';
import { PieChartContainer, GridContainer } from './DashboardDataContainer';
import { PrimaryStatsContainer } from './PrimaryStatsContainer';
import OneTouchSessions from './OneTouchSessions';
import TrainingDataSummary from './TrainingDataSummary';
import PartnerSchoolsChart from './PartnerSchoolsChart';
import PartnerSchoolsByYearChart from './PartnerSchoolsByYearChart';
import TeachersTrainedSummaryChart from './TeachersTrainedSummaryChart';
import ExitPlanning from './ExitPlanning';
import IndividualsReached from './IndividualsReached';
import SocialMediaTraffic from './SocialMediaTraffic';
import DashboardFilterContainer from "./DashboardFilterContainer";
import {Navbar, Form, FormControl, Nav} from 'react-bootstrap';
import { TabStrip, TabStripTab, PanelBar, PanelBarItem, PanelBarUtils, Menu, MenuItem, MenuItemModel, MenuItemLink, MenuItemArrow, Splitter } from '@progress/kendo-react-layout'
import '@progress/kendo-react-intl'
import '@progress/kendo-react-dropdowns'
import RadioLiveCall from "./RadioLiveCall";
import MobileCinema from "./MobileCinema";
import MaterialDistribution from "./MatrialDistribution";
import CommunicationsTraining from "./CommunicationsTraining";
import ParticipantTraining from "./ParticipantTraining";
import PartnerInstitutions from "./PartnerInstitution";
import AmplifyChangeParticipant from "./AmplifyChangeParticipants";

class DashboardMain extends React.Component {

    constructor(props) {
        super(props);
        this.appContainer = React.createRef();
        this.state = {
            selected: 0,
            showDialog: false,
        }
    }
    
    handleSelect = (e) => {
        this.setState({selected: e.selected});
    }

    /**
     * Handle export to PDF. All the content inside appContainer div will be exported as is
     */
    handlePDFExport = () => {
        savePDF(ReactDOM.findDOMNode(this.appContainer), { paperSize: 'auto' });
    }

    render() {
        return (
            <div id="apppage2">
                <MDBView>
                    <MDBMask className="gradient">
                        <div>
                        <div className="bootstrap-wrapper">
                            <Navbar style={{backgroundColor:"rgba(82, 42, 113, 1)"}}>
                            <Navbar.Brand href="#home" className="white-text">Aagahi Dashboard</Navbar.Brand>
                                <Nav className="mr-auto"></Nav>
                                <Form inline>
                                    {/* <Button variant="outline-info" style={{ backgroundColor: "#ef6c00", color: 'white'}} onClick={this.handlePDFExport}>Export PDF<MDBIcon icon="export" className="ml-2" /></Button> */}
                                    <MDBBtn size="md" onClick={() => this.props.history.push('/mainMenu')} style={{ backgroundColor: "#ef6c00"}} >Home<MDBIcon icon="home" className="ml-2" /></MDBBtn>
                                </Form>
                            </Navbar>
                        <div className="row">
                        <div class="col-md-10" style={{display: 'contents'}}>
                            <PrimaryStatsContainer />
                        </div>
                        </div>

                    <TabStrip style={{color: "white", fontWeight: "bold", width: "100%;"}} selected={this.state.selected} onSelect={this.handleSelect}>
                        <TabStripTab style={{width:"33%"}} title="LSE">
                            <DashboardFilterContainer />
                                <div class="component-container">
                                    <div class="row">
                                        <div class="col" style={{marginBottom: '12px'}}>
                                            <PartnerSchoolsChart />
                                        </div>
                                        <div class="col" style={{marginBottom: '12px'}}>
                                            <PartnerSchoolsByYearChart />
                                        </div>
                                        <div class="w-100">
                                            <div class="col" style={{marginBottom: '12px'}}>
                                                <TeachersTrainedSummaryChart />
                                            </div>
                                        </div>
                                        <div class="col" style={{marginBottom: '12px'}}>
                                            <TrainingDataSummary />
                                        </div>
                                        <div class="col" style={{marginBottom: '12px'}}>
                                            <ExitPlanning />
                                        </div>
                                    </div>
                                </div>
                        </TabStripTab>
                        <TabStripTab title="SRHM">
                            <DashboardFilterContainer />
                            <div class="component-container">
                            <div class="row">                            
                                <div class="col" style={{marginBottom: '12px'}}>
                                    <IndividualsReached />
                                </div>
                                <div class="col" style={{marginBottom: '12px'}}>   
                                    <ParticipantTraining />
                                </div>
                            </div>
                            <div class="row">
                                <div class="col" style={{marginBottom: '12px'}}>   
                                    <PartnerInstitutions />
                                </div>
                                <div class="col" style={{marginBottom: '12px'}}>  
                                    <AmplifyChangeParticipant />
                                </div>
                            </div>
                            </div>
                        </TabStripTab>
                        <TabStripTab title="COMMS">
                            <DashboardFilterContainer />
                            <div class="component-container">
                                <div class="row">
                                    <div class="col" style={{marginBottom: '12px'}}>   
                                        <SocialMediaTraffic />
                                    </div>
                                    <div class="col" style={{marginBottom: '12px'}}>   
                                        <RadioLiveCall />
                                    </div>
                                    <div class="w-100">
                                        <div class="col" style={{marginBottom: '12px'}}>   
                                            <MobileCinema />
                                        </div>
                                        <div class="col" style={{marginBottom: '12px'}}>   
                                            <MaterialDistribution />
                                        </div>
                                        <div class="col">   
                                            {/* <CommunicationsTraining /> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabStripTab>
                    </TabStrip>
                    </div>
            </div>
            </MDBMask>
          </MDBView>
        </div>
        );
    }
}

export default DashboardMain;
