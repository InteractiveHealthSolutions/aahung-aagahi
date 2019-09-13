/**
 * @author Tahira Niazi
 * @email tahira.niazi@ihsinformatics.com
 * @create date 2019-08-16 11:10:26
 * @modify date 2019-08-16 11:10:26
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
    { value: 'bahria456', label: 'Bahria College' },
    { value: 'city123', label: 'City School' },
];

const monitors = [
    { value: 'uuid1', label: 'Harry Potter' },
    { value: 'uuid2', label: 'Ron Weasley' },
    { value: 'uuid3', label: 'Hermione Granger' },
    { value: 'uuid4', label: 'Albus Dumbledore' },
];

class SecondaryMonitoringNew extends React.Component {

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
            school_sex: 'girls',
            class_sex: 'girls',
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
        this.scoreChange = this.scoreChange.bind(this);
        this.inputChange = this.inputChange.bind(this);

        this.isClassSexCoed = false;
        this.isLevel1 = true;
        this.isLevel2 = false;
        this.isClassFrequencyOther = false;
        this.isIntegrated = false;
        this.isChallenge1 = false;
        this.isChallenge2 = false;
        this.isChallenge3 = false;
        this.isChallenge4 = false;
        this.isChallenge5 = false;
        this.isChallenge6 = false;
        this.isSchoolSexGirls = true;
        this.isSchoolSexBoys = false;
        this.isWorkbookGirls = false;
        this.isWorkbookGirls = false;
        this.isOtherResources = false;
        this.isResourcesRequired = false;

        this.isResourcesRequiredDistribute = false;
        this.isWorkbookGirlsDistribute =false;
        this.isWorkbookBoysDistribute = false;
        this.isOtherResourcesDistribute = false;
        this.score = 0;
        this.totalScore = 0; 
        this.scoreArray = [];


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

        // receiving value directly from widget but it still requires widget to have on change methods to set it's value
        // alert(document.getElementById("date_start").value);
    }

    inputChange(e, name) {

        this.setState({
            [name]: e.target.value
        });

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

        if(name === "lsbe_challenge_1")
            this.isChallenge1 = e.target.id === "yes" ? true : false;
        if(name === "lsbe_challenge_2")    
            this.isChallenge2 = e.target.id === "yes" ? true : false;
        if(name === "lsbe_challenge_3")
            this.isChallenge3 = e.target.id === "yes" ? true : false;
        if(name === "lsbe_challenge_4")
            this.isChallenge4 = e.target.id === "yes" ? true : false;
        if(name === "lsbe_challenge_5")
            this.isChallenge5 = e.target.id === "yes" ? true : false;
        if(name === "lsbe_challenge_6")
            this.isChallenge6 = e.target.id === "yes" ? true : false;

        // for required
        if(name === "lsbe_resources_required") {
            this.isResourcesRequired = e.target.id === "yes" ? true : false;

            if(this.isResourcesRequired) {
                this.isWorkbookGirls = this.isSchoolSexGirls; 
                this.isWorkbookBoys = this.isSchoolSexBoys; 
            }
            else if(!this.isResourcesRequired) {
                
                this.isWorkbookGirls = false; 
                this.isWorkbookBoys = false; 
                this.isOtherResources = false;

            }
        }

        if(name === "other_resource_required_count" )
            this.isOtherResources = e.target.value > 0 ? true : false;

        // for disrtibuted
        if(name === "lsbe_resources_delivered") {
            this.isResourcesRequiredDistribute = e.target.id === "yes" ? true : false;

            if(this.isResourcesRequiredDistribute) {
                this.isWorkbookGirlsDistribute = this.isSchoolSexGirls; 
                this.isWorkbookBoysDistribute = this.isSchoolSexBoys; 
            }
            else if(!this.isResourcesRequiredDistribute) {
                
                this.isWorkbookGirlsDistribute = false; 
                this.isWorkbookBoysDistribute = false; 
                this.isOtherResourcesDistribute = false;

            }
        }

        if(name === "other_resource_delivered_count" )
            this.isOtherResourcesDistribute = e.target.value > 0 ? true : false;
    }


    // for single select
    valueChange = (e, name) => {
        this.setState ({sex : e.target.value });
        this.setState ({sex : e.target.value });
        this.setState({
            [name]: e.target.value
        });

        if(name === "lsbe_level_monitored") {

            this.isLevel1 = e.target.value === "level_1" ? true : false;
            this.isLevel2 = e.target.value === "level_2" ? true : false;
        }

        if(name == "lsbe_class_frequency") {
            this.isClassFrequencyOther = e.target.value === "other" ? true : false;
        }

        if(name === "school_sex") {
            this.isSchoolSexGirls = e.target.value === "girls" ? true : false;
            this.isSchoolSexBoys = e.target.value === "boys" ? true : false;
            
            this.isWorkbookGirls = this.isSchoolSexGirls;
            this.isWorkbookBoys = this.isSchoolSexBoys;

            this.isWorkbookGirlsDistribute = this.isSchoolSexGirls; 
            this.isWorkbookBoysDistribute = this.isSchoolSexBoys; 

            this.setState( {class_sex: e.target.value === "girls" ? 'girls' : 'boys'});
            // this.setState( {class_sex: e.target.value === "coed" ? 'girls' : 'boys'});
            // this.isClassSexCoed = e.target.value === "coed" ? true : false;
        }


    }

    // calculate score from scoring questions (radiobuttons)
    scoreChange = (e, name) => {
        this.setState({
            [name]: e.target.value
        });

        if(name === "lsbe_timetable_integration") {
            this.isIntegrated = e.target.id === "yes" ? true : false; 
        }

        let indicator = e.target.id;
        let fieldName = e.target.name;
        let value = e.target.value;
        this.calcualtingScore(indicator, fieldName, value);

    }

    
    // calculate total and score {id, fieldName, value, score, totalScore}
    calcualtingScore(indicator, fieldName, value) { 

        switch(indicator) {
            case "strongly_disagree": // coding is 5
                var indicatorCode = 5;
                this.calculate(indicator, fieldName, value, indicatorCode);
                
                break;

            case "disagree":
                var indicatorCode = 5;
                this.calculate(indicator, fieldName, value, indicatorCode);
                
                break;

            case "neither":
                var indicatorCode = 5;
                this.calculate(indicator, fieldName, value, indicatorCode);
            
                break;            

            case "agree":
                var indicatorCode = 5;
                this.calculate(indicator, fieldName, value, indicatorCode);

                break;
            
            case "strongly_agree":
                var indicatorCode = 5;
                this.calculate(indicator, fieldName, value, indicatorCode);
                
                break;
            
            case "yes":
                var indicatorCode = 1;
                this.calculate(indicator, fieldName, value, indicatorCode);
            
                break;
            
            case "no":
                var indicatorCode = 1;
                this.calculate(indicator, fieldName, value, indicatorCode);
        
                break;

            
          }

    }

    calculate(indicator, fieldName, value, indicatorValue) {
        let answered = [];
              if(this.scoreArray != undefined || this.scoreArray != null) {
                answered = this.scoreArray.filter(question => question.elementName == fieldName);
              }
              if(answered[0] !=null) {
                  answered[0].id = indicator;
                  answered[0].elementName = fieldName;
                  this.score = this.score - parseInt(answered[0].value); //becase previous answer is not applicable any more
                  this.score += parseInt(value);  

                  for (var i in this.scoreArray) {
                    if (this.scoreArray[i].elementName == fieldName) {

                       this.scoreArray[i].id = indicator; // they will remain same
                       this.scoreArray[i].elementName = fieldName; // they will remain same
                       this.scoreArray[i].value = value;
                       this.scoreArray[i].score = this.score;
                       break; //Stop this loop, we found it!
                    }
                  }
              }
              else { //push this question along with value and other attributes

                let newAnswered = {}
                newAnswered.id = indicator;
                newAnswered.elementName = fieldName;
                newAnswered.value = value;
                this.score += parseInt(value);
                this.totalScore += indicatorValue;
                newAnswered.score = this.score;
                newAnswered.totalScore = this.totalScore;
                this.scoreArray.push(newAnswered);
              }

            //   alert(this.score);
            //   alert(this.totalScore);
              var score = parseInt(this.score);
              var totalScore = parseInt(this.totalScore);
              
              var percent = (score/totalScore)*100;
            //   alert(percent)
              percent = percent.toFixed(2);
              this.setState({
                monitoring_score : this.score,
                monitoring_score_pct : percent
              })
            //   alert(percent);
              console.log(this.scoreArray);
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

        // for view mode
        const setDisable = this.state.viewMode ? "disabled" : "";
        const classSexStyle = this.isClassSexCoed ? {} : { display: 'none' };
        const level1Style = this.isLevel1 ? {} : { display: 'none' };
        const level2Style = this.isLevel2 ? {} : { display: 'none' };
        const frequencyOtherStyle = this.isClassFrequencyOther ? {} : { display: 'none' };
        const integratedStyle = this.isIntegrated ? {} : { display: 'none' };
        const challenge1Style = this.isChallenge1 ? {} : { display: 'none' };
        const challenge2Style = this.isChallenge2 ? {} : { display: 'none' };
        const challenge3Style = this.isChallenge3 ? {} : { display: 'none' };
        const challenge4Style = this.isChallenge4 ? {} : { display: 'none' };
        const challenge5Style = this.isChallenge5 ? {} : { display: 'none' };
        const challenge6Style = this.isChallenge6 ? {} : { display: 'none' };
        const workbookGirlsStyle = this.isWorkbookGirls ? {} : { display: 'none' };
        const workbookBoysStyle = this.isWorkbookBoys ? {} : { display: 'none' };
        const otherResourcesStyle = this.isResourcesRequired ? {} : { display: 'none' };
        const specifyOtherResourcesStyle = this.isOtherResources ? {} : { display: 'none' };
        const workbookGirlsDistributeStyle = this.isWorkbookGirlsDistribute ? {} : { display: 'none' };
        const workbookBoysDistributeStyle = this.isWorkbookBoysDistribute ? {} : { display: 'none' };
        const otherResourcesDistributeStyle = this.isResourcesRequiredDistribute ? {} : { display: 'none' };
        const specifyOtherResourcesDistributeStyle = this.isOtherResourcesDistribute ? {} : { display: 'none' };
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
                                                <b>Secondary Monitoring Form - New</b>
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
                                                                        <Label for="school_id" >School Name</Label>
                                                                        <Select id="school_id" name="school_id" value={this.state.school_id} onChange={(e) => this.handleChange(e, "school_id")} options={schools} />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            
                                                            <Row>
                                                                
                                                                
                                                            </Row>
                                                            <Row>
                                                                <Col md="6">
                                                                <FormGroup >
                                                                        <Label for="monitor" >Monitored By</Label> <span class="errorMessage">{this.state.errors["monitor"]}</span>
                                                                        <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e, "monitor")} value={this.state.monitor} id="monitor" name="monitor" options={monitors} required/>
                                                                    </FormGroup>                                                                    
                                                                </Col>
                                                                <Col md="6">
                                                                <FormGroup >
                                                                        <Label for="school_sex" >Classification of School by Sex</Label> <span class="errorMessage">{this.state.errors["school_sex"]}</span>
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "school_sex")} value={this.state.school_sex} name="school_sex" id="school_sex">
                                                                            
                                                                            <option value="girls">Girls</option>
                                                                            <option value="boys">Boys</option>
                                                                            <option value="coed">Co-ed</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col md="6" >
                                                                    <FormGroup >
                                                                    <Label for="class_sex" >Students in Class by Sex</Label> <span class="errorMessage">{this.state.errors["class_sex"]}</span>
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "class_sex")} value={this.state.class_sex} name="class_sex" id="class_sex">
                                                                            
                                                                            <option value="girls">Girls</option>
                                                                            <option value="boys">Boys</option>
                                                                            <option value="coed">Co-ed</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup>
                                                                        <Label for="participant_name" >Name of Teacher</Label> <span class="errorMessage">{this.state.errors["participant_name"]}</span>
                                                                        <Select id="participant_name" name="participant_name" value={this.state.participant_name} onChange={(e) => this.handleChange(e, "participant_name")} options={monitors} />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="participant_id" >Teacher ID</Label>
                                                                        <Input name="participant_id" id="participant_id" value={this.state.participant_id} disabled/>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="secondary_grade" >Class</Label>  <span class="errorMessage">{this.state.errors["secondary_grade"]}</span>
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "secondary_grade")} value={this.state.secondary_grade} name="secondary_grade" id="secondary_grade">
                                                                            
                                                                            <option value="six">6</option>
                                                                            <option value="seven">7</option>
                                                                            <option value="eight">8</option>
                                                                            <option value="nine">9</option>
                                                                            <option value="ten">10</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="class_students" >Number of Students in Class</Label> <span class="errorMessage">{this.state.errors["class_students"]}</span>
                                                                        <Input type="number" name="class_students" id="class_students" value={this.state.class_students} onInput = {(e) =>{ e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,2)}} max="99" min="1"/>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="class_duration" >Time duration of class in minutes</Label> <span class="errorMessage">{this.state.errors["class_duration"]}</span>
                                                                        <Input type="number" name="class_duration" id="class_duration" value={this.state.class_duration} onInput = {(e) =>{ e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,3)}} max="999" min="1"/>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                        </TabPane>
                                                        <TabPane tabId="2" id="lsbe">
                                                        <Row>
                                                            <Col md="6">
                                                                
                                                                        <Label><h6><u><b>LSBE Program</b></u></h6></Label>
                                                                
                                                            </Col>

                                                        </Row>
                                                        <Row></Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="lsbe_level_monitored" >LSBE Level</Label> <span class="errorMessage">{this.state.errors["lsbe_level_monitored"]}</span>
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "lsbe_level_monitored")} value={this.state.lsbe_level_monitored} name="lsbe_level_monitored" id="lsbe_level_monitored" required>
                                                                            
                                                                            <option value="level_1">Level 1</option>
                                                                            <option value="level_2">Level 2</option>
                                                                        </Input>
                                                                        
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col md="6" style={level1Style}>
                                                                    <FormGroup >
                                                                        <Label for="lsbe_level_1" >LSBE Chapter - Level 1</Label> <span class="errorMessage">{this.state.errors["lsbe_level_1"]}</span>
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "lsbe_level_1")} value={this.state.lsbe_level_1} name="lsbe_level_1" id="lsbe_level_1" required>
                                                                            
                                                                            <option value="self_awareness">Self-Awareness</option>
                                                                            <option value="communication">Communication</option>
                                                                            <option value="feelings">Feelings</option>
                                                                            <option value="values">Values</option>
                                                                            <option value="human_rights">Human Rights</option>
                                                                            <option value="gender">Gender</option>
                                                                            <option value="self_protection">Self-Protection</option>
                                                                            <option value="health">Health</option>
                                                                            <option value="peer_pressure">Peer Pressure</option>
                                                                            <option value="healthy_diet">Healthy Diet</option>
                                                                            <option value="puberty">Puberty</option>
                                                                            <option value="going_to_doctor">Going to the Doctor</option>
                                                                            <option value="decision_making">Decision Making</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="6" style={level2Style}>
                                                                    <FormGroup >
                                                                        <Label for="lsbe_level_2" >LSBE Chapter - Level 2</Label> <span class="errorMessage">{this.state.errors["lsbe_level_2"]}</span>
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "lsbe_level_2")} value={this.state.lsbe_level_2} name="lsbe_level_2" id="lsbe_level_2" required>
                                                                            
                                                                            <option value="human_rights">Human Rights</option>
                                                                            <option value="effective_communication">Effective Communication</option>
                                                                            <option value="gender_equality">Gender Equality</option>
                                                                            <option value="puberty">Puberty</option>
                                                                            <option value="decision_making">Decision Making</option>
                                                                            <option value="substance_abuse">Substance Abuse</option>
                                                                            <option value="youth_family">Youth and Family (Marriage)</option>
                                                                            <option value="maternal_child_health">Maternal and Child Health</option>
                                                                            <option value="hepatitis">Hepatitis</option>
                                                                            <option value="hiv">HIV</option>
                                                                            <option value="violence">Violence</option>
                                                                        </Input>
                                                                        
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="lsbe_chapter_revision" >Revision or First time chapter is being taught</Label> <span class="errorMessage">{this.state.errors["lsbe_chapter_revision"]}</span>
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "lsbe_chapter_revision")} value={this.state.lsbe_chapter_revision} name="lsbe_chapter_revision" id="lsbe_chapter_revision" required>
                                                                            <option value="revision">Revision</option>
                                                                            <option value="first_time">First time</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="6">
                                                                <Label><h7><u><b>Facilitation</b></u></h7></Label>
                                                            </Col>

                                                            </Row>

                                                            <Row>
                                                                <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="lsbe_prompts" >The teacher is actively using the teacher’s guide to aid in facilitation of content</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_prompts" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "lsbe_prompts")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_prompts" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "lsbe_prompts")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_prompts" id="neither" value="3" onChange={(e) => this.scoreChange(e, "lsbe_prompts")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_prompts" id="agree" value="4" onChange={(e) => this.scoreChange(e, "lsbe_prompts")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_prompts" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "lsbe_prompts")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["lsbe_prompts"]}</span>
                                                                            </Col>
                                                                    </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                                
                                                            </Row>

                                                            <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="lsbe_chapter_objective" >The teacher is clearly relaying the main messages of the chapter, even if they are not actively using the teacher’s guide</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_chapter_objective" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "lsbe_chapter_objective")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_chapter_objective" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "lsbe_chapter_objective")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_chapter_objective" id="neither" value="3" onChange={(e) => this.scoreChange(e, "lsbe_chapter_objective")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_chapter_objective" id="agree" value="4" onChange={(e) => this.scoreChange(e, "lsbe_chapter_objective")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_chapter_objective" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "lsbe_chapter_objective")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["lsbe_chapter_objective"]}</span>
                                                                            </Col>
                                                                    </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="lsbe_teacher_understanding" >The teacher demonstrates good understanding of the LSBE content</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_teacher_understanding" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "lsbe_teacher_understanding")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_teacher_understanding" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "lsbe_teacher_understanding")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_teacher_understanding" id="neither" value="3" onChange={(e) => this.scoreChange(e, "lsbe_teacher_understanding")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_teacher_understanding" id="agree" value="4" onChange={(e) => this.scoreChange(e, "lsbe_teacher_understanding")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_teacher_understanding" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "lsbe_teacher_understanding")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["lsbe_teacher_understanding"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="lsbe_material_preparation" >The teacher had all materials prepared in advance for the class</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_material_preparation" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "lsbe_material_preparation")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_material_preparation" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "lsbe_material_preparation")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_material_preparation" id="neither" value="3" onChange={(e) => this.scoreChange(e, "lsbe_material_preparation")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_material_preparation" id="agree" value="4" onChange={(e) => this.scoreChange(e, "lsbe_material_preparation")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_material_preparation" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "lsbe_material_preparation")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["lsbe_material_preparation"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="lsbe_teacher_preparation" >The teacher was well prepared to facilitate the session</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_teacher_preparation" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "lsbe_teacher_preparation")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_teacher_preparation" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "lsbe_teacher_preparation")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_teacher_preparation" id="neither" value="3" onChange={(e) => this.scoreChange(e, "lsbe_teacher_preparation")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_teacher_preparation" id="agree" value="4" onChange={(e) => this.scoreChange(e, "lsbe_teacher_preparation")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_teacher_preparation" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "lsbe_teacher_preparation")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["lsbe_teacher_preparation"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            

                                                            <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="lsbe_activity_time_allotment" >An appropriate amount of time is allotted to each activity and topic</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_activity_time_allotment" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "lsbe_activity_time_allotment")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_activity_time_allotment" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "lsbe_activity_time_allotment")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_activity_time_allotment" id="neither" value="3" onChange={(e) => this.scoreChange(e, "lsbe_activity_time_allotment")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_activity_time_allotment" id="agree" value="4" onChange={(e) => this.scoreChange(e, "lsbe_activity_time_allotment")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_activity_time_allotment" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "lsbe_activity_time_allotment")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["lsbe_activity_time_allotment"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="lsbe_subject_comfort" >The teacher is comfortable speaking about this subject</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_subject_comfort" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "lsbe_subject_comfort")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_subject_comfort" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "lsbe_subject_comfort")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_subject_comfort" id="neither" value="3" onChange={(e) => this.scoreChange(e, "lsbe_subject_comfort")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_subject_comfort" id="agree" value="4" onChange={(e) => this.scoreChange(e, "lsbe_subject_comfort")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_subject_comfort" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "lsbe_subject_comfort")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["lsbe_subject_comfort"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="lsbe_nonjudmental_tone" >The teacher uses a non-judgmental tone while facilitating the session</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_nonjudmental_tone" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "lsbe_nonjudmental_tone")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_nonjudmental_tone" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "lsbe_nonjudmental_tone")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_nonjudmental_tone" id="neither" value="3" onChange={(e) => this.scoreChange(e, "lsbe_nonjudmental_tone")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_nonjudmental_tone" id="agree" value="4" onChange={(e) => this.scoreChange(e, "lsbe_nonjudmental_tone")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_nonjudmental_tone" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "lsbe_nonjudmental_tone")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["lsbe_nonjudmental_tone"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="lsbe_impartial_opinions" >The teacher is not imposing their own values or opinions on the participants</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_impartial_opinions" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "lsbe_impartial_opinions")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_impartial_opinions" id="disagree" value="2"   onChange={(e) => this.scoreChange(e, "lsbe_impartial_opinions")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_impartial_opinions" id="neither" value="3"  onChange={(e) => this.scoreChange(e, "lsbe_impartial_opinions")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_impartial_opinions" id="agree" value="4"  onChange={(e) => this.scoreChange(e, "lsbe_impartial_opinions")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_impartial_opinions" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "lsbe_impartial_opinions")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["lsbe_impartial_opinions"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="lsbe_discussion_probes" >The teacher is engaging participants in discussion throughout session by providing probes</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_discussion_probes" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "lsbe_discussion_probes")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_discussion_probes" id="disagree" value="2"   onChange={(e) => this.scoreChange(e, "lsbe_discussion_probes")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_discussion_probes" id="neither" value="3"  onChange={(e) => this.scoreChange(e, "lsbe_discussion_probes")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_discussion_probes" id="agree" value="4"  onChange={(e) => this.scoreChange(e, "lsbe_discussion_probes")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_discussion_probes" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "lsbe_discussion_probes")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["lsbe_discussion_probes"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="lsbe_student_understanding" >Students demonstrate clear understanding of the main messages of the chapter</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_student_understanding" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "lsbe_student_understanding")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_student_understanding" id="disagree" value="2"   onChange={(e) => this.scoreChange(e, "lsbe_student_understanding")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_student_understanding" id="neither" value="3"  onChange={(e) => this.scoreChange(e, "lsbe_student_understanding")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_student_understanding" id="agree" value="4"  onChange={(e) => this.scoreChange(e, "lsbe_student_understanding")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_student_understanding" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "lsbe_student_understanding")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["lsbe_student_understanding"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            
                                                            <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="lsbe_student_engagement" >Students are actively participating in discussion on the chapter</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_student_engagement" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "lsbe_student_engagement")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_student_engagement" id="disagree" value="2"   onChange={(e) => this.scoreChange(e, "lsbe_student_engagement")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_student_engagement" id="neither" value="3"  onChange={(e) => this.scoreChange(e, "lsbe_student_engagement")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_student_engagement" id="agree" value="4"  onChange={(e) => this.scoreChange(e, "lsbe_student_engagement")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_student_engagement" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "lsbe_student_engagement")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["lsbe_student_engagement"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="lsbe_student_attention" >Students are actively paying attention to the class while the teacher is instructing</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_student_attention" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "lsbe_student_attention")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_student_attention" id="disagree" value="2"   onChange={(e) => this.scoreChange(e, "lsbe_student_attention")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_student_attention" id="neither" value="3"  onChange={(e) => this.scoreChange(e, "lsbe_student_attention")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_student_attention" id="agree" value="4"  onChange={(e) => this.scoreChange(e, "lsbe_student_attention")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_student_attention" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "lsbe_student_attention")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["lsbe_student_attention"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="6">
                                                                <Label><h7><u><b>Management</b></u></h7></Label>
                                                            </Col>

                                                            </Row>

                                                            <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="lsbe_timetable_integration" >Management has integrated the LSBE program into the school timetable</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_timetable_integration" id="yes" value="1" onChange={(e) => this.scoreChange(e, "lsbe_timetable_integration")} />{' '}
                                                                                    Yes
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_timetable_integration" id="no" value="0" onChange={(e) => this.scoreChange(e, "lsbe_timetable_integration")} />{' '}
                                                                                    No
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["lsbe_timetable_integration"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6" style={integratedStyle}>
                                                                    <FormGroup >
                                                                        <Label for="lsbe_class_frequency" >Frequency of class in time table</Label> <span class="errorMessage">{this.state.errors["lsbe_class_frequency"]}</span>
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "lsbe_class_frequency")} value={this.state.lsbe_class_frequency} name="lsbe_class_frequency" id="lsbe_class_frequency">
                                                                            <option value="weekly">Weekly</option>
                                                                            <option value="biweekly">Biweekly</option>
                                                                            <option value="monthly">Monthly</option>
                                                                            <option value="other">Other</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6" style={frequencyOtherStyle}>
                                                                    <FormGroup >
                                                                        <Label for="lsbe_class_frequency_other" >If other, please specify</Label>  <span class="errorMessage">{this.state.errors["lsbe_class_frequency_other"]}</span>
                                                                        <Input value={this.state.lsbe_class_frequency_other} name="lsbe_class_frequency_other" id="lsbe_class_frequency_other" onChange={(e) => {this.inputChange(e, "lsbe_class_frequency_other")}} ></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            
                                                            <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="lsbe_two_teacher_assigned" >There are at least 2 teachers assigned to teach the LSBE program</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_two_teacher_assigned" id="yes" value="1" onChange={(e) => this.scoreChange(e, "lsbe_two_teacher_assigned")} />{' '}
                                                                                    Yes
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_two_teacher_assigned" id="no" value="0" onChange={(e) => this.scoreChange(e, "lsbe_two_teacher_assigned")} />{' '}
                                                                                    No
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["lsbe_two_teacher_assigned"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="lsbe_teacher_mgmt_coordination" >There is excellent coordination between management and teachers regarding the LSBE program</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_teacher_mgmt_coordination" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "lsbe_teacher_mgmt_coordination")} />{' '}
                                                                                    {stronglyDisagree}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_teacher_mgmt_coordination" id="disagree" value="2"   onChange={(e) => this.scoreChange(e, "lsbe_teacher_mgmt_coordination")} />{' '}
                                                                                    {disagree}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_teacher_mgmt_coordination" id="neither" value="3"  onChange={(e) => this.scoreChange(e, "lsbe_teacher_mgmt_coordination")} />{' '}
                                                                                    {neither}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_teacher_mgmt_coordination" id="agree" value="4"  onChange={(e) => this.scoreChange(e, "lsbe_teacher_mgmt_coordination")} />{' '}
                                                                                    {agree}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_teacher_mgmt_coordination" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "lsbe_teacher_mgmt_coordination")} />{' '}
                                                                                    {stronglyAgree}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["lsbe_teacher_mgmt_coordination"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            
                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup className="monitoringScoreBox">
                                                                        <Label for="monitoring_score" style={{color: "green"}}><b>Cumulative Monitoring Score</b></Label>
                                                                        <Input value={this.state.monitoring_score} name="monitoring_score" id="monitoring_score"  onChange={(e) => {this.inputChange(e, "monitoring_score")}} ></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup className="monitoringScoreBox">
                                                                        {/* TODO: apply style to hide this based on csa/primary question */}
                                                                        <Label for="monitoring_score_pct" style={{color: "green"}}><b>% Monitoring Score</b></Label>
                                                                        <Input name="monitoring_score_pct" id="monitoring_score_pct" value={this.state.monitoring_score_pct} onChange={(e) => {this.inputChange(e, "monitoring_score_pct")}} ></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="6">
                                                                <Label><h7><u><b>Challenges</b></u></h7></Label>
                                                            </Col>

                                                            </Row>

                                                            <Row>
                                                            <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="lsbe_challenge_1" >The school is facing challenges scheduling the LSBE class</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_challenge_1" id="yes" value="1" onChange={(e) => {this.inputChange(e, "lsbe_challenge_1")}} />{' '}
                                                                                    {yes}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_challenge_1" id="no" value="0" onChange={(e) => {this.inputChange(e, "lsbe_challenge_1")}} />{' '}
                                                                                    {no}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["lsbe_challenge_1"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            {/* </Row> */}

                                                            {/* <Row> */}
                                                            <Col md="6" style={challenge1Style}>
                                                                    <FormGroup >
                                                                    <Label for="lsbe_challenge_1_status" >Status of Challenge</Label>
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "lsbe_challenge_1_status")} value={this.state.lsbe_challenge_1_status} name="lsbe_challenge_1_status" id="lsbe_challenge_1_status">
                                                                            <option value="resolved">Resolved</option>
                                                                            <option value="unresolved">Unresolved</option>
                                                                        </Input><span class="errorMessage">{this.state.errors["lsbe_challenge_1_status"]}</span>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="lsbe_challenge_2" >There are not enough resources</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_challenge_2" id="yes" value="1" onChange={(e) => {this.inputChange(e, "lsbe_challenge_2")}} />{' '}
                                                                                    Yes
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_challenge_2" id="no" value="0" onChange={(e) => {this.inputChange(e, "lsbe_challenge_2")}} />{' '}
                                                                                    No
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["lsbe_challenge_2"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6" style={challenge2Style}>
                                                                <FormGroup >
                                                                    <Label for="lsbe_challenge_2_status" >Status of Challenge</Label>
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "lsbe_challenge_2_status")} value={this.state.lsbe_challenge_2_status} name="lsbe_challenge_2_status" id="lsbe_challenge_2_status">
                                                                            <option value="resolved">Resolved</option>
                                                                            <option value="unresolved">Unresolved</option>
                                                                        </Input><span class="errorMessage">{this.state.errors["lsbe_challenge_2_status"]}</span>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>


                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="lsbe_challenge_3" >There is no room for the class</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_challenge_3" id="yes" value="1" onChange={(e) => {this.inputChange(e, "lsbe_challenge_3")}} />{' '}
                                                                                    Yes
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_challenge_3" id="no" value="0" onChange={(e) => {this.inputChange(e, "lsbe_challenge_3")}} />{' '}
                                                                                    No
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["lsbe_challenge_3"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6" style={challenge3Style}>
                                                                <FormGroup >
                                                                    <Label for="lsbe_challenge_3_status" >Status of Challenge</Label>
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "lsbe_challenge_3_status")} value={this.state.lsbe_challenge_3_status} name="lsbe_challenge_3_status" id="lsbe_challenge_3_status">
                                                                            <option value="resolved">Resolved</option>
                                                                            <option value="unresolved">Unresolved</option>
                                                                        </Input><span class="errorMessage">{this.state.errors["lsbe_challenge_3_status"]}</span>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="lsbe_challenge_4" >There are not enough teachers to teach the LSBE class</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_challenge_4" id="yes" value="1" onChange={(e) => {this.inputChange(e, "lsbe_challenge_4")}} />{' '}
                                                                                    Yes
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_challenge_4" id="no" value="0" onChange={(e) => {this.inputChange(e, "lsbe_challenge_4")}} />{' '}
                                                                                    No
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["lsbe_challenge_4"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6" style={challenge4Style}>
                                                                <FormGroup >
                                                                    <Label for="lsbe_challenge_4_status" >Status of Challenge</Label> 
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "lsbe_challenge_4_status")} value={this.state.lsbe_challenge_4_status} name="lsbe_challenge_4_status" id="lsbe_challenge_4_status">
                                                                            <option value="resolved">Resolved</option>
                                                                            <option value="unresolved">Unresolved</option>
                                                                        </Input> <span class="errorMessage">{this.state.errors["lsbe_challenge_4_status"]}</span>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="lsbe_challenge_5" >The content is irrelevant for the context of the students</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_challenge_5" id="yes" value="1" onChange={(e) => {this.inputChange(e, "lsbe_challenge_5")}} />{' '}
                                                                                    Yes
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_challenge_5" id="no" value="0" onChange={(e) => {this.inputChange(e, "lsbe_challenge_5")}} />{' '}
                                                                                    No
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["lsbe_challenge_5"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6" style={challenge5Style}>
                                                                <FormGroup >
                                                                    <Label for="lsbe_challenge_5_status" >Status of Challenge</Label> 
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "lsbe_challenge_5_status")} value={this.state.lsbe_challenge_5_status} name="lsbe_challenge_5_status" id="lsbe_challenge_5_status">
                                                                            <option value="resolved">Resolved</option>
                                                                            <option value="unresolved">Unresolved</option>
                                                                        </Input> <span class="errorMessage">{this.state.errors["lsbe_challenge_5_status"]}</span>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="lsbe_challenge_6" >Students are not interested in the content</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_challenge_6" id="yes" value="1" onChange={(e) => {this.inputChange(e, "lsbe_challenge_6")}} />{' '}
                                                                                    Yes
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_challenge_6" id="no" value="0" onChange={(e) => {this.inputChange(e, "lsbe_challenge_6")}} />{' '}
                                                                                    No
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["lsbe_challenge_6"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6" style={challenge6Style}>
                                                                <FormGroup >
                                                                    <Label for="lsbe_challenge_6_status" >Status of Challenge</Label> 
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "lsbe_challenge_6_status")} value={this.state.lsbe_challenge_6_status} name="lsbe_challenge_6_status" id="lsbe_challenge_6_status">
                                                                            <option value="resolved">Resolved</option>
                                                                            <option value="unresolved">Unresolved</option>
                                                                        </Input> <span class="errorMessage">{this.state.errors["lsbe_challenge_6_status"]}</span>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="6">
                                                                <Label><h7><u><b>Resources</b></u></h7></Label>
                                                            </Col>

                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="lsbe_resources_required">Does this school require any resources?</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_resources_required" id="yes" value="1" onChange={(e) => {this.inputChange(e, "lsbe_resources_required")}} />{' '}
                                                                                    Yes
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_resources_required" id="no" value="0" onChange={(e) => {this.inputChange(e, "lsbe_resources_required")}} />{' '}
                                                                                    No
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["lsbe_resources_required"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                                </Row>

                                                                <Row>
                                                                <Col md="6" style={workbookGirlsStyle}>
                                                                    <FormGroup >
                                                                        <Label for="wb1_girls_required_count" >Workbook Level 1 – Girls</Label>  <span class="errorMessage">{this.state.errors["wb1_girls_required_count"]}</span>
                                                                        <Input type="number" value={this.state.wb1_girls_required_count} name="wb1_girls_required_count" id="wb1_girls_required_count" onChange={(e) => {this.inputChange(e, "wb1_girls_required_count")}} max="999" min="1" onInput = {(e) =>{ e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,3)}} placeholder="Enter count in numbers"></Input> 
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" style={workbookBoysStyle}>
                                                                    <FormGroup >
                                                                        <Label for="wb1_boys_required_count" >Workbook Level 1 – Boys</Label>  <span class="errorMessage">{this.state.errors["wb1_boys_required_count"]}</span>
                                                                        <Input type="number" value={this.state.wb1_boys_required_count} name="wb1_boys_required_count" id="wb1_boys_required_count" onChange={(e) => {this.inputChange(e, "wb1_boys_required_count")}} max="999" min="1" onInput = {(e) =>{ e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,3)}} placeholder="Enter count in numbers"></Input> 
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                
                                                                <Col md="6" style={workbookGirlsStyle}>
                                                                    <FormGroup >
                                                                        <Label for="wb2_girls_required_count" >Workbook Level 2 – Girls</Label> <span class="errorMessage">{this.state.errors["wb2_girls_required_count"]}</span>
                                                                        <Input type="number" value={this.state.wb2_girls_required_count} name="wb2_girls_required_count" id="wb2_girls_required_count" onChange={(e) => {this.inputChange(e, "wb2_girls_required_count")}} max="999" min="1" onInput = {(e) =>{ e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,3)}} placeholder="Enter count in numbers"></Input> 
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" style={workbookBoysStyle}>
                                                                    <FormGroup >
                                                                        <Label for="wb2_boys_required_count" >Workbook Level 2 – Boys</Label> <span class="errorMessage">{this.state.errors["wb2_boys_required_count"]}</span>
                                                                        <Input type="number" value={this.state.wb2_boys_required_count} name="wb2_boys_required_count" id="wb2_boys_required_count" onChange={(e) => {this.inputChange(e, "wb2_boys_required_count")}} max="999" min="1" onInput = {(e) =>{ e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,3)}} placeholder="Enter count in numbers"></Input> 
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>


                                                            <Row>
                                                                <Col md="6"  style={otherResourcesStyle}>
                                                                <FormGroup >
                                                                        <Label for="other_resource_required_count" >Other Resource</Label>  <span class="errorMessage">{this.state.errors["other_resource_required_count"]}</span>
                                                                        <Input type="number" value={this.state.other_resource_required_count} name="other_resource_required_count" id="other_resource_required_count" onChange={(e) => {this.inputChange(e, "other_resource_required_count")}} max="999" min="1" onInput = {(e) =>{ e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,3)}} placeholder="Enter count in numbers"></Input> 
                                                                </FormGroup>
                                                                </Col>

                                                                <Col md="12" style={specifyOtherResourcesStyle}>
                                                                    <FormGroup >
                                                                        <Label for="other_resource_required_type" >Specify other type of resource</Label> <span class="errorMessage">{this.state.errors["other_resource_required_type"]}</span> 
                                                                        <Input value={this.state.other_resource_required_type} name="other_resource_required_type" id="other_resource_required_type" onChange={(e) => {this.inputChange(e, "other_resource_required_type")}} max="999" min="1" placeholder="Enter other type of resource"></Input> 
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>


                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="lsbe_resources_delivered">Were any resources distributed to this school in this visit?</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_resources_delivered" id="yes" value="1" onChange={(e) => {this.inputChange(e, "lsbe_resources_delivered")}} />{' '}
                                                                                    Yes
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="lsbe_resources_delivered" id="no" value="0" onChange={(e) => {this.inputChange(e, "lsbe_resources_delivered")}} />{' '}
                                                                                    No
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["lsbe_resources_delivered"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                <Col md="6" style={workbookGirlsDistributeStyle}>
                                                                    <FormGroup >
                                                                        <Label for="wb1_girls_delivered_count" >Workbook Level 1 – Girls</Label>  <span class="errorMessage">{this.state.errors["wb1_girls_delivered_count"]}</span>
                                                                        <Input type="number" value={this.state.wb1_girls_delivered_count} name="wb1_girls_delivered_count" id="wb1_girls_delivered_count" onChange={(e) => {this.inputChange(e, "wb1_girls_delivered_count")}} max="999" min="1" onInput = {(e) =>{ e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,3)}} placeholder="Enter count in numbers"></Input> 
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" style={workbookBoysDistributeStyle}>
                                                                    <FormGroup >
                                                                        <Label for="wb1_boys_delivered_count" >Workbook Level 1 – Boys</Label>  <span class="errorMessage">{this.state.errors["wb1_boys_delivered_count"]}</span>
                                                                        <Input type="number" value={this.state.wb1_boys_delivered_count} name="wb1_boys_delivered_count" id="wb1_boys_delivered_count" onChange={(e) => {this.inputChange(e, "wb1_boys_delivered_count")}} max="999" min="1" onInput = {(e) =>{ e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,3)}} placeholder="Enter count in numbers"></Input> 
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6" style={workbookGirlsDistributeStyle}>
                                                                    <FormGroup >
                                                                        <Label for="wb2_girls_delivered_count" >Workbook Level 2 – Girls</Label> <span class="errorMessage">{this.state.errors["wb2_girls_delivered_count"]}</span>
                                                                        <Input type="number" value={this.state.wb2_girls_delivered_count} name="wb2_girls_delivered_count" id="wb2_girls_delivered_count" onChange={(e) => {this.inputChange(e, "wb2_girls_delivered_count")}} max="999" min="1" onInput = {(e) =>{ e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,3)}} placeholder="Enter count in numbers"></Input> 
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" style={workbookBoysDistributeStyle}>
                                                                    <FormGroup >
                                                                        <Label for="wb2_boys_delivered_count" >Workbook Level 2 – Boys</Label> <span class="errorMessage">{this.state.errors["wb2_boys_delivered_count"]}</span>
                                                                        <Input type="number" value={this.state.wb2_boys_delivered_count} name="wb2_boys_delivered_count" id="wb2_boys_delivered_count" onChange={(e) => {this.inputChange(e, "wb2_boys_delivered_count")}} max="999" min="1" onInput = {(e) =>{ e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,3)}} placeholder="Enter count in numbers"></Input> 
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6" style={otherResourcesDistributeStyle}>
                                                                <FormGroup >
                                                                        <Label for="other_resource_delivered_count" >Other Resource</Label>  <span class="errorMessage">{this.state.errors["other_resource_delivered_count"]}</span>
                                                                        <Input type="number" value={this.state.other_resource_delivered_count} name="other_resource_delivered_count" id="other_resource_delivered_count" onChange={(e) => {this.inputChange(e, "other_resource_delivered_count")}} max="999" min="1" onInput = {(e) =>{ e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,3)}} placeholder="Enter count in numbers"></Input> 
                                                                </FormGroup>
                                                                </Col>

                                                                <Col md="12" style={specifyOtherResourcesDistributeStyle}>
                                                                    <FormGroup >
                                                                        <Label for="other_resource_delivered_type" >Specify other type of resource</Label> <span class="errorMessage">{this.state.errors["other_resource_delivered_type"]}</span> 
                                                                        <Input value={this.state.other_resource_delivered_type} name="other_resource_delivered_type" id="other_resource_delivered_type" onChange={(e) => {this.inputChange(e, "other_resource_delivered_type")}} placeholder="Enter other type of resource"></Input> 
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

export default SecondaryMonitoringNew;


