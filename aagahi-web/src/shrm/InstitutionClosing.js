/**
 * @author Tahira Niazi
 * @email tahira.niazi@ihsinformatics.com
 * @create date 2019-09-01 21:23:42
 * @modify date 2019-09-01 21:23:42
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
import "../index.css"
import classnames from 'classnames';
import Select from 'react-select';
import CustomModal from "../alerts/CustomModal";
import { useBeforeunload } from 'react-beforeunload';
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
import {RadioGroup, Radio} from 'react-radio-group';
import { getObject} from "../util/AahungUtil.js";
import moment from 'moment';
import { getLocationsByCategory, getLocationByShortname, getLocationAttributesByLocation, getDefinitionByDefinitionId, getDefinitionsByDefinitionType, getLocationAttributeTypeByShortName, getDefinitionId } from '../service/GetService';
import { saveLocationAttributes } from "../service/PostService";
import LoadingIndicator from "../widget/LoadingIndicator";
import * as Constants from "../util/Constants";
import { MDBContainer, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBBtn } from 'mdbreact';

const institutions = [
    { value: 'b37b9390-f14f-41da-893f-604def748fea', label: 'Institution 1' },
    { value: 'b37b9390-f14f-41da-1111-604def748fea', label: 'Institution 2' },
    { value: 'b37b9390-f14f-41da-2222-604def748fea', label: 'Institution 3' },
    { value: 'b37b9390-f14f-41da-5555-604def748fea', label: 'Institution 4' },
];

const institutionTypes = [
    { label: 'Medical', value: 'institution_medical'},
    { label: 'Nursing', value: 'institution_nursing'},
    { label: 'Midwifery', value: 'institution_midwifery'},
    { label: 'Other', value: 'institution_other'}
];

const options = [
    { label: 'Math', value: 'math'},
    { label: 'Science', value: 'science'},
    { label: 'English', value: 'def'},
    { label: 'Urdu', value: 'urdu', },
    { label: 'Social Studies', value: 'social_studies'},
    { label: 'Islamiat', value: 'islamiat'},
    { label: 'Art', value: 'art', },
    { label: 'Music', value: 'music'},
    { label: 'Other', value: 'other', },
];

const schools = [
    { value: 'sindh', label: 'Sindh' },
    { value: 'punjab', label: 'Punjab' },
    { value: 'balochistan', label: 'Balochistan' },
    { value: 'khyber_pakhtunkhwa', label: 'Khyber Pakhtunkhwa' },
];

const coveredTopics = [
    { value: 'csa', label: 'CSA' },
    { value: 'gender', label: 'Gender' },
    { value: 'puberty', label: 'Puberty' },
    { value: 'sexual_harassment', label: 'Sexual Harassment' },
    { value: 'lsbe', label: 'LSBE' },
    { value: 'other', label: 'Other' }
];


const users = [
    { value: 'uuid1', label: 'Harry Potter' },
    { value: 'uuid2', label: 'Ron Weasley' },
    { value: 'uuid3', label: 'Hermione Granger' },
    { value: 'uuid4', label: 'Albus Dumbledore' },
];

class InstitutionClosing extends React.Component {

    modal = false;

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);

        this.state = {
            institutions: [],
            participant_id : '',
            participant_name: '',
            dob: '',
            sex : '',
            school_id: [],
            csa_prompts: '',
            subject_taught : [], // all the form elements states are in underscore notation i.e variable names in codebook
            subject_taught_other: '',
            teaching_years: '',
            education_level: 'no_edu',
            institution_id: '',
            institution_name: '', 
            partnership_start_date: '', 
            partnership_end_date: '',
            partnership_years: '',
            institution_type: '', 
            end_partnership_reason: '',
            donor_name: '',
            activeTab: '1',
            page2Show: true,
            viewMode: false,
            editMode: false,
            hasError: false,
            errors: {},
            loading: false,
            loadingMsg: '',
            modal: false,
            modalText: '',
            okButtonStyle: {},
            modalHeading: ''
        };

        this.cancelCheck = this.cancelCheck.bind(this);
        this.callModal = this.callModal.bind(this);
        this.valueChangeMulti = this.valueChangeMulti.bind(this);
        this.valueChange = this.valueChange.bind(this);
        this.calculateScore = this.calculateScore.bind(this);
        this.inputChange = this.inputChange.bind(this);
        this.checkValid =  this.checkValid.bind(this);

        this.isCityOther = false;
        this.isLocationOther = false;
        this.isMaterialTypeOther = false;
        this.isAnnualReport = false;
        this.isAahungProfile = false;
        this.isPamphlet = false;
        this.isBooklet = false;
        this.isReport = false;
        this.isBrandingMaterial = false;

        this.isTopicOther = false;
        this.isAahungInformation = false;
        this.isAahungMug = false;
        this.isAahungFolder = false;
        this.isAahungNotebook = false;
        this.isNikahNama = false;
        this.isPuberty = false; 
        this.isRti = false; 
        this.isUngei = false;
        this.isSti = false; 
        this.isSexualHealth = false;
        this.isPreMarital = false;
        this.isPac = false;
        this.isMaternalHealth = false;
        this.isOtherInstitution = false;
        this.isRecipientOther = false;

        this.isRemoveInfo = false;

        this.errors = {};

        this.distributionTopics = [
            { value: 'aahung_information', label: 'Aahung Information' },
            { value: 'aahung_mugs', label: 'Aahung Mugs' },
            { value: 'aahung_folders', label: 'Aahung Folders' },
            { value: 'aahung_notebooks', label: 'Aahung Notebooks' },
            { value: 'nikah_nama', label: 'Nikah Nama' },
            { value: 'puberty', label: 'puberty' },
            { value: 'rtis', label: 'RTIs' },
            { value: 'ungei', label: 'UNGEI' },
            { value: 'stis', label: 'STIs' },
            { value: 'sexual_health', label: 'Sexual Health' },
            { value: 'pre_marital_information', label: 'Pre-marital Information' },
            { value: 'pac', label: 'PAC' },
            { value: 'maternal_health', label: 'Maternal Health' },
            { value: 'other', label: 'Other' }
        
        ];

    }

    componentDidMount() {

        window.addEventListener('beforeunload', this.beforeunload.bind(this));

        // autopopulate data based on institution selected
        // this.setState({
        //     partnership_start_date : "2019-09-05"
        // });

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

            let institutions = await getLocationsByCategory(Constants.INSTITUTION_DEFINITION_UUID);
            if (institutions != null && institutions.length > 0) {
                this.setState({
                    institutions: institutions
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
          e.preventDefault();
          e.returnValue = true;
      }


    cancelCheck = () => {

        console.log(" ============================================================= ");
        this.resetForm([]);
        // receiving value directly from widget but it still requires widget to have on change methods to set it's value
        // alert(document.getElementById("date_start").value);

        // 
        
    }

    // for text and numeric questions
    inputChange(e, name) {

        console.log(e);
        console.log(e.target.id);
        console.log(e.target.type);
        console.log(e.target.pattern);
        
        let errorText = e.target.value.match(e.target.pattern) ? '' : "invalid!";
        // alert(errorText);
        this.errors[name] = errorText;
        
        this.setState({
            [name]: e.target.value
        });
        
        if (name === "partnership_end_date") {
            if (this.state.partnership_start_date != undefined || this.state.partnership_start_date != null) {
                var startDate = this.state.partnership_start_date;
                var momentDate = moment(startDate);
                var endDataMoment = moment(e.target.value);
                this.setState({ partnership_years: endDataMoment.diff(momentDate, 'years') });
            }
        }

        this.setState({errors: this.errors});
    }

    // for single select
    valueChange = (e, name) => {
        console.log(e.target.type);
        this.setState ({sex : e.target.value });
        this.setState ({sex : e.target.value });

        this.setState({
            [name]: e.target.value
        });

        if(e.target.id === "city") {
            this.isCityOther = e.target.value === "other" ? true : false;
        }
    }

    // only for time widget <TimeField>
    getTime = (e, name) => {
        this.setState({
            [name]: e
        });
    }

    // calculate score from scoring questions (radiobuttons)
    calculateScore = (e, name) => {
        this.setState({
            [name]: e.target.value
        });
    }

    // for multi select
    valueChangeMulti(e, name) {
        
        console.log(e);

        this.setState({
            [name]: e
        });

        if (name === "institution_type") {
            if (getObject('institution_other', e, 'value') != -1) {
                this.isOtherInstitution = true;
                
            }
            if (getObject('institution_other', e, 'value') == -1) {
                this.isOtherInstitution = false;
                
            }
        }
    }

    callModal = () => {
        this.setState({ modal : !this.state.modal });
    }

    // for autocomplete single select
    async handleChange(e, name) {

        this.setState({
            [name]: e
        });

        try {
            if (name === "institution_id") {
        
                this.setState({
                    institution_name: e.locationName,
                    loading: true,
                    loadingMsg: 'Fetching Data...'
                })
                let attributes = await getLocationAttributesByLocation(e.uuid);
                this.autopopulateFields(attributes);
            }
        }
        catch (error) {
            console.log(error);
        }
    };



    /**
     * created separate method because async handle was not updating the local variables (location attrs)
     */
    autopopulateFields(locationAttributes) {
        
        let self = this;
        let attributeValue = '';
        let count = 0;
        
        try {
            locationAttributes.forEach(async function (obj) {


                let attrTypeName = obj.attributeType.shortName;
                if (attrTypeName === "partnership_years")
                    return;

                if (obj.attributeType.dataType.toUpperCase() != "JSON" || obj.attributeType.dataType.toUpperCase() != "DEFINITION") {
                    attributeValue = obj.attributeValue;

                }

                if (obj.attributeType.dataType.toUpperCase() == "DEFINITION") {
                    // fetch definition shortname
                    let definitionId = obj.attributeValue;
                    let definition = await getDefinitionByDefinitionId(definitionId);
                    let attrValue = definition.shortName;
                    attributeValue = attrValue;

                }

                if (obj.attributeType.dataType.toUpperCase() == "JSON") {

                    // attr value is a JSON obj > [{"definitionId":13},{"definitionId":14}]
                    let attrValueObj = JSON.parse(obj.attributeValue);
                    let multiSelectString = '';
                    if (attrValueObj != null && attrValueObj.length > 0) {
                        let definitionArray = [];
                        if ('definitionId' in attrValueObj[0]) {
                            definitionArray = await getDefinitionsByDefinitionType(attrTypeName);
                        }
                        attrValueObj.forEach(async function (obj) {
                            count++;
                            if ('definitionId' in obj) {

                                // definitionArr contains only one item because filter will return only one definition
                                let definitionArr = definitionArray.filter(df => df.id == parseInt(obj.definitionId));
                                
                                multiSelectString = multiSelectString.concat(definitionArr[0].definitionName);
                                if (count != attrValueObj.length) {
                                    multiSelectString = multiSelectString.concat(" ");
                                }
                                if (attrTypeName === "program_implemented")
                                    self.setState({ program_implemented: multiSelectString })
                            }
                        })
                    }
                    attributeValue = multiSelectString;

                }

                if (attrTypeName != "program_implemented")
                    self.setState({ [attrTypeName]: attributeValue });

            })

            this.setState({ 
                loading: false
            })

        }
        catch(error) {
            console.log(error);
            var errMsg = '';
            errMsg = "Unable to fetch institution details. Please see error logs for more details. ";
            
            this.setState({ 
                loading: false,
                modalHeading : 'Fail!',
                okButtonStyle : { display: 'none' },
                modalText : errMsg,
                modal: !this.state.modal
            });
        }
    }
    
    // submitForm(event) {
    //     alert("submitting");
    //     event.preventDefault();
    //     const data = new FormData(event.target);
    //     console.log(data);
            
    //   }

    handleSubmit = async event => {

        
        event.preventDefault();
        if(this.handleValidation()) {

            console.log("in submission");

            this.setState({ 
                // form_disabled: true,
                loading : true
            })
            // this.beforeSubmit();
            
            const data = new FormData(event.target);
            console.log(data);
            var jsonData = new Object();
            

            
            jsonData.attributes = [];
            
            var attrType = await getLocationAttributeTypeByShortName("partnership_years");
            var fetchedAttrTypeUuid= attrType.uuid;
            var atrObj = new Object(); // top level obj
            atrObj.attributeTypeUuid = fetchedAttrTypeUuid; // attributeType obj with attributeTypeId key value
            atrObj.locationUuid =  this.state.institution_id.uuid;
            var years = this.state.partnership_years;
            atrObj.attributeValue = String(years); // attributeValue obj
            jsonData.attributes.push(atrObj);


            var attrType = await getLocationAttributeTypeByShortName("partnership_end_date");
            var fetchedAttrTypeUuid= attrType.uuid;
            var atrObj = new Object(); //top level obj
            atrObj.attributeTypeUuid = fetchedAttrTypeUuid; // attributeType obj with attributeTypeId key value 
            atrObj.locationUuid =  this.state.institution_id.uuid;
            atrObj.attributeValue = this.state.partnership_end_date; // attributeValue obj
            jsonData.attributes.push(atrObj);

            // school_type has a deinition datatype so attr value will be integer definitionid
            var attrType = await getLocationAttributeTypeByShortName("end_partnership_reason");
            var fetchedAttrTypeUuid= attrType.uuid;
            var atrObj = new Object(); //top level obj
            atrObj.attributeTypeUuid = fetchedAttrTypeUuid; // attributeType obj with attributeTypeId key value
            atrObj.locationUuid =  this.state.institution_id.uuid;
            atrObj.attributeValue = this.state.end_partnership_reason; // attributeValue obj
            jsonData.attributes.push(atrObj);
 
            console.log(jsonData);
            saveLocationAttributes(jsonData)
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

                        this.resetForm([]);

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
        // console.log(this.requiredFields);
        // this.setState({ hasError: this.checkValid(this.requiredFields) ? false : true });
        // formIsValid = this.checkValid(this.requiredFields);
        // this.setState({errors: this.errors});
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
                if(this.state[stateName] === "" || this.state[stateName] == undefined) {
                    isOk = false;
                    this.errors[fields[j]] = errorText;
                }   
            }
        }

        return isOk;
    }

    /**
     * clear fields
     */
    resetForm = (fields) => {

        var fields = ["institution_id", "institution_name", "partnership_start_date", "partnership_end_date", "partnership_years", "institution_type", "end_partnership_reason"];

        for(let j=0; j < fields.length; j++) {
            let stateName = fields[j];

            var el = document.getElementById(stateName).value = '';
            
            // for array object
            if(typeof this.state[stateName] === 'object') {
                this.state[stateName] = [];
            }

            // for text and others
            if(typeof this.state[stateName] != 'object') {
                this.state[stateName] = ''; 
            }
        }

    }

    render() {

        const page2style = this.state.page2Show ? {} : { display: 'none' };

        // for view mode
        const setDisable = this.state.viewMode ? "disabled" : "";

        // skip logics
        const cityOtherStyle = this.isCityOther ? {} : { display: 'none' };
        
        const otherInstitutionStyle = this.isOtherInstitution ? {} : { display: 'none' };
        const { selectedOption } = this.state;
        // scoring labels
        
        return (
            
            <div >
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
                            <Form id="institutionClosing" onSubmit={this.handleSubmit}>
                                <Row>
                                    <Col md="6">
                                        <Card className="main-card mb-6">
                                            <CardHeader>
                                                <i className="header-icon lnr-license icon-gradient bg-plum-plate"> </i>
                                                <b>Institution Closing Form</b>
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
                                                <span class="errorMessage"><u>Error: <br/></u> Form has some errors. Please check for required and invalid fields.<br/></span>
                                                </div>

                                                <br/>
                                                
                                                <fieldset >
                                                    <TabContent activeTab={this.state.activeTab}>
                                                        <TabPane tabId="1">
                                                            
                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="institution_id" >Select Institution ID</Label> <span class="errorMessage">{this.state.errors["institution_id"]}</span>
                                                                        <Select id="institution_id" name="institution_id" value={this.state.institution_id} onChange={(e) => this.handleChange(e, "institution_id")} options={this.state.institutions}/>
                                                                        
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="institution_name" >Name of Institution</Label> <span class="errorMessage">{this.state.errors["institution_name"]}</span> 
                                                                        <Input name="institution_name" id="institution_name" value={this.state.institution_name} onChange={(e) => {this.inputChange(e, "institution_name")}} placeholder="Institution Name" maxLength="100"  required disabled/>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="partnership_start_date" >Date partnership with Aahung was formed</Label> <span class="errorMessage">{this.state.errors["partnership_start_date"]}</span>
                                                                        <Input type="date" name="partnership_start_date" id="partnership_start_date" value={this.state.partnership_start_date} onChange={(e) => {this.inputChange(e, "partnership_start_date")}} max={moment().format("YYYY-MM-DD")} disabled/>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="partnership_end_date" >Date partnership with Aahung ended</Label> <span class="errorMessage">{this.state.errors["partnership_end_date"]}</span>
                                                                        <Input type="date" name="partnership_end_date" id="partnership_end_date" value={this.state.partnership_end_date} onChange={(e) => {this.inputChange(e, "partnership_end_date")}} max={moment().format("YYYY-MM-DD")} required/>
                                                                    </FormGroup>
                                                                </Col>

                                                            </Row>
                                                            <Row>
                                                                <Col md="6" >
                                                                    <FormGroup >
                                                                        <Label for="partnership_years" >Number of years of partnership</Label> <span class="errorMessage">{this.state.errors["partnership_years"]}</span>
                                                                        <Input type="number" value={this.state.partnership_years} name="partnership_years" id="partnership_years" onChange={(e) => { this.inputChange(e, "partnership_years") }} max="99" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 2) }} placeholder="Enter number" disabled required></Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="institution_type" >Type of Institution</Label> <span class="errorMessage">{this.state.errors["institution_type"]}</span>
                                                                        <Input name="institution_type" id="institution_type" value={this.state.institution_type} onChange={(e) => {this.inputChange(e, "institution_type")}} placeholder="Institution Type" required disabled/>
                                                                        {/* <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e, "institution_type")} value={this.state.institution_type} id="institution_type" options={institutionTypes} disabled/> */}
                                                                    </FormGroup>
                                                                </Col>

                                                            </Row>

                                                            <Row>
                                                                <Col md="12">
                                                                    <FormGroup style={otherInstitutionStyle}>
                                                                        <Label for="institution_type_other" >Specify other type of institution</Label>
                                                                        <Input name="institution_type_other" id="institution_type_other" value={this.state.institution_type_other} onChange={(e) => {this.inputChange(e, "institution_type_other")}} placeholder="Specify other" />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            <Row>

                                                                <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="end_partnership_reason" >Reason for end of partnership</Label> <span class="errorMessage">{this.state.errors["end_partnership_reason"]}</span>
                                                                        <Input type="textarea" name="end_partnership_reason" id="end_partnership_reason" value={this.state.end_partnership_reason} onChange={(e) => {this.inputChange(e, "end_partnership_reason")}} placeholder="Specify reason" required/>
                                                                    </FormGroup>
                                                                </Col>

                                                            </Row>
                                                            {/* please don't remove this div unless you are adding multiple questions here*/}
                                                            {/* <div style={{height: '250px'}}><span>   </span></div> */}

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

export default InstitutionClosing;