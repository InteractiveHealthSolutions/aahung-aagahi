/**
 * @author Tahira Niazi
 * @email tahira.niazi@ihsinformatics.com
 * @create date 2019-08-18 23:29:42
 * @modify date 2019-08-18 23:29:42
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
import { location, getDistrictsByProvince} from "../util/LocationUtil.js";
import moment from 'moment';
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

const monitors = [
    { label: 'Harry Potter', value: 'harry123'},
    { label: 'Hermione Granger', value: 'herione456'},

];
const facilitatorTypeOptions = [
    { value: 'parents', label: 'Parents' },
    { value: 'teachers', label: 'Teachers' },
    { value: 'school_management', label: 'School Management' },
    { value: 'aahung_trainers', label: 'Aahung Trainers' },
];

const previousTopicCoveredOptions = [
    { value: 'understanding_family', label: 'Understanding Family' },
    { value: 'healthy_relationships', label: 'Healthy Relationships' },
    { value: 'gender_1', label: 'Gender I' },
    { value: 'gender_2', label: 'Gender II' },
    { value: 'violence', label: 'Violence' },
    { value: 'safe_use_icts', label: 'Safe Use of ICTs' },
    { value: 'puberty', label: 'Puberty' },
    { value: 'body_image', label: 'Body Image' },
    { value: 'child_early_forced_marriages', label: 'Child Early and Forced Marriages' },
    { value: 'financial_literacy', label: 'Financial Literacy' },
    { value: 'other', label: 'Other' }, 
    
];

class ParentSessions extends React.Component {

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
            previous_topic_covered: '',
            parent_session_conducted: '',
            next_session_plan: '',
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
        this.getObject = this.getObject.bind(this);
        this.inputChange = this.inputChange.bind(this);

        this.isSessionConducted = false;
        this.isGenderBoth = false;
        this.isPreviousTopicOther = false;
        this.isNextPlan = false;
        this.score = 0;
        this.totalScore = 0; 
        this.scoreArray = [];
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

        if(name === "parent_attendant") {
            this.isGenderBoth = e.target.value === "both" ? true : false; 
        }

        

    }

    // calculate score from scoring questions (radiobuttons)
    scoreChange = (e, name) => {
        this.setState({
            [name]: e.target.value
        });
        // alert(e.target.name); // field_name
        // alert(e.target.id); // yes or strongly agree
        // alert(e.target.value); // 0 || 1 || 2 || 3 || 4 || 5

        if(name === "parent_session_conducted") {
            this.isSessionConducted = e.target.id === "yes" ? true : false;
            this.isGenderBoth = this.state.parent_attendant === "both" && e.target.id === "yes" ? true : false;
            this.isNextPlan = this.state.next_session_plan === "yes" && e.target.id === "yes" ? true : false;

            if(e.target.id === "yes") {
                if (getObject('other', this.state.previous_topic_covered, 'value' ) != -1) { 
                    this.isPreviousTopicOther =  true;
                }
                if (getObject('other', this.state.previous_topic_covered, 'value') == -1) {
                    this.isPreviousTopicOther = false;
                }
            }
            else 
                this.isPreviousTopicOther = false;
            
        }

        if(name === "next_session_plan") {
            this.isNextPlan = e.target.id === "yes" ? true : false; 
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
                    parent_session_score : this.score,
                    parent_session_score_pct : percent
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

        if (name === "previous_topic_covered") {
            // checking twice because when another value is selected and other is unchecked, it still does not change the state
            if (getObject('other', e, 'value') != -1) { 
                this.isPreviousTopicOther =  true;
            }
            if (getObject('other', e, 'value') == -1) {
                this.isPreviousTopicOther =  false;
            }
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

        if(name === "province"){
            let districts = getDistrictsByProvince(e.id); // sending province integer id
            console.log(districts);
            this.setState({
                districtArray : districts
            })
        }
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
            // alert(errors["csa_prompts"]);
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
        
        const monitoredCsaStyle = this.state.isCsa ? {} : { display: 'none' };
        const monitoredGenderStyle = this.state.isGender ? {} : { display: 'none' };
        const sessionConductedStyle = this.isSessionConducted ? {} : { display: 'none' };
        const genderBothStyle = this.isGenderBoth ? {} : { display: 'none' };
        const nextPlanStyle = this.isNextPlan ? {} : { display: 'none' };
        const otherTopicStyle = this.isPreviousTopicOther ? {} : { display: 'none' };
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
                                                <b>Parent Sessions</b>
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
                                                            </Row>

                                                            {/* <Row>
                                                                <Col md="6">
                                                                    <FormGroup>
                                                                        <Label for="province" >Province</Label> <span class="errorMessage">{this.state.errors["province"]}</span>
                                                                        <Select id="province" name="province" value={this.state.province} onChange={(e) => this.handleChange(e, "province")} options={location.provinces} required/>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6">
                                                                    <FormGroup> 
                                                                        <Label for="district" >District</Label> <span class="errorMessage">{this.state.errors["district"]}</span>
                                                                        <Select id="district" name="district" value={this.state.district} onChange={(e) => this.handleChange(e, "district")} options={this.state.districtArray} required/>
                                                                    </FormGroup>
                                                                </Col>

                                                            </Row> */}

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
                                                                        <Input name="school_name" id="school_name" value={this.state.school_name} placeholder="School Name will be autopulated" disabled/>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            
                                                        <Row>
                                                            <Col md="6">
                                                                <FormGroup >
                                                                    <Label for="monitor" >Monitored By</Label>
                                                                    <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e, "monitor")} value={this.state.monitor} id="monitor" options={monitors} required/>
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

                                                        

                                                        <Row>
                                                            <Col md="6">
                                                                <Label><h6><u><b>Parent Sessions</b></u></h6></Label>
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="parent_session_conducted" >Does this school conduct parent sessions?</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="parent_session_conducted" id="yes" value="1" onChange={(e) => this.scoreChange(e, "parent_session_conducted")} />{' '}
                                                                                    Yes
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="parent_session_conducted" id="no" value="0" onChange={(e) => this.scoreChange(e, "parent_session_conducted")} />{' '}
                                                                                    No
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["parent_session_conducted"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            
                                                            <Row>
                                                                <Col md="12" style={sessionConductedStyle}>
                                                                    <FormGroup >
                                                                        <Label for="session_actively_organized" >School Management is active in organizing parent sessions for parents of primary students</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="session_actively_organized" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "session_actively_organized")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="session_actively_organized" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "session_actively_organized")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="session_actively_organized" id="neither" value="3" onChange={(e) => this.scoreChange(e, "session_actively_organized")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="session_actively_organized" id="agree" value="4" onChange={(e) => this.scoreChange(e, "session_actively_organized")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="session_actively_organized" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "session_actively_organized")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["session_actively_organized"]}</span>
                                                                            </Col>
                                                                    </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6" style={sessionConductedStyle}>
                                                                    <FormGroup inline>
                                                                        <Label for="lastest_session_date" >Date of Last Parent Session</Label> <span class="errorMessage">{this.state.errors["lastest_session_date"]}</span>
                                                                        <Input type="date" name="lastest_session_date" id="lastest_session_date" value={this.state.lastest_session_date} onChange={(e) => {this.inputChange(e, "lastest_session_date")}} max={moment().format("YYYY-MM-DD")} />
                                                                    </FormGroup>
                                                                </Col>
                                                            
                                                                <Col md="6" style={sessionConductedStyle}>
                                                                    <FormGroup >
                                                                        <Label for="session_count" >Number of parent sessions held since beginning of school year</Label>  <span class="errorMessage">{this.state.errors["session_count"]}</span>
                                                                        <Input type="number" value={this.state.session_count} name="session_count" id="session_count" onChange={(e) => {this.inputChange(e, "session_count")}} max="99" min="1" onInput = {(e) =>{ e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,2)}} placeholder="Enter count in numbers"></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6" style={sessionConductedStyle}>
                                                                    <FormGroup >
                                                                        <Label for="avg_participant_count" >Average number of participants in sessions</Label>  <span class="errorMessage">{this.state.errors["session_count"]}</span>
                                                                        <Input type="number" value={this.state.avg_participant_count} name="avg_participant_count" id="avg_participant_count" onChange={(e) => {this.inputChange(e, "avg_participant_count")}} max="99" min="1" onInput = {(e) =>{ e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,3)}} placeholder="Enter count in numbers"></Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" style={sessionConductedStyle}>
                                                                    <FormGroup >
                                                                        <Label for="parent_attendant" >Which parent(s) attends the session?</Label>
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "parent_attendant")} value={this.state.parent_attendant} name="parent_attendant" id="parent_attendant">
                                                                            <option value="mothers">Mothers</option>
                                                                            <option value="fathers">Fathers</option>
                                                                            <option value="both">Both</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" style={genderBothStyle}>
                                                                    <FormGroup >
                                                                        <Label for="session_organization" >How are the sessions organized?</Label>
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "session_organization")} value={this.state.session_organization} name="session_organization" id="session_organization">
                                                                            <option value="separate">Separate Sessions</option>
                                                                            <option value="joint">Joint Sessions</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            
                                                                <Col md="6" style={sessionConductedStyle}>
                                                                    <FormGroup >
                                                                            <Label for="facilitator_type" >Facilitator</Label>
                                                                            <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e, "facilitator_type")} value={this.state.facilitator_type} id="facilitator_type" options={facilitatorTypeOptions} />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="6" style={sessionConductedStyle}>
                                                                <FormGroup >
                                                                        <Label for="previous_topic_covered" >Topics covered in previous sessions</Label>
                                                                        <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e, "previous_topic_covered")} value={this.state.previous_topic_covered} id="previous_topic_covered" options={previousTopicCoveredOptions} />
                                                                </FormGroup>
                                                            </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12" style={otherTopicStyle}>
                                                                    <FormGroup >
                                                                        <Label for="previous_topic_covered_other" >Specify Other</Label>
                                                                        <Input name="previous_topic_covered_other" id="previous_topic_covered_other" value={this.state.previous_topic_covered_other} placeholder="Enter text"/>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="6" style={sessionConductedStyle}>
                                                                    <FormGroup >
                                                                        <Label for="next_session_plan" >Is the next parent session planned?</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="next_session_plan" id="yes" value="1" onChange={(e) => this.scoreChange(e, "next_session_plan")} />{' '}
                                                                                    Yes
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="next_session_plan" id="no" value="0" onChange={(e) => this.scoreChange(e, "next_session_plan")} />{' '}
                                                                                    No
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["next_session_plan"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" style={nextPlanStyle}>
                                                                    <FormGroup inline>
                                                                        <Label for="next_session_date" >Date of next session</Label> <span class="errorMessage">{this.state.errors["next_session_date"]}</span>
                                                                        <Input type="date" name="next_session_date" id="next_session_date" value={this.state.next_session_date} onChange={(e) => {this.inputChange(e, "next_session_date")}} max={moment().format("YYYY-MM-DD")}/>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup className="monitoringScoreBox">
                                                                        <Label for="parent_session_score" style={{color: "green"}}><b>Cumulative Parent Session Score</b></Label>
                                                                        <Input value={this.state.parent_session_score} name="parent_session_score" id="parent_session_score"  onChange={(e) => {this.inputChange(e, "parent_session_score")}} ></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup className="monitoringScoreBox">
                                                                        {/* TODO: apply style to hide this based on csa/primary question */}
                                                                        <Label for="parent_session_score_pct" style={{color: "green"}}><b>% Score</b></Label>
                                                                        <Input name="parent_session_score_pct" id="parent_session_score_pct" value={this.state.parent_session_score_pct} onChange={(e) => {this.inputChange(e, "parent_session_score_pct")}} ></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            {/* please don't remove this div unless you are adding multiple questions here*/}
                                                            <div style={{height: '180px'}}><span>   </span></div>
                                                        
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

export default ParentSessions;