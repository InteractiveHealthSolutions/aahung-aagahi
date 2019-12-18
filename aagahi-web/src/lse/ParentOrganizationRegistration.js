/**
 * @author Tahira Niazi
 * @email tahira.niazi@ihsinformatics.com
 * @create date 2019-08-19 09:31:05
 * @modify date 2019-08-19 09:31:05
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

import { MDBBtn, MDBContainer, MDBModal, MDBModalBody, MDBModalFooter, MDBModalHeader } from 'mdbreact';
import React, { Fragment } from "react";
import { BrowserRouter as Router } from 'react-router-dom';
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import { Button, Card, CardBody, CardHeader, Col, Container, Form, FormGroup, Input, Label, Row, TabContent, TabPane } from 'reactstrap';
import CustomModal from "../alerts/CustomModal";
import "../index.css";
import { getDefinitionId, getDefinitionByDefinitionId, getDefinitionsByDefinitionType, getLocationByRegexValue, getLocationAttributeTypeByShortName } from '../service/GetService';
import { saveLocation, updateLocation } from "../service/PostService";
import FormNavBar from "../widget/FormNavBar";
import LoadingIndicator from "../widget/LoadingIndicator";

class ParentOrganizationRegistration extends React.Component {

    modal = false;
    constructor(props) {

        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = {
            partner_components: 'lse',
            participant_id : '',
            participant_name: '',
            dob: '',
            sex : '',
            school_id: [],
            csa_prompts: '',
            subject_taught : [], // all the form elements states are in underscore notation i.e variable names in codebook
            subject_taught_other: '',
            teaching_years: '',
            point_person_contact: '',
            extension: '',
            donor_name: '',
            activeTab: '1',
            page2Show: true,
            errors: {},
            loading: false,
            modal: false,
            modalText: '',
            okButtonStyle: {},
            modalHeading: ''
        };

        this.cancelCheck = this.cancelCheck.bind(this);
        this.callModal = this.callModal.bind(this);
        this.valueChangeMulti = this.valueChangeMulti.bind(this);
        this.valueChange = this.valueChange.bind(this);
        this.getObject = this.getObject.bind(this);
        this.inputChange = this.inputChange.bind(this);
        this.editMode = false;
        this.errors = {};
        this.isLse = true;
        this.isSrhm = false;
        this.isExtension = false;
        this.requiredFields = [ "parent_organization_name", "organization_address", "point_person_name", "point_person_contact"];
        this.parentOrganizationId = '';
    }

    componentDidMount() {
        window.addEventListener('beforeunload', this.beforeunload.bind(this));
        this.loadData();
    }

    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.beforeunload.bind(this));
    }

    /**
     * Loads data when the component is mounted
     */
    loadData = async () => {

        try {
            this.editMode = (this.props.location.state !== undefined && this.props.location.state.edit) ? true : false ;
            if(this.editMode) {
                if(this.editMode) {

                    this.setState({
                        loading: true,
                        loadingMsg: 'Fetching Data...'
                    })
                    this.fetchedLocation = await getLocationByRegexValue(String(this.props.location.state.locationId));
                    this.parentOrganizationId =  this.fetchedLocation.shortName;
                    console.log("fetched location id is .................................");
                    console.log(this.fetchedLocation.locationId);

                    this.setState({
                        parent_organization_name: this.fetchedLocation.locationName,
                        organization_address: this.fetchedLocation.address1
                    })

                    this.setState({
                        point_person_name: this.fetchedLocation.primaryContactPerson,
                        point_person_contact: this.fetchedLocation.primaryContact
                    })
                    if(this.fetchedLocation.email !== undefined && this.fetchedLocation.email !== '') {
                        this.setState({
                            point_person_email: this.fetchedLocation.email
                        })
                    }
                    if(this.fetchedLocation.extension !== undefined && this.fetchedLocation.extension !== '') {
                        this.isExtension = true;
                        this.setState({
                            extension: this.fetchedLocation.extension
                        })
                    }
                    this.autopopulateFields(this.fetchedLocation.attributes);
                    this.setState({ 
                        loading: false
                    })
                }
            }
        }
        catch(error) {
            console.log(error);
        }
    }

    beforeunload(e) {
          e.preventDefault();
          e.returnValue = true;
    }

    /**
     * created separate method because async handle was not updating the local variables (location attrs)
     */
    autopopulateFields(locationAttributes) {
        let self = this;
        let attributeValue = '';
        locationAttributes.forEach(async function (obj) {
            let attrTypeName = obj.attributeType.shortName;
            if (attrTypeName === "organization_schools" || attrTypeName === "organization_institutions") {
                attributeValue = obj.attributeValue;
            }
            
            if (obj.attributeType.dataType.toUpperCase() != "JSON" || obj.attributeType.dataType.toUpperCase() != "DEFINITION") {
                attributeValue = obj.attributeValue;
            }

            if (obj.attributeType.dataType.toUpperCase() == "DEFINITION") {
                // fetch definition shortname
                let definitionId = obj.attributeValue;
                let definition = await getDefinitionByDefinitionId(definitionId);
                attributeValue = definition.shortName;
                if(attrTypeName === "partner_components") {
                    self.isLse = attributeValue === "lse" ? true : false;
                    self.isSrhm = attributeValue === "srhm" ? true : false;
                }
            }
            self.setState({ [attrTypeName]: attributeValue });
        })
    }
      
    cancelCheck = () => {
        this.resetForm(this.requiredFields);
    }

    // for text and numeric questions
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
        // enable/disable extension based on landline number
        if(name === "point_person_contact") {
            if(this.state.point_person_contact.length >= 2 && !this.state.point_person_contact.startsWith("0")) {
                errorText = "invalid!";
                this.errors[name] = errorText;
            }
            else {
                errorText = '';
                this.errors[name] = errorText;
                if(this.state.point_person_contact.length >= 1 && !this.state.point_person_contact.startsWith("03")) {
                    this.isExtension = true;
                }
                else {
                    this.isExtension = false;
                }
            }
        }
    }

    // setting autocomplete single select tag when receiving value from server
    // value is the uuid, arr is the options array, prop either label/value, mostly value because it is uuid
    getObject(value, arr, prop) {
        for(var i = 0; i < arr.length; i++) {
            if(arr[i][prop] === value) {
                return arr[i];

            }
        }
        return -1; //to handle the case where the value doesn't exist
    }

    // for single select
    valueChange = (e, name) => {
        
        this.setState({
            [name]: e.target.value
        });

        if(name === "partner_components") {
            this.isLse = e.target.value === "lse" ? true : false;
            this.isSrhm = e.target.value === "srhm" ? true : false;

            this.isLse ? this.requiredFields.push("organization_schools") : this.requiredFields = this.requiredFields.filter(e => e !== "organization_schools");
            this.isSrhm ? this.requiredFields.push("organization_institutions") : this.requiredFields = this.requiredFields.filter(e => e !== "organization_institutions");
        }
    }

    // for multi select
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
    };
    
    handleSubmit = async event => {        
        event.preventDefault();
        if(this.handleValidation()) {

            console.log("in submission");
            this.setState({ 
                // form_disabled: true,
                loading : true,
                loadingMsg: "Saving trees..."
            })
            this.beforeSubmit();

            if(this.editMode) {

                let self = this;
                this.fetchedLocation.locationName = this.state.parent_organization_name.trim();
                this.fetchedLocation.primaryContactPerson = this.state.point_person_name;
                if(this.state.point_person_email !== undefined) {
                    this.fetchedLocation.email = this.state.point_person_email;
                }
                if(this.state.extension !== undefined) {
                    this.fetchedLocation.extension = this.state.extension;
                }
                this.fetchedLocation.primaryContact = this.state.point_person_contact;
                this.fetchedLocation.address1 = this.state.organization_address;
                
                var isLse = false;
                var isSrhm = false;

                var fetchedAttributes = this.fetchedLocation.attributes;
                // CAUTION: async/await does not work in forEach therefore used Javascript For()
                // fetchedAttributes.forEach(async function (obj) { 
                for (var obj of fetchedAttributes) {

                    delete obj.createdBy;
                    delete obj.updatedBy;
                    // partner_components
                    if(obj.attributeType.shortName === "partner_components") {
                        obj.attributeValue = await getDefinitionId("partner_components", self.state.partner_components);
                    }
                    
                    // organization_schools
                    if(obj.attributeType.shortName === "organization_schools" && !this.isLse) {
                        obj.isVoided = true;
                        isLse = true;
                    }
                    else if(obj.attributeType.shortName === "organization_schools") {
                        obj.attributeValue = self.state.organization_schools;
                        obj.isVoided = false;
                        isLse = true;
                    }

                    // organization_institutions
                    if(obj.attributeType.shortName === "organization_institutions" && !this.isSrhm) {
                        obj.isVoided = true;
                        isSrhm = true;
                    }
                    if(obj.attributeType.shortName === "organization_institutions") {
                        obj.attributeValue = self.state.organization_institutions;
                        isSrhm = true;
                    }
                }

                if(!isLse && self.state.partner_components === "lse" && (self.state.organization_schools !== undefined || self.state.organization_schools !== "")) {
                    var attrType = await getLocationAttributeTypeByShortName("organization_schools");
                    // var attrTypeId= attrType.attributeTypeId;
                    var attributeObject = new Object(); //top level obj
                    attributeObject.attributeType = attrType;
                    // attributeObject.attributeType.attributeTypeId = attrTypeId; // attributeType obj with attributeTypeId key value
                    
                    attributeObject.attributeValue = this.state.organization_schools;
                    fetchedAttributes.push(attributeObject);
                }

                if(!isSrhm && self.state.partner_components === "srhm" && (self.state.organization_schools !== undefined || self.state.organization_schools !== "")) {
                    var attrType = await getLocationAttributeTypeByShortName("organization_institutions");
                    // var attrTypeId= attrType.attributeTypeId;
                    var attributeObject = new Object(); //top level obj
                    attributeObject.attributeType = attrType;
                    // attributeObject.attributeType.attributeTypeId = attrTypeId; // attributeType obj with attributeTypeId key value
                    
                    attributeObject.attributeValue = this.state.organization_institutions;
                    fetchedAttributes.push(attributeObject);
                }

                this.fetchedLocation.attributes = fetchedAttributes;
                delete this.fetchedLocation.createdBy;
                delete this.fetchedLocation.updatedBy;

                updateLocation(this.fetchedLocation, this.fetchedLocation.uuid)
                .then(
                    responseData => {
                        console.log(responseData);
                        if(!(String(responseData).includes("Error"))) {
                            
                            this.setState({ 
                                loading: false,
                                modalHeading : 'Success!',
                                okButtonStyle : { display: 'none' },
                                modalText : 'Data updated successfully.',
                                modal: !this.state.modal
                            });
                            
                            this.resetForm(this.requiredFields);
                        }
                        else if(String(responseData).includes("Error")) {
                            
                            var submitMsg = '';
                            submitMsg = "Unable to update Parent Organization Details form. \
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
            else {
                const data = new FormData(event.target);
                console.log(data);
                var jsonData = new Object();
                jsonData.category = {};
                var categoryId = await getDefinitionId("location_category", "parent_organization");
                jsonData.category.definitionId = categoryId;
                jsonData.country = "Pakistan";
                jsonData.partner_components = this.state.partner_components;
                jsonData.shortName = this.parentOrganizationId;

                jsonData.locationName = this.state.parent_organization_name.trim();
                jsonData.primaryContactPerson = this.state.point_person_name; 
                jsonData.email = this.state.point_person_email;
                jsonData.primaryContact = this.state.point_person_contact;
                jsonData.address1 = this.state.organization_address;
                if(this.isExtension && this.state.extension !== '') {
                    jsonData.extension = this.state.extension;
                } 
                
                jsonData.attributes = [];

                // partner_components
                var attrType = await getLocationAttributeTypeByShortName("partner_components");
                var attrTypeId= attrType.attributeTypeId;
                var attributeObject = new Object(); //top level obj
                attributeObject.attributeType = {};
                attributeObject.attributeType.attributeTypeId = attrTypeId; // attributeType obj with attributeTypeId key value
                attributeObject.attributeValue = await getDefinitionId("partner_components", this.state.partner_components); // attributeValue obj
                jsonData.attributes.push(attributeObject);

                if(this.isLse) {
                    var attrType = await getLocationAttributeTypeByShortName("organization_schools");
                    var attrTypeId= attrType.attributeTypeId;
                    var attributeObject = new Object(); //top level obj
                    attributeObject.attributeType = {};
                    attributeObject.attributeType.attributeTypeId = attrTypeId; // attributeType obj with attributeTypeId key value
                    attributeObject.attributeValue = this.state.organization_schools; // attributeValue obj
                    jsonData.attributes.push(attributeObject);
                }

                if(this.isSrhm) {
                    var attrType = await getLocationAttributeTypeByShortName("organization_institutions");
                    var attrTypeId= attrType.attributeTypeId;
                    var attributeObject = new Object(); //top level obj
                    attributeObject.attributeType = {};
                    attributeObject.attributeType.attributeTypeId = attrTypeId; // attributeType obj with attributeTypeId key value
                    attributeObject.attributeValue = this.state.organization_institutions; // attributeValue obj
                    jsonData.attributes.push(attributeObject);
                }
                
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
    }

    handleValidation(){
        let formIsValid = true;
        // this.isSrhm ? this.requiredFields.push("organization_institutions") : this.requiredFields = this.requiredFields.filter(e => e !== "organization_institutions");
        this.isLse ? this.requiredFields.push("organization_schools") : this.requiredFields = this.requiredFields.filter(e => e !== "organization_schools");
        this.isSrhm ? this.requiredFields.push("organization_institutions") : this.requiredFields = this.requiredFields.filter(e => e !== "organization_institutions");
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
        const errorText = "Required";
        for(let j=0; j < fields.length; j++) {
            let stateName = fields[j];
            // for array object
            if(typeof this.state[stateName] === 'object' && this.state[stateName].length === 0) {
                isOk = false;
                this.errors[fields[j]] = errorText;
            }
            // for text and others
            if(typeof this.state[stateName] != 'object') {
                if(this.state[stateName] == undefined) {
                    isOk = false;
                    this.errors[fields[j]] = errorText;
                }
                else {
                    var stateData = this.state[stateName];
                    if(stateData.trim() === "" ) {
                        isOk = false;
                        this.errors[fields[j]] = errorText;   
                    }
                }
            }
        }

        var mobileRegex =  /^[0][3][0-9]{2}[0-9]{7}$/;
        if(this.state.point_person_contact.startsWith('03') && !this.state.point_person_contact.match(mobileRegex)) 
        { 
            isOk = false;
            this.errors["point_person_contact"] = "Invalid mobile number";
        }
        return isOk;
    }

    beforeSubmit() {

        // autogenerate parent organization id
        try {
            var name = (this.state.parent_organization_name).toUpperCase();
            var parentInitials = name.match(/\b(\w)/g);
            parentInitials = parentInitials.join('').toUpperCase();
            this.parentOrganizationId = parentInitials + (this.state.partner_components).toUpperCase(); 
            // var levelInitials = (this.state.school_level).toUpperCase().substring(0,3);
            var randomDigits = String(Math.floor(100000 + Math.random() * 900000));
            this.parentOrganizationId = this.parentOrganizationId + "-" +  randomDigits.substring(0,2);
        }
        catch(error) {
            console.log(error);
        }
    }

    /**
     * clear fields
     */
    resetForm = (fields) => {
        
        if(this.state.organization_schools != '') {
            fields.push("organization_schools");
        }
        if(this.state.organization_institutions != '') {
            fields.push("organization_institutions");
        }
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

        // clearing not required fields
        this.setState({
            point_person_email: '',
            extension: ''
        })
        this.parentOrganizationId = '';

        this.updateDisplay();
    }

    updateDisplay(){
        this.setState({
            partner_components:'lse'
        })

        this.isLse = this.state.partner_components === "lse" ? true : false;
        this.isSrhm = this.state.partner_components === "srhm" ? true : false;
        this.isExtension = false;
    }

    // for modal
    toggle = () => {
        this.setState({
          modal: !this.state.modal
        });
    }

    render() {

        const page2style = this.state.page2Show ? {} : { display: 'none' };
        // for view mode
        const setDisable = this.state.viewMode ? "disabled" : "";
        const organizationSchoolStyle = this.isLse ? {} : { display: 'none' };
        const organizationInstitutionStyle = this.isSrhm ? {} : { display: 'none' };
        const extensionStyle = this.isExtension ? {} : { display: 'none' };
        var formNavVisible = false;
        if(this.props.location.state !== undefined) {
            formNavVisible = this.props.location.state.edit ? true : false ;
        }
        else {
            formNavVisible = false;
        }

        return (
            
            <div id="formDiv">
            <Router>
                <header>
                <FormNavBar isVisible={formNavVisible} {...this.props} componentName="Common" />
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
                            <Form id="parentOrganization" onSubmit={this.handleSubmit}>
                                <Row>
                                    <Col md="6">
                                        <Card className="main-card mb-6">
                                            <CardHeader>
                                                <i className="header-icon lnr-license icon-gradient bg-plum-plate"> </i>
                                                <b>Parent Organization Registration</b>
                                            </CardHeader>

                                        </Card>
                                    </Col>

                                </Row>

                                {/* <br/> */}

                                <Row>
                                    <Col md="12">
                                        <Card className="main-card mb-6 center-col">
                                            <CardBody>

                                                {/* error message div */}
                                                <div class="alert alert-danger" style={this.state.hasError ? {} : { display: 'none' }} >
                                                <span class="errorMessage"><u>Errors: <br/></u> Form has some errors. Please check for required or invalid fields.<br/></span>
                                                </div>

                                                <br/>
                                                
                                                <fieldset >
                                                    <TabContent activeTab={this.state.activeTab}>
                                                        <TabPane tabId="1">
                                                            
                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="parent_organization_name" >Parent Organization Name <span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["parent_organization_name"]}</span>
                                                                        <Input name="parent_organization_name" id="parent_organization_name" value={this.state.parent_organization_name} onChange={(e) => {this.inputChange(e, "parent_organization_name")}} maxLength='100' pattern="^[A-Za-z. ]+" placeholder="Enter name" />
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="parent_organization_id" >Parent Organization ID</Label> <span class="errorMessage">{this.state.errors["parent_organization_id"]}</span>
                                                                        <Input name="parent_organization_id" id="parent_organization_id" value={this.parentOrganizationId} onChange={(e) => {this.inputChange(e, "parent_organization_id")}} maxLength="20" placeholder="Parent Oraganization ID" disabled />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="partner_components">Partner with</Label> <span class="errorMessage">{this.state.errors["partner_components"]}</span>
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "partner_components")} value={this.state.partner_components} name="partner_components" id="partner_components">
                                                                        
                                                                            <option value="lse">LSE</option>
                                                                            <option value="srhm">SRHM</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" style={organizationSchoolStyle}>
                                                                    <FormGroup >
                                                                        <Label for="organization_schools" >No. of school under the organization <span className="required">*</span></Label>  <span class="errorMessage">{this.state.errors["organization_schools"]}</span>
                                                                        <Input type="number" value={this.state.organization_schools} name="organization_schools" id="organization_schools" onChange={(e) => {this.inputChange(e, "organization_schools")}} max="99" min="1" onInput = {(e) =>{ e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,2)}} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" style={organizationInstitutionStyle}>
                                                                    <FormGroup >
                                                                        <Label for="organization_institutions" >No. of institutions under the organization <span className="required">*</span></Label>  <span class="errorMessage">{this.state.errors["organization_institutions"]}</span>
                                                                        <Input type="number" value={this.state.organization_institutions} name="organization_institutions" id="organization_institutions" onChange={(e) => {this.inputChange(e, "organization_institutions")}} max="99" min="1" onInput = {(e) =>{ e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,2)}} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="organization_address" >Office Address <span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["organization_address"]}</span>
                                                                        <Input type="textarea" name="organization_address" id="organization_address" onChange={(e) => {this.inputChange(e, "organization_address")}} value={this.state.organization_address} maxLength="300" placeholder="Enter address" />
                                                                    </FormGroup>
                                                                </Col>
                                                            
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="point_person_name" >Name of Point of Contact <span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["point_person_name"]}</span>
                                                                        <Input type="text" name="point_person_name" id="point_person_name" value={this.state.point_person_name} onChange={(e) => {this.inputChange(e, "point_person_name")}} pattern="^[A-Za-z. ]+" maxLength="200" placeholder="Enter name" />
                                                                    </FormGroup>
                                                                </Col>
                                                            
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="point_person_contact" >Phone Number of point of contact <span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["point_person_contact"]}</span>
                                                                        <div id="phone_extension_div">
                                                                            <Input type="text" name="point_person_contact" id="point_person_contact" onChange={(e) => {this.inputChange(e, "point_person_contact")}} value={this.state.point_person_contact} maxLength="12" placeholder="Contact Number" />
                                                                            <Input type="text" style={extensionStyle} name="extension" id="extension" onChange={(e) => {this.inputChange(e, "extension")}} value={this.state.extension} maxLength="4" placeholder="Extension" />
                                                                        </div>
                                                                    </FormGroup>
                                                                </Col>
                                                            
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="point_person_email" >Email of point of contact </Label><span class="errorMessage">{this.state.errors["point_person_email"]}</span>
                                                                        <Input type="text" name="point_person_email" id="point_person_email" value={this.state.point_person_email} onChange={(e) => {this.inputChange(e, "point_person_email")}} placeholder="Enter email" maxLength="50" pattern="^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$" />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                        </TabPane>
                                                    </TabContent>
                                                    </fieldset>
                                                
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
                                                        <LoadingIndicator loading={this.state.loading} msg={this.state.loadingMsg}/>
                                                    </Col>
                                                    <Col md="3">
                                                        {/* <div className="btn-actions-pane-left"> */}
                                                        <Button className="mb-2 mr-2" color="success" size="sm" type="submit" disabled={setDisable}>Submit</Button>
                                                        <Button className="mb-2 mr-2" color="danger" size="sm" onClick={this.cancelCheck} disabled={setDisable}>Clear</Button>
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
                                        <MDBBtn color="secondary" onClick={this.toggle}>OK!</MDBBtn>
                                        {/* <MDBBtn color="primary" style={this.state.okButtonStyle} onClick={this.confirm}>OK!</MDBBtn> */}
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

export default ParentOrganizationRegistration;