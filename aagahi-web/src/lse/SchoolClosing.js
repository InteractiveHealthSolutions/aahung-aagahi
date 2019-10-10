/**
 * @author Tahira Niazi
 * @email tahira.niazi@ihsinformatics.com
 * @create date 2019-08-19 15:26:53
 * @modify date 2019-08-19 15:26:53
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
import Select from 'react-select';
import CustomModal from "../alerts/CustomModal";
import moment from 'moment';
import { getObject, schoolDefinitionUuid } from "../util/AahungUtil.js";
import { getLocationsByCategory, getLocationByShortname, getLocationAttributesByLocation, getDefinitionByDefinitionShortName, getDefinitionByDefinitionId, getDefinitionsByDefinitionType, getLocationAttributeTypeByShortName, getDefinitionId } from '../service/GetService';
import { saveLocationAttributes } from "../service/PostService";
import LoadingIndicator from "../widget/LoadingIndicator";
import { MDBContainer, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBBtn } from 'mdbreact';

const schools = [
    { value: 'khileahi', label: 'Karachi Learning High School' },
    { value: 'khibahcol', label: 'Bahria College Karsaz' },
    { value: 'khihbpub', label: 'Habib Public School' },
];

const programsImplemented = [
    { label: 'CSA', value: 'csa' },
    { label: 'Gender', value: 'gender' },
    { label: 'LSBE', value: 'lsbe' }
];

class SchoolClosing extends React.Component {

    modal = false;

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);

        this.state = {
            locationObj: {},
            schools: [],
            participant_id: '',
            participant_name: '',
            school_tier: 'school_tier_new',
            dob: '123',
            sex: '',
            school_id: [],
            partnership_years: '',
            subject_taught: [], // all the form elements states are in underscore notation i.e variable names in codebook
            subject_taught_other: '',
            teaching_years: '',
            education_level: 'no_edu',
            donor_name: '',
            activeTab: '1',
            page2Show: true,
            viewMode: false,
            editMode: false,
            errors: {},
            loading: false,
            isCsa: true,
            isGender: false,
            hasError: false,
        };


        this.cancelCheck = this.cancelCheck.bind(this);
        this.callModal = this.callModal.bind(this);
        this.valueChangeMulti = this.valueChangeMulti.bind(this);
        this.valueChange = this.valueChange.bind(this);
        this.calculateScore = this.calculateScore.bind(this);
        this.inputChange = this.inputChange.bind(this);

        // this.partnership_years = '1222';
        this.locationObj = {};
        this.requiredFields = ["school_id", "end_partnership_reason", "partnership_years"]; //rest of the required fields are checked automatically by 'required' tag
        this.errors = {};
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
            
            let schools = await getLocationsByCategory(schoolDefinitionUuid);
            console.log(schools);

            if (schools != null && schools.length > 0) {
                this.setState({
                    schools: schools
                })
            }

        }
        catch (error) {
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

    // for modal
    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    }

    beforeunload(e) {
        e.preventDefault();
        e.returnValue = true;
    }


    cancelCheck = () => {

        this.resetForm();
        // receiving value directly from widget but it still requires widget to have on change methods to set it's value
        // this.setState({school_tier: 'school_tier_new'})
        // document.getElementById("school_tier").value = "school_tier_running";
        
    }

    // for text and numeric questions
    inputChange(e, name) {


        // appending dash to contact number after 4th digit
        if (name === "donor_name") {
            this.setState({ donor_name: e.target.value });
            let hasDash = false;
            if (e.target.value.length == 4 && !hasDash) {
                this.setState({ donor_name: '' });
            }
            if (this.state.donor_name.length == 3 && !hasDash) {
                this.setState({ donor_name: '' });
                this.setState({ donor_name: e.target.value });
                this.setState({ donor_name: `${e.target.value}-` });
                this.hasDash = true;
            }
        }

        // appending dash after 4th position in phone number
        if (name === "point_person_contact") {
            this.setState({ point_person_contact: e.target.value });
            let hasDash = false;
            if (e.target.value.length == 4 && !hasDash) {
                this.setState({ point_person_contact: '' });
            }
            if (this.state.donor_name.length == 3 && !hasDash) {
                this.setState({ point_person_contact: '' });
                this.setState({ point_person_contact: e.target.value });
                this.setState({ point_person_contact: `${e.target.value}-` });
                this.hasDash = true;
            }
        }



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
    }

    // for single select
    valueChange = (e, name) => {
        this.setState({ sex: e.target.value });
        this.setState({ sex: e.target.value });
        this.setState({
            [name]: e.target.value
        });

        if (e.target.id === "primary_program_monitored")
            if (e.target.value === "csa") {
                this.setState({ isCsa: true });
                this.setState({ isGender: false });

            }
            else if (e.target.value === "gender") {
                this.setState({ isCsa: false });
                this.setState({ isGender: true });
            }

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
    }

    callModal = () => {
        this.setState({ modal: !this.state.modal });
    }

    // for autocomplete single select
    async handleChange(e, name) {

        this.setState({
            [name]: e
        });

        try {
            if (name === "school_id") {

                    this.setState({
                        school_name: e.locationName
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
                if(attrTypeName === "school_tier")
                    document.getElementById(attrTypeName).value = attributeValue;
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
                            multiSelectString = multiSelectString.concat(", ");
                            
                        }
                    })
                    if (attrTypeName === "program_implemented") {
                        multiSelectString = multiSelectString.substring(0, multiSelectString.length - 2);
                        self.setState({ program_implemented: multiSelectString })
                    }
                }
                attributeValue = multiSelectString;
            }

            if (attrTypeName != "program_implemented" && attrTypeName != "school_tier")
                self.setState({ [attrTypeName]: attributeValue });

        })
    }

    handleSubmit = async event => {
        event.preventDefault();
        if(this.handleValidation()) {
            this.setState({ 
                loading : true
            })
            
            const data = new FormData(event.target);
            console.log(data);
            var jsonData = new Object();
            
            jsonData.attributes = [];
            
            var attrType = await getLocationAttributeTypeByShortName("partnership_years");
            var fetchedAttrTypeId= attrType.attributeTypeId;
            var atrObj = new Object(); // top level obj
            atrObj.attributeTypeId = fetchedAttrTypeId; // attributeType obj with attributeTypeId key value
            atrObj.locationId =  this.state.school_id.id; 
            var years = this.state.partnership_years;
            atrObj.attributeValue = String(years); // attributeValue obj
            jsonData.attributes.push(atrObj);

            // school_tier has a deinition datatype so attr value will be integer definitionid
            var attrType = await getLocationAttributeTypeByShortName("school_tier");
            var fetchedAttrTypeId= attrType.attributeTypeId;
            var atrObj = new Object(); // top level obj
            atrObj.attributeTypeId = fetchedAttrTypeId; // attributeType obj with attributeTypeId key value
            atrObj.locationId =  this.state.school_id.id;
            var def = await getDefinitionByDefinitionShortName(this.state.school_tier);
            atrObj.attributeValue = String(def.definitionId);
            console.log(" >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ");
            console.log(atrObj.attributeValue);
            jsonData.attributes.push(atrObj);

            var attrType = await getLocationAttributeTypeByShortName("partnership_end_date");
            var fetchedAttrTypeId= attrType.attributeTypeId;
            var atrObj = new Object(); // top level obj
            atrObj.attributeTypeId = fetchedAttrTypeId; // attributeType obj with attributeTypeId key value
            atrObj.locationId =  this.state.school_id.id; 
            atrObj.attributeValue = this.state.partnership_end_date; // attributeValue obj
            jsonData.attributes.push(atrObj);

            // school_type has a deinition datatype so attr value will be integer definitionid
            var attrType = await getLocationAttributeTypeByShortName("end_partnership_reason");
            var fetchedAttrTypeId= attrType.attributeTypeId;
            var atrObj = new Object(); // top level obj
            atrObj.attributeTypeId = fetchedAttrTypeId; // attributeType obj with attributeTypeId key value
            atrObj.locationId =  this.state.school_id.id; 
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
                        
                        this.resetForm();
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
        let formIsValid = true;
        console.log(this.requiredFields);
        this.setState({ hasError: true });
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
    resetForm = () => {

        var fields = ["school_id", "school_name", "partnership_start_date", "partnership_end_date", "partnership_years", "school_level", "program_implemented", "school_tier", "end_partnership_reason"];

        for(let j=0; j < fields.length; j++) {
            let stateName = fields[j];

            // var el = document.getElementById(stateName).value = '';
            
            // for array object
            if(typeof this.state[stateName] === 'object') {
                this.state[stateName] = [];
            }

            // for text and others
            if(typeof this.state[stateName] != 'object') {
                this.state[stateName] = ''; 
            }
        }

        this.setState({
            program_implemented: ''

        })
    }

    render() {

        const page2style = this.state.page2Show ? {} : { display: 'none' };

        // for view mode
        const setDisable = this.state.viewMode ? "disabled" : "";

        const monitoredCsaStyle = this.state.isCsa ? {} : { display: 'none' };
        const monitoredGenderStyle = this.state.isGender ? {} : { display: 'none' };
        const { selectedOption } = this.state;
        // scoring labels
        const stronglyAgree = "Strongly Agree";
        const agree = "Agree";
        const neither = "Neither Agree nor Disagree";
        const stronglyDisagree = "Strongly Disagree";
        const disagree = "Disagree";
        const yes = "Yes";
        const no = "No";


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
                            <Form id="schoolDetail" onSubmit={this.handleSubmit}>
                                <Row>
                                    <Col md="6">
                                        <Card className="main-card mb-6">
                                            <CardHeader>
                                                <i className="header-icon lnr-license icon-gradient bg-plum-plate"> </i>
                                                <b>School Closing</b>
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
                                                    <span class="errorMessage"><u>Errors: <br /></u> Form has some errors. Please check for required or invalid fields.<br /></span>
                                                </div>

                                                <br />
                                                
                                                    <fieldset >
                                                        <TabContent activeTab={this.state.activeTab}>
                                                            <TabPane tabId="1">
                                                                
                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="school_id" >Select School ID</Label> <span class="errorMessage">{this.state.errors["school_id"]}</span>
                                                                            <Select id="school_id" name="school_id" value={this.state.school_id} onChange={(e) => this.handleChange(e, "school_id")} options={this.state.schools} required/>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="school_name" >School Name</Label>
                                                                            <Input name="school_name" id="school_name" value={this.state.school_name} disabled />
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup inline>
                                                                            <Label for="partnership_start_date" >Date partnership with Aahung was formed</Label>
                                                                            <Input type="date" name="partnership_start_date" id="partnership_start_date" value={this.state.partnership_start_date} onChange={(e) => { this.inputChange(e, "partnership_start_date") }} max={moment().format("YYYY-MM-DD")} required disabled />
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6">
                                                                        <FormGroup inline>
                                                                            <Label for="partnership_end_date" >Date partnership with Aahung ended</Label>
                                                                            <Input type="date" name="partnership_end_date" id="partnership_end_date" value={this.state.partnership_end_date} onChange={(e) => { this.inputChange(e, "partnership_end_date") }} max={moment().format("YYYY-MM-DD")} required />
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="partnership_years">Number of years of partnership</Label> <span class="errorMessage">{this.state.errors["partnership_years"]}</span>
                                                                            <Input type="number" value={this.state.partnership_years} name="partnership_years" id="partnership_years" onChange={(e) => { this.inputChange(e, "partnership_years") }} max="99" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 2) }} placeholder="Enter count in numbers" disabled required></Input>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="school_level" >Level of Program</Label>
                                                                            <Input type="select" onChange={(e) => this.valueChange(e, "school_level")} value={this.state.school_level} name="school_level" id="school_level" disabled>
                                                                                <option value="school_level_primary">Primary</option>
                                                                                <option value="school_level_secondary">Secondary</option>
                                                                            </Input>
                                                                        </FormGroup>

                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="program_implemented" >Type of program(s) implemented in school</Label>
                                                                            <Input name="program_implemented" id="program_implemented" value={this.state.program_implemented} placeholder="Programs implemented in school" disabled />
                                                                            {/* <Input type="select" onChange={(e) => this.valueChange(e, "program_implemented")} value={this.state.program_implemented} name="program_implemented" id="program_implemented">
                                                                            <option value="csa">CSA</option>
                                                                            <option value="gender">Gender</option>
                                                                            <option value="lsbe">LSBE</option>
                                                                        </Input> */}
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="school_tier" >School Tier</Label> <span class="errorMessage">{this.state.errors["school_tier"]}</span>
                                                                            <Input type="select" name="school_tier" id="school_tier" onChange={(e) => this.valueChange(e, "school_tier")}>
                                                                                <option value="school_tier_new">New</option>
                                                                                <option value="school_tier_running">Running</option>
                                                                                <option value="school_tier_exit">Exit</option>
                                                                            </Input>
                                                                        </FormGroup>
                                                                    </Col>

                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="end_partnership_reason" >Reason for end of partnership</Label> <span class="errorMessage">{this.state.errors["end_partnership_reason"]}</span>
                                                                            <Input type="textarea" name="end_partnership_reason" id="end_partnership_reason" value={this.state.end_partnership_reason} onChange={(e) => { this.inputChange(e, "end_partnership_reason") }} maxLength="250" placeholder="Enter reason" />
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
                                                    <LoadingIndicator loading={this.state.loading}/>
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

export default SchoolClosing;