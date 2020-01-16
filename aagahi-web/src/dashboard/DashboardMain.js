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
            <div className="bootstrap-wrapper">
                 <Navbar bg="dark" variant="dark">
                <Navbar.Brand href="#home">Aagahi Dashboard</Navbar.Brand>
                    <Nav className="mr-auto">
                        
                    </Nav>
                    <Form inline>
                        <Button variant="outline-info" onClick={this.handlePDFExport}>Export PDF</Button>
                    </Form>
                </Navbar>

                <div className="app-container container" ref={(el) => this.appContainer = el}>
                    {/* <div className="row">
                        { <div class="col-md-6">
                            <h1>Aagahi Dashboard</h1>
                        </div> }
                        <div class="col-md-4">
                            <Button >Export PDF</Button>
                        </div>
                    </div> */}
                    <div className="row">
                    <div class="col-md-12">
                            <PrimaryStatsContainer />
                        </div>
                    </div>

                    <TabStrip selected={this.state.selected} onSelect={this.handleSelect}>
                        <TabStripTab title="LSE">
                        <div className="row">
                            <h1>-LSE</h1>
                        </div>

                    <div className="row">
                        <DashboardFilterContainer />
                    </div>


                    <div class="component-container">
                        <div class="row">
                            <div class="col">
                                <PartnerSchoolsChart />
                            </div>
                            <div class="col">
                                <PartnerSchoolsByYearChart />
                            </div>
                            <div class="w-100">
                            <div class="col">
                                <TeachersTrainedSummaryChart />
                            </div>
                            </div>
                            <div class="col">
                                <TrainingDataSummary />
                            </div>
                            <div class="col">
                                <ExitPlanning />
                            </div>
                            <div class="w-100"></div>
                            <div class="col">
                                <GridContainer />
                            </div>
                        </div>
                    </div>
                        </TabStripTab>
                        <TabStripTab title="SRHM" style={{width: '100%'}}>
                            
                        <div class="component-container">
                                <h1>-SRHM</h1>
                            </div>

                            <div className="row">
                                <DashboardFilterContainer />
                            </div>

                            <div class="col">
                                <div class="w-100">   
                                    <IndividualsReached />
                                </div>
                                <div class="w-100">   
                                    <ParticipantTraining />
                                </div>
                                <div class="w-100">   
                                    <PartnerInstitutions />
                                </div>
                                <div class="w-100">   
                                    <AmplifyChangeParticipant />
                                </div>
                            </div>
                        </TabStripTab>
                        <TabStripTab title="COMMS">

                        <div class="component-container">
                                
                        <h1>-COMMS</h1>
                            <div class="row">
                                <DashboardFilterContainer />
                            </div>

                            <div class="row">
                            <div class="col">   
                                    <SocialMediaTraffic />
                                </div>
                                <div class="col">   
                                    <RadioLiveCall />
                                </div>
                                <div class="w-100">
                                <div class="col">   
                                    <MobileCinema />
                                </div>

                                <div class="col">   
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
        );
    }
}

export default DashboardMain;
