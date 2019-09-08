/**
 * @author Tahira Niazi
 * @email tahira.niazi@ihsinformatics.com
 * @create date 2019-07-30 12:53:25
 * @modify date 2019-07-30 12:53:25
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

import React, { Fragment } from "react";
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import { Input, Label, CustomInput, Form, FormGroup, Container, Card, CardBody, TabContent, TabPane, CardTitle, Row, Col } from 'reactstrap';
import { Button, CardHeader, ButtonGroup } from 'reactstrap';
import "../index.css";
import { MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavbarToggler, MDBCollapse, MDBNavItem, MDBNavLink, MDBContainer, MDBView, MDBMask, MDBBtn, MDBIcon, MDBDropdown, MDBDropdownItem, MDBDropdownToggle, MDBDropdownMenu, MDBRow, MDBCol, MDBFooter } from 'mdbreact';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import aahunglogo from "../img/aahung-logo.svg";
import Select from 'react-select';
import CustomModal from "../alerts/CustomModal";
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
import { location, getDistrictsByProvince} from "../util/LocationUtil.js";
import moment from 'moment';
import { getLocationsByCategory } from '../service/GetService';


const programsImplemented = [  /* value will be replaced with short names */
    { label: 'CSA', value: 'csa'},
    { label: 'Gender', value: 'gender'},
    { label: 'LSBE', value: 'lsbe'},
];

const projects = [
    { value: 'pro1', label: 'GF-TB', donor: "Global Fund" },
    { value: 'pro2', label: 'GF-HIV', donor: "Global Fund" },
    { value: 'pro3', label: 'WHO-Cancer', donor: "WHO" },
];

const formatOptionLabel = ({ value, label, donor }) => (
    <div style={{ display: "flex" }}>
      <div>{label} |</div>
      <div style={{ marginLeft: "10px", color: "#9e9e9e" }}>
        {donor}
      </div>
    </div>
  );

class SchoolDetails extends React.Component {

