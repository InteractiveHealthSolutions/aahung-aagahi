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
import "../index.css"
import classnames from 'classnames';
import Select from 'react-select';
import CustomModal from "../alerts/CustomModal";
import { useBeforeunload } from 'react-beforeunload';
import { getObject} from "../util/AahungUtil.js";
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
import moment from 'moment';
import * as Constants from "../util/Constants";
import {  getDefinitionId, getPersonAttributeTypeByShortName, getLocationsByCategory} from '../service/GetService';
import { saveParticipant } from "../service/PostService";
import LoadingIndicator from "../widget/LoadingIndicator";
import { MDBContainer, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBBtn } from 'mdbreact';


// const options = [
//     { value: 'b37b9390-f14f-41da-893f-604def748fea', label: 'Sindh' },
//     { value: 'b37b9390-f14f-41da-893f-604def748fea', label: 'Punjab' },
//     { value: 'b37b9390-f14f-41da-893f-604def748fea', label: 'Balochistan' },
//     { value: 'b37b9390-f14f-41da-893f-604def748fea', label: 'Khyber Pakhtunkhwa' },
// ];

const programsImplemented = [
    { label: 'CSA', value: 'csa'},
    { label: 'Gender', value: 'gender'},
    { label: 'LSBE', value: 'lsbe'},
];

const subjectsTaught = [
    { label: 'Math', value: 'math'},
    { label: 'Science', value: 'science'},
    { label: 'English', value: 'english'},
    { label: 'Urdu', value: 'urdu', },
    { label: 'Social Studies', value: 'social_studies'},
    { label: 'Islamiat', value: 'islamiat'},
    { label: 'Art', value: 'art', },
    { label: 'Music', value: 'music'},
    { label: 'Other', value: 'other_subject', },
];


class ParticipantDetails extends React.Component {

