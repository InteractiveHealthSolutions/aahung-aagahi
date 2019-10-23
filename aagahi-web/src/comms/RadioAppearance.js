/*
 * @Author: tahira.niazi@ihsinformatics.com 
 * @Date: date 2019-08-27 14:34:23 
 * @Last Modified by: tahira.niazi@ihsinformatics.com
 * @Last Modified time: 2019-10-23 15:53:10
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
import TimeField from 'react-simple-timefield';
import * as Constants from "../util/Constants";
import { getAllUsers, getFormTypeByUuid } from "../service/GetService";
import { saveFormData } from "../service/PostService";
import LoadingIndicator from "../widget/LoadingIndicator";
import { MDBContainer, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBBtn } from 'mdbreact';

const coveredTopics = [
    { value: 'csa', label: 'CSA' },
    { value: 'gender', label: 'Gender' },
    { value: 'puberty', label: 'Puberty' },
    { value: 'sexual_harrassment', label: 'Sexual Harassment' },
    { value: 'lsbe', label: 'LSBE' },
    { value: 'other', label: 'Other' }
];


const users = [
    { value: 'uuid1', label: 'Harry Potter' },
    { value: 'uuid2', label: 'Ron Weasley' },
    { value: 'uuid3', label: 'Hermione Granger' },
    { value: 'uuid4', label: 'Albus Dumbledore' },
];

class RadioAppearance extends React.Component {

    modal = false;

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);

        this.state = {
            users: [],
            date_start: '',
            city : 'karachi',
            participant_name: '',
            dob: '',
            sex : '',
            school_id: [],
            csa_prompts: '',
            subject_taught : [], // all the form elements states are in underscore notation i.e variable names in codebook
            subject_taught_other: '',
            teaching_years: '',
            education_level: 'no_edu',
            donor_name: '',
            activeTab: '1',
            page2Show: true,
            viewMode: false,
            editMode: false,
            isCsa: true,
            isGender: false,
            hasError: false,
            errors: {},
            loading: false,
            modal: false,
            modalText: '',
            okButtonStyle: {},
            modalHeading: '',
        };

        this.cancelCheck = this.cancelCheck.bind(this);
        this.callModal = this.callModal.bind(this);
        this.valueChangeMulti = this.valueChangeMulti.bind(this);
        this.valueChange = this.valueChange.bind(this);
        this.calculateScore = this.calculateScore.bind(this);
        this.inputChange = this.inputChange.bind(this);
        this.checkValid =  this.checkValid.bind(this);

        this.isCityOther = false;
        this.isOtherTopic = false;

        this.formTypeId = 0;
        this.requiredFields = ["date_start", "time_radio_show", "radio_channel_name", "radio_channel_frequency", "city", "topic_covered", "aahung_staff_appearance", "live_call_count"];

        this.nonRequiredFields = ["listener_count", "topic_covered_other"];

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
            let userArray = await getAllUsers();
            let formTypeObj = await getFormTypeByUuid(Constants.RADIO_APPEARANCE_FORM_UUID);

            if(userArray != null && userArray.length > 0) {
                this.setState({
                    users : userArray
                })
            }

            this.formTypeId = formTypeObj.formTypeId;
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

        console.log(this.state.date_start);
        
        console.log(moment(this.state.time_radio_show, 'HH:mm').format('hh:mm a'));
        console.log(this.requiredFields);

        this.resetForm(this.requiredFields);

        for(let i=0; i < this.requiredFields.length; i ++ ) {
            console.log(this.requiredFields[i]);

            // for array object
            if(typeof this.state[this.requiredFields[i]] === 'object' && this.state[this.requiredFields[i]].length != 0) {
                this.setState({
                    [this.requiredFields[i]] : []
                })
            }

            // for text and others
            if(typeof this.state[this.requiredFields[i]] != 'object') {
                if(this.state[this.requiredFields[i]] != "" || this.state[this.requiredFields[i]] != undefined) {
                    this.setState({
                        [this.requiredFields[i]] : ''
                    })
                } 
            }

            if(this.requiredFields[i] === "time_radio_show") {
                this.setState({
                    [this.requiredFields[i]] : moment().format('HH:mm')
                })
            }
        }

    }

    // for text and numeric questions
    inputChange(e, name) {

        console.log(e);
        console.log(e.target.id);
        console.log(e.target.type);
        console.log(e.target.pattern);
        let errorText = '';
        if(e.target.pattern != "" && name != "radio_channel_frequency") {
            errorText = e.target.value.match(e.target.pattern) != e.target.value ? "invalid!" : '';
            this.errors[name] = errorText;
        }

        if(name === "radio_channel_frequency"){
            var regexp = /^\d+(\.\d{1,2})?$/;
            errorText = regexp.test(e.target.value) == false ? "invalid!" : '';
            this.errors[name] = errorText;
        }
        
        
        this.setState({
            [name]: e.target.value
        });
        
        if(name === "date_start") {
            this.setState({ date_start: e.target.value});
        }

        this.setState({errors: this.errors});
    }

    // for single select
    valueChange = (e, name) => {
        console.log(e.target.type);

        this.setState({
            [name]: e.target.value
        });

        if(e.target.id === "city") {
            this.isCityOther = e.target.value === "other" ? true : false;
            this.isCityOther ? this.requiredFields.push("city_other") : this.requiredFields = this.requiredFields.filter(e => e !== "city_other");
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

        if (name === "topic_covered") {
            if (getObject('other', e, 'value') != -1) {
                this.isOtherTopic = true;
                
            }
            if (getObject('other', e, 'value') == -1) {
                this.isOtherTopic = false;
                
            }

            this.isOtherTopic ? this.requiredFields.push("topic_covered_other") : this.requiredFields = this.requiredFields.filter(e => e !== "topic_covered_other");
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
    }
    

    handleSubmit = event => {
        event.preventDefault();
        if(this.handleValidation()) {

            console.log("in submission");

            this.setState({ 
                // form_disabled: true,
                loading : true
            })

            this.requiredFields = ["date_start", "time_radio_show", "radio_channel_name", "radio_channel_frequency", "city", "topic_covered", "aahung_staff_appearance", "live_call_count"];
            
            const data = new FormData(event.target);
            var jsonData = new Object();
            var dataObject = new Object();
            var formTypeObject = new Object();
            var topicCovered = [];
            var topicCoveredObject = new Object();
            
            dataObject.time_radio_show = moment(this.state.time_radio_show, 'HH:mm').format('hh:mm a');
            dataObject.radio_channel_name = data.get('radio_channel_name');
            dataObject.radio_channel_frequency = parseFloat(103);
            dataObject.city = this.state.city;
            if(this.isCityOther) 
                dataObject.city_other = data.get('city_other');

            // generating multiselect for topic covered
            if((this.state.topic_covered != null && this.state.topic_covered != undefined)) {
                for(let i=0; i< this.state.topic_covered.length; i++) {
                    topicCovered.push(String(this.state.topic_covered[i].value));
                }
            }
            topicCoveredObject.values = topicCovered;
            // var topicCoveredString = JSON.stringify(topicCoveredObject);
            dataObject.topic_covered = topicCoveredObject;
            if(this.isOtherTopic) 
                dataObject.topic_covered_other = data.get('topic_covered_other');

            // aahung_staff_appearance
            let aahungUsers = [];
            if((this.state.aahung_staff_appearance != null && this.state.aahung_staff_appearance != undefined)) {
                for(let i=0; i< this.state.aahung_staff_appearance.length; i++) {
                    aahungUsers.push({ 
                        "userId" : this.state.aahung_staff_appearance[i].id
                    });
                }
            }
            
            // var aahungUsersString = JSON.stringify(aahungUsers);
            dataObject.aahung_staff_appearance = aahungUsers;
            
            dataObject.live_call_count = parseInt(data.get('live_call_count'));
            if(data.get('listener_count') != null && data.get('listener_count') != undefined) {
                dataObject.listener_count = parseInt(data.get('listener_count'));
            }

            formTypeObject.formTypeId = this.formTypeId;
            // jsonData.data =  JSON.stringify(dataObject);
            jsonData.data =  dataObject;
            jsonData.formType =  formTypeObject;
            jsonData.formDate =  this.state.date_start;
            jsonData.referenceId =  "";
            console.log("printing json 'data' property object");
            console.log(dataObject);
            console.log("printing converted 'data' property in to string ");
            // console.log(JSON.stringify(dataObject));
            console.log("printing final json object");
            console.log(jsonData);
            // JSON.parse(JSON.stringify(dataObject));
            
            saveFormData(jsonData)
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

                        // document.getElementById("projectForm").reset();
                        // this.messageForm.reset();
                    }
                    else if(String(responseData).includes("Error")) {
                        
                        var submitMsg = '';
                        submitMsg = "Unable to submit Form. \
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
     * verifies and notifies for the empty form fields
     */
    resetForm = (fields) => {

        fields = fields.concat(this.nonRequiredFields);
        
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

        this.setState({
            time_radio_show: '00:00'
        })
        this.updateDisplay();
    }

    updateDisplay() {

        this.setState({
            city: 'karachi'
        })

        this.isCityOther = false;
        this.isOtherTopic = false;

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

        // skip logics
        const cityOtherStyle = this.isCityOther ? {} : { display: 'none' };
        
        const otherTopicStyle = this.isOtherTopic ? {} : { display: 'none' };
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
                            <Form id="testForm" onSubmit={this.handleSubmit}>
                                <Row>
                                    <Col md="6">
                                        <Card className="main-card mb-6">
                                            <CardHeader>
                                                <i className="header-icon lnr-license icon-gradient bg-plum-plate"> </i>
                                                <b>Radio Appearance Form</b>
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
                                                                    <FormGroup inline>
                                                                        <Label for="date_start" >Date</Label> <span class="errorMessage">{this.state.errors["date_start"]}</span>
                                                                        <Input type="date" name="date_start" id="date_start" value={this.state.date_start} onChange={(e) => {this.inputChange(e, "date_start")}} max={moment().format("YYYY-MM-DD")} />
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6">
                                                                    <FormGroup>
                                                                    <Label for="time_radio_show" >Time of Radio Show Start</Label> <span class="errorMessage">{this.state.errors["time_radio_show"]}</span> <br/>
                                                                    {/* <TimePicker id="time_radio_show" value={this.state.time_radio_show} onChange={(e) => {this.inputChange(e, "time_radio_show")}} /> */}
                                                                    <TimeField onChange={(e) => {this.getTime(e, "time_radio_show")}} input={<Input id="time" value={this.state.time_radio_show} onChange={(e) => {this.inputChange(e, "time_radio_show")}} />}  colon=":" required/>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="radio_channel_name" >Name of Radio</Label> <span class="errorMessage">{this.state.errors["radio_channel_name"]}</span>
                                                                        <Input name="radio_channel_name" id="radio_channel_name" value={this.state.radio_channel_name} onChange={(e) => {this.inputChange(e, "radio_channel_name")}} maxLength="200" placeholder="Enter name" pattern="^[A-Za-z0-9. ]+" />
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="radio_channel_frequency" >Radio Frequency</Label> <span class="errorMessage">{this.state.errors["radio_channel_frequency"]}</span> 
                                                                        <Input name="radio_channel_frequency" id="radio_channel_frequency" value={this.state.radio_channel_frequency} onChange={(e) => {this.inputChange(e, "radio_channel_frequency")}} maxLength="5" pattern="^\d{1,10}(\.\d{1,4})?$" placeholder="Enter input"/>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>

                                                                <Col md="6">
                                                                    <FormGroup > 
                                                                            <Label for="city" >City</Label> <span class="errorMessage">{this.state.errors["city"]}</span>
                                                                            <Input type="select" onChange={(e) => this.valueChange(e, "city")} value={this.state.city} name="city" id="city" >
                                                                                <option value="karachi">Karachi</option>
                                                                                <option value="islamabad">Islamabad</option>
                                                                                <option value="lahore">Lahore</option>
                                                                                <option value="quetta">Quetta</option>
                                                                                <option value="peshawar">Peshawar</option>
                                                                                <option value="hyderabad">Hyderabad</option>
                                                                                <option value="sba">SBA</option>
                                                                                <option value="other">Other</option>
                                                                            </Input>
                                                                        </FormGroup>
                                                                        
                                                                </Col>

                                                                <Col md="6" style={cityOtherStyle}>
                                                                    <FormGroup >
                                                                        <Label for="city_other" >Specify Other City</Label> <span class="errorMessage">{this.state.errors["city_other"]}</span>
                                                                        <Input name="city_other" id="city_other" value={this.state.city_other} onChange={(e) => {this.inputChange(e, "city_other")}} maxLength="200" placeholder="Enter other"/>
                                                                    </FormGroup>
                                                                </Col>

                                                                </Row>
                                                                <Row>

                                                                <Col md="6" >
                                                                    <FormGroup >
                                                                        <Label for="topic_covered" >Topics Covered</Label> <span class="errorMessage">{this.state.errors["topic_covered"]}</span>
                                                                        <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e, "topic_covered")} value={this.state.topic_covered} id="topic_covered" options={coveredTopics} required/>  
                                                                    </FormGroup>
                                                                </Col>


                                                                <Col md="6" style={otherTopicStyle}>
                                                                    <FormGroup >
                                                                        <Label for="topic_covered_other" >Specify Other Topic</Label> <span class="errorMessage">{this.state.errors["topic_covered_other"]}</span>
                                                                        <Input name="topic_covered_other" id="topic_covered_other" value={this.state.topic_covered_other} onChange={(e) => {this.inputChange(e, "topic_covered_other")}} maxLength="200" placeholder="Enter other"/>
                                                                    </FormGroup>
                                                                </Col>

                                                                </Row>
                                                                <Row>

                                                                <Col md="6" >
                                                                    <FormGroup > 
                                                                        <Label for="aahung_staff_appearance">Aahung Staff on Radio</Label> <span class="errorMessage">{this.state.errors["aahung_staff_appearance"]}</span>
                                                                        <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e, "aahung_staff_appearance")} value={this.state.aahung_staff_appearance} id="aahung_staff_appearance" options={this.state.users} />  
                                                                    </FormGroup>
                                                                </Col>
                                                               
                                                                <Col md="6" >
                                                                    <FormGroup >
                                                                        <Label for="live_call_count" >Number of Live Calls During Show</Label> <span class="errorMessage">{this.state.errors["live_call_count"]}</span>
                                                                        <Input type="number" value={this.state.live_call_count} name="live_call_count" id="live_call_count" onChange={(e) => { this.inputChange(e, "live_call_count") }} max="999" min="0" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" >
                                                                    <FormGroup >
                                                                        <Label for="listener_count" >Number of Listeners</Label> <span class="errorMessage">{this.state.errors["listener_count"]}</span>
                                                                        <Input type="number" value={this.state.listener_count} name="listener_count" id="listener_count" onChange={(e) => { this.inputChange(e, "listener_count") }} max="9999999999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 10) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            {/* please don't remove this div unless you are adding multiple questions here*/}
                                                            <div style={{height: '250px'}}><span>   </span></div>

                                                            


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

export default RadioAppearance;