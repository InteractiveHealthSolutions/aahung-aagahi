/**
 * @author Tahira Niazi
 * @email tahira.niazi@ihsinformatics.com
 * @create date 2019-08-18 17:03:50
 * @modify date 2019-08-18 17:03:50
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
import { getObject } from "../util/AahungUtil.js";
import moment from 'moment';

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

const monitors = [
    { value: 'sindh', label: 'Sindh' },
    { value: 'punjab', label: 'Punjab' },
    { value: 'balochistan', label: 'Balochistan' },
    { value: 'khyber_pakhtunkhwa', label: 'Khyber Pakhtunkhwa' },
];

const new_activities_options = [
    { value: 'new_activities', label: 'New activities' },
    { value: 'additional_probes', label: 'Additional Probes' },
    { value: 'additional_information', label: 'Additional Information' },
    { value: 'additional_videos', label: 'Additional videos' },
];

const first_aid_kit_options = [
    { value: 'band_aids', label: 'Band-aids' },
    { value: 'sterile_gauze_dressings', label: 'Sterile Gauze Dressings' },
    { value: 'sticky_tape', label: 'Sticky Tape' },
    { value: 'disposable_sterile_gloves', label: 'Disposable Sterile Gloves' },
    { value: 'thermometer', label: 'Thermometer' },
    { value: 'antiseptic_wipes_or_cream', label: 'Antiseptic Wipes or Cream' },
    { value: 'pain_killers', label: 'Pain Killers' },
    { value: 'antihistamine_cream_or_tablets', label: 'Antihistamine Cream or Tablets' },];

class SrhrPolicy extends React.Component {

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
        this.inputChange = this.inputChange.bind(this);

        this.isPolicyImplemented = false;
    }

    componentDidMount() {

        // TODO: checking view mode, view mode will become active after the form is populated
        // this.setState({
            // school_id : getObject('khyber_pakhtunkhwa', schools, 'value'), // autopopulate in view: for single select autocomplete
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

        if(e.target.id === "primary_program_monitored")
        if(e.target.value === "csa") {
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
        
        if(name === "srhr_policy_implemented") {
            this.isPolicyImplemented = e.target.id === "yes" ? true : false; 
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
        const policyImplementedStyle = this.isPolicyImplemented ? {} : { display: 'none' };

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
                                                <b>SRHR Policy</b>
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
                                                                        <Input type="date" name="date_start" id="date_start" value={this.state.date_start} onChange={(e) => {this.inputChange(e, "date_start")}} max={moment().format("YYYY-MM-DD")} required/>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="monitor" >Monitored By</Label>
                                                                        <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e, "monitor")} value={this.state.monitor} id="monitor" options={monitors} required/>
                                                                    </FormGroup>
                                                                    
                                                                </Col>
                                                            </Row>
                                                            
                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="school_id" >School Name</Label>
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
                                                                        <Label for="program_implemented" >Type of program(s) implemented in school</Label>
                                                                        <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e)} value={this.state.program_implemented} id="program_implemented" options={programsImplemented} />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                <FormGroup >
                                                                        <Label for="school_tier" >School Tier</Label>
                                                                        <Input type="select" name="school_tier" id="school_tier">
                                                                            <option>New</option>
                                                                            <option>Running</option>
                                                                            <option>Exit</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="school_sex" >Classification of School by Sex</Label>
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "school_sex")} value={this.state.school_sex} name="school_sex" id="school_sex">
                                                                            <option value="girls">Girls</option>
                                                                            <option value="boys">Boys</option>
                                                                            <option value="coed">Co-ed</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            

                                                        </TabPane>
                                                        <TabPane tabId="2" id="lsbe">
                                                        <Row>
                                                            <Col md="6">
                                                                <Label><h6><u><b>SRHR Policy</b></u></h6></Label>
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="srhr_policy_implemented" >Has this school implemented the SRHR Policy Guidelines?</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="srhr_policy_implemented" id="yes" value="1" onChange={(e) => this.calculateScore(e, "srhr_policy_implemented")} />{' '}
                                                                                    Yes
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="srhr_policy_implemented" id="no" value="0"  onChange={(e) => this.calculateScore(e, "srhr_policy_implemented")} />{' '}
                                                                                    No
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["srhr_policy_implemented"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                        </Row>

                                                        <div style={policyImplementedStyle}>
                                                        <Row>
                                                            <Col md="6">
                                                                <Label><h6><u><b>1. Promotion of SRH Education in Schools</b></u></h6></Label>
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                                <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="srh_edu_resource_awareness">Students are aware of which teachers are trained on SRHR and are available for support</Label>
                                                                        <FormGroup tag="fieldset" row>  
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="srh_edu_resource_awareness" id="no_student_aware" value="1" onChange={(e) => this.calculateScore(e, "srh_edu_resource_awareness")} />{' '}
                                                                                    No student is aware
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="srh_edu_resource_awareness" id="very_few_aware" value="2" onChange={(e) => this.calculateScore(e, "srh_edu_resource_awareness")} />{' '}
                                                                                    Very few students are aware
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="srh_edu_resource_awareness" id="some_are_aware" value="3" onChange={(e) => this.calculateScore(e, "srh_edu_resource_awareness")} />{' '}
                                                                                    Some students are aware
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="srh_edu_resource_awareness" id="most_are_aware" value="4" onChange={(e) => this.calculateScore(e, "srh_edu_resource_awareness")} />{' '}
                                                                                    Most students are aware
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="srh_edu_resource_awareness" id="all_are_aware" value="5" onChange={(e) => this.calculateScore(e, "srh_edu_resource_awareness")} />{' '}
                                                                                    All students are aware
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["srh_edu_resource_awareness"]}</span>
                                                                            </Col>
                                                                    </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                        
                                                            <Row>
                                                                <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="srh_edu_teaching_safe_space" >School Management has created a safe and secure space where teachers trained on SRHR are able to teach and counsel students on SRHR issues</Label>
                                                                        <FormGroup tag="fieldset" row>  
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="srh_edu_teaching_safe_space" id="strongly_disagree" value="1" onChange={(e) => this.calculateScore(e, "srh_edu_teaching_safe_space")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="srh_edu_teaching_safe_space" id="disagree" value="2" onChange={(e) => this.calculateScore(e, "srh_edu_teaching_safe_space")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="srh_edu_teaching_safe_space" id="neither" value="3" onChange={(e) => this.calculateScore(e, "srh_edu_teaching_safe_space")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="srh_edu_teaching_safe_space" id="agree" value="4" onChange={(e) => this.calculateScore(e, "srh_edu_teaching_safe_space")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="srh_edu_teaching_safe_space" id="strongly_agree" value="5" onChange={(e) => this.calculateScore(e, "srh_edu_teaching_safe_space")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["srh_edu_teaching_safe_space"]}</span>
                                                                                </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>                                                        
                                                        
                                                            <Row>
                                                                <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="srh_training_iniative_mgmt" >School Management takes the initiative to organize capacity building training sessions for teachers on a needs basis</Label>
                                                                        <FormGroup tag="fieldset" row>  
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="srh_training_iniative_mgmt" id="strongly_disagree" value="1" onChange={(e) => this.calculateScore(e, "srh_training_iniative_mgmt")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="srh_training_iniative_mgmt" id="disagree" value="2" onChange={(e) => this.calculateScore(e, "srh_training_iniative_mgmt")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="srh_training_iniative_mgmt" id="neither" value="3" onChange={(e) => this.calculateScore(e, "srh_training_iniative_mgmt")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="srh_training_iniative_mgmt" id="agree" value="4" onChange={(e) => this.calculateScore(e, "srh_training_iniative_mgmt")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="srh_training_iniative_mgmt" id="strongly_agree" value="5" onChange={(e) => this.calculateScore(e, "srh_training_iniative_mgmt")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["srh_training_iniative_mgmt"]}</span>
                                                                                </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                        <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="" >Students have access to SRHR IEC materials within the school vicinity</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="srh_iec_material_access" id="yes" value="1" onChange={(e) => {this.inputChange(e, "srh_iec_material_access")}} />{' '}
                                                                                    Yes
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="srh_iec_material_access" id="no" value="0"  onChange={(e) => {this.inputChange(e, "srh_iec_material_access")}} />{' '}
                                                                                    No
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["srh_iec_material_access"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col md="12">
                                                                <FormGroup >
                                                                    <Label for="srh_gender_neutral_encouragement" >School encourages all students of all genders to be involved in extracurricular activities, such as sports and art</Label>
                                                                    <FormGroup tag="fieldset" row>  
                                                                        <Col >
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="srh_gender_neutral_encouragement" id="strongly_disagree" value="1" onChange={(e) => this.calculateScore(e, "srh_gender_neutral_encouragement")} />{' '}
                                                                                Strongly Disagree
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="srh_gender_neutral_encouragement" id="disagree" value="2" onChange={(e) => this.calculateScore(e, "srh_gender_neutral_encouragement")} />{' '}
                                                                                Disagree
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="srh_gender_neutral_encouragement" id="neither" value="3" onChange={(e) => this.calculateScore(e, "srh_gender_neutral_encouragement")} />{' '}
                                                                                Neither Agree nor Disagree
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="srh_gender_neutral_encouragement" id="agree" value="4" onChange={(e) => this.calculateScore(e, "srh_gender_neutral_encouragement")} />{' '}
                                                                                Agree
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="srh_gender_neutral_encouragement" id="strongly_agree" value="5" onChange={(e) => this.calculateScore(e, "srh_gender_neutral_encouragement")} />{' '}
                                                                                Strongly Agree
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <span class="errorMessage">{this.state.errors["srh_gender_neutral_encouragement"]}</span>
                                                                            </Col>
                                                                    </FormGroup>
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>
                                                        
                                                        <Row>
                                                            <Col md="6">
                                                                <Label><h6><u><b>2. Parental Involvement to Strengthen SRH Education Programs in Schools</b></u></h6></Label>
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col md="12">
                                                                <FormGroup >
                                                                    <Label for="srh_parent_involvement" >School Management involves parents in the SRHR programs through various activities throughout the school year</Label>
                                                                    <FormGroup tag="fieldset" row>  
                                                                        <Col >
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="srh_parent_involvement" id="strongly_disagree" value="1" onChange={(e) => this.calculateScore(e, "srh_parent_involvement")} />{' '}
                                                                                Strongly Disagree
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="srh_parent_involvement" id="disagree" value="2" onChange={(e) => this.calculateScore(e, "srh_parent_involvement")} />{' '}
                                                                                Disagree
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="srh_parent_involvement" id="neither" value="3" onChange={(e) => this.calculateScore(e, "srh_parent_involvement")} />{' '}
                                                                                Neither Agree nor Disagree
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="srh_parent_involvement" id="agree" value="4" onChange={(e) => this.calculateScore(e, "srh_parent_involvement")} />{' '}
                                                                                Agree
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="srh_parent_involvement" id="strongly_agree" value="5" onChange={(e) => this.calculateScore(e, "srh_parent_involvement")} />{' '}
                                                                                Strongly Agree
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <span class="errorMessage">{this.state.errors["srh_parent_involvement"]}</span>
                                                                            </Col>
                                                                    </FormGroup>
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="srh_parent_sensitization" >Parents are sensitized on the SRHR curriculum and implementation of SRHR policies on an annual basis</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="srh_parent_sensitization" id="yes" value="1" onChange={(e) => this.calculateScore(e, "srh_parent_sensitization")} />{' '}
                                                                                    Yes
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="srh_parent_sensitization" id="no" value="0"  onChange={(e) => this.calculateScore(e, "srh_parent_sensitization")} />{' '}
                                                                                    No
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["srh_parent_sensitization"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="srh_parent_child_update" >Parents are updated on their child’s progress regarding the SRHR classes during parent teacher meetings</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="srh_parent_child_update" id="yes" value="1" onChange={(e) => this.calculateScore(e, "srh_parent_child_update")} />{' '}
                                                                                    Yes
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="srh_parent_child_update" id="no" value="0"  onChange={(e) => this.calculateScore(e, "srh_parent_child_update")} />{' '}
                                                                                    No
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["srh_parent_child_update"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col md="12">
                                                                <FormGroup >
                                                                    <Label for="srh_parent_group_encouragement" >School Management and teachers encourage the formation and role of parent groups in school and support them in their initiatives</Label>
                                                                    <FormGroup tag="fieldset" row>  
                                                                        <Col >
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="srh_parent_group_encouragement" id="strongly_disagree" value="1" onChange={(e) => this.calculateScore(e, "srh_parent_group_encouragement")} />{' '}
                                                                                Strongly Disagree
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="srh_parent_group_encouragement" id="disagree" value="2" onChange={(e) => this.calculateScore(e, "srh_parent_group_encouragement")} />{' '}
                                                                                Disagree
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="srh_parent_group_encouragement" id="neither" value="3" onChange={(e) => this.calculateScore(e, "srh_parent_group_encouragement")} />{' '}
                                                                                Neither Agree nor Disagree
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="srh_parent_group_encouragement" id="agree" value="4" onChange={(e) => this.calculateScore(e, "srh_parent_group_encouragement")} />{' '}
                                                                                Agree
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="srh_parent_group_encouragement" id="strongly_agree" value="5" onChange={(e) => this.calculateScore(e, "srh_parent_group_encouragement")} />{' '}
                                                                                Strongly Agree
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <span class="errorMessage">{this.state.errors["srh_parent_group_encouragement"]}</span>
                                                                            </Col>
                                                                    </FormGroup>
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col md="6">
                                                                <Label><h6><u><b>3. Provision of Psychosocial Services to Address Students’ SRHR and Other Issues</b></u></h6></Label>
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="counselling_services" >Safe and secure spaces are available in the school where counselling can take place</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="counselling_services" id="yes" value="1" onChange={(e) => this.calculateScore(e, "counselling_services")} />{' '}
                                                                                    Yes
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="counselling_services" id="no" value="0"  onChange={(e) => this.calculateScore(e, "counselling_services")} />{' '}
                                                                                    No
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["counselling_services"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="certified_counsellor" >Counselors at this school are trained and certified by a reputable organization</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="certified_counsellor" id="yes" value="1" onChange={(e) => this.calculateScore(e, "certified_counsellor")} />{' '}
                                                                                    Yes
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="certified_counsellor" id="no" value="0"  onChange={(e) => this.calculateScore(e, "certified_counsellor")} />{' '}
                                                                                    No
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["certified_counsellor"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                        </Row>                                                

                                                        <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="student_counselling_services_awareness" >Students are aware of the counselling services offered</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="student_counselling_services_awareness" id="yes" value="1" onChange={(e) => this.calculateScore(e, "student_counselling_services_awareness")} />{' '}
                                                                                    Yes
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="student_counselling_services_awareness" id="no" value="0"  onChange={(e) => this.calculateScore(e, "student_counselling_services_awareness")} />{' '}
                                                                                    No
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["student_counselling_services_awareness"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col md="12">
                                                                <FormGroup >
                                                                    <Label for="srh_guide_usage" >School Management and counselors use the Referral Guide provided by Aahung when needed</Label>
                                                                    <FormGroup tag="fieldset" row>  
                                                                        <Col >
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="srh_guide_usage" id="never" value="1" onChange={(e) => this.calculateScore(e, "srh_guide_usage")} />{' '}
                                                                                Never
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="srh_guide_usage" id="rarely" value="2" onChange={(e) => this.calculateScore(e, "srh_guide_usage")} />{' '}
                                                                                Rarely
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="srh_guide_usage" id="occasionally" value="3" onChange={(e) => this.calculateScore(e, "srh_guide_usage")} />{' '}
                                                                                Occasionally
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="srh_guide_usage" id="frequently" value="4" onChange={(e) => this.calculateScore(e, "srh_guide_usage")} />{' '}
                                                                                Frequently
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="srh_guide_usage" id="always" value="5" onChange={(e) => this.calculateScore(e, "srh_guide_usage")} />{' '}
                                                                                Always
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <span class="errorMessage">{this.state.errors["srh_guide_usage"]}</span>
                                                                            </Col>
                                                                    </FormGroup>
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col md="12">
                                                                <FormGroup >
                                                                    <Label for="counselling_urgent_case_reported" >Counselors inform management about any cases that require urgent attention</Label>
                                                                    <FormGroup tag="fieldset" row>  
                                                                        <Col >
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="counselling_urgent_case_reported" id="never" value="1" onChange={(e) => this.calculateScore(e, "counselling_urgent_case_reported")} />{' '}
                                                                                Never
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="counselling_urgent_case_reported" id="rarely" value="2" onChange={(e) => this.calculateScore(e, "counselling_urgent_case_reported")} />{' '}
                                                                                Rarely
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="counselling_urgent_case_reported" id="occasionally" value="3" onChange={(e) => this.calculateScore(e, "counselling_urgent_case_reported")} />{' '}
                                                                                Occasionally
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="counselling_urgent_case_reported" id="frequently" value="4" onChange={(e) => this.calculateScore(e, "counselling_urgent_case_reported")} />{' '}
                                                                                Frequently
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="counselling_urgent_case_reported" id="always" value="5" onChange={(e) => this.calculateScore(e, "counselling_urgent_case_reported")} />{' '}
                                                                                Always
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <span class="errorMessage">{this.state.errors["counselling_urgent_case_reported"]}</span>
                                                                            </Col>
                                                                    </FormGroup>
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col md="6">
                                                                <Label><h6><u><b>4. Provision of First Aid Management</b></u></h6></Label>
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col md="12">
                                                            <FormGroup >
                                                            {/* Coding: number of items selected */}
                                                                    <Label for="first_aid_kit" >This school has a proper First Aid kit that includes the following:</Label> <span class="errorMessage">{this.state.errors["first_aid_kit"]}</span>
                                                                    <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e, "first_aid_kit")} value={this.state.first_aid_kit} id="first_aid_kit" options={first_aid_kit_options} />
                                                            </FormGroup>
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col md="12">
                                                                <FormGroup >
                                                                        <Label for="first_aid_focal_person" >There is a focal person for medical care who has First Aid training and is responsible for the First Aid kit</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="first_aid_focal_person" id="yes" value="1" onChange={(e) => this.calculateScore(e, "first_aid_focal_person")} />{' '}
                                                                                    Yes
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="first_aid_focal_person" id="no" value="0"  onChange={(e) => this.calculateScore(e, "first_aid_focal_person")} />{' '}
                                                                                    No
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["first_aid_focal_person"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>                                                            
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                        <Col md="12">
                                                                <FormGroup >
                                                                        <Label for="first_aid_kit_refill" >There is a focal person for medical care who has First Aid training and is responsible for the First Aid kit</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="first_aid_kit_refill" id="yes" value="1" onChange={(e) => this.calculateScore(e, "first_aid_kit_refill")} />{' '}
                                                                                    Yes
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="first_aid_kit_refill" id="no" value="0"  onChange={(e) => this.calculateScore(e, "first_aid_kit_refill")} />{' '}
                                                                                    No
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["first_aid_kit_refill"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>                                                            
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col md="12">
                                                                <FormGroup >
                                                                    <Label for="srh_guide_usage" >The focal person for medical care informs management about any cases that require urgent attention</Label>
                                                                    <FormGroup tag="fieldset" row>  
                                                                        <Col >
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="first_aid_urgent_case_reported" id="never" value="1" onChange={(e) => this.calculateScore(e, "first_aid_urgent_case_reported")} />{' '}
                                                                                Never
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="first_aid_urgent_case_reported" id="rarely" value="2" onChange={(e) => this.calculateScore(e, "first_aid_urgent_case_reported")} />{' '}
                                                                                Rarely
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="first_aid_urgent_case_reported" id="occasionally" value="3" onChange={(e) => this.calculateScore(e, "first_aid_urgent_case_reported")} />{' '}
                                                                                Occasionally
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="first_aid_urgent_case_reported" id="frequently" value="4" onChange={(e) => this.calculateScore(e, "first_aid_urgent_case_reported")} />{' '}
                                                                                Frequently
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="first_aid_urgent_case_reported" id="always" value="5" onChange={(e) => this.calculateScore(e, "first_aid_urgent_case_reported")} />{' '}
                                                                                Always
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <span class="errorMessage">{this.state.errors["first_aid_urgent_case_reported"]}</span>
                                                                            </Col>
                                                                    </FormGroup>
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col md="6">
                                                                <Label><h6><u><b>5. Improving Menstrual Hygiene Management in Schools</b></u></h6></Label>
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                        <Col md="12">
                                                                <FormGroup >
                                                                        <Label for="mhm_kit" >The school has a menstrual hygiene management (MHM) kit readily available for students and teachers that includes necessary items such as soap, pads and underwear</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mhm_kit" id="yes" value="1" onChange={(e) => this.calculateScore(e, "mhm_kit")} />{' '}
                                                                                    Yes
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mhm_kit" id="no" value="0"  onChange={(e) => this.calculateScore(e, "mhm_kit")} />{' '}
                                                                                    No
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["mhm_kit"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>                                                            
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                        <Col md="12">
                                                                <FormGroup >
                                                                        <Label for="mhm_focal_person" >There is a focal person who oversees the maintenance of the MHM kit</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mhm_focal_person" id="yes" value="1" onChange={(e) => this.calculateScore(e, "mhm_focal_person")} />{' '}
                                                                                    Yes
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mhm_focal_person" id="no" value="0"  onChange={(e) => this.calculateScore(e, "mhm_focal_person")} />{' '}
                                                                                    No
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["mhm_focal_person"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>                                                            
                                                            </Col>
                                                        </Row> 

                                                        <Row>
                                                        <Col md="12">
                                                                <FormGroup >
                                                                        <Label for="mhm_kit_refill" >The MHM kit is checked on a monthly basis and is regularly refilled</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mhm_kit_refill" id="yes" value="1" onChange={(e) => this.calculateScore(e, "mhm_kit_refill")} />{' '}
                                                                                    Yes
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mhm_kit_refill" id="no" value="0"  onChange={(e) => this.calculateScore(e, "mhm_kit_refill")} />{' '}
                                                                                    No
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["mhm_kit_refill"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>                                                            
                                                            </Col>
                                                        </Row>   
                                                        
                                                        <Row>
                                                            <Col md="6">
                                                                <Label><h6><u><b>6. Provision of Safe, Clean and Hygienic Food and Water Sanitation</b></u></h6></Label>
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                        <Col md="12">
                                                                <FormGroup >
                                                                        <Label for="clean_drinking_water_access" >Teachers and students have access to clean drinking water</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="clean_drinking_water_access" id="yes" value="1" onChange={(e) => this.calculateScore(e, "clean_drinking_water_access")} />{' '}
                                                                                    Yes
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="clean_drinking_water_access" id="no" value="0"  onChange={(e) => this.calculateScore(e, "clean_drinking_water_access")} />{' '}
                                                                                    No
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["clean_drinking_water_access"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>                                                            
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                        <Col md="12">
                                                                <FormGroup >
                                                                        <Label for="clean_food_consumption_space_access" >Teachers and students have access to a hygienic space where food can be consumed</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="clean_food_consumption_space_access" id="yes" value="1" onChange={(e) => this.calculateScore(e, "clean_food_consumption_space_access")} />{' '}
                                                                                    Yes
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="clean_food_consumption_space_access" id="no" value="0"  onChange={(e) => this.calculateScore(e, "clean_food_consumption_space_access")} />{' '}
                                                                                    No
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["clean_food_consumption_space_access"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>                                                            
                                                            </Col>
                                                        </Row> 

                                                        <Row>
                                                        <Col md="12">
                                                                <FormGroup >
                                                                        <Label for="sanitation_facilities_access" >Teachers and students have easy access to safe, clean and hygienic sanitation facilities</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="sanitation_facilities_access" id="yes" value="1" onChange={(e) => this.calculateScore(e, "sanitation_facilities_access")} />{' '}
                                                                                    Yes
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="sanitation_facilities_access" id="no" value="0"  onChange={(e) => this.calculateScore(e, "sanitation_facilities_access")} />{' '}
                                                                                    No
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["sanitation_facilities_access"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>                                                            
                                                            </Col>
                                                        </Row>

                                                            <Row>
                                                                <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="toilet_assist_staff_trained" >Support staff hired to assist primary school children with going to the toilet are trained on appropriate use of language and cleaning techniques</Label>
                                                                        <FormGroup tag="fieldset" row>  
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="toilet_assist_staff_trained" id="strongly_disagree" value="1" onChange={(e) => this.calculateScore(e, "toilet_assist_staff_trained")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="toilet_assist_staff_trained" id="disagree" value="2" onChange={(e) => this.calculateScore(e, "toilet_assist_staff_trained")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="toilet_assist_staff_trained" id="neither" value="3" onChange={(e) => this.calculateScore(e, "toilet_assist_staff_trained")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="toilet_assist_staff_trained" id="agree" value="4" onChange={(e) => this.calculateScore(e, "toilet_assist_staff_trained")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_prompts" id="toilet_assist_staff_trained" value="5" onChange={(e) => this.calculateScore(e, "toilet_assist_staff_trained")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["toilet_assist_staff_trained"]}</span>
                                                                                </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                        <Row>
                                                        <Col md="12">
                                                                <FormGroup >
                                                                        <Label for="separate_toilets" >Toilets for boys and girls are separate</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="separate_toilets" id="yes" value="1" onChange={(e) => this.calculateScore(e, "separate_toilets")} />{' '}
                                                                                    Yes
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="separate_toilets" id="no" value="0"  onChange={(e) => this.calculateScore(e, "separate_toilets")} />{' '}
                                                                                    No
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["separate_toilets"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>                                                            
                                                            </Col>
                                                        </Row>
                                                        
                                                        <Row>
                                                        <Col md="12">
                                                                <FormGroup >
                                                                        <Label for="close_proximity_toilets" >Toilets are within close proximity to the classrooms</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="close_proximity_toilets" id="yes" value="1" onChange={(e) => this.calculateScore(e, "close_proximity_toilets")} />{' '}
                                                                                    Yes
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="close_proximity_toilets" id="no" value="0"  onChange={(e) => this.calculateScore(e, "close_proximity_toilets")} />{' '}
                                                                                    No
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["close_proximity_toilets"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>                                                            
                                                            </Col>
                                                        </Row>

                                                    <Row>
                                                        <Col md="12">
                                                                <FormGroup >
                                                                        <Label for="toilet_permission_given" >Teachers allow students to go to the toilet when they request permission</Label>
                                                                        <FormGroup tag="fieldset" row>  
                                                                        <Col >
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="toilet_permission_given" id="never" value="1" onChange={(e) => this.calculateScore(e, "toilet_permission_given")} />{' '}
                                                                                Never
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="toilet_permission_given" id="rarely" value="2" onChange={(e) => this.calculateScore(e, "toilet_permission_given")} />{' '}
                                                                                Rarely
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="toilet_permission_given" id="occasionally" value="3" onChange={(e) => this.calculateScore(e, "toilet_permission_given")} />{' '}
                                                                                Occasionally
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="toilet_permission_given" id="frequently" value="4" onChange={(e) => this.calculateScore(e, "toilet_permission_given")} />{' '}
                                                                                Frequently
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="toilet_permission_given" id="always" value="5" onChange={(e) => this.calculateScore(e, "toilet_permission_given")} />{' '}
                                                                                Always
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <span class="errorMessage">{this.state.errors["toilet_permission_given"]}</span>
                                                                            </Col>
                                                                    </FormGroup>
                                                                </FormGroup>                                                            
                                                            </Col>
                                                        </Row>

                                                            <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="well_equipped_toilets">Toilets are well equipped with clean water, soap, tissue paper, toilet rolls and dust-bins</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="well_equipped_toilets" id="strongly_disagree" value="1" onChange={(e) => this.calculateScore(e, "well_equipped_toilets")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="well_equipped_toilets" id="disagree" value="2" onChange={(e) => this.calculateScore(e, "well_equipped_toilets")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="well_equipped_toilets" id="neither" value="3" onChange={(e) => this.calculateScore(e, "well_equipped_toilets")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="well_equipped_toilets" id="agree" value="4" onChange={(e) => this.calculateScore(e, "well_equipped_toilets")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="well_equipped_toilets" id="strongly_agree" value="5" onChange={(e) => this.calculateScore(e, "well_equipped_toilets")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["well_equipped_toilets"]}</span>
                                                                            </Col>
                                                                    </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="toilet_etiquette_awareness" >Students are well aware of proper toilet etiquette to improve hygienic practices, i.e. importance of hand washing, flushing, cleaning the toilet seat and not wasting water</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="toilet_etiquette_awareness" id="strongly_disagree" value="1" onChange={(e) => this.calculateScore(e, "toilet_etiquette_awareness")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="toilet_etiquette_awareness" id="disagree" value="2" onChange={(e) => this.calculateScore(e, "toilet_etiquette_awareness")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="toilet_etiquette_awareness" id="neither" value="3" onChange={(e) => this.calculateScore(e, "toilet_etiquette_awareness")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="toilet_etiquette_awareness" id="agree" value="4" onChange={(e) => this.calculateScore(e, "toilet_etiquette_awareness")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="toilet_etiquette_awareness" id="strongly_agree" value="5" onChange={(e) => this.calculateScore(e, "toilet_etiquette_awareness")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["toilet_etiquette_awareness"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12">
                                                                <FormGroup >
                                                                    <Label for="toilet_cleaniness" >Support staff cleans the toilets at least 2-3 times a day with antibacterial products</Label>
                                                                    <FormGroup tag="fieldset" row>  
                                                                        <Col >
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="toilet_cleaniness" id="never" value="1" onChange={(e) => this.calculateScore(e, "toilet_cleaniness")} />{' '}
                                                                                Never
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="toilet_cleaniness" id="rarely" value="2" onChange={(e) => this.calculateScore(e, "toilet_cleaniness")} />{' '}
                                                                                Rarely
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="toilet_cleaniness" id="occasionally" value="3" onChange={(e) => this.calculateScore(e, "toilet_cleaniness")} />{' '}
                                                                                Occasionally
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="toilet_cleaniness" id="frequently" value="4" onChange={(e) => this.calculateScore(e, "toilet_cleaniness")} />{' '}
                                                                                Frequently
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="toilet_cleaniness" id="always" value="5" onChange={(e) => this.calculateScore(e, "toilet_cleaniness")} />{' '}
                                                                                Always
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <span class="errorMessage">{this.state.errors["toilet_cleaniness"]}</span>
                                                                            </Col>
                                                                    </FormGroup>
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col md="6">
                                                                <Label><h6><u><b>7. Zero Tolerance Policy</b></u></h6></Label>
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="zero_tolerance_policy_maintained" >School management maintains a zero tolerance policy for any teachers, students and staff that commit any of the following: discrimination; sexual harassment; verbal or physical abuse; use of alcohol or drugs on school premises; sharing confidential information of students; teachers or staff; using school premises for illegal activity; criminal activities, theft or fraud.</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="zero_tolerance_policy_maintained" id="yes" value="1" onChange={(e) => this.calculateScore(e, "zero_tolerance_policy_maintained")} />{' '}
                                                                                    Yes
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="zero_tolerance_policy_maintained" id="no" value="0"  onChange={(e) => this.calculateScore(e, "zero_tolerance_policy_maintained")} />{' '}
                                                                                    No
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["zero_tolerance_policy_maintained"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col md="6">
                                                                <Label><h6><u><b>8. Safety and Security</b></u></h6></Label>
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col md="12">
                                                                <FormGroup >
                                                                    <Label for="appropriate_security_measures" >The school management takes appropriate security measures (such as collecting their ID document) with all visitors entering the school premises</Label>
                                                                    <FormGroup tag="fieldset" row>  
                                                                        <Col >
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="appropriate_security_measures" id="never" value="1" onChange={(e) => this.calculateScore(e, "appropriate_security_measures")} />{' '}
                                                                                Never
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="appropriate_security_measures" id="rarely" value="2" onChange={(e) => this.calculateScore(e, "appropriate_security_measures")} />{' '}
                                                                                Rarely
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="appropriate_security_measures" id="occasionally" value="3" onChange={(e) => this.calculateScore(e, "appropriate_security_measures")} />{' '}
                                                                                Occasionally
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="appropriate_security_measures" id="frequently" value="4" onChange={(e) => this.calculateScore(e, "appropriate_security_measures")} />{' '}
                                                                                Frequently
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="appropriate_security_measures" id="always" value="5" onChange={(e) => this.calculateScore(e, "appropriate_security_measures")} />{' '}
                                                                                Always
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <span class="errorMessage">{this.state.errors["appropriate_security_measures"]}</span>
                                                                            </Col>
                                                                    </FormGroup>
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col md="12">
                                                                <FormGroup >
                                                                    <Label for="parents_given_security_update" >School management updates parents on security related policies and concerns that impact students</Label>
                                                                    <FormGroup tag="fieldset" row>  
                                                                        <Col >
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="parents_given_security_update" id="never" value="1" onChange={(e) => this.calculateScore(e, "parents_given_security_update")} />{' '}
                                                                                Never
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="parents_given_security_update" id="rarely" value="2" onChange={(e) => this.calculateScore(e, "parents_given_security_update")} />{' '}
                                                                                Rarely
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="parents_given_security_update" id="occasionally" value="3" onChange={(e) => this.calculateScore(e, "parents_given_security_update")} />{' '}
                                                                                Occasionally
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="parents_given_security_update" id="frequently" value="4" onChange={(e) => this.calculateScore(e, "parents_given_security_update")} />{' '}
                                                                                Frequently
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="parents_given_security_update" id="always" value="5" onChange={(e) => this.calculateScore(e, "parents_given_security_update")} />{' '}
                                                                                Always
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <span class="errorMessage">{this.state.errors["parents_given_security_update"]}</span>
                                                                            </Col>
                                                                    </FormGroup>
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>    
                                                        
                                                        {/* onChange={(e) => {this.inputChange(e, "csa_resources_required")}} 
                                                                                                            */}

                                                        <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="defined_student_pickup_responsibility" >School management is informed about the adult responsible for the pick/drop of students</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="defined_student_pickup_responsibility" id="yes" value="1" onChange={(e) => {this.inputChange(e, "defined_student_pickup_responsibility")}} />{' '}
                                                                                    Yes
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="defined_student_pickup_responsibility" id="no" value="0"  onChange={(e) => {this.inputChange(e, "defined_student_pickup_responsibility")}} />{' '}
                                                                                    No
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["defined_student_pickup_responsibility"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>                                                                                                             

                                                            <Row>
                                                            <Col md="12">
                                                                <FormGroup >
                                                                    <Label for="correct_student_pickup_release" >Staff release students only to the aforementioned individuals</Label>
                                                                    <FormGroup tag="fieldset" row>  
                                                                        <Col >
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="correct_student_pickup_release" id="never" value="1" onChange={(e) => this.calculateScore(e, "correct_student_pickup_release")} />{' '}
                                                                                Never
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="correct_student_pickup_release" id="rarely" value="2" onChange={(e) => this.calculateScore(e, "correct_student_pickup_release")} />{' '}
                                                                                Rarely
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="correct_student_pickup_release" id="occasionally" value="3" onChange={(e) => this.calculateScore(e, "correct_student_pickup_release")} />{' '}
                                                                                Occasionally
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="correct_student_pickup_release" id="frequently" value="4" onChange={(e) => this.calculateScore(e, "correct_student_pickup_release")} />{' '}
                                                                                Frequently
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="correct_student_pickup_release" id="always" value="5" onChange={(e) => this.calculateScore(e, "correct_student_pickup_release")} />{' '}
                                                                                Always
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <span class="errorMessage">{this.state.errors["correct_student_pickup_release"]}</span>
                                                                            </Col>
                                                                    </FormGroup>
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col md="12">
                                                                <FormGroup >
                                                                    <Label for="parents_guided_security_precaution" >Management guides parents on security precautions they should take to ensure the safety of their children when coming to/leaving school, i.e. have the van drivers' CNIC number and references, tell their child not to leave school premises alone or with someone they were not previously informed would be picking them up</Label>
                                                                    <FormGroup tag="fieldset" row>  
                                                                        <Col >
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="parents_guided_security_precaution" id="never" value="1" onChange={(e) => this.calculateScore(e, "parents_guided_security_precaution")} />{' '}
                                                                                Never
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="parents_guided_security_precaution" id="rarely" value="2" onChange={(e) => this.calculateScore(e, "parents_guided_security_precaution")} />{' '}
                                                                                Rarely
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="parents_guided_security_precaution" id="occasionally" value="3" onChange={(e) => this.calculateScore(e, "parents_guided_security_precaution")} />{' '}
                                                                                Occasionally
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="parents_guided_security_precaution" id="frequently" value="4" onChange={(e) => this.calculateScore(e, "parents_guided_security_precaution")} />{' '}
                                                                                Frequently
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="parents_guided_security_precaution" id="always" value="5" onChange={(e) => this.calculateScore(e, "parents_guided_security_precaution")} />{' '}
                                                                                Always
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <span class="errorMessage">{this.state.errors["parents_guided_security_precaution"]}</span>
                                                                            </Col>
                                                                    </FormGroup>
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>

                                                            <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="staff_student_interaction_code" >School management enforces stringent codes of conduct around staff and student interactions</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="staff_student_interaction_code" id="strongly_disagree" value="1" onChange={(e) => this.calculateScore(e, "staff_student_interaction_code")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="staff_student_interaction_code" id="disagree" value="2" onChange={(e) => this.calculateScore(e, "staff_student_interaction_code")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="staff_student_interaction_code" id="neither" value="3" onChange={(e) => this.calculateScore(e, "staff_student_interaction_code")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="staff_student_interaction_code" id="agree" value="4" onChange={(e) => this.calculateScore(e, "staff_student_interaction_code")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="staff_student_interaction_code" id="strongly_agree" value="5" onChange={(e) => this.calculateScore(e, "staff_student_interaction_code")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["staff_student_interaction_code"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="open_door_policy" >An open door policy is implemented to ensure transparency and clear glass windows are installed in all classrooms and offices where possible</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="open_door_policy" id="strongly_disagree" value="1" onChange={(e) => this.calculateScore(e, "open_door_policy")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="open_door_policy" id="disagree" value="2" onChange={(e) => this.calculateScore(e, "open_door_policy")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="open_door_policy" id="neither" value="3" onChange={(e) => this.calculateScore(e, "open_door_policy")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="open_door_policy" id="agree" value="4" onChange={(e) => this.calculateScore(e, "open_door_policy")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="open_door_policy" id="strongly_agree" value="5" onChange={(e) => this.calculateScore(e, "open_door_policy")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["open_door_policy"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12">
                                                                <FormGroup >
                                                                    <Label for="student_teacher_loitering_check" >Management checks for teachers, staff and students roaming around the premises in and out of school hours</Label>
                                                                    <FormGroup tag="fieldset" row>  
                                                                        <Col >
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="student_teacher_loitering_check" id="never" value="1" onChange={(e) => this.calculateScore(e, "student_teacher_loitering_check")} />{' '}
                                                                                Never
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="student_teacher_loitering_check" id="rarely" value="2" onChange={(e) => this.calculateScore(e, "student_teacher_loitering_check")} />{' '}
                                                                                Rarely
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="student_teacher_loitering_check" id="occasionally" value="3" onChange={(e) => this.calculateScore(e, "student_teacher_loitering_check")} />{' '}
                                                                                Occasionally
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="student_teacher_loitering_check" id="frequently" value="4" onChange={(e) => this.calculateScore(e, "student_teacher_loitering_check")} />{' '}
                                                                                Frequently
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <FormGroup check inline>
                                                                            <Label check>
                                                                                <Input type="radio" name="student_teacher_loitering_check" id="always" value="5" onChange={(e) => this.calculateScore(e, "student_teacher_loitering_check")} />{' '}
                                                                                Always
                                                                            </Label>
                                                                            </FormGroup>
                                                                            <span class="errorMessage">{this.state.errors["student_teacher_loitering_check"]}</span>
                                                                            </Col>
                                                                    </FormGroup>
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>

                                                            <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="teacher_staff_student_boubdaries" >Clear boundaries are enforced between teachers, staff and students - inappropriate body language, touch, or conversation are not acceptable</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="teacher_staff_student_boubdaries" id="strongly_disagree" value="1" onChange={(e) => this.calculateScore(e, "teacher_staff_student_boubdaries")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="teacher_staff_student_boubdaries" id="disagree" value="2" onChange={(e) => this.calculateScore(e, "teacher_staff_student_boubdaries")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="teacher_staff_student_boubdaries" id="neither" value="3" onChange={(e) => this.calculateScore(e, "teacher_staff_student_boubdaries")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="teacher_staff_student_boubdaries" id="agree" value="4" onChange={(e) => this.calculateScore(e, "teacher_staff_student_boubdaries")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="teacher_staff_student_boubdaries" id="strongly_agree" value="5" onChange={(e) => this.calculateScore(e, "teacher_staff_student_boubdaries")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["teacher_staff_student_boubdaries"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            </div>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup className="monitoringScoreBox">
                                                                        <Label for="srhr_score" style={{color: "green"}}><b>Cumulative SRHR Policy Score</b></Label>
                                                                        <Input value={this.state.srhr_score} name="srhr_score" id="srhr_score"  onChange={(e) => {this.inputChange(e, "srhr_score")}} ></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup className="monitoringScoreBox">
                                                                        {/* TODO: apply style to hide this based on csa/primary question */}
                                                                        <Label for="srhr_score_pct" style={{color: "green"}}><b>% Score</b></Label>
                                                                        <Input name="srhr_score_pct" id="srhr_score_pct" value={this.state.srhr_score_pct} onChange={(e) => {this.inputChange(e, "srhr_score_pct")}} ></Input>
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
                                                            <Button color="secondary" id="page_csa_a" 
                                                                className={"btn-shadow " + classnames({ active: this.state.activeTab === '2' })}
                                                                onClick={() => {
                                                                    this.toggle('2');
                                                                }}
                                                            >Policy</Button>  

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

export default SrhrPolicy;