    modal = false;
    

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);

        this.state = {
            schools: [],
            participant_id : '',
            participant_name: '',
            dob: '',
            sex : '',
            school_id: [],
            school_name: '',
            subject_taught : [], // all the form elements states are in underscore notation i.e variable names in codebook
            subject_taught_other: '',
            teaching_years: '',
            education_level: 'no_education',
            activeTab: '1',
            page2Show: true,
            hasError: false,
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
        this.inputChange = this.inputChange.bind(this);

        this.requiredFields = [ "participant_name", "dob", "sex", "school_id", "subject_taught", "teaching_years"];
        this.participantId = '';
        this.errors = {};
        this.isOtherSubject = false;
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

            let schools = await getLocationsByCategory(Constants.SCHOOL_DEFINITION_UUID);
            if (schools != null && schools.length > 0) {
                this.setState({
                    schools: schools
                })
            }
        }
        catch(error) {
            console.log(error);
        }
    }

    updateDisplay(){
        this.setState({

            partner_components:'lse'
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
          e.preventDefault();
          e.returnValue = true;
      }


    cancelCheck = () => {
        this.resetForm(this.requiredFields);
    }

    inputChange(e, name) {

        this.setState({
            [name]: e.target.value
        });
    }

    // for single select
    valueChange = (e, name) => {
        
        
        this.setState({
            [name]: e.target.value
        });

        if(e.target.id === "school_level") {
            // do skip logics based on school_level
        }

    }

    // for multi select
    valueChangeMulti(e, name) {
        console.log(e);
        this.setState({
            [name]: e
        });

        if(name === "subject_taught") {
            // checking with two of because when another value is selected and other is unchecked, it still does not change the state
            if(getObject('other_subject', e, 'value') != -1) {
                
                this.isOtherSubject = true;
            }
            if(getObject('other_subject', e, 'value') == -1) {
                
                this.isOtherSubject = false;
            }
            this.isOtherSubject ? this.requiredFields.push("subject_taught_other") : this.requiredFields = this.requiredFields.filter(e => e !== "subject_taught_other");
        }
    }

    callModal = () => {
        this.setState({ modal : !this.state.modal });
    }

    // for autocomplete single select
    handleChange(e, name) {

        this.setState({
            [name]: e
        });

        try {
            if (name === "school_id") {

                this.setState({ school_name: e.locationName});
                document.getElementById("school_name").value= e.locationName;
            }
        }
        catch (error) {
            console.log(error);
        }
    };
    
    beforeSubmit() {

        // autogenerate parent organization id
        try {
            var user = JSON.parse( sessionStorage.getItem('user'));
            var userId = user.userId;
            var timestamp = moment().format('YYMMDDhhmmss');
            this.participantId = String(userId) + timestamp;
            var id = parseInt(this.participantId);
            this.participantId = id.toString(36);
        }
        catch(error) {
            console.log(error);
        }
    
    }

    handleSubmit = async event => {

        
        event.preventDefault();
        if(this.handleValidation()) {

            console.log("in submission");

            this.setState({ 
                loading : true
            })

            try{
                this.beforeSubmit();
                
                const data = new FormData(event.target);
                console.log(data);
                var jsonData = new Object();
                
                // jsonData.category = {};
                // var categoryId = await getDefinitionId("location_category", "school");
                // jsonData.category.definitionId = categoryId;
                jsonData.identifier = this.participantId;
                jsonData.location = {};
                jsonData.location.locationId = this.state.school_id.id;
                
                jsonData.person = {};
                jsonData.person.country = "Pakistan";
                // jsonData.person.date_start = this.state.date_start;
                jsonData.person.firstName = this.state.participant_name;
                jsonData.person.dob = this.state.dob; 
                jsonData.person.gender = this.state.sex; 

                jsonData.person.attributes = [];
                
                // type of participant
                var attrType = await getPersonAttributeTypeByShortName("lse_teacher_participant");
                var attrTypeId= attrType.attributeTypeId;
                var attributeObject = new Object(); // top level obj
                attributeObject.attributeType = {};
                attributeObject.attributeType.attributeTypeId = attrTypeId; // attributeType obj with attributeTypeId key value 
                attributeObject.attributeValue = true; // attributeValue obj
                jsonData.person.attributes.push(attributeObject);

                
                // ==== MULTISELECT location_attribute_types ===
                
                // subject_taught > person attr type
                var attrType = await getPersonAttributeTypeByShortName("subject_taught");
                var attrTypeId= attrType.attributeTypeId;
                var attributeObject = new Object(); //top level obj
                attributeObject.attributeType = {};
                attributeObject.attributeType.attributeTypeId = attrTypeId; // attributeType obj with attributeTypeId key value
                let attrValueObject = [];
                for(let i=0; i< this.state.subject_taught.length; i++ ) {
                    let definitionObj = {};
                    // send first: def type and second: definition shortname below
                    definitionObj.definitionId = await getDefinitionId("subject_taught", this.state.subject_taught[i].value);
                    attrValueObject.push(definitionObj);
                }
                
                attributeObject.attributeValue = JSON.stringify(attrValueObject); // attributeValue array of definitionIds
                jsonData.person.attributes.push(attributeObject);
                
                // subject_taught_other
                if(this.isOtherSubject) {
                    
                    var attrType = await getPersonAttributeTypeByShortName("subject_taught_other");
                    var attrTypeId= attrType.attributeTypeId;
                    var attributeObject = new Object(); //top level obj
                    attributeObject.attributeType = {};
                    attributeObject.attributeType.attributeTypeId = attrTypeId; // attributeType obj with attributeTypeId key value
                    
                    attributeObject.attributeValue = this.state.subject_taught_other;
                    jsonData.person.attributes.push(attributeObject);
                }

                //teaching_years
                var attrType = await getPersonAttributeTypeByShortName("teaching_years");
                var attrTypeId= attrType.attributeTypeId;
                var attributeObject = new Object(); //top level obj
                attributeObject.attributeType = {};
                attributeObject.attributeType.attributeTypeId = attrTypeId; // attributeType obj with attributeTypeId key value
                
                // var years = moment().diff(this.state.partnership_start_date, 'years');
                attributeObject.attributeValue = this.state.teaching_years; // attributeValue obj
                jsonData.person.attributes.push(attributeObject);
                
                // education_level has a deinition datatype so attr value will be integer definitionid
                var attrType = await getPersonAttributeTypeByShortName("education_level");
                var attrTypeId= attrType.attributeTypeId;
                var attributeObject = new Object(); //top level obj
                attributeObject.attributeType = {};
                attributeObject.attributeType.attributeTypeId = attrTypeId; // attributeType obj with attributeTypeId key value
                
                attributeObject.attributeValue = await getDefinitionId("education_level", this.state.education_level); // attributeValue obj
                jsonData.person.attributes.push(attributeObject);

    
                console.log(jsonData);
                saveParticipant(jsonData)
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
            catch(error){

                console.log(error);
                var submitMsg = '';
                    submitMsg = "An error occured. Please see error logs for details. "
                    
                    
                    this.setState({ 
                        loading: false,
                        modalHeading : 'Fail!',
                        okButtonStyle : { display: 'none' },
                        modalText : submitMsg,
                        modal: !this.state.modal
                    });


            }

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
        // Check 'teaching_years' to be less than age of participant
        if(this.state.teaching_years != '') {
            var now = moment(new Date()); //todays date
            var dobDate = moment(document.getElementById('dob').value); // another date
            var duration = moment.duration(now.diff(dobDate));
            var ageYears = duration.asYears();
            var teachingYears = parseInt(document.getElementById('teaching_years').value);
            if(teachingYears > ageYears) {
                isOk = false;
                this.errors['teaching_years'] = "Enter valid number of teaching years";
            }
        }
        
        return isOk;
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
        const { selectedOption } = this.state;
        const otherSubjectStyle = this.isOtherSubject ? {} : { display: 'none' };

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
                            <Form id="testForm" onSubmit={this.handleSubmit}>
                                <Row>
                                    <Col md="6">
                                        <Card className="main-card mb-6">
                                            <CardHeader>
                                                <i className="header-icon lnr-license icon-gradient bg-plum-plate"> </i>
                                                <b>Participant Details Form</b>
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
                                                {/* <CardTitle>Form Details</CardTitle> */}
                                                    <TabContent activeTab={this.state.activeTab}>
                                                        <TabPane tabId="1">
                                                            {/* <Row>
                                                                 <Col md="6">
                                                                    <FormGroup inline>
                                                                        <Label for="date_start" >Form Date</Label> <span class="errorMessage">{this.state.errors["date_start"]}</span>
                                                                        <Input type="date" name="date_start" id="date_start" value={this.state.date_start} onChange={(e) => {this.inputChange(e, "date_start")}} max={moment().format("YYYY-MM-DD")} />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row> */}
                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup> 
                                                                        <Label for="participant_id" >Teacher ID</Label> <span class="errorMessage">{this.state.errors["participant_id"]}</span>
                                                                        <Input type="text" name="participant_id" id="participant_id" value={this.participantId} placeholder="Autogenerated" maxLength='10' disabled/>
                                                                        
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup>
                                                                        <Label for="participant_name" >Teacher Name</Label>  <span class="errorMessage">{this.state.errors["participant_name"]}</span>
                                                                        <Input name="participant_name" id="participant_name" value={this.state.participant_name} onChange={(e) => {this.inputChange(e, "participant_name")}} maxLength='50' pattern="^[A-Za-z ]+" placeholder="Enter name" />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="dob" >Date of Birth</Label> <span class="errorMessage">{this.state.errors["dob"]}</span>
                                                                        <Input type="date" name="dob" id="dob" value={this.state.dob} onChange={(e) => {this.inputChange(e, "dob")}} max={moment().format("YYYY-MM-DD")}/>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup tag="fieldset" row>
                                                                        <legend className="col-form-label col-sm-2">Sex</legend>
                                                                        <Col sm={10}>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="sex" id="male" value="Male" /* checked= {this.state.sex === 'Male'} */ onChange={(e) => this.valueChange(e, "sex")} />{' '}
                                                                                Male
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="sex" id="female" value="Female" /* checked= {this.state.sex === 'Female'} */  onChange={(e) => this.valueChange(e, "sex")} />{' '}
                                                                                Female
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="sex" id="other" value="Other" /* checked= {this.state.sex === 'Other'} */ onChange={(e) => this.valueChange(e, "sex")} />{' '}
                                                                                Other
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <span class="errorMessage">{this.state.errors["sex"]}</span>
                                                                        </Col>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col md="6">
                                                                <FormGroup >
                                                                        <Label for="school_id" >School ID</Label> <span class="errorMessage">{this.state.errors["school_id"]}</span>
                                                                        <Select id="school_id"
                                                                            name="school_id"
                                                                            value={this.state.school_id}
                                                                            onChange={(e) => this.handleChange(e, "school_id")}
                                                                            options={this.state.schools}
                                                                        />
                                                                    </FormGroup>                                                                    
                                                                </Col>
                                                                <Col md="6">

                                                                    <FormGroup >
                                                                        <Label for="school_name" >School Name</Label>
                                                                        <Input name="school_name" id="school_name" placeholder="Autopopulate School Name" value={this.state.school_name} disabled/>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            <Row>

                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="subject_taught" >Subject(s) taught</Label> <span class="errorMessage">{this.state.errors["subject_taught"]}</span>
                                                                        <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e, "subject_taught")} value={this.state.subject_taught} id="subject_taught" options={subjectsTaught} />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="12">
                                                                    <FormGroup style={otherSubjectStyle}>
                                                                        <Label for="subject_taught_other" >Specify Other</Label> <span class="errorMessage">{this.state.errors["subject_taught_other"]}</span>
                                                                        <Input name="subject_taught_other" id="subject_taught_other" value={this.subject_taught_other} onChange={(e) => {this.inputChange(e, "subject_taught_other")}} placeholder="Other subjects" />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="teaching_years" >Number of years teaching</Label> <span class="errorMessage">{this.state.errors["teaching_years"]}</span>
                                                                        <Input type="number" value={this.state.teaching_years} name="teaching_years" id="teaching_years" onChange={(e) => {this.inputChange(e, "teaching_years")}} max="99" min="1" onInput = {(e) =>{ e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,2)}} placeholder="Enter number of years"></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="education_level" >Level of Education</Label> <span class="errorMessage">{this.state.errors["education_level"]}</span>
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "education_level")} value={this.state.education_level} name="education_level" id="education_level">
                                                                            <option value="no_education">No Education</option>
                                                                            <option value="some_primary">Some Primary</option>
                                                                            <option value="primary">Primary</option>
                                                                            <option value="secondary">Secondary</option>
                                                                            <option value="college">College</option>
                                                                            <option value="undergraduate">Undergraduate</option>
                                                                            <option value="postgraduate">Post-graduate</option>
                                                                        </Input>
                                                                        
                                                                    </FormGroup>

                                                                </Col>
                                                            </Row>

                                                            {/* please don't remove this div unless you are adding another form question here*/}
                                                            <div style={{height: '250px'}}><span>   </span></div>

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

export default ParticipantDetails;


