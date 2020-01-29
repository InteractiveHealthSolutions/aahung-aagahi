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

// Contributors: Owais Hussain, Tahira Niazi

/**
 * @author Owais Hussain, Tahira Niazi
 * @email owais.hussain@ihsinformatics.com, tahira.niazi@ihsinformatics.com
 * @create date 2019-12-18
 * @desc [description]
 */

import React from "react";
import ReactDOM from 'react-dom';
import '../css/dashboard.css';
import 'bootstrap-4-grid/css/grid.min.css';
import { Button } from '@progress/kendo-react-buttons';
import { savePDF, PDFExport } from '@progress/kendo-react-pdf';
import { MDBBtn, MDBCard, MDBCardBody, MDBCardHeader, MDBCol, MDBContainer, MDBIcon, MDBMask, MDBNav, MDBNavbar, MDBNavbarBrand, MDBNavItem, MDBNavLink, MDBRow, MDBTabContent, MDBTable, MDBTableBody, MDBTableHead, MDBTabPane, MDBView } from "mdbreact";
import '@progress/kendo-theme-material/dist/all.css';
import { PieChartContainer, GridContainer } from './DashboardDataContainer';
import PrimaryStatsContainer from './PrimaryStatsContainer';
import OneTouchSessions from './OneTouchSessions';
import TrainingDataSummary from './TrainingDataSummary';
import PartnerSchoolsChart from './PartnerSchoolsChart';
import PartnerSchoolsByYearChart from './PartnerSchoolsByYearChart';
import TeachersTrainedSummaryChart from './TeachersTrainedSummaryChart';
import ExitPlanning from './ExitPlanning';
import IndividualsReached from './IndividualsReached';
import SocialMediaTraffic from './SocialMediaTraffic';
import DashboardFilterContainer from "./DashboardFilterContainer";
import { Navbar, Form, FormControl, Nav } from 'react-bootstrap';
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
import Select from 'react-select';
import { getDistrictsByMultipleProvinces, getDistrictsByProvince, location, getProvinceListFilter, getDistrictListFilter } from "../util/LocationUtil.js";
import DatePicker from "react-datepicker";
import moment from 'moment';

class DashboardMain extends React.Component {

    chartsDiv;
    constructor(props) {
        super(props);
        this.appContainer = React.createRef();
        this.state = {
            selected: 0,
            showDialog: false,
            start_date: new Date(new Date().getFullYear(), 0, 1),
            end_date: new Date(),
            district: [], // for capturing the selected options for districts
            province: [], // for capturing the selected options for provinces,
            component: "lse",
            paramFilter: "",
            startDateParam: new Date(),
            endDateParam: new Date(),
            provincesStringParam: '',
            citiesStringParam: '',
        }
    }

    componentDidMount() {
        this.handleRefresh();
    }

    handleRefresh = () => {

        if (this.state.selected === 0)
            this.setState({ component: "lse" })
        else if (this.state.selected === 1)
            this.setState({ component: "srhm" })
        else
            this.setState({ component: "comms" })

        this.refreshComponentCharts();
    }

    handleDate(date, name) {
        this.setState({
            [name]: date
        });
    };

    handleSelect = async (e) => {
        this.setState({ selected: e.selected });

        if (e.selected === 0)
            await this.setState({ component: "lse" })
        else if (e.selected === 1)
            await this.setState({ component: "srhm" })
        else
            await this.setState({ component: "comms" })

        this.refreshComponentCharts();
    }

    refreshComponentCharts() {

        var concatenatedProvinces = getProvinceListFilter(this.state.province);
        var concatenatedDistricts = getDistrictListFilter(this.state.district);
        this.setState({
            startDateParam: moment(this.state.start_date).format('YYYY-MM-DD'),
            endDateParam: moment(this.state.end_date).format('YYYY-MM-DD'),
            provincesStringParam: concatenatedProvinces,
            citiesStringParam: concatenatedDistricts
        })
    }

    // for multi select
    valueChangeMulti(e, name) {

        console.log(e);
        this.setState({
            [name]: e
        });

        if (name === "province") {
            if (e !== null && e.length > 0) {
                let districts = getDistrictsByMultipleProvinces(e);
                console.log(districts);
                this.setState({
                    districtArray: districts,
                    district: []
                })
            }
            else {
                this.setState({
                    districtArray: [],
                    district: []
                })
            }
        }
    }

