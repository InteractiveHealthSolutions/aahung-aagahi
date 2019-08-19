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

const evaluators = [
    { value: 'sindh', label: 'Sindh' },
    { value: 'punjab', label: 'Punjab' },
    { value: 'balochistan', label: 'Balochistan' },
    { value: 'khyber_pakhtunkhwa', label: 'Khyber Pakhtunkhwa' },
];

const sessionFacilitatorOptions = [
    { value: 'parents', label: 'Parents' },
    { value: 'teachers', label: 'Teachers' },
    { value: 'school_management', label: 'School Management' },
    { value: 'aahung_trainers', label: 'Aahung Trainers' },
];

const participantTypeOptions = [
    { value: 'government', label: 'Government' },
    { value: 'policy_makers', label: 'Policy Makers' },
    { value: 'tac', label: 'TAC' },
    { value: 'ngos', label: 'NGOs' },
    { value: 'school_partners', label: 'School Partners' },
    { value: 'other', label: 'Other' },
];

const staffUsers = [
    { value: 'uuid1', label: 'Harry Potter' },
    { value: 'uuid2', label: 'Ron Weasley' },
    { value: 'uuid3', label: 'Hermione Granger' },
    { value: 'uuid4', label: 'Albus Dumbledore' },
];

class StakeholderMeeting extends React.Component {

