/*
 * @Author: tahira.niazi@ihsinformatics.com 
 * @Date: 2019-07-30 12:53:25 
 * @Last Modified by: tahira.niazi@ihsinformatics.com
 * @Last Modified time: 2019-09-18 13:26:03
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
import { MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavbarToggler, MDBCollapse, MDBNavItem, MDBNavLink, MDBContainer, MDBView, MDBMask, MDBBtn, MDBIcon, MDBDropdown, MDBDropdownItem, MDBDropdownToggle, MDBDropdownMenu, MDBRow, MDBCol, MDBFooter, MDBCardBody,
    MDBModalFooter,
    MDBInput,
    MDBModal, MDBModalBody, MDBModalHeader, } from 'mdbreact';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import aahunglogo from "../img/aahung-logo.svg";
import Select from 'react-select';
import CustomModal from "../alerts/CustomModal";
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
import { location, getDistrictsByProvince} from "../util/LocationUtil.js";
import { parentLocationDefinitionUuid} from "../util/AahungUtil.js";
import moment from 'moment';
import { getLocationsByCategory, getAllProjects, getDefinitionId, getLocationAttributeTypeByShortName } from '../service/GetService';
import { saveLocation } from "../service/PostService";
import LoadingIndicator from "../widget/LoadingIndicator";


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

const formatOptionLabel = ({ label, donorName }) => (
    <div style={{ display: "flex" }}>
      <div>{label} |</div>
      <div style={{ marginLeft: "10px", color: "#9e9e9e" }}>
        {donorName}
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
            projectsList: [],
            school_id: '',
            program_implemented : [],
            school_tier: 'school_tier_new',
            school_type: 'school_public',
            school_sex : 'girls',
            school_category_new: 'school_new_inducted',
            school_category_exit : 'school_exit_initial_phase',
            school_category_running: 'school_running_low',
            activeTab: '1',
            partnership_years : '',
            point_person_contact: '',
            selectedOption: null,
            page2Show: true,
            isView: false,
            errors: {},
            loading: false,
            modal: false,
            modalText: '',
            okButtonStyle: {},
            modalHeading: '',
        };

        // fields for loading data in components
        // this.organizations = [];

        this.cancelCheck = this.cancelCheck.bind(this);
        this.callModal = this.callModal.bind(this);
        this.valueChangeMulti = this.valueChangeMulti.bind(this);
        this.inputChange = this.inputChange.bind(this);
        this.isTierNew = true;
        this.isTierRunning= false;
        this.isTierExit= false;
        this.schoolId = '';
        this.school_level_shortname = '';
        this.formatOptionLabel = '';
        this.errors = {};
        this.partnership_years = '';
        this.isSecondary = false;
        this.isPrimary = false;
        this.requiredFields = ["province", "district", "parent_organization_id", "program_implemented", "projects", "school_level"];
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
    }

    // for modal
    toggle = () => {
        this.setState({
          modal: !this.state.modal
        });
    }

    /**
     * Loads data when the component is mounted
     */
    loadData = async () => {

        
        try {
            let organizations = await getLocationsByCategory(parentLocationDefinitionUuid);
            console.log(organizations);

            if(organizations != null && organizations.length > 0) {
                this.setState({
                    organizations : organizations
                })
            }

            // projects
            let projects = await getAllProjects();
            
            if(projects != null && projects.length > 0) {
                this.setState({
                    projectsList : projects
                })
            }

        }
        catch(error) {
            console.log(error);
        }
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


    cancelCheck = async () => {
        // this.setState({ page2Show: false });
        
        var categoryUuid = "cce863e8-d09b-11e9-b422-0242ac130002";
        var categoryShortName = "parent_location";
        this.resetForm(this.requiredFields);
    }

    // for single select
    valueChange = (e, name) => {
        console.log(e); 
        console.log(e.target.value);

        this.setState({
            [name]: e.target.value
        });

        if( name === "school_level") {

            this.school_level_shortname = e.target.id;

            e.target.id === "school_level_secondary" ? this.setState({
                // Autoselect program_implemented = LSBE
                program_implemented: [{value: 'lsbe', label: 'LSBE'}]
                }) : this.setState({
                    program_implemented: []
                    });
        }
        
        if (name === "school_tier") {
            if(e.target.value === "school_tier_new") {
                this.isTierNew = true;
                this.isTierRunning = false;
                this.isTierExit = false;
            }
            else if(e.target.value === "school_tier_running") {
                this.isTierNew = false ;
                this.isTierRunning = true;
                this.isTierExit = false;
            }
            else if(e.target.value === "school_tier_exit") {
                this.isTierNew = false;
                this.isTierRunning = false;
                this.isTierExit = true;
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
                parent_organization_name : e.locationName
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


    handleSubmit = async event => {

        
        event.preventDefault();
        if(this.handleValidation()) {

            console.log("in submission");

            this.setState({ 
                // form_disabled: true,
                loading : true
            })
            this.beforeSubmit();
            
            const data = new FormData(event.target);
            console.log(data);
            var jsonData = new Object();
            jsonData.category = {};
            var categoryId = await getDefinitionId("location_category", "school");
            jsonData.category.definitionId = categoryId;
            jsonData.country = "Pakistan";
            jsonData.date_start = this.state.date_start;
            jsonData.state_province = this.state.province.name;
            jsonData.city_village = this.state.district.label;
            jsonData.parentLocation = {};
            jsonData.parentLocation.locationId = this.state.parent_organization_id.id;;
            jsonData.shortName = this.schoolId;
            jsonData.locationName = this.state.school_name;
            jsonData.primaryContactPerson = this.state.point_person_name; 
            jsonData.email = this.state.point_person_email;
            jsonData.primaryContact = this.state.point_person_contact;
            
            jsonData.attributes = [];
            
            var attrType = await getLocationAttributeTypeByShortName("partnership_years");
            var attrTypeId= attrType.attributeTypeId;
            var attributeObject = new Object(); // top level obj
            attributeObject.attributeType = {};
            attributeObject.attributeType.attributeTypeId = attrTypeId; // attributeType obj with attributeTypeId key value 
            var years = moment().diff(this.state.partnership_start_date, 'years');
            attributeObject.attributeValue = years; // attributeValue obj
            jsonData.attributes.push(attributeObject);

            var attrType = await getLocationAttributeTypeByShortName("partnership_start_date");
            var attrTypeId= attrType.attributeTypeId;
            var attributeObject = new Object(); //top level obj
            attributeObject.attributeType = {};
            attributeObject.attributeType.attributeTypeId = attrTypeId; // attributeType obj with attributeTypeId key value 
            attributeObject.attributeValue = this.state.partnership_start_date; // attributeValue obj
            jsonData.attributes.push(attributeObject);

            // school_type has a deinition datatype so attr value will be integer definitionid
            var attrType = await getLocationAttributeTypeByShortName("school_type");
            var attrTypeId= attrType.attributeTypeId;
            var attributeObject = new Object(); //top level obj
            attributeObject.attributeType = {};
            attributeObject.attributeType.attributeTypeId = attrTypeId; // attributeType obj with attributeTypeId key value
            attributeObject.attributeValue = await getDefinitionId("school_type", this.state.school_type); // attributeValue obj
            jsonData.attributes.push(attributeObject);

            // school_sex has a deinition datatype so attr value will be integer definitionid
            var attrType = await getLocationAttributeTypeByShortName("school_sex");
            var attrTypeId= attrType.attributeTypeId;
            var attributeObject = new Object(); //top level obj
            attributeObject.attributeType = {};
            attributeObject.attributeType.attributeTypeId = attrTypeId; // attributeType obj with attributeTypeId key value
            attributeObject.attributeValue = await getDefinitionId("school_sex", this.state.school_sex); // attributeValue obj
            jsonData.attributes.push(attributeObject);

            // school_level has a deinition datatype so attr value will be integer definitionid
            var attrType = await getLocationAttributeTypeByShortName("school_level");
            var attrTypeId= attrType.attributeTypeId;
            var attributeObject = new Object(); //top level obj
            attributeObject.attributeType = {};
            attributeObject.attributeType.attributeTypeId = attrTypeId; // attributeType obj with attributeTypeId key value
            attributeObject.attributeValue = await getDefinitionId("school_level", this.school_level_shortname); // attributeValue obj
            jsonData.attributes.push(attributeObject);

            // school_tier has a deinition datatype so attr value will be integer definitionid
            var attrType = await getLocationAttributeTypeByShortName("school_tier");
            var attrTypeId= attrType.attributeTypeId;
            var attributeObject = new Object(); //top level obj
            attributeObject.attributeType = {};
            attributeObject.attributeType.attributeTypeId = attrTypeId; // attributeType obj with attributeTypeId key value
            attributeObject.attributeValue = await getDefinitionId("school_tier", this.state.school_tier); // attributeValue obj
            jsonData.attributes.push(attributeObject);

            if(this.isTierNew) {
                // school_tier has a deinition datatype so attr value will be integer definitionid
                var attrType = await getLocationAttributeTypeByShortName("school_category_new");
                var attrTypeId= attrType.attributeTypeId;
                var attributeObject = new Object(); //top level obj
                attributeObject.attributeType = {};
                attributeObject.attributeType.attributeTypeId = attrTypeId; // attributeType obj with attributeTypeId key value
                
                attributeObject.attributeValue = await getDefinitionId("school_category_new", this.state.school_category_new); // attributeValue obj
                jsonData.attributes.push(attributeObject);
            }

            if(this.isTierRunning) {
                // school_category_running has a deinition datatype so attr value will be integer definitionid
                var attrType = await getLocationAttributeTypeByShortName("school_category_running");
                var attrTypeId= attrType.attributeTypeId;
                var attributeObject = new Object(); //top level obj
                attributeObject.attributeType = {};
                attributeObject.attributeType.attributeTypeId = attrTypeId; // attributeType obj with attributeTypeId key value
                
                attributeObject.attributeValue = await getDefinitionId("school_category_running", this.state.school_category_running); // attributeValue obj
                jsonData.attributes.push(attributeObject);
            }

            if(this.isTierExit) {
                // school_category_exit has a deinition datatype so attr value will be integer definitionid
                var attrType = await getLocationAttributeTypeByShortName("school_category_exit");
                var attrTypeId= attrType.attributeTypeId;
                var attributeObject = new Object(); //top level obj
                attributeObject.attributeType = {};
                attributeObject.attributeType.attributeTypeId = attrTypeId; // attributeType obj with attributeTypeId key value
                
                attributeObject.attributeValue = await getDefinitionId("school_category_exit", this.state.school_category_exit); // attributeValue obj
                jsonData.attributes.push(attributeObject);
            }

            // student_count > loca attr type
            var attrType = await getLocationAttributeTypeByShortName("student_count");
            var attrTypeId= attrType.attributeTypeId;
            var attributeObject = new Object(); //top level obj
            attributeObject.attributeType = {};
            attributeObject.attributeType.attributeTypeId = attrTypeId; // attributeType obj with attributeTypeId key value
            attributeObject.attributeValue = this.state.student_count; // attributeValue obj
            jsonData.attributes.push(attributeObject);

            
            // ==== MULTISELECT location_attribute_types ===

            // program_implemented > loca attr type
            var attrType = await getLocationAttributeTypeByShortName("program_implemented");
            var attrTypeId= attrType.attributeTypeId;
            var attributeObject = new Object(); //top level obj
            attributeObject.attributeType = {};
            attributeObject.attributeType.attributeTypeId = attrTypeId; // attributeType obj with attributeTypeId key value
            let attrValueObject = [];
            for(let i=0; i< this.state.program_implemented.length; i++ ) {
                let definitionObj = {};
                definitionObj.definitionId = await getDefinitionId("program_implemented", this.state.program_implemented[i].value);
                attrValueObject.push(definitionObj);
            }
            
            attributeObject.attributeValue = JSON.stringify(attrValueObject); // attributeValue array of definitionIds
            jsonData.attributes.push(attributeObject);
            

            // projects > loca attr type
            var attrType = await getLocationAttributeTypeByShortName("projects");
            var attrTypeId= attrType.attributeTypeId;
            var attributeObject = new Object(); //top level obj
            attributeObject.attributeType = {};
            attributeObject.attributeType.attributeTypeId = attrTypeId; // attributeType obj with attributeTypeId key value
            let multiAttrValueObject = [];
            for(let i=0; i< this.state.projects.length; i++ ) {
                let projectObj = {};
                projectObj.projectId = this.state.projects[i].id;
                multiAttrValueObject.push(projectObj);
            }
            attributeObject.attributeValue = JSON.stringify(multiAttrValueObject); // attributeValue array of definitionIds
            jsonData.attributes.push(attributeObject);
 
            console.log(jsonData);
            saveLocation(jsonData)
            .then(
                responseData => {
                    console.log(responseData);
                    if(!(String(responseData).includes("Error"))) {
                        
                        this.setState({ 
                            loading: false,
                            modalHeading : 'Success!',
                            okButtonStyle : { display: 'none' },
                            modalText : 'Data saved successfully.',
                            modal: !this.state.modal
                        });

                        this.resetForm(this.requiredFields);
                    }
                    else if(String(responseData).includes("Error")) {
                        
                        var submitMsg = '';
                        submitMsg = "Unable to submit school details form. \
                        " + String(responseData);
                        
                        this.setState({ 
                            loading: false,
                            modalHeading : 'Fail!',
                            okButtonStyle : { display: 'none' },
                            modalText : submitMsg,
                            modal: !this.state.modal
                        });
                    }
                }
            );

        }

    }

    handleValidation(){
        // check each required state
        
        let formIsValid = true;
        console.log(this.requiredFields);
        this.setState({ hasError: this.checkValid(this.requiredFields) ? false : true });
        formIsValid = this.checkValid(this.requiredFields);
        this.setState({errors: this.errors});
        return formIsValid;
    }

    /**
     * verifies and notifies for the empty form fields
     */
    checkValid = (fields) => {

        let isOk = true;
        this.errors = {};
        for(let j=0; j < fields.length; j++) {
            let stateName = fields[j];
            
            // for array object
            if(typeof this.state[stateName] === 'object' && this.state[stateName].length === 0) {
                isOk = false;
                this.errors[fields[j]] = "Please fill in this field!";
                
            }

            // for text and others
            if(typeof this.state[stateName] != 'object') {
                if(this.state[stateName] === "" || this.state[stateName] == undefined) {
                    isOk = false;
                    this.errors[fields[j]] = "Please fill in this field!";   
                } 
            }
        }


        if(this.state.school_level == '' || this.state.school_level == undefined || this.state.school_level == null) {
            isOk = false;
            this.errors['school_level'] = "Please fill in this field!"; 
        }

        return isOk;
    }

    
    beforeSubmit = async () => {

        // autogenerate school id
        try {
            var district = this.state.district.value;
            var name = (this.state.school_name).toUpperCase();
            var schoolInitials = name.match(/\b(\w)/g);
            schoolInitials = schoolInitials.join('').toUpperCase();
            this.schoolId = district + schoolInitials; 
            var levelInitials = (this.state.school_level).toUpperCase().substring(0,3);
            
            this.schoolId = this.schoolId + levelInitials; 
            var randomDigits = String(Math.floor(100000 + Math.random() * 900000));
            this.schoolId = this.schoolId + "-" +  randomDigits.substring(0,4);
            

        }
        catch(error) {
            console.log(error);
        }
    
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

    /**
     * clear fields
     */
    resetForm = (fields) => {

        for(let j=0; j < fields.length; j++) {
            let stateName = fields[j];
            
            // for array object
            if(typeof this.state[stateName] === 'object') {
                this.state[stateName] = [];
            }

            // for text and others
            if(typeof this.state[stateName] != 'object') {
                this.state[stateName] = ''; 
            }
        }

        this.updateDisplay();
    }

    // for modal
    toggle = () => {
        this.setState({
          modal: !this.state.modal
        });
    }



    render() {

        const page2style = this.state.page2Show ? {} : { display: 'none' };
        const newSchoolStyle = this.isTierNew ? {} : { display: 'none' };
        const runningSchoolStyle = this.isTierRunning ? {} : { display: 'none' };
        const exitSchoolStyle = this.isTierExit ? {} : { display: 'none' };
        
        
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
                                                    {/* <MDBDropdownItem href="/mainMenu">Back</MDBDropdownItem> */}
                                                    {/* <MDBDropdownItem href="#!">Something else here</MDBDropdownItem> */}
                                                    {/* <MDBDropdownItem href="#!">Something else here</MDBDropdownItem> */}
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
                                                                        <Input name="school_name" id="school_name" value={this.state.school_name} onChange={(e) => {this.inputChange(e, "school_name")}} maxLength='100' placeholder="Enter school name" required/>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        {/* TODO: autogenerate school ID */} 
                                                                        <Label for="school_id" >School ID</Label> <span class="errorMessage">{this.state.errors["school_id"]}</span>
                                                                        <Input name="school_id" id="school_id" value={this.schoolId}  onChange={(e) => {this.inputChange(e, "school_id")}} maxLength='100' disabled />
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
                                                                        <Input name="partnership_years" id="partnership_years" onChange={(e) => {this.inputChange(e, "partnership_years")}} value={ moment().diff(this.state.partnership_start_date, 'years') } disabled />
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
                                                                                <Input type="radio" name="school_level" id="school_level_primary" value="Primary" onChange={(e) => this.valueChange(e, "school_level")} />{' '}
                                                                                Primary
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="school_level" id="school_level_secondary" value="Secondary"  onChange={(e) => this.valueChange(e, "school_level")} />{' '}
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
                                                                        <Select onChange={(e) => this.valueChangeMulti(e, "projects")} value={this.state.projects} id="projects" options={this.state.projectsList} formatOptionLabel={formatOptionLabel} isMulti required/>
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
                                                    </Col>
                                                    <Col md="2">
                                                    </Col>
                                                    <Col md="2">
                                                    </Col>
                                                    <Col md="2">
                                                    <LoadingIndicator loading={this.state.loading}/>
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

                                <MDBContainer>
                                    {/* <MDBBtn onClick={this.toggle}>Modal</MDBBtn> */}
                                    <MDBModal isOpen={this.state.modal} toggle={this.toggle}>
                                        <MDBModalHeader toggle={this.toggle}>{this.state.modalHeading}</MDBModalHeader>
                                        <MDBModalBody>
                                            {this.state.modalText}
                                        </MDBModalBody>
                                        <MDBModalFooter>
                                        <MDBBtn color="secondary" onClick={this.toggle}>Cancel</MDBBtn>
                                        <MDBBtn color="primary" style={this.state.okButtonStyle} onClick={this.confirm}>OK!</MDBBtn>
                                        </MDBModalFooter>
                                        </MDBModal>
                                </MDBContainer>
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


