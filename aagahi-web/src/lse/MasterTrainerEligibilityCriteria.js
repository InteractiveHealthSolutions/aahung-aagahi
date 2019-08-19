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

const sessionTopicOptions = [
    { value: 'understanding_family', label: 'Understanding Family' },
    { value: 'healthy_relationships', label: 'Healthy Relationships' },
    { value: 'gender_one', label: 'Gender I' },
    { value: 'gender_two', label: 'Gender II' },
    { value: 'violence', label: 'Violence' },
    { value: 'safe_use_icts', label: 'Safe Use of ICTs' },
    { value: 'puberty', label: 'Puberty' },
    { value: 'body_image', label: 'Body Image' },
    { value: 'child_early_forced_marriages', label: 'Child Early and Forced Marriages' },
    { value: 'financial_literacy', label: 'Financial Literacy' },
    { value: 'other', label: 'Other' }, 
    
];

const programTrainingOptions = [
    { value: 'csa', label: 'CSA' },
    { value: 'lsbe', label: 'LSBE' },
];

const programNominationOptions = [
    { value: 'csa', label: 'CSA' },
    { value: 'lsbe', label: 'LSBE' },
];

class MasterTrainerEligibilityCriteria extends React.Component {

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
                                                <b>Primary Monitoring Form - New</b>
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
                                                                        <Label for="date_start" >Form Date</Label>
                                                                        <Input type="date" name="date_start" id="date_start" value={this.state.date_start} onChange={(e) => {this.inputChange(e, "date_start")}} required/>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>    
                                                                <Col md="6">
                                                                
                                                                    <FormGroup >
                                                                        <Label for="school_id" >School ID</Label>
                                                                        <Select id="school_id"
                                                                            name="school_id"
                                                                            value={this.state.school_id}
                                                                            onChange={(e) => this.handleChange(e, "school_id")}
                                                                            options={options}
                                                                        />
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="school_name" >School Name</Label>
                                                                        <Input name="school_name" id="school_name" value={this.state.school_name} />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            
                                                        <Row>
                                                            <Col md="6">
                                                                <FormGroup>
                                                                    <Label for="participant_name" >Name of Candidate</Label>
                                                                    <Select id="participant_name"
                                                                        name="participant_name"
                                                                        value={selectedOption}
                                                                        onChange={this.handleChange}
                                                                        options={options}
                                                                    />
                                                                </FormGroup>
                                                            </Col>

