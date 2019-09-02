/**
 * @author Tahira Niazi
 * @email tahira.niazi@ihsinformatics.com
 * @create date 2019-08-16 17:32:02
 * @modify date 2019-08-16 17:32:05
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
import { getObject } from "../util/AahungUtil.js";
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
    { value: 'khileahi', label: 'Karachi Learning High School' },
    { value: 'khibahcol', label: 'Bahria College Karsaz' },
    { value: 'khihbpub', label: 'Habib Public School' },
];

const monitors = [
    { value: 'uuid1', label: 'Harry Potter' },
    { value: 'uuid2', label: 'Ron Weasley' },
    { value: 'uuid3', label: 'Hermione Granger' },
    { value: 'uuid4', label: 'Albus Dumbledore' },
];

const new_activities_options = [
    { value: 'new_activities', label: 'New activities' },
    { value: 'additional_probes', label: 'Additional Probes' },
    { value: 'additional_information', label: 'Additional Information' },
    { value: 'additional_videos', label: 'Additional videos' },
];

const csa_subject_options = [
    { value: 'health', label: 'Health' },
    { value: 'gender', label: 'Gender' },
    { value: 'csa', label: 'CSA' },
    { value: 'implementation_feedback', label: 'Implementation Feedback' },
];

const lsbe_subject_options = [
    { value: 'vcat', label: 'VCAT' },
    { value: 'human_rights', label: 'Human Rights' },
    { value: 'gender_equality', label: 'Gender Equality' },
    { value: 'sexual_health_rights', label: 'Sexual Health and Rights' },
    { value: 'violence', label: 'Violence' },
    { value: 'puberty', label: 'Puberty' },
    { value: 'implementation_feedback', label: 'Implementation Feedback' },
];

class MasterTrainerMockSessionEvaluation extends React.Component {

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
            mt_program_evaluated: '',
            lsbe_level_evaluated: 'level_1',
            lsbe_level_1 : 'communication',
            lsbe_level_2: 'effective_communication',
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

        this.programType = '';
        this.isLevel1 = true;
        this.isLevel2 = false;
        this.isLevel1Communication =  true;
        this.isLevel1Values =  false;
        this.isLevel1Gender =  false;
        this.isLevel1Self =  false;
        this.isLevel1Peer =  false;
        this.isLevel1Puberty =  false;
        this.isLevel2Effective =  false;
        this.isLevel2Gender =  false;
        this.isLevel2Puberty =  false;
        this.isLevel2Youth =  false;
        this.isLevel2Maternal =  false;
        this.isLevel2Hiv =  false;
        this.isLevel2Violence =  false;


        this.cancelCheck = this.cancelCheck.bind(this);
        this.callModal = this.callModal.bind(this);
        this.valueChangeMulti = this.valueChangeMulti.bind(this);
        this.valueChange = this.valueChange.bind(this);
        this.calculateScore = this.calculateScore.bind(this);
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

        // this will be fetched from school 
        this.setState({ mt_program_evaluated:  "csa"});
        this.programType = "csa";
        // alert(this.programType);
        
        // if(this.programType === "lsbe") {
        //     alert("it's lsbe");
        // }



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
        console.log(getObject('khyber_pakhtunkhwa', schools, 'value'));
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


    // for single select
    valueChange = (e, name) => {
        this.setState ({sex : e.target.value });
        this.setState ({sex : e.target.value });
        this.setState({
            [name]: e.target.value
        });

        if(e.target.id === "mt_program_evaluated") {
            if(e.target.value === "csa") {
                this.programType = "csa";
            }
            else if(e.target.value === "lsbe") {
                this.programType = "lsbe";
            }
        }

        if(name === "lsbe_level_evaluated") {
                this.isLevel1 = e.target.value === "level_1" ? true : false;
                this.isLevel2 = e.target.value === "level_2" ? true : false;

                this.isLevel1Communication = e.target.value === "level_1" ? true : false;
                this.isLevel2Effective = e.target.value === "level_2" ? true : false;
                
        }

        if(name === "lsbe_level_1") {

        
            this.isLevel1Communication = e.target.value === "communication" ? true : false; 
            this.isLevel1Values = e.target.value === "values" ? true : false; 
            this.isLevel1Gender = e.target.value === "gender" ? true : false; 
            this.isLevel1Self = e.target.value === "self_protection" ? true : false; 
            this.isLevel1Peer = e.target.value === "peer_pressure" ? true : false; 
            this.isLevel1Puberty = e.target.value === "puberty" ? true : false; 
            
            // level 2 field should be hidden
            this.isLevel2Effective = false; 
            this.isLevel2Youth = false; 
            this.isLevel2Gender = false; 
            this.isLevel2Maternal = false; 
            this.isLevel2Hiv =  false; 
            this.isLevel2Violence = false; 
            this.isLevel2Puberty = false; 
            
        }

        if(name === "lsbe_level_2") {

            if(e.target.value === "effective_communication") {
                this.isLevel2Effective =  true;
            }
            else {
                this.isLevel2Effective =  true;
            }

            this.isLevel2Effective = e.target.value === "effective_communication" ? true : false; 
            this.isLevel2Youth = e.target.value === "youth_and_family" ? true : false; 
            this.isLevel2Gender = e.target.value === "gender" ? true : false; 
            this.isLevel2Maternal = e.target.value === "maternal_child_health" ? true : false; 
            this.isLevel2Hiv = e.target.value === "hiv_aids" ? true : false; 
            this.isLevel2Violence = e.target.value === "violence" ? true : false; 
            this.isLevel2Puberty = e.target.value === "puberty" ? true : false; 

            // level 1 fields should be hidden
            this.isLevel1Communication = false; 
            this.isLevel1Values = false; 
            this.isLevel1Gender = false; 
            this.isLevel1Self = false; 
            this.isLevel1Peer = false; 
            this.isLevel1Puberty = false;
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
    };


    handleValidation(){
        // check each required state
        let errors = {};
        let formIsValid = true;
        console.log("showing csa_prompts")
        console.log(this.state.csa_prompts);
        if(this.state.csa_prompts === '') {
            formIsValid = false;
            errors["csa_prompts"] = "Cannot be empty";
        }

        // //Name
        // if(!fields["name"]){
        //   formIsValid = false;
        //   errors["name"] = "Cannot be empty";
        // }
    
        this.setState({errors: errors});
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
        const lsbeStyle = this.programType === "lsbe" ? {} : { display: 'none' };
        const csaStyle = this.programType === "csa" ? {} : { display: 'none' };
        const level1Style = this.isLevel1 ? {} : { display: 'none' };
        const level2Style = this.isLevel2 ? {} : { display: 'none' };

        // styles for level 1
        const level1CommunicationStyle = this.isLevel1Communication ? {} : { display: 'none' };
        const level1ValuesStyle = this.isLevel1Values ? {} : { display: 'none' };
        const level1GenderStyle = this.isLevel1Gender ? {} : { display: 'none' };
        const level1SelfStyle = this.isLevel1Self ? {} : { display: 'none' };
        const level1PeerStyle = this.isLevel1Peer ? {} : { display: 'none' };
        const level1PubertyStyle = this.isLevel1Puberty ? {} : { display: 'none' };

        // styles for level 2
        const level2EffectiveStyle = this.isLevel2Effective ? {} : { display: 'none' };
        const level2YouthStyle = this.isLevel2Youth ? {} : { display: 'none' };
        const level2GenderStyle = this.isLevel2Gender ? {} : { display: 'none' };
        const level2MaternalStyle = this.isLevel2Maternal ? {} : { display: 'none' };
        const level2HivStyle = this.isLevel2Hiv ? {} : { display: 'none' };
        const level2ViolenceStyle = this.isLevel2Violence ? {} : { display: 'none' };
        const level2PubertyStyle = this.isLevel2Puberty ? {} : { display: 'none' };




        // for view mode
        const setDisable = this.state.viewMode ? "disabled" : "";
        
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
                                                <b>Master Trainer Mock Session Evaluation</b>
                                                {/* <p style={{fontSize: "10px"}}>This is the form in the LSE component to be filled by LSE Monitors.</p> */}
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
                                                                    <FormGroup>
                                                                        <Label for="province" >Province</Label>
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
                                                                        <Label for="district" >District</Label>
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
                                                                        <Input name="school_name" id="school_name" value={this.state.school_name} disabled/>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="monitor">Monitored By</Label>
                                                                        <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e, "monitor")} value={this.state.monitor} id="monitor" options={monitors} required/>
                                                                    </FormGroup>
                                                                    
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup> 
                                                                    { /* Single Select */ }
                                                                    {/* TODO: skip logic, Show if step_down_program_monitored = CSA */}
                                                                        <Label for="participant_name" >Name of Teacher</Label>
                                                                        <Select id="participant_name"
                                                                            name="participant_name"
                                                                            value={this.state.participant_name}
                                                                            onChange={(e) => this.handleChange(e, "participant_name")}
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
                                                                {/* TODO: autopopulate from school */}
                                                                        <Label for="school_level" >Level of Program</Label>
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "school_level")} value={this.state.school_level} name="school_level" id="school_level">
                                                                            <option>Primary</option>
                                                                            <option>Secondary</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                    
                                                            </Col>
                                                            
                                                            <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="mt_program_evaluated" >Type of program being evaluated</Label>
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "mt_program_evaluated")} value={this.state.mt_program_evaluated} name="mt_program_evaluated" id="mt_program_evaluated">
                                                                            <option value="csa">CSA</option>
                                                                            <option value="lsbe">LSBE</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row> 

                                                            

                                                        </TabPane>
                                                        
                                                        <TabPane tabId="2" id="csa">
                                                            <Row>
                                                                <Col md="6">
                                                                    <Label><h6><u><b>CSA Program</b></u></h6></Label>
                                                                </Col>
                                                            </Row>

                                                            <Row>                                                                
                                                                <Col md="6">
                                                                    <FormGroup>
                                                                        {/* TODO: skip logic, Show if mt_program_evaluated = CSA */}
                                                                        <Label for="csa_mt_num">CSA Flashcard being run</Label>
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "mt_csa_flashcard")} value={this.state.mt_csa_flashcard} name="mt_csa_flashcard" id="mt_csa_flashcard">
                                                                            <option value="one">1</option>
                                                                            <option value="two">2</option>
                                                                            <option value="three">3</option>
                                                                            <option value="four">4</option>
                                                                            <option value="five">5</option>
                                                                            <option value="six">6</option>
                                                                            <option value="seven">7</option>
                                                                            <option value="eight">8</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="mt_csa_prompts" >Master Trainer is using the prompts provided in the CSA flashcard guide</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_prompts" id="strongly_disagree" value="1" onChange={(e) => this.calculateScore(e, "mt_csa_prompts")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_prompts" id="disagree" value="2" onChange={(e) => this.calculateScore(e, "mt_csa_prompts")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_prompts" id="neither" value="3" onChange={(e) => this.calculateScore(e, "mt_csa_prompts")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_prompts" id="agree" value="4" onChange={(e) => this.calculateScore(e, "mt_csa_prompts")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_prompts" id="strongly_agree" value="5" onChange={(e) => this.calculateScore(e, "mt_csa_prompts")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["mt_csa_prompts"]}</span>
                                                                            </Col>
                                                                    </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                                
                                                            </Row>

                                                            <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="mt_csa_flashcard_objective" >Master Trainer is meeting the objective of their flashcard even if they are not using all prompts provided in the CSA flashcard guide</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_flashcard_objective" id="strongly_disagree" value="1" onChange={(e) => this.calculateScore(e, "mt_csa_flashcard_objective")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_flashcard_objective" id="disagree" value="2" onChange={(e) => this.calculateScore(e, "mt_csa_flashcard_objective")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_flashcard_objective" id="neither" value="3" onChange={(e) => this.calculateScore(e, "mt_csa_flashcard_objective")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_flashcard_objective" id="agree" value="4" onChange={(e) => this.calculateScore(e, "mt_csa_flashcard_objective")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_flashcard_objective" id="strongly_agree" value="5" onChange={(e) => this.calculateScore(e, "mt_csa_flashcard_objective")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["mt_csa_flashcard_objective"]}</span>
                                                                            </Col>
                                                                    </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="mt_csa_understanding" >Master Trainer shows good understanding of the message of the flashcard</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_understanding" id="strongly_disagree" value="1" onChange={(e) => this.calculateScore(e, "mt_csa_understanding")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_understanding" id="disagree" value="2"  onChange={(e) => this.calculateScore(e, "mt_csa_understanding")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_understanding" id="neither" value="3" onChange={(e) => this.calculateScore(e, "mt_csa_understanding")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_understanding" id="agree" value="4" onChange={(e) => this.calculateScore(e, "mt_csa_understanding")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_understanding" id="strongly_agree" value="5" onChange={(e) => this.calculateScore(e, "mt_csa_understanding")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["mt_csa_understanding"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="mt_csa_subject_comfort" >Master Trainer is comfortable speaking about this subject</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_subject_comfort" id="strongly_disagree" value="1" onChange={(e) => this.calculateScore(e, "mt_csa_subject_comfort")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_subject_comfort" id="disagree" value="2"  onChange={(e) => this.calculateScore(e, "mt_csa_subject_comfort")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_subject_comfort" id="neither" value="3" onChange={(e) => this.calculateScore(e, "mt_csa_subject_comfort")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_subject_comfort" id="agree" value="4" onChange={(e) => this.calculateScore(e, "mt_csa_subject_comfort")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_subject_comfort" id="strongly_agree" value="5" onChange={(e) => this.calculateScore(e, "mt_csa_subject_comfort")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["mt_csa_subject_comfort"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="mt_csa_nonjudmental_tone" >Master Trainer uses a non-judgmental tone while facilitating the session</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_nonjudmental_tone" id="strongly_disagree" value="1" onChange={(e) => this.calculateScore(e, "mt_csa_nonjudmental_tone")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_nonjudmental_tone" id="disagree" value="2" onChange={(e) => this.calculateScore(e, "mt_csa_nonjudmental_tone")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_nonjudmental_tone" id="neither" value="3" onChange={(e) => this.calculateScore(e, "mt_csa_nonjudmental_tone")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_nonjudmental_tone" id="agree" value="4" onChange={(e) => this.calculateScore(e, "mt_csa_nonjudmental_tone")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_nonjudmental_tone" id="strongly_agree" value="5" onChange={(e) => this.calculateScore(e, "mt_csa_nonjudmental_tone")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["mt_csa_nonjudmental_tone"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="mt_csa_impartial_opinions" >Master Trainer is not imposing their own values or opinions on the participants</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_impartial_opinions" id="strongly_disagree" value="1" onChange={(e) => this.calculateScore(e, "mt_csa_impartial_opinions")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_impartial_opinions" id="disagree" value="2" onChange={(e) => this.calculateScore(e, "mt_csa_impartial_opinions")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_impartial_opinions" id="neither" value="3" onChange={(e) => this.calculateScore(e, "mt_csa_impartial_opinions")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_impartial_opinions" id="agree" value="4" onChange={(e) => this.calculateScore(e, "mt_csa_impartial_opinions")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_impartial_opinions" id="strongly_agree" value="5" onChange={(e) => this.calculateScore(e, "mt_csa_impartial_opinions")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["mt_csa_impartial_opinions"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="mt_csa_probing_style" >Master Trainer is leading participants to the main message of the flashcard through probes and not providing the message to participants in a lecture style presentation</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_probing_style" id="strongly_disagree" value="1" onChange={(e) => this.calculateScore(e, "mt_csa_probing_style")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_probing_style" id="disagree" value="2" onChange={(e) => this.calculateScore(e, "mt_csa_probing_style")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_probing_style" id="neither" value="3" onChange={(e) => this.calculateScore(e, "mt_csa_probing_style")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_probing_style" id="agree" value="4" onChange={(e) => this.calculateScore(e, "mt_csa_probing_style")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_probing_style" id="strongly_agree" value="5" onChange={(e) => this.calculateScore(e, "mt_csa_probing_style")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["mt_csa_probing_style"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row >
                                                                <Col md="6">
                                                                    <FormGroup className="monitoringScoreBox">
                                                                        <Label for="mt_mock_score" style={{color: "green"}}><b>Cumulative MT Mock Session Score</b></Label>
                                                                        <Input value={this.state.mt_mock_score} name="mt_mock_score" id="mt_mock_score" onChange={(e) => {this.inputChange(e, "mt_mock_score")}} ></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup className="monitoringScoreBox">
                                                                        {/* TODO: apply style to hide this based on csa/primary question */}
                                                                        <Label for="mt_mock_score_pct" style={{color: "green"}}><b>% Score</b></Label>
                                                                        <Input name="mt_mock_score_pct" id="mt_mock_score_pct" value={this.state.mt_mock_score_pct} onChange={(e) => {this.inputChange(e, "mt_mock_score_pct")}} ></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                        </TabPane>

                                                        <TabPane tabId="3" id="lsbe">
                                                        <Row>
                                                            <Col md="6">
                                                                
                                                                        <Label><h6><u><b>LSBE Program</b></u></h6></Label>
                                                                
                                                            </Col>

                                                        </Row>

                                                        <Row>
                                                            <Col md="6">
                                                                <FormGroup >
                                                                    <Label for="lsbe_level_evaluated" >LSBE Level</Label> <span class="errorMessage">{this.state.errors["lsbe_level_evaluated"]}</span>
                                                                    <Input type="select" onChange={(e) => this.valueChange(e, "lsbe_level_evaluated")} value={this.state.lsbe_level_evaluated} name="lsbe_level_evaluated" id="lsbe_level_evaluated" required>
                                                                        {/* TODO: apply skip logic */}
                                                                        <option value="level_1">Level 1</option>
                                                                        <option value="level_2">Level 2</option>
                                                                    </Input>
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>


                                                        <Row>
                                                            <Col md="6" style={level1Style}>
                                                                    <FormGroup >
                                                                        <Label for="lsbe_level_1" >Subject Master Trainer is facilitating</Label> <span class="errorMessage">{this.state.errors["lsbe_level_1"]}</span>
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "lsbe_level_1")} value={this.state.lsbe_level_1} name="lsbe_level_1" id="lsbe_level_1" required>
                                                                            {/* TODO: apply skip logic */}
                                                                            <option value="communication">Communication</option>
                                                                            <option value="values">Values</option>
                                                                            <option value="gender">Gender</option>
                                                                            <option value="self_protection">Self-Protection</option>
                                                                            <option value="peer_pressure">Peer Pressure</option>
                                                                            <option value="puberty">Puberty</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col md="6" style={level2Style}>
                                                                    <FormGroup >
                                                                        <Label for="lsbe_level_2" >Subject Master Trainer is facilitating</Label> <span class="errorMessage">{this.state.errors["lsbe_level_2"]}</span>
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "lsbe_level_2")} value={this.state.lsbe_level_2} name="lsbe_level_2" id="lsbe_level_2" required>
                                                                            {/* TODO: apply skip logic */}
                                                                            <option value="effective_communication">Effective Communication</option>
                                                                            <option value="gender">Gender</option>
                                                                            <option value="puberty">Puberty</option>
                                                                            <option value="youth_and_family">Youth and Family</option>
                                                                            <option value="maternal_child_health">Maternal and Child Health</option>
                                                                            <option value="hiv_aids">HIV/AIDS</option>
                                                                            <option value="violence">Violence</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                </Col>
                                                        </Row>


                                                            <Row>
                                                                <Col md="12" style={level1CommunicationStyle}>
                                                                    <FormGroup >
                                                                        <Label for="imp_communication" >Master Trainer was able to effectively relay the importance of communication</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                {/* TODO: fill UUIDs */}
                                                                                <Label check>
                                                                                    <Input type="radio" name="imp_communication" id="strongly_disagree" value="1" onChange={(e) => this.calculateScore(e, "imp_communication")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="imp_communication" id="disagree" value="2"  onChange={(e) => this.calculateScore(e, "imp_communication")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="imp_communication" id="neither" value="3" onChange={(e) => this.calculateScore(e, "imp_communication")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="imp_communication" id="agree" value="4" onChange={(e) => this.calculateScore(e, "imp_communication")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="imp_communication" id="strongly_agree" value="5" onChange={(e) => this.calculateScore(e, "imp_communication")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["imp_communication"]}</span>
                                                                            </Col>
                                                                    </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                                
                                                            </Row>

                                                            <Row>
                                                            <Col md="12" style={level1ValuesStyle}>
                                                                    <FormGroup >
                                                                        <Label for="def_values" >Master Trainer was able to effectively define values</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="def_values" id="strongly_disagree" value="1"  onChange={(e) => this.calculateScore(e, "def_values")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="def_values" id="disagree" value="2"  onChange={(e) => this.calculateScore(e, "def_values")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="def_values" id="neither" value="3" onChange={(e) => this.calculateScore(e, "def_values")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="def_values" id="agree" value="4" onChange={(e) => this.calculateScore(e, "def_values")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="def_values" id="strongly_agree" value="5" onChange={(e) => this.calculateScore(e, "def_values")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["def_values"]}</span>
                                                                            </Col>
                                                                    </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12" style={level1GenderStyle}>
                                                                    <FormGroup >
                                                                        <Label for="diff_sex_gender" >Master Trainer was able to correctly differentiate between sex and gender</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="diff_sex_gender" id="strongly_disagree" value="1" onChange={(e) => this.calculateScore(e, "diff_sex_gender")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="diff_sex_gender" id="disagree" value="2"  onChange={(e) => this.calculateScore(e, "diff_sex_gender")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="diff_sex_gender" id="neither" value="3" onChange={(e) => this.calculateScore(e, "diff_sex_gender")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="diff_sex_gender" id="agree" value="4" onChange={(e) => this.calculateScore(e, "diff_sex_gender")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="diff_sex_gender" id="strongly_agree" value="5"  onChange={(e) => this.calculateScore(e, "diff_sex_gender")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["diff_sex_gender"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12" style={level1SelfStyle}>
                                                                    <FormGroup >
                                                                        <Label for="explain_self_protection" >Master Trainer was able to correctly explain methods of self-protection</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="explain_self_protection" id="strongly_disagree" value="1" onChange={(e) => this.calculateScore(e, "explain_self_protection")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="explain_self_protection" id="disagree" value="2" onChange={(e) => this.calculateScore(e, "explain_self_protection")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="explain_self_protection" id="neither" value="3" onChange={(e) => this.calculateScore(e, "explain_self_protection")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="explain_self_protection" id="agree" value="4" onChange={(e) => this.calculateScore(e, "explain_self_protection")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="explain_self_protection" id="strongly_agree" value="5" onChange={(e) => this.calculateScore(e, "explain_self_protection")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["explain_self_protection"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12" style={level1PeerStyle}>
                                                                    <FormGroup >
                                                                        <Label for="explain_peer_pressure" >Master Trainer was able to correctly explain peer pressure and its impacts</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="explain_peer_pressure" id="strongly_disagree" value="1" onChange={(e) => this.calculateScore(e, "explain_peer_pressure")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="explain_peer_pressure" id="disagree" value="2"  onChange={(e) => this.calculateScore(e, "explain_peer_pressure")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="explain_peer_pressure" id="neither" value="3" onChange={(e) => this.calculateScore(e, "explain_peer_pressure")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="explain_peer_pressure" id="agree" value="4" onChange={(e) => this.calculateScore(e, "explain_peer_pressure")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="explain_peer_pressure" id="strongly_agree" value="5" onChange={(e) => this.calculateScore(e, "explain_peer_pressure")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["explain_peer_pressure"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12" style={level1PubertyStyle}>
                                                                    <FormGroup >
                                                                        <Label for="explain_puberty" >Master Trainer was able to clearly explain changes that occur during puberty for boys and girls</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                            <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="explain_puberty" id="strongly_disagree" value="1" onChange={(e) => this.calculateScore(e, "explain_puberty")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="explain_puberty" id="disagree" value="2"  onChange={(e) => this.calculateScore(e, "explain_puberty")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="explain_puberty" id="neither" value="3" onChange={(e) => this.calculateScore(e, "explain_puberty")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="explain_puberty" id="agree" value="4" onChange={(e) => this.calculateScore(e, "explain_puberty")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="explain_puberty" id="strongly_agree" value="5" onChange={(e) => this.calculateScore(e, "explain_puberty")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["explain_puberty"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12">
                                                                    <FormGroup style={level2EffectiveStyle}>
                                                                        <Label for="imp_communicaton_l2" >level 2: Master Trainer was able to effectively relay the importance of communication</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                            <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="imp_communicaton_l2" id="strongly_disagree" value="1" onChange={(e) => this.calculateScore(e, "imp_communicaton_l2")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="imp_communicaton_l2" id="disagree" value="2"  onChange={(e) => this.calculateScore(e, "imp_communicaton_l2")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="imp_communicaton_l2" id="neither" value="3" onChange={(e) => this.calculateScore(e, "imp_communicaton_l2")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="imp_communicaton_l2" id="agree" value="4" onChange={(e) => this.calculateScore(e, "imp_communicaton_l2")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="imp_communicaton_l2" id="strongly_agree" value="5" onChange={(e) => this.calculateScore(e, "imp_communicaton_l2")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["imp_communicaton_l2"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12" style={level2EffectiveStyle}>
                                                                    <FormGroup >
                                                                        <Label for="describe_communication_comp" >Master Trainer has effectively described the different components of communication and their importance</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                            <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="describe_communication_comp" id="strongly_disagree" value="1" onChange={(e) => this.calculateScore(e, "describe_communication_comp")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="describe_communication_comp" id="disagree" value="2"  onChange={(e) => this.calculateScore(e, "describe_communication_comp")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="describe_communication_comp" id="neither" value="3" onChange={(e) => this.calculateScore(e, "describe_communication_comp")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="describe_communication_comp" id="agree" value="4" onChange={(e) => this.calculateScore(e, "describe_communication_comp")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="describe_communication_comp" id="strongly_agree" value="5" onChange={(e) => this.calculateScore(e, "describe_communication_comp")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["describe_communication_comp"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12" style={level2GenderStyle}>
                                                                    <FormGroup >
                                                                        <Label for="diff_sex_gender_l2" >Master Trainer was able to correctly differentiate between sex and gender</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                            <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="diff_sex_gender_l2" id="strongly_disagree" value="1" onChange={(e) => this.calculateScore(e, "diff_sex_gender_l2")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="diff_sex_gender_l2" id="disagree" value="2"  onChange={(e) => this.calculateScore(e, "diff_sex_gender_l2")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="diff_sex_gender_l2" id="neither" value="3" onChange={(e) => this.calculateScore(e, "diff_sex_gender_l2")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="diff_sex_gender_l2" id="agree" value="4" onChange={(e) => this.calculateScore(e, "diff_sex_gender_l2")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="diff_sex_gender_l2" id="strongly_agree" value="5" onChange={(e) => this.calculateScore(e, "diff_sex_gender_l2")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["diff_sex_gender_l2"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>                                                            

                                                            <Row>
                                                            <Col md="12" style={level2GenderStyle}>
                                                                    <FormGroup >
                                                                        <Label for="explain_gender_norm_sterotypes" >Master Trainer has clearly explained gender norms and stereotypes and their impact</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                            <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="explain_gender_norm_sterotypes" id="strongly_disagree" value="1" onChange={(e) => this.calculateScore(e, "explain_gender_norm_sterotypes")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="explain_gender_norm_sterotypes" id="disagree" value="2"  onChange={(e) => this.calculateScore(e, "explain_gender_norm_sterotypes")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="explain_gender_norm_sterotypes" id="neither" value="3" onChange={(e) => this.calculateScore(e, "explain_gender_norm_sterotypes")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="explain_gender_norm_sterotypes" id="agree" value="4" onChange={(e) => this.calculateScore(e, "explain_gender_norm_sterotypes")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="explain_gender_norm_sterotypes" id="strongly_agree" value="5" onChange={(e) => this.calculateScore(e, "explain_gender_norm_sterotypes")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["explain_gender_norm_sterotypes"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12" style={level2GenderStyle}>
                                                                    <FormGroup >
                                                                        <Label for="gender_discrimination_impact" >Master Trainer has accurately described gender discrimination and its impact</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                            <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_discrimination_impact" id="strongly_disagree" value="1" onChange={(e) => this.calculateScore(e, "gender_discrimination_impact")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_discrimination_impact" id="disagree" value="2"  onChange={(e) => this.calculateScore(e, "gender_discrimination_impact")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_discrimination_impact" id="neither" value="3" onChange={(e) => this.calculateScore(e, "gender_discrimination_impact")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_discrimination_impact" id="agree" value="4" onChange={(e) => this.calculateScore(e, "gender_discrimination_impact")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_discrimination_impact" id="strongly_agree" value="5" onChange={(e) => this.calculateScore(e, "gender_discrimination_impact")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["gender_discrimination_impact"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12" style={level2PubertyStyle}>
                                                                    <FormGroup >
                                                                        <Label for="explain_puberty_l2" >Master Trainer was able to clearly explain changes that occur during puberty for boys and girls</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                            <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="explain_puberty_l2" id="strongly_disagree" value="1" onChange={(e) => this.calculateScore(e, "explain_puberty_l2")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="explain_puberty_l2" id="disagree" value="2"  onChange={(e) => this.calculateScore(e, "explain_puberty_l2")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="explain_puberty_l2" id="neither" value="3" onChange={(e) => this.calculateScore(e, "explain_puberty_l2")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="explain_puberty_l2" id="agree" value="4" onChange={(e) => this.calculateScore(e, "explain_puberty_l2")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="explain_puberty_l2" id="strongly_agree" value="5" onChange={(e) => this.calculateScore(e, "explain_puberty_l2")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["explain_puberty_l2"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12" style={level2PubertyStyle}>
                                                                    <FormGroup >
                                                                        <Label for="myths_puberty" >Master Trainer has clearly explained and dispelled myths related to puberty in both boys and girls</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                            <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="myths_puberty" id="strongly_disagree" value="1" onChange={(e) => this.calculateScore(e, "myths_puberty")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="myths_puberty" id="disagree" value="2"  onChange={(e) => this.calculateScore(e, "myths_puberty")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="myths_puberty" id="neither" value="3" onChange={(e) => this.calculateScore(e, "myths_puberty")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="myths_puberty" id="agree" value="4" onChange={(e) => this.calculateScore(e, "myths_puberty")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="myths_puberty" id="strongly_agree" value="5" onChange={(e) => this.calculateScore(e, "myths_puberty")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["myths_puberty"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>                                                                                                                    

                                                            <Row>
                                                            <Col md="12" style={level2YouthStyle}>
                                                                    <FormGroup >
                                                                        <Label for="describe_nikah_nama" >Master Trainer has effectively described the nikah nama and its clauses</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                            <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="describe_nikah_nama" id="strongly_disagree" value="1" onChange={(e) => this.calculateScore(e, "describe_nikah_nama")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="describe_nikah_nama" id="disagree" value="2"  onChange={(e) => this.calculateScore(e, "describe_nikah_nama")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="describe_nikah_nama" id="neither" value="3" onChange={(e) => this.calculateScore(e, "describe_nikah_nama")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="describe_nikah_nama" id="agree" value="4" onChange={(e) => this.calculateScore(e, "describe_nikah_nama")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="describe_nikah_nama" id="strongly_agree" value="5" onChange={(e) => this.calculateScore(e, "describe_nikah_nama")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["describe_nikah_nama"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12" style={level2MaternalStyle}>
                                                                    <FormGroup >
                                                                        <Label for="descibe_maternal_mortality" >Master Trainer has accurately described the causes of maternal mortality</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                            <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="descibe_maternal_mortality" id="strongly_disagree" value="1" onChange={(e) => this.calculateScore(e, "descibe_maternal_mortality")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="descibe_maternal_mortality" id="disagree" value="2"  onChange={(e) => this.calculateScore(e, "descibe_maternal_mortality")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="descibe_maternal_mortality" id="neither" value="3" onChange={(e) => this.calculateScore(e, "descibe_maternal_mortality")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="descibe_maternal_mortality" id="agree" value="4" onChange={(e) => this.calculateScore(e, "descibe_maternal_mortality")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="descibe_maternal_mortality" id="strongly_agree" value="5" onChange={(e) => this.calculateScore(e, "descibe_maternal_mortality")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["descibe_maternal_mortality"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12" style={level2MaternalStyle}>
                                                                    <FormGroup >
                                                                        <Label for="link_age_maternal_health" >Master Trainer has clearly linked early age marriage with negative consequences in maternal health</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                            <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="link_age_maternal_health" id="strongly_disagree" value="1" onChange={(e) => this.calculateScore(e, "link_age_maternal_health")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="link_age_maternal_health" id="disagree" value="2"  onChange={(e) => this.calculateScore(e, "link_age_maternal_health")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="link_age_maternal_health" id="neither" value="3" onChange={(e) => this.calculateScore(e, "link_age_maternal_health")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="link_age_maternal_health" id="agree" value="4" onChange={(e) => this.calculateScore(e, "link_age_maternal_health")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="link_age_maternal_health" id="strongly_agree" value="5" onChange={(e) => this.calculateScore(e, "link_age_maternal_health")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["link_age_maternal_health"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12" style={level2HivStyle}>
                                                                    <FormGroup >
                                                                        <Label for="describe_hiv" >Master Trainer has correctly described HIV</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                            <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="describe_hiv" id="strongly_disagree" value="1" onChange={(e) => this.calculateScore(e, "describe_hiv")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="describe_hiv" id="disagree" value="2"  onChange={(e) => this.calculateScore(e, "describe_hiv")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="describe_hiv" id="neither" value="3" onChange={(e) => this.calculateScore(e, "describe_hiv")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="describe_hiv" id="agree" value="4" onChange={(e) => this.calculateScore(e, "describe_hiv")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="describe_hiv" id="strongly_agree" value="5" onChange={(e) => this.calculateScore(e, "describe_hiv")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["describe_hiv"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12" style={level2HivStyle}>
                                                                    <FormGroup >
                                                                        <Label for="describe_hiv_transmission" >Master Trainer has correctly described the modes of transmission of HIV</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                            <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="describe_hiv_transmission" id="strongly_disagree" value="1" onChange={(e) => this.calculateScore(e, "describe_hiv_transmission")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="describe_hiv_transmission" id="disagree" value="2"  onChange={(e) => this.calculateScore(e, "describe_hiv_transmission")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="describe_hiv_transmission" id="neither" value="3" onChange={(e) => this.calculateScore(e, "describe_hiv_transmission")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="describe_hiv_transmission" id="agree" value="4" onChange={(e) => this.calculateScore(e, "describe_hiv_transmission")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="describe_hiv_transmission" id="strongly_agree" value="5" onChange={(e) => this.calculateScore(e, "describe_hiv_transmission")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["describe_hiv_transmission"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12" style={level2HivStyle}>
                                                                    <FormGroup >
                                                                        <Label for="describe_hiv_prevention" >Master Trainer has correctly described HIV prevention strategies</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                            <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="describe_hiv_prevention" id="strongly_disagree" value="1" onChange={(e) => this.calculateScore(e, "describe_hiv_prevention")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="describe_hiv_prevention" id="disagree" value="2"  onChange={(e) => this.calculateScore(e, "describe_hiv_prevention")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="describe_hiv_prevention" id="neither" value="3" onChange={(e) => this.calculateScore(e, "describe_hiv_prevention")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="describe_hiv_prevention" id="agree" value="4" onChange={(e) => this.calculateScore(e, "describe_hiv_prevention")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="describe_hiv_prevention" id="strongly_agree" value="5" onChange={(e) => this.calculateScore(e, "describe_hiv_prevention")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["describe_hiv_prevention"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12" style={level2ViolenceStyle}>
                                                                    <FormGroup >
                                                                        <Label for="describe_violence_types" >Master Trainer has correctly described the different types of violence</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                            <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="describe_violence_types" id="strongly_disagree" value="1" onChange={(e) => this.calculateScore(e, "describe_violence_types")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="describe_violence_types" id="disagree" value="2"  onChange={(e) => this.calculateScore(e, "describe_violence_types")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="describe_violence_types" id="neither" value="3" onChange={(e) => this.calculateScore(e, "describe_violence_types")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="describe_violence_types" id="agree" value="4" onChange={(e) => this.calculateScore(e, "describe_violence_types")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="describe_violence_types" id="strongly_agree" value="5" onChange={(e) => this.calculateScore(e, "describe_violence_types")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["describe_violence_types"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12" style={level2PubertyStyle}>
                                                                    <FormGroup >
                                                                        <Label for="describe_violence_imapct" >Master Trainer has effectively described the impact of violence on an individual’s life</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                            <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="describe_violence_imapct" id="strongly_disagree" value="1" onChange={(e) => this.calculateScore(e, "describe_violence_imapct")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="describe_violence_imapct" id="disagree" value="2"  onChange={(e) => this.calculateScore(e, "describe_violence_imapct")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="describe_violence_imapct" id="neither" value="3" onChange={(e) => this.calculateScore(e, "describe_violence_imapct")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="describe_violence_imapct" id="agree" value="4" onChange={(e) => this.calculateScore(e, "describe_violence_imapct")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="describe_violence_imapct" id="strongly_agree" value="5" onChange={(e) => this.calculateScore(e, "describe_violence_imapct")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["describe_violence_imapct"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            
                                                            <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="mt_lsbe_prompts" >Master Trainer is actively using the training guide to aid in facilitation of content</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                            <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_prompts" id="strongly_disagree" value="1" onChange={(e) => this.calculateScore(e, "mt_lsbe_prompts")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_prompts" id="disagree" value="2"  onChange={(e) => this.calculateScore(e, "mt_lsbe_prompts")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_prompts" id="neither" value="3" onChange={(e) => this.calculateScore(e, "mt_lsbe_prompts")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_prompts" id="agree" value="4" onChange={(e) => this.calculateScore(e, "mt_lsbe_prompts")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_prompts" id="strongly_agree" value="5" onChange={(e) => this.calculateScore(e, "mt_lsbe_prompts")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["mt_lsbe_prompts"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="mt_lsbe_understanding" >Master Trainer demonstrates good understanding of the training content</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                            <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_understanding" id="strongly_disagree" value="1" onChange={(e) => this.calculateScore(e, "mt_lsbe_understanding")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_understanding" id="disagree" value="2"  onChange={(e) => this.calculateScore(e, "mt_lsbe_understanding")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_understanding" id="neither" value="3" onChange={(e) => this.calculateScore(e, "mt_lsbe_understanding")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_understanding" id="agree" value="4" onChange={(e) => this.calculateScore(e, "mt_lsbe_understanding")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_understanding" id="strongly_agree" value="5" onChange={(e) => this.calculateScore(e, "mt_lsbe_understanding")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["mt_lsbe_understanding"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="mt_material_prep" >Master Trainer had all materials prepared in advance for the session</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                            <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_material_prep" id="strongly_disagree" value="1" onChange={(e) => this.calculateScore(e, "mt_material_prep")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_material_prep" id="disagree" value="2"  onChange={(e) => this.calculateScore(e, "mt_material_prep")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_material_prep" id="neither" value="3" onChange={(e) => this.calculateScore(e, "mt_material_prep")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_material_prep" id="agree" value="4" onChange={(e) => this.calculateScore(e, "mt_material_prep")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_material_prep" id="strongly_agree" value="5" onChange={(e) => this.calculateScore(e, "mt_material_prep")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["mt_material_prep"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="mt_content_prep" >Master Trainer was well prepared in their facilitation of the content</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                            <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_content_prep" id="strongly_disagree" value="1" onChange={(e) => this.calculateScore(e, "mt_content_prep")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_content_prep" id="disagree" value="2"  onChange={(e) => this.calculateScore(e, "mt_content_prep")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_content_prep" id="neither" value="3" onChange={(e) => this.calculateScore(e, "mt_content_prep")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_content_prep" id="agree" value="4" onChange={(e) => this.calculateScore(e, "mt_content_prep")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_content_prep" id="strongly_agree" value="5" onChange={(e) => this.calculateScore(e, "mt_content_prep")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["mt_content_prep"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="mt_activity_time_allotment" >An appropriate amount of time is allotted to each activity and topic</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                            <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_activity_time_allotment" id="strongly_disagree" value="1" onChange={(e) => this.calculateScore(e, "mt_activity_time_allotment")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_activity_time_allotment" id="disagree" value="2"  onChange={(e) => this.calculateScore(e, "mt_activity_time_allotment")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_activity_time_allotment" id="neither" value="3" onChange={(e) => this.calculateScore(e, "mt_activity_time_allotment")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_activity_time_allotment" id="agree" value="4" onChange={(e) => this.calculateScore(e, "mt_activity_time_allotment")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_activity_time_allotment" id="strongly_agree" value="5" onChange={(e) => this.calculateScore(e, "mt_activity_time_allotment")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["mt_activity_time_allotment"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="mt_lsbe_subject_comfort" >Master Trainer is comfortable speaking about this subject</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                            <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_subject_comfort" id="strongly_disagree" value="1" onChange={(e) => this.calculateScore(e, "mt_lsbe_subject_comfort")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_subject_comfort" id="disagree" value="2"  onChange={(e) => this.calculateScore(e, "mt_lsbe_subject_comfort")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_subject_comfort" id="neither" value="3" onChange={(e) => this.calculateScore(e, "mt_lsbe_subject_comfort")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_subject_comfort" id="agree" value="4" onChange={(e) => this.calculateScore(e, "mt_lsbe_subject_comfort")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_subject_comfort" id="strongly_agree" value="5" onChange={(e) => this.calculateScore(e, "mt_lsbe_subject_comfort")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["mt_lsbe_subject_comfort"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="mt_lsbe_nonjudmental_tone" >Master Trainer uses a non-judgmental tone while facilitating the session</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                            <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_nonjudmental_tone" id="strongly_disagree" value="1" onChange={(e) => this.calculateScore(e, "mt_lsbe_nonjudmental_tone")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_nonjudmental_tone" id="disagree" value="2"  onChange={(e) => this.calculateScore(e, "mt_lsbe_nonjudmental_tone")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_nonjudmental_tone" id="neither" value="3" onChange={(e) => this.calculateScore(e, "mt_lsbe_nonjudmental_tone")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_nonjudmental_tone" id="agree" value="4" onChange={(e) => this.calculateScore(e, "mt_lsbe_nonjudmental_tone")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_nonjudmental_tone" id="strongly_agree" value="5" onChange={(e) => this.calculateScore(e, "mt_lsbe_nonjudmental_tone")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["mt_lsbe_nonjudmental_tone"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="mt_lsbe_impartial_opinions" >Master Trainer is not imposing their own values or opinions on the participants</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                            <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_impartial_opinions" id="strongly_disagree" value="1" onChange={(e) => this.calculateScore(e, "mt_lsbe_impartial_opinions")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_impartial_opinions" id="disagree" value="2"  onChange={(e) => this.calculateScore(e, "mt_lsbe_impartial_opinions")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_impartial_opinions" id="neither" value="3" onChange={(e) => this.calculateScore(e, "mt_lsbe_impartial_opinions")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_impartial_opinions" id="agree" value="4" onChange={(e) => this.calculateScore(e, "mt_lsbe_impartial_opinions")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_impartial_opinions" id="strongly_agree" value="5" onChange={(e) => this.calculateScore(e, "mt_lsbe_impartial_opinions")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["mt_lsbe_impartial_opinions"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            
                                                            <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="mt_lsbe_probing_style" >Master Trainer is engaging participants in discussion throughout session by providing probes</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                            <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_probing_style" id="strongly_disagree" value="1" onChange={(e) => this.calculateScore(e, "mt_lsbe_probing_style")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_probing_style" id="disagree" value="2"  onChange={(e) => this.calculateScore(e, "mt_lsbe_probing_style")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_probing_style" id="neither" value="3" onChange={(e) => this.calculateScore(e, "mt_lsbe_probing_style")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_probing_style" id="agree" value="4" onChange={(e) => this.calculateScore(e, "mt_lsbe_probing_style")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_probing_style" id="strongly_agree" value="5" onChange={(e) => this.calculateScore(e, "mt_lsbe_probing_style")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["mt_lsbe_probing_style"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>


                                                            <Row >
                                                                <Col md="6">
                                                                    <FormGroup className="monitoringScoreBox">
                                                                        <Label for="mt_mock_score" style={{color: "green"}}><b>Cumulative MT Mock Session Score</b></Label>
                                                                        <Input value={this.state.mt_mock_score} name="mt_mock_score" id="mt_mock_score" onChange={(e) => {this.inputChange(e, "mt_mock_score")}} ></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup className="monitoringScoreBox">
                                                                        {/* TODO: apply style to hide this based on csa/primary question */}
                                                                        <Label for="mt_mock_score_pct" style={{color: "green"}}><b>% Score</b></Label>
                                                                        <Input name="mt_mock_score_pct" id="mt_mock_score_pct" value={this.state.mt_mock_score_pct} onChange={(e) => {this.inputChange(e, "mt_mock_score_pct")}} ></Input>
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
                                                        {/* <div className="btn-actions-pane-left"> */}
                                                        <ButtonGroup size="sm">
                                                            <Button color="secondary" id="page1" 
                                                                className={"btn-shadow " + classnames({ active: this.state.activeTab === '1' })}
                                                                onClick={() => {
                                                                    this.toggle('1');
                                                                }}
                                                            >Form</Button>
                                                            <Button color="secondary" id="page_csa_a" style={csaStyle}
                                                                className={"btn-shadow " + classnames({ active: this.state.activeTab === '2' })}
                                                                onClick={() => {
                                                                    this.toggle('2');
                                                                }}
                                                            >CSA</Button>
                                                            <Button color="secondary" id="page_csa_b" style={lsbeStyle}
                                                                className={"btn-shadow " + classnames({ active: this.state.activeTab === '3' })}
                                                                onClick={() => {
                                                                    this.toggle('3');
                                                                }}
                                                            >LSBE</Button>
                                                        </ButtonGroup>
                                                        {/* </div> */}
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

export default MasterTrainerMockSessionEvaluation;