    /**
     * Handle export to PDF. All the content inside appContainer div will be exported as is
     */
    handlePDFExport = () => {
        savePDF(ReactDOM.findDOMNode(this.appContainer), { paperSize: 'auto' });
    }

    exportPDFWithComponent = (event) => {
        event.preventDefault();
        this.pdfExportComponent.save();
    }

    render() {
        return (
            <div id="apppage2">
                <MDBView>
                    <MDBMask className="gradient">
                        <div>
                            <div className="bootstrap-wrapper">
                                <Navbar style={{ backgroundColor: "rgba(82, 42, 113, 1)" }}>
                                    <Navbar.Brand href="#home" className="white-text">Aagahi Dashboard</Navbar.Brand>
                                    <Nav className="mr-auto"></Nav>
                                    <Form inline>
                                        <Button variant="outline-info" style={{ backgroundColor: "#ef6c00", color: 'white'}} onClick={this.exportPDFWithComponent}>Export PDF<MDBIcon icon="export" className="ml-2" /></Button>
                                        <MDBBtn size="md" onClick={() => this.props.history.push('/mainMenu')} style={{ backgroundColor: "#ef6c00" }} >Home<MDBIcon icon="home" className="ml-2" /></MDBBtn>
                                    </Form>
                                </Navbar>
                                <div className="row">
                                    <div class="col-md-10" style={{ display: 'contents' }}>
                                        <PrimaryStatsContainer />
                                    </div>
                                </div>
                                <div id="filtersDiv">
                                    {/* <DashboardFilterContainer handleRefresh={this.handleRefresh}/> */}
                                    <div class="card" style={{ marginLeft: "2%", marginRight: "2%" }}>
                                        <h5 class="card-header h5" style={{ color: 'black' }}>Filter Data</h5>
                                        <div class="card-body">
                                            <div class="row">
                                                <div class="col-sm-3" style={{ color: 'black' }}>Province</div>
                                                <div class="col-sm-3" style={{ color: 'black' }}>City</div>
                                                <div class="col-sm-2" style={{ color: 'black' }}>Start Date</div>
                                                <div class="col-sm-2" style={{ color: 'black' }}>End Date</div>
                                            </div>
                                            <div class="row">
                                                <div class="col-md-3">
                                                    <Select id="province" name="province" value={this.state.province} onChange={(e) => this.valueChangeMulti(e, "province")} options={location.provinces} isMulti required />
                                                </div>
                                                <div class="col-md-3">
                                                    <Select id="district" name="district" value={this.state.district} onChange={(e) => this.valueChangeMulti(e, "district")} options={this.state.districtArray} isMulti required />
                                                </div>
                                                <div class="col-md-2">
                                                    <DatePicker style={{ border: "none !important" }}
                                                        selected={this.state.start_date}
                                                        onChange={(date) => this.handleDate(date, "start_date")}
                                                        selectsStart
                                                        startDate={this.state.start_date}
                                                        endDate={this.state.end_date}
                                                        placeholderText="Start Date"
                                                    />
                                                    {/* <i class="far fa-calendar-alt"></i> */}
                                                </div>
                                                <div class="col-md-2">
                                                    <DatePicker style={{ borderTop: "none !important", borderLeft: "none !important", borderRight: "none !important" }}
                                                        selected={this.state.end_date}
                                                        onChange={(date) => this.handleDate(date, "end_date")}
                                                        selectsEnd
                                                        endDate={this.state.end_date}
                                                        minDate={this.state.start_date}
                                                        placeholderText="End Date"
                                                        maxDate={new Date()}
                                                    />
                                                </div>
                                                <div class="col-md-2">
                                                    <MDBBtn size="sm" style={{ backgroundColor: "#ef6c00", marginTop: "-4%" }} onClick={(e) => this.handleRefresh()} >Refresh<MDBIcon icon="sync-alt" className="ml-2" /></MDBBtn>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <br />
                                </div>

                                <PDFExport ref={(component) => this.pdfExportComponent = component} paperSize="auto">
                                <div ref={(chartsDiv) => this.chartsDiv = chartsDiv}>
                                <TabStrip style={{ color: "white", fontWeight: "bold", width: "100%;" }} selected={this.state.selected} onSelect={this.handleSelect}>
                                    <TabStripTab style={{ width: "33%" }} title="LSE">
                                        {/* <DashboardFilterContainer /> */}
                                        <div class="component-container">
                                            <div class="row">
                                                <div class="col" style={{ marginBottom: '12px' }}>
                                                    <PartnerSchoolsChart endDate={this.state.endDateParam} startDate={this.state.startDateParam} provincesString={this.state.provincesStringParam} component={this.state.component} />
                                                </div>
                                                <div class="col" style={{ marginBottom: '12px' }}>
                                                    <PartnerSchoolsByYearChart endDate={this.state.endDateParam} startDate={this.state.startDateParam} component={this.state.component} />
                                                </div>
                                                <div class="w-100">
                                                    <div class="col" style={{ marginBottom: '12px' }}>
                                                        <TeachersTrainedSummaryChart endDate={this.state.endDateParam} startDate={this.state.startDateParam} provincesString={this.state.provincesStringParam} citiesString={this.state.citiesStringParam} component={this.state.component} />
                                                    </div>
                                                </div>
                                                <div class="col" style={{ marginBottom: '12px' }}>
                                                    <TrainingDataSummary endDate={this.state.endDateParam} startDate={this.state.startDateParam} provincesString={this.state.provincesStringParam} citiesString={this.state.citiesStringParam} component={this.state.component} />
                                                </div>
                                                <div class="col" style={{ marginBottom: '12px' }}>
                                                    <ExitPlanning endDate={this.state.endDateParam} startDate={this.state.startDateParam} provincesString={this.state.provincesStringParam} citiesString={this.state.citiesStringParam} component={this.state.component} />
                                                </div>
                                            </div>
                                        </div>
                                    </TabStripTab>
                                    <TabStripTab title="SRHM">
                                        {/* <DashboardFilterContainer /> */}
                                        <div class="component-container">
                                            <div class="row">
                                                <div class="col" style={{ marginBottom: '12px' }}>
                                                    <IndividualsReached endDate={this.state.endDateParam} startDate={this.state.startDateParam} provincesString={this.state.provincesStringParam} citiesString={this.state.citiesStringParam} component={this.state.component} />
                                                </div>
                                                <div class="col" style={{ marginBottom: '12px' }}>
                                                    <ParticipantTraining endDate={this.state.endDateParam} startDate={this.state.startDateParam} provincesString={this.state.provincesStringParam} citiesString={this.state.citiesStringParam} component={this.state.component} />
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col" style={{ marginBottom: '12px' }}>
                                                    <PartnerInstitutions endDate={this.state.endDateParam} startDate={this.state.startDateParam} provincesString={this.state.provincesStringParam} citiesString={this.state.citiesStringParam} component={this.state.component} />
                                                </div>
                                                <div class="col" style={{ marginBottom: '12px' }}>
                                                    <AmplifyChangeParticipant endDate={this.state.endDateParam} startDate={this.state.startDateParam} provincesString={this.state.provincesStringParam} citiesString={this.state.citiesStringParam} component={this.state.component} />
                                                </div>
                                            </div>
                                        </div>
                                    </TabStripTab>
                                    <TabStripTab title="COMMS">
                                        {/* <DashboardFilterContainer /> */}
                                        <div class="component-container">
                                            <div class="row">
                                                <div class="col" style={{ marginBottom: '12px' }}>
                                                    <SocialMediaTraffic endDate={this.state.endDateParam} startDate={this.state.startDateParam} provincesString={this.state.provincesStringParam} citiesString={this.state.citiesStringParam} component={this.state.component} />
                                                </div>
                                                <div class="col" style={{ marginBottom: '12px' }}>
                                                    <RadioLiveCall endDate={this.state.endDateParam} startDate={this.state.startDateParam} component={this.state.component} />
                                                </div>
                                                <div class="w-100">
                                                    <div class="col" style={{ marginBottom: '12px' }}>
                                                        <MobileCinema endDate={this.state.endDateParam} startDate={this.state.startDateParam} provincesString={this.state.provincesStringParam} citiesString={this.state.citiesStringParam} component={this.state.component} />
                                                    </div>
                                                    <div class="col" style={{ marginBottom: '12px' }}>
                                                        <MaterialDistribution endDate={this.state.endDateParam} startDate={this.state.startDateParam} component={this.state.component}/>
                                                    </div>
                                                    <div class="col">
                                                        <CommunicationsTraining endDate={this.state.endDateParam} startDate={this.state.startDateParam} component={this.state.component}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </TabStripTab>
                                </TabStrip>
                                </div>
                                </PDFExport>
                            </div>
                        </div>
                    </MDBMask>
                </MDBView>
            </div>
        );
    }
}

export default DashboardMain;