                                                            <Col md="6">
                                                                <FormGroup >
                                                                    <Label for="participant_id" >Teacher ID</Label>
                                                                    <Input name="participant_id" id="participant_id" value={this.state.participant_id} disabled/>
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col md="6">
                                                                <FormGroup >
                                                                    <Label for="candidate_program_training" >Aahung program candidate has been trained on</Label>
                                                                    <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e, "candidate_program_training")} value={this.state.candidate_program_training} id="candidate_program_training" options={programTrainingOptions} required/>
                                                                </FormGroup>                                                                    
                                                            </Col>
                                                            
                                                            <Col md="6">
                                                                <FormGroup >
                                                                    <Label for="candidate_program_nomination" >Aahung program candidate is being nominated as Master Trainer for</Label>
                                                                    <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e, "candidate_program_nomination")} value={this.state.candidate_program_nomination} id="candidate_program_nomination" options={programNominationOptions} />
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col md="6">
                                                                <FormGroup >
                                                                    <Label for="evaluated_by" >Evaluated By</Label>
                                                                    <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e, "evaluated_by")} value={this.state.evaluated_by} id="evaluated_by" options={evaluators} />
                                                                </FormGroup>                                                                    
                                                            </Col>
                                                        </Row>
                                                        
                                                        <Row>
                                                            <Col md="6">
                                                                <Label><h6><u><b>Eligibility Criteria</b></u></h6></Label>
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="candidate_willingness" >Candidate is willing to become a Master Trainer for this school</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="candidate_willingness" id="yes" value="1" onChange={(e) => this.calculateScore(e, "candidate_willingness")} />{' '}
                                                                                    Yes
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="candidate_willingness" id="no" value="0" onChange={(e) => this.calculateScore(e, "candidate_willingness")} />{' '}
                                                                                    No
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["candidate_willingness"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col md="12">
                                                                <FormGroup >
                                                                    <Label for="candidate_work_continuation" >Candidate is likely to continue working at this school for the next 2-4 years</Label>
                                                                    <FormGroup tag="fieldset" row>
                                                                        <Col >
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="candidate_work_continuation" id="yes" value="1" onChange={(e) => this.calculateScore(e, "candidate_work_continuation")} />{' '}
                                                                                Yes
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="candidate_work_continuation" id="no" value="0" onChange={(e) => this.calculateScore(e, "candidate_work_continuation")} />{' '}
                                                                                No
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <span class="errorMessage">{this.state.errors["candidate_work_continuation"]}</span>
                                                                        </Col>
                                                                    </FormGroup>
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col md="12">
                                                                <FormGroup >
                                                                    <Label for="candidate_trained_teaching_2y" >Candidate is trained in Aahung’s CSA/LSBE program and has been teaching the course for at least 2 years in school</Label>
                                                                    <FormGroup tag="fieldset" row>
                                                                        <Col >
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="candidate_trained_teaching_2y" id="yes" value="1" onChange={(e) => this.calculateScore(e, "candidate_trained_teaching_2y")} />{' '}
                                                                                Yes
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="candidate_trained_teaching_2y" id="no" value="0" onChange={(e) => this.calculateScore(e, "candidate_trained_teaching_2y")} />{' '}
                                                                                No
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <span class="errorMessage">{this.state.errors["candidate_trained_teaching_2y"]}</span>
                                                                        </Col>
                                                                    </FormGroup>
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col md="12">
                                                                <FormGroup >
                                                                    <Label for="candidate_program_interest" >Candidate demonstrates a strong interest in leading and sustaining the CSA/LSBE program in this school through their dedication in teaching this program</Label>
                                                                    <FormGroup tag="fieldset" row>
                                                                        <Col >
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="candidate_program_interest" id="yes" value="1" onChange={(e) => this.calculateScore(e, "candidate_program_interest")} />{' '}
                                                                                Yes
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="candidate_program_interest" id="no" value="0" onChange={(e) => this.calculateScore(e, "candidate_program_interest")} />{' '}
                                                                                No
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <span class="errorMessage">{this.state.errors["candidate_program_interest"]}</span>
                                                                        </Col>
                                                                    </FormGroup>
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>
                                                        
                                                        <Row>
                                                            <Col md="12">
                                                                <FormGroup >
                                                                    <Label for="candidate_leadership" >Candidate possesses strong leadership skills and has the ability to work in a team</Label>
                                                                    <FormGroup tag="fieldset" row>
                                                                        <Col >
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="candidate_leadership" id="yes" value="1" onChange={(e) => this.calculateScore(e, "candidate_leadership")} />{' '}
                                                                                Yes
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="candidate_leadership" id="no" value="0" onChange={(e) => this.calculateScore(e, "candidate_leadership")} />{' '}
                                                                                No
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <span class="errorMessage">{this.state.errors["candidate_leadership"]}</span>
                                                                        </Col>
                                                                    </FormGroup>
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>
                                                            
                                                        <Row>
                                                            <Col md="12">
                                                                <FormGroup >
                                                                    <Label for="candidate_training_skill" >Candidate is capable of replicating Aahung’s 6 day CSA/LSBE training with other teachers in this school</Label>
                                                                    <FormGroup tag="fieldset" row>
                                                                        <Col >
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="candidate_training_skill" id="yes" value="1" onChange={(e) => this.calculateScore(e, "candidate_training_skill")} />{' '}
                                                                                Yes
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="candidate_training_skill" id="no" value="0" onChange={(e) => this.calculateScore(e, "candidate_training_skill")} />{' '}
                                                                                No
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <span class="errorMessage">{this.state.errors["candidate_training_skill"]}</span>
                                                                        </Col>
                                                                    </FormGroup>
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>
                                                        
                                                        <Row>
                                                            <Col md="12">
                                                                <FormGroup >
                                                                    <Label for="candidate_session_conduction_skills" >Candidate is capable of conducting regular parent and teacher sensitization sessions related to Aahung’s CSA/LSBE program</Label>
                                                                    <FormGroup tag="fieldset" row>
                                                                        <Col >
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="candidate_session_conduction_skills" id="yes" value="1" onChange={(e) => this.calculateScore(e, "candidate_session_conduction_skills")} />{' '}
                                                                                Yes
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="candidate_session_conduction_skills" id="no" value="0" onChange={(e) => this.calculateScore(e, "candidate_session_conduction_skills")} />{' '}
                                                                                No
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <span class="errorMessage">{this.state.errors["candidate_session_conduction_skills"]}</span>
                                                                        </Col>
                                                                    </FormGroup>
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>


                                                        <Row>
                                                            <Col md="6">
                                                                <FormGroup className="monitoringScoreBox">
                                                                    <Label for="mt_eligibility_score" style={{color: "green"}}><b>Cumulative Eligibility Score</b></Label>
                                                                    <Input value={this.state.mt_eligibility_score} name="mt_eligibility_score" id="mt_eligibility_score"  onChange={(e) => {this.inputChange(e, "mt_eligibility_score")}} ></Input>
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md="6">
                                                                <FormGroup className="monitoringScoreBox">
                                                                    {/* TODO: apply style to hide this based on csa/primary question */}
                                                                    <Label for="mt_eligibility_score_pct" style={{color: "green"}}><b>% Score</b></Label>
                                                                    <Input name="mt_eligibility_score_pct" id="mt_eligibility_score_pct" value={this.state.mt_eligibility_score_pct} onChange={(e) => {this.inputChange(e, "mt_eligibility_score_pct")}} ></Input>
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>

                                                        {/* onChange={(e) => {this.inputChange(e, "defined_student_pickup_responsibility")}} */}

                                                        <Row>
                                                            <Col md="12">
                                                                <FormGroup >
                                                                    <Label for="mt_eligible" >Final Decision - Selected as Master Trainer?</Label>
                                                                    <FormGroup tag="fieldset" row>
                                                                        <Col >
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="mt_eligible" id="yes" value="1" onChange={(e) => {this.inputChange(e, "mt_eligible")}} />{' '}
                                                                                Yes
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="mt_eligible" id="no" value="0" onChange={(e) => {this.inputChange(e, "mt_eligible")}} />{' '}
                                                                                No
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <span class="errorMessage">{this.state.errors["mt_eligible"]}</span>
                                                                        </Col>
                                                                    </FormGroup>
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

export default MasterTrainerEligibilityCriteria;