    modal = false;

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);

        this.state = {
            organizations : [],
            program_implemented : [],
            school_level : 'Secondary',
            school_tier: 'New',
            activeTab: '1',
            partnership_years : '',
            point_person_contact: '',
            selectedOption: null,
            page2Show: true,
            isTierNew: true,
            isTierRunning: false,
            isTierExit: false,
            isView: false,
            errors: {},
            // modal: false,
        };

        // fields for loading data in components
        // this.organizations = [];

        this.cancelCheck = this.cancelCheck.bind(this);
        this.callModal = this.callModal.bind(this);
        this.valueChangeMulti = this.valueChangeMulti.bind(this);
        this.inputChange = this.inputChange.bind(this);
        this.errors = {};
        this.partnership_years = '';
        this.isSecondary = false;
        this.isPrimary = false;
    }

    componentDidMount() {
        // alert("School Details: Component did mount called!");
        // this.cancelCheck = this.cancelCheck.bind(this);
        window.addEventListener('beforeunload', this.beforeunload.bind(this));
        this.loadData();
    }

    componentWillUnmount() {

        // alert("School Details: ComponentWillUnMount called!");
        window.removeEventListener('beforeunload', this.beforeunload.bind(this));
        // alert(this.modal);
        // this.modal = !this.modal;
        // alert(this.modal);
    }

    /**
     * Loads data when the component is mounted
     */
    loadData = async () => {

        this.setState({
            organizations : await getLocationsByCategory('cce863e8-d09b-11e9-b422-0242ac130002')
        })
        
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    beforeunload(e) {
        // if (this.props.dataUnsaved) {
          e.preventDefault();
          e.returnValue = true;
        // }
      }


    cancelCheck = () => {
        // this.setState({ page2Show: false });
        console.log(this.state.program_implemented);
        // this.handleGet();
        var categoryUuid = "cce863e8-d09b-11e9-b422-0242ac130002";
        var categoryShortName = "parent_location";
        
        // getLocationsByCategory(categoryUuid);
        console.log(this.state.parent_organization_name);
        
    }

    // for single select
    valueChange = (e, name) => {
        console.log(e); 
        console.log(e.target.value);

        this.setState({
            [name]: e.target.value
        });

        if( name === "school_level") {

            e.target.id === "school_level_secondary" ? this.setState({
                // Autoselect program_implemented = LSBE
                program_implemented: [{value: 'lsbe', label: 'LSBE'}]
                }) : this.setState({
                    program_implemented: []
                    });
        }
        
        if (name === "school_tier") {
            if(e.target.value === "school_tier_new") {
                this.setState({isTierNew : true });
                this.setState({isTierRunning : false });
                this.setState({isTierExit : false });
            }
            else if(e.target.value === "school_tier_running") {
                this.setState({isTierNew : false });
                this.setState({isTierRunning : true });
                this.setState({isTierExit : false });
            }
            else if(e.target.value === "school_tier_exit") {
                this.setState({isTierNew : false });
                this.setState({isTierRunning : false });
                this.setState({isTierExit : true });
            }
        }

    }

    inputChange(e, name) {
        let errorText = '';
        if(name != "point_person_email" && (e.target.pattern != "" && e.target.pattern != undefined) ) {
            
            errorText = e.target.value.match(e.target.pattern) != e.target.value ? "invalid!" : '';
            console.log(errorText);
            this.errors[name] = errorText;
        }

        if(name === "point_person_email") {
            let regexPattern = new RegExp(e.target.pattern);
            console.log(regexPattern);
            if (regexPattern.test(e.target.value))
            {
                errorText = '';
                this.errors[name] = errorText;
            }
            else {
                errorText = "invalid!";
                this.errors[name] = errorText;
            }
        }

        this.setState({
            [name]: e.target.value
        });

        this.setState({errors: this.errors});


        // appending dash to contact number after 4th digit
        if(name === "point_person_contact") {
            this.setState({ point_person_contact: e.target.value});
            let hasDash = false;
            if(e.target.value.length == 4 && !hasDash) {
                this.setState({ point_person_contact: ''});
            }
            if(this.state.point_person_contact.length == 3 && !hasDash) {
                this.setState({ point_person_contact: ''});
                this.setState({ point_person_contact: e.target.value});
                this.setState({ point_person_contact: `${e.target.value}-` });
                this.hasDash = true;
            }
        }
    }

    valueChangeMulti(e, name) {
        console.log(e);

        this.setState({
            [name]: e
        });
    }

    callModal = () => {
        this.setState({ modal : !this.state.modal });
    }

    // for autocomplete single select
    handleChange(e, name) {

        this.setState({
            [name]: e
        });

        if(name === "parent_organization_id") {
            
            this.setState({
                parent_organization_name : e.shortName
            })
        }

        if(name === "province"){
            let districts = getDistrictsByProvince(e.id); // sending province integer id
            console.log(districts);
            this.setState({
                districtArray : districts
            })
        }
    };

    // handleOnSubmit = e => {
    //     e.preventDefault();
    //     // pass form data
    //     // get it from state
    //     const formData = {};
    //     this.finallySubmit(formData);
    //   };

    finallySubmit = formData => {
    };

    handleSubmit = event => {

        
        event.preventDefault();
        const data = new FormData(event.target);
        console.log(data.get('participantScore'));

    }

    handleGet() {
        let axios = require('axios');
        var categoryUuid = 'cce863e8-d09b-11e9-b422-0242ac130002'; 
        let URL =  'http://199.172.1.76:8080/aahung-aagahi/api/locations/category/' + categoryUuid;

        console.log(localStorage.getItem('auth_header'));
        axios.get(URL, { 'headers': {
            'Authorization': localStorage.getItem('auth_header'),
            } 
          }
        )
        .then(response => {
            console.log(response.data);
            
        })
        .catch((error) => {
          console.log(error);
          
        }); 
      
    }



    render() {

        const page2style = this.state.page2Show ? {} : { display: 'none' };
        const newSchoolStyle = this.state.isTierNew ? {} : { display: 'none' };
        const runningSchoolStyle = this.state.isTierRunning ? {} : { display: 'none' };
        const exitSchoolStyle = this.state.isTierExit ? {} : { display: 'none' };
        
        
        // const exitSchoolStyle = this.isSecondary ? {} : { display: 'none' };
        // const exitSchoolStyle = this.isPrimary ? {} : { display: 'none' };
        var navBarStyle= '';
        var spanDivStyle = '';
        if(this.props.location.state !== undefined) {
            navBarStyle = this.props.location.state.xyz ? {} : { display: 'none' };
            spanDivStyle = this.props.location.state.xyz ? {height: "3.2em"} : { display: 'none' };
        }
        else {
            navBarStyle = { display: 'none' };
            spanDivStyle = { display: 'none' };
        }

        const { selectedOption } = this.state;

        return (
            <div >
                <div id="spanSpaceDiv" style={spanDivStyle}><span>   </span></div>
            <Router>
                    <header >
                        <MDBNavbar color="black" fixed="top" dark expand="md" style={navBarStyle}>
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
                                                    <MDBDropdownItem href="/">Logout</MDBDropdownItem>
                                                    <MDBDropdownItem href="/mainMenu">Back</MDBDropdownItem>
                                                    <MDBDropdownItem href="#!">Something else here</MDBDropdownItem>
                                                    <MDBDropdownItem href="#!">Something else here</MDBDropdownItem>
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

                <Fragment >

                    <ReactCSSTransitionGroup
                        component="div"
                        transitionName="TabsAnimation"
                        transitionAppear={true}
                        transitionAppearTimeout={0}
                        transitionEnter={false}
                        transitionLeave={false}>
                        <div>
                            <Container >
                            <Form id="schoolDetail" onSubmit={this.handleSubmit}>
                                <Row>
                                    <Col md="6">
                                        <Card className="main-card mb-6">
                                            {/* <CardBody> */}

                                            {/* <h6><b>Parent Organization Registration</b></h6> */}

                                            {/* </CardBody> */}

                                            <CardHeader>
                                                <i className="header-icon lnr-license icon-gradient bg-plum-plate"> </i>
                                                <b>School Details Form</b>
                                            </CardHeader>

                                        </Card>
                                    </Col>

                                </Row>

                                {/* <br/> */}

                                <Row>
                                    <Col md="12">
                                        <Card className="main-card mb-6 center-col">
                                            <CardBody>
                                                    <TabContent activeTab={this.state.activeTab}>
                                                        <TabPane tabId="1">
                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup inline>
                                                                        <Label for="date_start" >Form Date</Label>
                                                                        <Input type="date" name="date_start" id="date_start" value={this.state.date_start} onChange={(e) => {this.inputChange(e, "date_start")}} max={moment().format("YYYY-MM-DD")} required/>

                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup>
                                                                        <Label for="province" >Province</Label> <span class="errorMessage">{this.state.errors["province"]}</span>
                                                                        <Select id="province" name="province" value={this.state.province} onChange={(e) => this.handleChange(e, "province")} options={location.provinces} required/>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6">
                                                                    <FormGroup> 
                                                                        <Label for="district" >District</Label> <span class="errorMessage">{this.state.errors["district"]}</span>
                                                                        <Select id="district" name="district" value={this.state.district} onChange={(e) => this.handleChange(e, "district")} options={this.state.districtArray} required/>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="parent_organization_id" >Parent Organization ID</Label> <span class="errorMessage">{this.state.errors["parent_organization_id"]}</span>
                                                                        <Select id="parent_organization_id" name="parent_organization_id" value={this.state.parent_organization_id} onChange={(e) => this.handleChange(e, "parent_organization_id")} options={this.state.organizations} />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="parent_organization_name" >Parent Organization Name</Label>  
                                                                        <Input name="parent_organization_name" id="parent_organization_name" value={this.state.parent_organization_name} disabled />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="school_name" >School Name</Label> <span class="errorMessage">{this.state.errors["school_name"]}</span>
                                                                        <Input name="school_name" id="school_name" value={this.state.school_name} onChange={(e) => {this.inputChange(e, "school_name")}} maxLength='100' placeholder="Enter school name" />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        {/* TODO: autogenerate school ID */} 
                                                                        <Label for="school_id" >School ID</Label> <span class="errorMessage">{this.state.errors["school_id"]}</span>
                                                                        <Input name="school_id" id="school_id" value={this.state.school_id} onChange={(e) => {this.inputChange(e, "school_id")}} maxLength='100' disabled />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            <Row>

                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="partnership_start_date" >Date partnership with Aahung was formed</Label> <span class="errorMessage">{this.state.errors["partnership_start_date"]}</span>
                                                                        <Input type="date" name="partnership_start_date" id="partnership_start_date" value={this.state.partnership_start_date} onChange={(e) => {this.inputChange(e, "partnership_start_date")}} locale = {moment().format("DD-MM-YYYY")} max={moment().format("YYYY-MM-DD")} onInput = {(e) => { this.partnership_years =  moment(e.target.value, "YYYYMMDD").fromNow(); }} required />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="partnership_years" >Number of years of partnership</Label> <span class="errorMessage">{this.state.errors["partnership_years"]}</span>
                                                                        <Input name="partnership_years" id="partnership_years" onChange={(e) => {this.inputChange(e, "partnership_years")}} value={parseInt((this.partnership_years).match(/\d+/g)) == 'NaN' ? 0 : parseInt((this.partnership_years).match(/\d+/g)) } disabled />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="school_type" >Type of School</Label> <span class="errorMessage">{this.state.errors["school_type"]}</span>
                                                                        <Input type="select" name="school_type" id="school_type" onChange={(e) => this.valueChange(e, "school_type")} value={this.state.school_type}>
                                                                            <option value="school_public">Public</option>
                                                                            <option value="school_private">Private</option>
                                                                            <option value="school_govt_adopted_private">Government Adopted by Private</option>
                                                                            <option value="school_local_govt">Local Government Schools</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="school_sex" >Classification of School by Sex</Label> <span class="errorMessage">{this.state.errors["school_sex"]}</span>
                                                                        <Input type="select" name="school_sex" id="school_sex" onChange={(e) => this.valueChange(e, "school_sex")} value={this.state.school_sex}>
                                                                            <option value="girls">Girls</option>
                                                                            <option value="boys">Boys</option>
                                                                            <option value="coed">Co-ed</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                </Col>


                                                            </Row>
                                                            <Row>
                                                                <Col md="6">
                                                                <Label for="school_level" >Level of Program</Label>
                                                                    <FormGroup tag="fieldset" row>
                                                                        
                                                                        <Col >
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="school_level" id="school_level_primary" value="Primary" /* checked= {this.state.sex === 'Male'} */ onChange={(e) => this.valueChange(e, "school_level")} />{' '}
                                                                                Primary
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="school_level" id="school_level_secondary" value="Secondary" /* checked= {this.state.sex === 'Female'} */  onChange={(e) => this.valueChange(e, "school_level")} />{' '}
                                                                                Secondary
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <span class="errorMessage">{this.state.errors["school_level"]}</span>
                                                                        </Col>
                                                                    </FormGroup>

                                                                </Col>
                                                                <Col md="6">
                                                                <FormGroup >
                                                                        <Label for="program_implemented" >Type of program(s) implemented in school</Label> <span class="errorMessage">{this.state.errors["program_implemented"]}</span>
                                                                        <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e, "program_implemented")} value={this.state.program_implemented} id="program_implemented" options={programsImplemented} />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            {/* please don't remove this div unless you are adding another form question here*/}
                                                            {/* <div style={{height: '160px'}}><span>   </span></div> */}

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="projects" >Associated Projects</Label> <span class="errorMessage">{this.state.errors["projects"]}</span>
                                                                        <Select onChange={(e) => this.valueChangeMulti(e, "projects")} value={this.state.projects} id="projects" options={projects} formatOptionLabel={formatOptionLabel} isMulti required/>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="school_tier" >School Tier</Label> <span class="errorMessage">{this.state.errors["school_tier"]}</span>
                                                                        <Input type="select" name="school_tier" id="school_tier" onChange={(e) => this.valueChange(e, "school_tier")} value={this.state.school_tier}>
                                                                            <option value="school_tier_new">New</option>
                                                                            <option value="school_tier_running">Running</option>
                                                                            <option value="school_tier_exit">Exit</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" style={newSchoolStyle}>
                                                                    <FormGroup >
                                                                        <Label for="school_category_new" >New Schools Category</Label> <span class="errorMessage">{this.state.errors["school_category_new"]}</span>
                                                                        <Input type="select" name="school_category_new" id="school_category_new" onChange={(e) => this.valueChange(e, "school_category_new")} value={this.state.school_category_new}>
                                                                            <option value="school_new_inducted">Newly Inducted</option>
                                                                            <option value="school_new_implementation">Implementation > 1 Cycle</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                </Col>

                                                            
                                                                <Col md="6" style={runningSchoolStyle}>
                                                                    <FormGroup >
                                                                        <Label for="school_category_running" >Running Schools Category</Label> <span class="errorMessage">{this.state.errors["school_category_running"]}</span>
                                                                        <Input type="select" name="school_category_running" id="school_category_running" onChange={(e) => this.valueChange(e, "school_category_running")} value={this.state.school_category_running}>
                                                                            <option value="school_running_low">Low Performing</option>
                                                                            <option value="school_running_average">Average Performing</option>
                                                                            <option value="school_running_high">High Performing</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" style={exitSchoolStyle}>
                                                                    <FormGroup >
                                                                        <Label for="school_category_exit" >Exit Schools Category</Label> <span class="errorMessage">{this.state.errors["school_category_exit"]}</span>
                                                                        <Input type="select" name="school_category_exit" id="school_category_exit" onChange={(e) => this.valueChange(e, "school_category_exit")} value={this.state.school_category_exit}>
                                                                            <option value="school_exit_initial_phase">Initial Phase</option>
                                                                            <option value="school_exit_mid_phase">Mid Phase</option>
                                                                            <option value="school_exit_exit_phase">Exit Phase</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="point_person_name" >Name of point of contact for school</Label> <span class="errorMessage">{this.state.errors["point_person_name"]}</span>
                                                                        <Input type="text" name="point_person_name" id="point_person_name" value={this.state.point_person_name} onChange={(e) => {this.inputChange(e, "point_person_name")}} pattern="^[A-Za-z. ]+" maxLength="200" placeholder="Enter name" required/>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="point_person_contact" >Phone number for point of contact at school</Label> <span class="errorMessage">{this.state.errors["point_person_contact"]}</span>
                                                                        <Input type="text" name="point_person_contact" id="point_person_contact" onChange={(e) => {this.inputChange(e, "point_person_contact")}} value={this.state.point_person_contact} maxLength="12" pattern="[0][3][0-9]{2}-[0-9]{7}" placeholder="Mobile Number: xxxx-xxxxxxx" required/>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="point_person_email" >Email address for point of contact at school</Label> <span class="errorMessage">{this.state.errors["point_person_email"]}</span>
                                                                        <Input type="text" name="point_person_email" id="point_person_email" value={this.state.point_person_email} onChange={(e) => {this.inputChange(e, "point_person_email")}} placeholder="Enter email" maxLength="50" pattern="^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$" required/>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="student_count" >Approximate number of students </Label> <span class="errorMessage">{this.state.errors["student_count"]}</span>
                                                                        <Input type="number" value={this.state.student_count} name="student_count" id="student_count" onChange={(e) => {this.inputChange(e, "student_count")}} max="99999" min="1" onInput = {(e) =>{ e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,5)}} placeholder="Enter count in numbers"></Input>
                                                                    </FormGroup>
                                                                </Col>

                                                            </Row>
                                                        </TabPane>
                                                    </TabContent>
                                                
                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row>


                                {/* <div className="app-footer"> */}
                                {/* <div className="app-footer__inner"> */}
                                <Row>
                                    <Col md="12">
                                        <Card className="main-card mb-6">

                                            <CardHeader>

                                                <Row>
                                                    <Col md="3">
                                                        {/* <ButtonGroup size="sm">
                                                            <Button color="secondary" id="page1"
                                                                className={"btn-shadow " + classnames({ active: this.state.activeTab === '1' })}
                                                                onClick={() => {
                                                                    this.toggle('1');
                                                                }}
                                                            >Page 1</Button>
                                                            <Button color="secondary" id="page2" style={page2style}
                                                                className={"btn-shadow " + classnames({ active: this.state.activeTab === '2' })}
                                                                onClick={() => {
                                                                    this.toggle('2');
                                                                }}
                                                            >Page 2</Button>

                                                        </ButtonGroup> */}
                                                    </Col>
                                                    <Col md="3">
                                                    </Col>
                                                    <Col md="3">
                                                    </Col>
                                                    <Col md="3">
                                                        {/* <div className="btn-actions-pane-left"> */}
                                                        <Button className="mb-2 mr-2" color="success" size="sm" type="submit" >Submit</Button>
                                                        <Button className="mb-2 mr-2" color="danger" size="sm" onClick={this.cancelCheck} >Clear</Button>
                                                        {/* </div> */}
                                                    </Col>
                                                </Row>
                                            </CardHeader>
                                        </Card>
                                    </Col>
                                </Row>
                                {/* </div> */}
                                {/* </div> */}
                                <CustomModal
                                    modal={this.modal}
                                    // message="Some unsaved changes will be lost. Do you want to leave this page?"
                                    ModalHeader="Leave Page Confrimation!"
                                ></CustomModal>
                                </Form>
                            </Container>

                        </div>
                    </ReactCSSTransitionGroup>
                </Fragment>

            </div>
        );
    }

}

export default SchoolDetails;