    modal = false;

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);

        this.state = {
            // TODO: fill UUIDs everywhere where required
            // options : [{value: 'math'},
            // {value: 'science'}],
            elements: ['program_implemented', 'school_level','donor_name'],
            date_start: '',
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
            donor_name: '',
            activeTab: '1',
            page2Show: true,
            viewMode: false,
            editMode: false,
            errors: {},
            isCsa: true,
            isGender: false,
            hasError: false,
        };


        this.cancelCheck = this.cancelCheck.bind(this);
        this.callModal = this.callModal.bind(this);
        this.valueChangeMulti = this.valueChangeMulti.bind(this);
        this.valueChange = this.valueChange.bind(this);
        this.calculateScore = this.calculateScore.bind(this);
        this.getObject = this.getObject.bind(this);
        this.inputChange = this.inputChange.bind(this);
    }

    componentDidMount() {

        // TODO: checking view mode, view mode will become active after the form is populated
        // this.setState({
            // school_id : this.getObject('khyber_pakhtunkhwa', schools, 'value'), // autopopulate in view: for single select autocomplete
            // monitor: [{value: 'sindh'}, {value: 'punjab'}], // // autopopulate in view: for multi-select autocomplete
            // viewMode : true,    
        // })

        // alert("School Details: Component did mount called!");
        window.addEventListener('beforeunload', this.beforeunload.bind(this));



    }

    componentWillUnmount() {

        // alert("School Details: ComponentWillUnMount called!");
        window.removeEventListener('beforeunload', this.beforeunload.bind(this));
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

        let errors = {};

        console.log(" ============================================================= ")
        // alert(this.state.program_implemented + " ----- " + this.state.school_level + "-----" + this.state.sex);
        console.log("program_implemented below:");
        console.log(this.state.program_implemented);
        console.log("school_level below:");
        console.log(this.state.school_level);
        console.log("school_id below:");
        console.log(this.state.school_id);
        console.log(this.getObject('khyber_pakhtunkhwa', schools, 'value'));
        console.log(this.state.donor_name);
        console.log(this.state.date_start);
        this.handleValidation();

        this.setState({
            hasError : true
        })


        // receiving value directly from widget but it still requires widget to have on change methods to set it's value
        // alert(document.getElementById("date_start").value);
    }

    inputChange(e, name) {
        // appending dash to contact number after 4th digit
        if(name === "donor_name") {
            this.setState({ donor_name: e.target.value});
            let hasDash = false;
            if(e.target.value.length == 4 && !hasDash) {
                this.setState({ donor_name: ''});
            }
            if(this.state.donor_name.length == 3 && !hasDash) {
                this.setState({ donor_name: ''});
                this.setState({ donor_name: e.target.value});
                this.setState({ donor_name: `${e.target.value}-` });
                this.hasDash = true;
            }
        }

        if(name === "date_start") {
            this.setState({ date_start: e.target.value});
        }
    }


    // setting autocomplete single select tag when receiving value from server
    // value is the uuid, arr is the options array, prop either label/value, mostly value because it is uuid
    getObject(value, arr, prop) {
        for(var i = 0; i < arr.length; i++) {
            if(arr[i][prop] === value) {
                alert(arr[i]);
                return arr[i];

            }
        }
        return -1; //to handle the case where the value doesn't exist
    }

    // for single select
    valueChange = (e, name) => {
        this.setState ({sex : e.target.value });
        this.setState ({sex : e.target.value });
        this.setState({
            [name]: e.target.value
        });

        if(e.target.id === "primary_program_monitored")
        if(e.target.value === "csa") {
            alert("csa program selected");
            this.setState({isCsa : true });
            this.setState({isGender : false });
            
        }
        else if(e.target.value === "gender") {
            this.setState({isCsa : false });
            this.setState({isGender : true });
        }

    }

    // calculate score from scoring questions (radiobuttons)
    calculateScore = (e, name) => {
        this.setState({
            [name]: e.target.value
        });
        alert(e.target.name);
        alert(e.target.id);
        alert(e.target.value);

    }

    // for multi select
    valueChangeMulti(e, name) {
        console.log(e);
        // alert(e.length);
        // alert(value[0].label + "  ----  " + value[0].value);
        
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

        console.log(this.state.selectedOption)
        console.log("=============")
        // console.log(`Option selected:`, school_id);
        console.log(this.state.school_id);
        // console.log(this.state.school_id.value);
    };
    

    // handleOnSubmit = e => {
    //     e.preventDefault();
    //     // pass form data
    //     // get it from state
    //     const formData = {};
    //     this.finallySubmit(formData);
    //   };

    finallySubmit = formData => {
        alert("Form submitted!");
    };


    handleValidation(){
        // check each required state
        let errors = {};
        let formIsValid = true;
        console.log("showing csa_prompts")
        console.log(this.state.csa_prompts);
        if(this.state.csa_prompts === '') {
            formIsValid = false;
            alert("csa_prompts is not selected");
            errors["csa_prompts"] = "Cannot be empty";
            alert(errors["csa_prompts"]);
        }

        // //Name
        // if(!fields["name"]){
        //   formIsValid = false;
        //   errors["name"] = "Cannot be empty";
        // }
    
        this.setState({errors: errors});
        alert(this.state.errors);
        return formIsValid;
    }

    handleSubmit(event) {
        // event.preventDefault();
        // const data = new FormData(event.target);
        // console.log(data.get('participantScore'));

        fetch('/api/form-submit-url', {
            method: 'POST',
            // body: data,
        });
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
                                <Row>
                                    <Col md="6">
                                        <Card className="main-card mb-6">
                                            <CardHeader>
                                                <i className="header-icon lnr-license icon-gradient bg-plum-plate"> </i>
                                                <b>Stakeholder Meetings</b>
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
                                                <span class="errorMessage"><u>Errors: <br/></u> Form has some errors. Please check for reqired and invalid fields.<br/></span>
                                                </div>

                                                <br/>
                                                <Form id="testForm">
                                                <fieldset >
                                                    <TabContent activeTab={this.state.activeTab}>
                                                        <TabPane tabId="1">
                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup inline>
                                                                    {/* TODO: autopopulate current date */}
                                                                        <Label for="date_start" >Form Date</Label>
                                                                        <Input type="date" name="date_start" id="date_start" value={this.state.date_start} onChange={(e) => {this.inputChange(e, "date_start")}} required/>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup>
                                                                        <Label for="province" >Province</Label> <span class="errorMessage">{this.state.errors["province"]}</span>
                                                                        <Select id="province"
                                                                            name="province"
                                                                            value={selectedOption}
                                                                            onChange={this.handleChange}
                                                                            options={options}
                                                                        />
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6">
                                                                    <FormGroup> 
                                                                        <Label for="district" >District</Label> <span class="errorMessage">{this.state.errors["district"]}</span>
                                                                        <Select id="district"
                                                                            name="district"
                                                                            value={selectedOption}
                                                                            onChange={this.handleChange}
                                                                            options={options}
                                                                        />
                                                                    </FormGroup>
                                                                </Col>

                                                            </Row>

                                                            <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="meeting_venue" >Meeting Venue</Label> <span class="errorMessage">{this.state.errors["meeting_venue"]}</span>
                                                                        <Input name="meeting_venue" id="meeting_venue" value={this.state.meeting_venue} maxLength="200" placeholder="Enter text"/>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="aahung_staff" >Aahung Staff Members</Label> <span class="errorMessage">{this.state.errors["aahung_staff"]}</span>
                                                                        <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e, "aahung_staff")} value={this.state.aahung_staff} id="aahung_staff" options={staffUsers} required/>
                                                                    </FormGroup>                                                                    
                                                                </Col>

                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="meeting_participants_type" >Type of Participants</Label> <span class="errorMessage">{this.state.errors["meeting_participants_type"]}</span>
                                                                        <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e, "meeting_participants_type")} value={this.state.aahung_staff} id="aahung_staff" options={participantTypeOptions} />
                                                                    </FormGroup>                                                                    
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="meeting_participants_type_other" >Specify Other</Label> <span class="errorMessage">{this.state.errors["meeting_participants_type_other"]}</span>
                                                                        <Input name="meeting_participants_type_other" id="meeting_participants_type_other" value={this.state.meeting_participants_type_other} maxLength="200" placeholder="Enter text"/>
                                                                    </FormGroup>                                                                    
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="meeting_government_num" >Number of Goverment </Label>  <span class="errorMessage">{this.state.errors["meeting_government_num"]}</span>
                                                                        <Input type="number" value={this.state.meeting_government_num} name="meeting_government_num" id="meeting_government_num" onChange={(e) => {this.inputChange(e, "meeting_government_num")}} max="999" min="1" onInput = {(e) =>{ e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,3)}} placeholder="Enter count in numbers"></Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="meeting_policy_maker_num" >Number of Policy Makers</Label>  <span class="errorMessage">{this.state.errors["meeting_policy_maker_num"]}</span>
                                                                        <Input type="number" value={this.state.meeting_policy_maker_num} name="meeting_policy_maker_num" id="meeting_policy_maker_num" onChange={(e) => {this.inputChange(e, "meeting_policy_maker_num")}} max="999" min="1" onInput = {(e) =>{ e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,3)}} placeholder="Enter count in numbers"></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="meeting_tac_num" >Number of TAC</Label>  <span class="errorMessage">{this.state.errors["meeting_tac_num"]}</span>
                                                                        <Input type="number" value={this.state.meeting_tac_num} name="meeting_tac_num" id="meeting_tac_num" onChange={(e) => {this.inputChange(e, "meeting_tac_num")}} max="999" min="1" onInput = {(e) =>{ e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,3)}} placeholder="Enter count in numbers"></Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="meeting_ngo_num" >Number of NGOs</Label>  <span class="errorMessage">{this.state.errors["meeting_ngo_num"]}</span>
                                                                        <Input type="number" value={this.state.meeting_ngo_num} name="meeting_ngo_num" id="meeting_ngo_num" onChange={(e) => {this.inputChange(e, "meeting_ngo_num")}} max="999" min="1" onInput = {(e) =>{ e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,3)}} placeholder="Enter count in numbers"></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            
                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="meeting_school_partner_num" >Number of School Partners</Label>  <span class="errorMessage">{this.state.errors["meeting_tac_num"]}</span>
                                                                        <Input type="number" value={this.state.meeting_school_partner_num} name="meeting_school_partner_num" id="meeting_school_partner_num" onChange={(e) => {this.inputChange(e, "meeting_school_partner_num")}} max="999" min="1" onInput = {(e) =>{ e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,3)}} placeholder="Enter count in numbers"></Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="meeting_other_num" >Number of Other</Label>  <span class="errorMessage">{this.state.errors["meeting_other_num"]}</span>
                                                                        <Input type="number" value={this.state.meeting_other_num} name="meeting_other_num" id="meeting_other_num" onChange={(e) => {this.inputChange(e, "meeting_other_num")}} max="999" min="1" onInput = {(e) =>{ e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,3)}} placeholder="Enter count in numbers"></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="meeting_purpose">Purpose of Meeting</Label> <span class="errorMessage">{this.state.errors["meeting_purpose"]}</span>
                                                                        <Input type="textarea" name="text" value={this.state.meeting_purpose} id="meeting_purpose" maxLength="400" placeholder="Enter text"/>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>


                                                            <Row>
                                                                <Col md="6">
                                                                <FormGroup >
                                                                        <Label for="meeting_topic">Topics Covered</Label> <span class="errorMessage">{this.state.errors["meeting_topic"]}</span>
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "meeting_topic")} value={this.state.meeting_topic} name="meeting_topic" id="meeting_topic">
                                                                            <option value="advocacy">Advocacy</option>
                                                                            <option value="school_partnership">School Partnership</option>
                                                                            <option value="Trainings">Trainings</option>
                                                                            <option value="others">Other</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="meeting_topic_other" >Specify Other</Label> <span class="errorMessage">{this.state.errors["meeting_topic_other"]}</span>
                                                                        <Input name="meeting_topic_other" id="meeting_topic_other" value={this.state.meeting_topic_other} maxLength="200" placeholder="Enter text"/>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            
                                                        </TabPane>
                                                    </TabContent>
                                                    </fieldset>
                                                </Form>

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
                                                            >Form</Button>  

                                                        </ButtonGroup> */}
                                                    </Col>
                                                    <Col md="3">
                                                    </Col>
                                                    <Col md="3">
                                                    </Col>
                                                    <Col md="3">
                                                        {/* <div className="btn-actions-pane-left"> */}
                                                        <Button className="mb-2 mr-2" color="success" size="sm" type="submit" onClick={this.handleSubmit} disabled={setDisable}>Submit</Button>
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
                            </Container>

                        </div>
                    </ReactCSSTransitionGroup>
                </Fragment>

            </div>
        );
    }
}

export default StakeholderMeeting;