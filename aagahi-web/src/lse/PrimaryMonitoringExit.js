/*
 * @Author: tahira.niazi@ihsinformatics.com 
 * @Date: 2019-08-08 13:20:44 
 * @Last Modified by:   tahira.niazi@ihsinformatics.com 
 * @Last Modified time: 2019-09-13 02:04:42 
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

const participants = [
    { label: 'Nelson Mandela', value: 'nelsone657'},
    { label: 'Roger Federer', value: 'roger456'},
    { label: 'Harry Potter', value: 'harry123'},
];

const schools = [
    { value: 'khileahi', label: 'Karachi Learning High School' },
    { value: 'khibahcol', label: 'Bahria College Karsaz' },
    { value: 'khihbpub', label: 'Habib Public School' },
];

const csaFlashcards = [
    { value: 'one', label: '1' },
    { value: 'two', label: '2' },
    { value: 'three', label: '3' },
    { value: 'four', label: '4' },
    { value: 'five', label: '5' },
    { value: 'six', label: '6' },
    { value: 'seven', label: '7' },
    { value: 'eight', label: '8' },
];

const genderFlashcards = [
    { value: 'one', label: '1' },
    { value: 'two', label: '2' },
    { value: 'three', label: '3' },
    { value: 'four', label: '4' },
    { value: 'five', label: '5' },
    { value: 'six', label: '6' },
    { value: 'seven', label: '7' },
    { value: 'eight', label: '8' },
    { value: 'nine', label: '9' },
    { value: 'ten', label: '10' },
];

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

const monitors = [
    { value: 'uuid1', label: 'Harry Potter' },
    { value: 'uuid2', label: 'Ron Weasley' },
    { value: 'uuid3', label: 'Hermione Granger' },
    { value: 'uuid4', label: 'Albus Dumbledore' },
];

const new_activities_options = [
    { value: 'new_activities', label: 'New activities' },
    { value: 'additional_probes', label: 'Additional Probes' },
    { value: 'additional_info', label: 'Additional Information' },
    { value: 'additional_videos', label: 'Additional videos' },
];

class PrimaryMonitoringExit extends React.Component {

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

        this.isCsaBeyondGuide = false;
        this.isGenderBeyondGuide = false;
        this.isCsaIntegrated = false;
        this.isGenderIntegrated = false;
        this.isCsaFrequencyOther = false;
        this.isGenderFrequencyOther = false;
        this.isCsaChallenge1 = false;
        this.isCsaChallenge2 = false;
        this.isCsaChallenge3 = false;
        this.isCsaChallenge4 = false;
        this.isCsaChallenge5 = false;
        this.isCsaChallenge6 = false;
        this.isGenderChallenge1 = false;
        this.isGenderChallenge2 = false;
        this.isGenderChallenge3 = false;
        this.isGenderChallenge4 = false;
        this.isGenderChallenge5 = false;
        this.isGenderChallenge6 = false;
        this.isCsaResourcesRequired = false;
        this.isGenderResourcesRequired = false;
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

        if(name === "csa_challenge_1")
            this.isCsaChallenge1 = e.target.id === "yes" ? true : false;
        if(name === "csa_challenge_2")    
            this.isCsaChallenge2 = e.target.id === "yes" ? true : false;
        if(name === "csa_challenge_3")
            this.isCsaChallenge3 = e.target.id === "yes" ? true : false;
        if(name === "csa_challenge_4")
            this.isCsaChallenge4 = e.target.id === "yes" ? true : false;
        if(name === "csa_challenge_5")
            this.isCsaChallenge5 = e.target.id === "yes" ? true : false;
        if(name === "csa_challenge_6")
            this.isCsaChallenge6 = e.target.id === "yes" ? true : false;

        // for gender
        if(name === "gender_challenge_1")
            this.isGenderChallenge1 = e.target.id === "yes" ? true : false;
        if(name === "gender_challenge_2")    
            this.isGenderChallenge2 = e.target.id === "yes" ? true : false;
        if(name === "gender_challenge_3")
            this.isGenderChallenge3 = e.target.id === "yes" ? true : false;
        if(name === "gender_challenge_4")
            this.isGenderChallenge4 = e.target.id === "yes" ? true : false;
        if(name === "gender_challenge_5")
            this.isGenderChallenge5 = e.target.id === "yes" ? true : false;
        if(name === "gender_challenge_6")
            this.isGenderChallenge6 = e.target.id === "yes" ? true : false;

        // for csa  - required
        if(name === "csa_resources_required")
            this.isCsaResourcesRequired = e.target.id === "yes" ? true : false;

        if(name === "csa_other_required_count" )
            this.isCsaOtherResourcesRequired = e.target.value > 0 ? true : false;

        // for gender - required
        if(name === "gender_resources_required")
            this.isGenderResourcesRequired = e.target.id === "yes" ? true : false;
        

        if(name === "gender_other_required_count" )
            this.isGenderOtherResourcesRequired = e.target.value > 0 ? true : false;


        // for csa - delivered
        if(name === "csa_resources_delivered")
            this.isCsaResourcesDelivered = e.target.id === "yes" ? true : false;

        if(name === "csa_other_delivered_count" )
            this.isCsaOtherResourcesDelivered = e.target.value > 0 ? true : false;

        // for gender - delivered
        if(name === "gender_resources_delivered")
            this.isGenderResourcesDelivered = e.target.id === "yes" ? true : false;
        

        if(name === "gender_other_delivered_count" )
            this.isGenderOtherResourcesDelivered = e.target.value > 0 ? true : false;

    }

    // for single select
    valueChange = (e, name) => {
        this.setState ({sex : e.target.value });
        this.setState ({sex : e.target.value });
        this.setState({
            [name]: e.target.value
        });

        if(name === "school_sex")
            this.setState( {class_sex: e.target.value === "girls" ? 'girls' : 'boys'});

        if(e.target.id === "program_type") {
            if(e.target.value === "csa") {
                this.setState({isCsa : true });
                this.setState({isGender : false });
                
            }
            else if(e.target.value === "gender") {
                this.setState({isCsa : false });
                this.setState({isGender : true });
            }
        }


        if(name == "csa_class_frequency") {
            this.isCsaFrequencyOther = e.target.value === "other" ? true : false;
        }

        if(name == "gender_class_frequency") {
            this.isGenderFrequencyOther = e.target.value === "other" ? true : false;
        }     

    }

    // calculate score from scoring questions (radiobuttons)
    scoreChange = (e, name) => {
        this.setState({
            [name]: e.target.value
        });
        
        if(name === "csa_beyond_guide") {
            this.isCsaBeyondGuide = e.target.id === "yes" ? true : false; 
        }

        if(name === "gender_beyond_guide") {
            this.isGenderBeyondGuide = e.target.id === "yes" ? true : false; 
        }

        if(name === "csa_timetable_integration") {
            this.isCsaIntegrated = e.target.id === "yes" ? true : false; 
        }

        if(name === "gender_timetable_integration") {
            this.isGenderIntegrated = e.target.id === "yes" ? true : false;
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
        const csaBeyondGuideStyle = this.isCsaBeyondGuide ? {} : { display: 'none' };
        const genderBeyondGuideStyle = this.isGenderBeyondGuide ? {} : { display: 'none' };
        const csaIntegratedStyle = this.isCsaIntegrated ? {} : { display: 'none' };
        const genderIntegratedStyle = this.isGenderIntegrated ? {} : { display: 'none' };
        const csaFrequencyOtherStyle = this.isCsaFrequencyOther ? {} : { display: 'none' };
        const genderFrequencyOtherStyle = this.isGenderFrequencyOther ? {} : { display: 'none' };
        
        const csaChallenge1Style = this.isCsaChallenge1 ? {} : { display: 'none' };
        const csaChallenge2Style = this.isCsaChallenge2 ? {} : { display: 'none' };
        const csaChallenge3Style = this.isCsaChallenge3 ? {} : { display: 'none' };
        const csaChallenge4Style = this.isCsaChallenge4 ? {} : { display: 'none' };
        const csaChallenge5Style = this.isCsaChallenge5 ? {} : { display: 'none' };
        const csaChallenge6Style = this.isCsaChallenge6 ? {} : { display: 'none' };

        const genderChallenge1Style = this.isGenderChallenge1 ? {} : { display: 'none' };
        const genderChallenge2Style = this.isGenderChallenge2 ? {} : { display: 'none' };
        const genderChallenge3Style = this.isGenderChallenge3 ? {} : { display: 'none' };
        const genderChallenge4Style = this.isGenderChallenge4 ? {} : { display: 'none' };
        const genderChallenge5Style = this.isGenderChallenge5 ? {} : { display: 'none' };
        const genderChallenge6Style = this.isGenderChallenge6 ? {} : { display: 'none' };

        const csaResourcesRequiredStyle = this.isCsaResourcesRequired ? {} : { display: 'none' };
        const genderResourcesRequiredStyle = this.isGenderResourcesRequired ? {} : { display: 'none' };

        const csaOtherResourcesReqStyle = this.isCsaOtherResourcesRequired ? {} : { display: 'none' };
        const genderOtherResourcesReqStyle = this.isGenderOtherResourcesRequired ? {} : { display: 'none' };

        const csaResourcesDeliveredStyle = this.isCsaResourcesDelivered ? {} : { display: 'none' };
        const genderResourcesDeliveredStyle = this.isGenderResourcesDelivered ? {} : { display: 'none' };

        const csaOtherResourcesDelStyle = this.isCsaOtherResourcesDelivered ? {} : { display: 'none' };
        const genderOtherResourcesDelStyle = this.isGenderOtherResourcesDelivered ? {} : { display: 'none' };

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
                                                <b>Primary Monitoring Form - Exit</b>
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
                                                                        <Input type="date" name="date_start" id="date_start" value={this.state.date_start} onChange={(e) => {this.inputChange(e, "date_start")}} max={moment().format("YYYY-MM-DD")} required/>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                
                                                                    <FormGroup >
                                                                        <Label for="school_name" >School Name</Label>
                                                                        <Select id="school_id" name="school_id" value={this.state.school_id} onChange={(e) => this.handleChange(e, "school_id")} options={schools} />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            
                                                            <Row>
                                                                
                                                                
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
                                                                    <FormGroup >
                                                                    <Label for="class_sex" >Students in Class by Sex</Label>
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "class_sex")} value={this.state.class_sex} name="class_sex" id="class_sex">
                                                                            <option value="girls">Girls</option>
                                                                            <option value="boys">Boys</option>
                                                                            <option value="coed">Co-ed</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup>
                                                                        <Label for="participant_name" >Name of Teacher</Label>
                                                                        <Select id="participant_name" name="participant_name" value={this.state.participant_name} onChange={(e) => this.handleChange(e, "participant_name")} options={participants} />
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
                                                                        <Label for="primary_grade" >Class</Label>
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "primary_grade")} value={this.state.primary_grade} name="primary_grade" id="primary_grade">
                                                                            
                                                                            <option value="one">1</option>
                                                                            <option value="two">2</option>
                                                                            <option value="three">3</option>
                                                                            <option value="four">4</option>
                                                                            <option value="five">5</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="class_students" >Number of Students in Class</Label>
                                                                        <Input type="number" name="class_students" id="class_students" value={this.state.class_students} onInput = {(e) =>{ e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,2)}} max="99" min="1"/>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="class_duration" >Time duration of class in minutes</Label>
                                                                        <Input type="number" name="class_duration" id="class_duration" value={this.state.class_duration} onInput = {(e) =>{ e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,3)}} max="999" min="1"/>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="program_type" >Primary Program</Label>
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "program_type")} value={this.state.program_type} name="program_type" id="program_type">
                                                                            
                                                                            <option value="csa">CSA</option>
                                                                            <option value="gender">Gender</option>
                                                                            
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
                                                                    <FormGroup >
                                                                        <Label for="csa_flashcard" >CSA Flashcard being run</Label> <span class="errorMessage">{this.state.errors["csa_flashcard"]}</span>
                                                                        <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e, "csa_flashcard")} value={this.state.csa_flashcard} id="csa_flashcard" options={csaFlashcards} required/>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="csa_flashcard_revision" >Revision or first time flashcard is being taught</Label> <span class="errorMessage">{this.state.errors["csa_flashcard_revision"]}</span>
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "csa_flashcard_revision")} value={this.state.csa_flashcard_revision} name="csa_flashcard_revision" id="csa_flashcard_revision" required>
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
                                                                        <Label for="csa_prompts" >The teacher is using the prompts provided in the CSA flashcard guide</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_prompts" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "csa_prompts")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_prompts" id="disagree" value="2"  onChange={(e) => this.scoreChange(e, "csa_prompts")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_prompts" id="neither" value="3" onChange={(e) => this.scoreChange(e, "csa_prompts")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_prompts" id="agree" value="4" onChange={(e) => this.scoreChange(e, "csa_prompts")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_prompts" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "csa_prompts")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["csa_prompts"]}</span>
                                                                            </Col>
                                                                    </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                                
                                                            </Row>

                                                            <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="csa_flashcard_objective" >The teacher is meeting the objective of each flashcard even if they are not using all prompts provided in the CSA flashcard guide</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                {/* TODO: fill UUIDs */}
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_flashcard_objective" id="strongly_disagree" value="1"  onChange={(e) => this.scoreChange(e, "csa_flashcard_objective")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_flashcard_objective" id="disagree" value="2"  onChange={(e) => this.scoreChange(e, "csa_flashcard_objective")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_flashcard_objective" id="neither" value="3" onChange={(e) => this.scoreChange(e, "csa_flashcard_objective")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_flashcard_objective" id="agree" value="4" onChange={(e) => this.scoreChange(e, "csa_flashcard_objective")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_flashcard_objective" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "csa_flashcard_objective")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["csa_flashcard_objective"]}</span>
                                                                            </Col>
                                                                    </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="csa_material_preparation" >The teacher had all materials prepared in advance for the class</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                {/* TODO: fill UUIDs */}
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_material_preparation" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "csa_material_preparation")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_material_preparation" id="disagree" value="2"  onChange={(e) => this.scoreChange(e, "csa_material_preparation")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_material_preparation" id="neither" value="3" onChange={(e) => this.scoreChange(e, "csa_material_preparation")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_material_preparation" id="agree" value="4" onChange={(e) => this.scoreChange(e, "csa_material_preparation")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_material_preparation" id="strongly_agree" value="5"  onChange={(e) => this.scoreChange(e, "csa_material_preparation")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["csa_material_preparation"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="csa_teacher_preparation" >The teacher was well prepared to facilitate the session</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_teacher_preparation" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "csa_teacher_preparation")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_teacher_preparation" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "csa_teacher_preparation")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_teacher_preparation" id="neither" value="3" onChange={(e) => this.scoreChange(e, "csa_teacher_preparation")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_teacher_preparation" id="agree" value="4" onChange={(e) => this.scoreChange(e, "csa_teacher_preparation")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_teacher_preparation" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "csa_teacher_preparation")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["csa_teacher_preparation"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="csa_activity_time_allotment" >An appropriate amount of time is allotted for each activity and topic</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_activity_time_allotment" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "csa_activity_time_allotment")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_activity_time_allotment" id="disagree" value="2"  onChange={(e) => this.scoreChange(e, "csa_activity_time_allotment")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_activity_time_allotment" id="neither" value="3" onChange={(e) => this.scoreChange(e, "csa_activity_time_allotment")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_activity_time_allotment" id="agree" value="4" onChange={(e) => this.scoreChange(e, "csa_activity_time_allotment")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_activity_time_allotment" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "csa_activity_time_allotment")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["csa_activity_time_allotment"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="csa_beyond_guide" >Teacher has gone beyond the teacher’s guide to build on and/or develop new activities</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_beyond_guide" id="yes" value="1" onChange={(e) => this.scoreChange(e, "csa_beyond_guide")} />{' '}
                                                                                    Yes
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_beyond_guide" id="no" value="0"  onChange={(e) => this.scoreChange(e, "csa_beyond_guide")} />{' '}
                                                                                    No
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["csa_beyond_guide"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col md="8" style={csaBeyondGuideStyle}>
                                                                    <FormGroup >
                                                                        <Label for="csa_beyond_guide_new" >What has the teacher done that is new?</Label> <span class="errorMessage">{this.state.errors["csa_beyond_guide_new"]}</span>
                                                                        <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e, "csa_beyond_guide_new")} value={this.state.csa_beyond_guide_new} id="csa_beyond_guide_new" options={new_activities_options} required/>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="csa_subject_comfort" >The teacher is comfortable speaking about this subject</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_subject_comfort" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "csa_subject_comfort")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_subject_comfort" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "csa_subject_comfort")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_subject_comfort" id="neither" value="3" onChange={(e) => this.scoreChange(e, "csa_subject_comfort")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_subject_comfort" id="agree" value="4" onChange={(e) => this.scoreChange(e, "csa_subject_comfort")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_subject_comfort" id="strongly_agree" value="5" /* checked= {this.state.sex === 'Strongly Agree'} */ onChange={(e) => this.scoreChange(e, "csa_subject_comfort")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["csa_subject_comfort"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="csa_nonjudmental_tone" >The teacher uses a non-judgmental tone while facilitating the session</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_nonjudmental_tone" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "csa_nonjudmental_tone")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_nonjudmental_tone" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "csa_nonjudmental_tone")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_nonjudmental_tone" id="neither" value="3" onChange={(e) => this.scoreChange(e, "csa_nonjudmental_tone")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_nonjudmental_tone" id="agree" value="4" onChange={(e) => this.scoreChange(e, "csa_nonjudmental_tone")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_nonjudmental_tone" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "csa_nonjudmental_tone")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["csa_nonjudmental_tone"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>


                                                            <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="csa_impartial_opinions" >The teacher does not impose their own values or opinions on the participants</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_impartial_opinions" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "csa_impartial_opinions")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_impartial_opinions" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "csa_impartial_opinions")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_impartial_opinions" id="neither" value="3" onChange={(e) => this.scoreChange(e, "csa_impartial_opinions")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_impartial_opinions" id="agree" value="4" onChange={(e) => this.scoreChange(e, "csa_impartial_opinions")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_impartial_opinions" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "csa_impartial_opinions")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["csa_impartial_opinions"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="csa_student_engagement" >Students are engaged in discussion on flashcard(s)</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_student_engagement" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "csa_student_engagement")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_student_engagement" id="disagree" value="2"   onChange={(e) => this.scoreChange(e, "csa_student_engagement")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_student_engagement" id="neither" value="3"  onChange={(e) => this.scoreChange(e, "csa_student_engagement")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_student_engagement" id="agree" value="4"  onChange={(e) => this.scoreChange(e, "csa_student_engagement")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_student_engagement" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "csa_student_engagement")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["csa_student_engagement"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="csa_student_understanding" >Students understand the main messages of the flashcard(s)</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_student_understanding" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "csa_student_understanding")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_student_understanding" id="disagree" value="2"   onChange={(e) => this.scoreChange(e, "csa_student_understanding")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_student_understanding" id="neither" value="3"  onChange={(e) => this.scoreChange(e, "csa_student_understanding")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_student_understanding" id="agree" value="4"  onChange={(e) => this.scoreChange(e, "csa_student_understanding")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_student_understanding" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "csa_student_understanding")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["csa_student_understanding"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="csa_student_attention" >Students are actively paying attention to the class while the teacher is instructing</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_student_attention" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "csa_student_attention")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_student_attention" id="disagree" value="2"   onChange={(e) => this.scoreChange(e, "csa_student_attention")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_student_attention" id="neither" value="3"  onChange={(e) => this.scoreChange(e, "csa_student_attention")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_student_attention" id="agree" value="4"  onChange={(e) => this.scoreChange(e, "csa_student_attention")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_student_attention" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "csa_student_attention")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["csa_student_attention"]}</span>
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
                                                                        <Label for="csa_timetable_integration" >Management has integrated the CSA program into the school timetable</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_timetable_integration" id="yes" value="1" onChange={(e) => this.scoreChange(e, "csa_timetable_integration")} />{' '}
                                                                                    Yes
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_timetable_integration" id="no" value="0" onChange={(e) => this.scoreChange(e, "csa_timetable_integration")} />{' '}
                                                                                    No
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["csa_timetable_integration"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6" style={csaIntegratedStyle}>
                                                                    <FormGroup >
                                                                        <Label for="csa_class_frequency" >Frequency of class in time table</Label> <span class="errorMessage">{this.state.errors["csa_class_frequency"]}</span>
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "csa_class_frequency")} value={this.state.csa_class_frequency} name="csa_class_frequency" id="csa_class_frequency">
                                                                            <option value="weekly">Weekly</option>
                                                                            <option value="biweekly">Biweekly</option>
                                                                            <option value="monthly">Monthly</option>
                                                                            <option value="other">Other</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6" style={csaFrequencyOtherStyle}>
                                                                    <FormGroup >
                                                                        <Label for="csa_class_frequency_other" >If other, please specify</Label> <span class="errorMessage">{this.state.errors["csa_class_frequency_other"]}</span>
                                                                        <Input value={this.state.csa_class_frequency_other} name="csa_class_frequency_other" id="csa_class_frequency_other" onChange={(e) => {this.inputChange(e, "csa_class_frequency_other")}} ></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            
                                                            <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="csa_two_teacher_assigned" >There are at least 2 teachers assigned to teach the CSA program</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_two_teacher_assigned" id="yes" value="1" onChange={(e) => this.scoreChange(e, "csa_two_teacher_assigned")} />{' '}
                                                                                    Yes
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_two_teacher_assigned" id="no" value="0" onChange={(e) => this.scoreChange(e, "csa_two_teacher_assigned")} />{' '}
                                                                                    No
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["csa_two_teacher_assigned"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="csa_teacher_mgmt_coordination" >There is excellent coordination between management and teachers regarding the CSA program</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_teacher_mgmt_coordination" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "csa_teacher_mgmt_coordination")} />{' '}
                                                                                    {stronglyDisagree}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_teacher_mgmt_coordination" id="disagree" value="2"   onChange={(e) => this.scoreChange(e, "csa_teacher_mgmt_coordination")} />{' '}
                                                                                    {disagree}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_teacher_mgmt_coordination" id="neither" value="3"  onChange={(e) => this.scoreChange(e, "csa_teacher_mgmt_coordination")} />{' '}
                                                                                    {neither}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_teacher_mgmt_coordination" id="agree" value="4"  onChange={(e) => this.scoreChange(e, "csa_teacher_mgmt_coordination")} />{' '}
                                                                                    {agree}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_teacher_mgmt_coordination" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "csa_teacher_mgmt_coordination")} />{' '}
                                                                                    {stronglyAgree}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["csa_teacher_mgmt_coordination"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="8">
                                                                    <FormGroup>
                                                                        <Label for="csa_mt_num">Number of Master Trainers leading CSA program</Label>
                                                                        <Input type="number" value={this.state.csa_mt_num} name="csa_mt_num" id="csa_mt_num" onChange={(e) => {this.inputChange(e, "csa_mt_num")}} max="999" min="1" onInput = {(e) =>{ e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,2)}} placeholder="Enter in number"></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="csa_mt_teacher_coordination" >There is excellent coordination between Master Trainers and teachers regarding the CSA program</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_mt_teacher_coordination" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "csa_mt_teacher_coordination")} />{' '}
                                                                                    {stronglyDisagree}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_mt_teacher_coordination" id="disagree" value="2"   onChange={(e) => this.scoreChange(e, "csa_mt_teacher_coordination")} />{' '}
                                                                                    {disagree}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_mt_teacher_coordination" id="neither" value="3"  onChange={(e) => this.scoreChange(e, "csa_mt_teacher_coordination")} />{' '}
                                                                                    {neither}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_mt_teacher_coordination" id="agree" value="4"  onChange={(e) => this.scoreChange(e, "csa_mt_teacher_coordination")} />{' '}
                                                                                    {agree}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_mt_teacher_coordination" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "csa_mt_teacher_coordination")} />{' '}
                                                                                    {stronglyAgree}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["csa_mt_teacher_coordination"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>

                                                            </Row>

                                                            <Row>
                                                                <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="csa_mt_conduct_monitoring" >Master Trainers conduct regular monitoring sessions to maintain quality of CSA program</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_mt_conduct_monitoring" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "csa_mt_conduct_monitoring")} />{' '}
                                                                                    {stronglyDisagree}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_mt_conduct_monitoring" id="disagree" value="2"   onChange={(e) => this.scoreChange(e, "csa_mt_conduct_monitoring")} />{' '}
                                                                                    {disagree}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_mt_conduct_monitoring" id="neither" value="3"  onChange={(e) => this.scoreChange(e, "csa_mt_conduct_monitoring")} />{' '}
                                                                                    {neither}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_mt_conduct_monitoring" id="agree" value="4"  onChange={(e) => this.scoreChange(e, "csa_mt_conduct_monitoring")} />{' '}
                                                                                    {agree}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_mt_conduct_monitoring" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "csa_mt_conduct_monitoring")} />{' '}
                                                                                    {stronglyAgree}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["csa_mt_conduct_monitoring"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>

                                                            </Row>

                                                            <Row>
                                                                <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="csa_mt_conduct_training" >Master Trainers arrange and conduct refresher trainings as needed for CSA teachers</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_mt_conduct_training" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "csa_mt_conduct_training")} />{' '}
                                                                                    {stronglyDisagree}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_mt_conduct_training" id="disagree" value="2"   onChange={(e) => this.scoreChange(e, "csa_mt_conduct_training")} />{' '}
                                                                                    {disagree}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_mt_conduct_training" id="neither" value="3"  onChange={(e) => this.scoreChange(e, "csa_mt_conduct_training")} />{' '}
                                                                                    {neither}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_mt_conduct_training" id="agree" value="4"  onChange={(e) => this.scoreChange(e, "csa_mt_conduct_training")} />{' '}
                                                                                    {agree}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_mt_conduct_training" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "csa_mt_conduct_training")} />{' '}
                                                                                    {stronglyAgree}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["csa_mt_conduct_training"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            
                                                            <Row >
                                                                <Col md="6">
                                                                    <FormGroup className="monitoringScoreBox">
                                                                        <Label for="monitoring_score" style={{color: "green"}}><b>Cumulative Monitoring Score</b></Label>
                                                                        <Input value={this.state.monitoring_score} name="monitoring_score" id="monitoring_score" onChange={(e) => {this.inputChange(e, "monitoring_score")}} ></Input>
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
                                                                        <Label for="csa_challenge_1" >The school is facing challenges scheduling the CSA class</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_challenge_1" id="yes" value="1" onChange={(e) => {this.inputChange(e, "csa_challenge_1")}} />{' '}
                                                                                    {yes}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_challenge_1" id="no" value="0" onChange={(e) => {this.inputChange(e, "csa_challenge_1")}} />{' '}
                                                                                    {no}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["csa_challenge_1"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                            </Col>

                                                            <Col md="6" style={csaChallenge1Style}>
                                                                    <FormGroup >
                                                                    <Label for="csa_challenge_1_status" >Status of Challenge</Label> <span class="errorMessage">{this.state.errors["csa_challenge_1_status"]}</span>
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "csa_challenge_1_status")} value={this.state.csa_challenge_1_status} name="csa_challenge_1_status" id="csa_challenge_1_status">
                                                                            <option value="resolved">Resolved</option>
                                                                            <option value="unresolved">Unresolved</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="csa_challenge_2" >There are not enough resources</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_challenge_2" id="yes" value="1" onChange={(e) => {this.inputChange(e, "csa_challenge_2")}} />{' '}
                                                                                    Yes
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_challenge_2" id="no" value="0" onChange={(e) => {this.inputChange(e, "csa_challenge_2")}} />{' '}
                                                                                    No
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["csa_challenge_2"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6" style={csaChallenge2Style}>
                                                                <FormGroup >
                                                                    <Label for="csa_challenge_2_status" >Status of Challenge</Label> <span class="errorMessage">{this.state.errors["csa_challenge_2_status"]}</span>
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "csa_challenge_2_status")} value={this.state.csa_challenge_2_status} name="csa_challenge_2_status" id="csa_challenge_2_status">
                                                                            <option value="resolved">Resolved</option>
                                                                            <option value="unresolved">Unresolved</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="csa_challenge_3" >There is no room for the class</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_challenge_3" id="yes" value="1" onChange={(e) => {this.inputChange(e, "csa_challenge_3")}} />{' '}
                                                                                    Yes
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_challenge_3" id="no" value="0" onChange={(e) => {this.inputChange(e, "csa_challenge_3")}} />{' '}
                                                                                    No
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["csa_challenge_3"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6" style={csaChallenge3Style}>
                                                                <FormGroup >
                                                                    <Label for="csa_challenge_3_status" >Status of Challenge</Label> <span class="errorMessage">{this.state.errors["csa_challenge_3_status"]}</span>
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "csa_challenge_3_status")} value={this.state.csa_challenge_3_status} name="csa_challenge_3_status" id="csa_challenge_3_status">
                                                                            <option value="resolved">Resolved</option>
                                                                            <option value="unresolved">Unresolved</option>
                                                                        </Input><span class="errorMessage">{this.state.errors[""]}</span>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="csa_challenge_4" >There are not enough teachers to teach the CSA class</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_challenge_4" id="yes" value="1" onChange={(e) => {this.inputChange(e, "csa_challenge_4")}} />{' '}
                                                                                    Yes
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_challenge_4" id="no" value="0" onChange={(e) => {this.inputChange(e, "csa_challenge_4")}} />{' '}
                                                                                    No
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["csa_challenge_4"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6" style={csaChallenge4Style}>
                                                                <FormGroup >
                                                                    <Label for="csa_challenge_4_status" >Status of Challenge</Label> <span class="errorMessage">{this.state.errors["csa_challenge_4_status"]}</span>
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "csa_challenge_4_status")} value={this.state.csa_challenge_4_status} name="csa_challenge_4_status" id="csa_challenge_4_status">
                                                                            <option value="resolved">Resolved</option>
                                                                            <option value="unresolved">Unresolved</option>
                                                                        </Input> 
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup style={monitoredCsaStyle}>
                                                                        <Label for="csa_challenge_5" >The content is irrelevant for the context of the students</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_challenge_5" id="yes" value="1" onChange={(e) => {this.inputChange(e, "csa_challenge_5")}} />{' '}
                                                                                    Yes
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_challenge_5" id="no" value="0" onChange={(e) => {this.inputChange(e, "csa_challenge_5")}} />{' '}
                                                                                    No
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["csa_challenge_5"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6" style={csaChallenge5Style}>
                                                                <FormGroup >
                                                                    <Label for="csa_challenge_5_status" >Status of Challenge</Label> <span class="errorMessage">{this.state.errors["csa_challenge_5_status"]}</span>
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "csa_challenge_5_status")} value={this.state.csa_challenge_5_status} name="csa_challenge_5_status" id="csa_challenge_5_status">
                                                                            <option value="resolved">Resolved</option>
                                                                            <option value="unresolved">Unresolved</option>
                                                                        </Input> 
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="csa_challenge_6" >Students are not interested in the content</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_challenge_6" id="yes" value="1" onChange={(e) => {this.inputChange(e, "csa_challenge_6")}} />{' '}
                                                                                    Yes
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_challenge_6" id="no" value="0" onChange={(e) => {this.inputChange(e, "csa_challenge_6")}} />{' '}
                                                                                    No
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["csa_challenge_6"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6" style={csaChallenge6Style}>
                                                                <FormGroup >
                                                                    <Label for="csa_challenge_6_status" >Status of Challenge</Label> <span class="errorMessage">{this.state.errors["csa_challenge_6_status"]}</span>
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "csa_challenge_6_status")} value={this.state.csa_challenge_6_status} name="csa_challenge_6_status" id="csa_challenge_6_status">
                                                                            <option value="resolved">Resolved</option>
                                                                            <option value="unresolved">Unresolved</option>
                                                                        </Input> 
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
                                                                        <Label for="csa_resources_required">Does this school require any resources?</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_resources_required" id="yes" value="1" onChange={(e) => {this.inputChange(e, "csa_resources_required")}} />{' '}
                                                                                    Yes
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_resources_required" id="no" value="0" onChange={(e) => {this.inputChange(e, "csa_resources_required")}} />{' '}
                                                                                    No
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["csa_resources_required"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6" style={csaResourcesRequiredStyle}>
                                                                    <FormGroup >
                                                                        <Label for="csa_flashcard_guides_req_num" >CSA Flashcard Guides</Label>  <span class="errorMessage">{this.state.errors["csa_flashcard_guides_req_num"]}</span>
                                                                        <Input type="number" value={this.state.csa_flashcard_guides_req_num} name="csa_flashcard_guides_req_num" id="csa_flashcard_guides_req_num" onChange={(e) => {this.inputChange(e, "csa_flashcard_guides_req_num")}} max="999" min="1" onInput = {(e) =>{ e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,3)}} placeholder="Enter count in numbers"></Input> 
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6" style={csaResourcesRequiredStyle}>
                                                                    <FormGroup >
                                                                        <Label for="csa_book_required_count" >Drawing Books</Label>  <span class="errorMessage">{this.state.errors["csa_book_required_count"]}</span>
                                                                        <Input type="number" value={this.state.csa_book_required_count} name="csa_book_required_count" id="csa_book_required_count" onChange={(e) => {this.inputChange(e, "csa_book_required_count")}} max="999" min="1" onInput = {(e) =>{ e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,3)}} placeholder="Enter count in numbers"></Input> 
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6" style={csaResourcesRequiredStyle}>
                                                                    <FormGroup >
                                                                        <Label for="csa_other_required_count" >Other Resource</Label> <span class="errorMessage">{this.state.errors["csa_other_required_count"]}</span>
                                                                        <Input type="number" value={this.state.csa_other_required_count} name="csa_other_required_count" id="csa_other_required_count" onChange={(e) => {this.inputChange(e, "csa_other_required_count")}} max="999" min="1" onInput = {(e) =>{ e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,3)}} placeholder="Enter count in numbers"></Input> 
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="12" style={csaOtherResourcesReqStyle}>
                                                                    <FormGroup >
                                                                        <Label for="csa_other_required_type" >Specify other type of resource</Label> <span class="errorMessage">{this.state.errors["csa_other_required_type"]}</span>
                                                                        <Input value={this.state.csa_other_required_type} name="csa_other_required_type" id="csa_other_required_type" onChange={(e) => {this.inputChange(e, "csa_other_required_type")}} placeholder="Enter other type of resource"></Input> 
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>


                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="csa_resources_delivered">Were any resources distributed to this school in this visit?</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_resources_delivered" id="yes" value="1" onChange={(e) => {this.inputChange(e, "csa_resources_delivered")}} />{' '}
                                                                                    Yes
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_resources_delivered" id="no" value="0" onChange={(e) => {this.inputChange(e, "csa_resources_delivered")}} />{' '}
                                                                                    No
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["csa_resources_delivered"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6" style={csaResourcesDeliveredStyle}>
                                                                    <FormGroup >
                                                                        <Label for="csa_guide_delivered_count" >CSA Flashcard Guides</Label>  <span class="errorMessage">{this.state.errors["csa_guide_delivered_count"]}</span>
                                                                        <Input type="number" value={this.state.csa_guide_delivered_count} name="csa_guide_delivered_count" id="csa_guide_delivered_count" onChange={(e) => {this.inputChange(e, "csa_guide_delivered_count")}} max="999" min="1" onInput = {(e) =>{ e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,3)}} placeholder="Enter count in numbers"></Input> 
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6" style={csaResourcesDeliveredStyle}>
                                                                    <FormGroup >
                                                                        <Label for="csa_book_delivered_count" >Drawing Books</Label>  <span class="errorMessage">{this.state.errors["csa_book_delivered_count"]}</span>
                                                                        <Input type="number" value={this.csa_book_delivered_count} name="csa_book_delivered_count" id="csa_book_delivered_count" onChange={(e) => {this.inputChange(e, "csa_book_delivered_count")}} max="999" min="1" onInput = {(e) =>{ e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,3)}} placeholder="Enter count in numbers"></Input> 
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6" style={csaResourcesDeliveredStyle}>
                                                                    <FormGroup >
                                                                        <Label for="csa_other_delivered_count" >Other Resource</Label> <span class="errorMessage">{this.state.errors["csa_other_delivered_count"]}</span>
                                                                        <Input type="number" value={this.state.csa_other_delivered_count} name="csa_other_delivered_count" id="csa_other_delivered_count" onChange={(e) => {this.inputChange(e, "csa_other_delivered_count")}} max="999" min="1" onInput = {(e) =>{ e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,3)}} placeholder="Enter count in numbers"></Input> 
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="12" style={csaOtherResourcesDelStyle}>
                                                                    <FormGroup >
                                                                        <Label for="csa_other_delivered_type" >Specify other type of resource</Label> <span class="errorMessage">{this.state.errors["csa_other_delivered_type"]}</span>
                                                                        <Input value={this.state.csa_other_delivered_type} name="csa_other_delivered_type" id="csa_other_delivered_type" onChange={(e) => {this.inputChange(e, "csa_other_delivered_type")}} placeholder="Enter other type of resource"></Input> 
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                        </TabPane>
                                                        <TabPane tabId="3" id="gender">
                                                            <Row>
                                                                <Col md="6">
                                                                    <Label><h6><u><b>Gender Program</b></u></h6></Label>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup>
                                                                        <Label for="gender_flashcard" >Gender Flashcard being run</Label> <span class="errorMessage">{this.state.errors["gender_flashcard"]}</span>
                                                                        <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e, "gender_flashcard")} value={this.state.gender_flashcard} id="gender_flashcard" options={genderFlashcards} required/>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="gender_flashcard_revision">Revision or first time flashcard is being taught</Label> <span class="errorMessage">{this.state.errors["gender_flashcard_revision"]}</span>
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "gender_flashcard_revision")} value={this.state.gender_flashcard_revision} name="gender_flashcard_revision" id="gender_flashcard_revision" required>
                                                                            <option value="csa">Revision</option>
                                                                            <option value="gender">First time</option>       
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
                                                                        <Label for="gender_prompts" >The teacher is using the prompts provided in the Gender flashcard guide</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_prompts" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "gender_prompts")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_prompts" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "gender_prompts")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_prompts" id="neither" value="3" onChange={(e) => this.scoreChange(e, "gender_prompts")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_prompts" id="agree" value="4" onChange={(e) => this.scoreChange(e, "gender_prompts")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_prompts" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "gender_prompts")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["gender_prompts"]}</span>
                                                                            </Col>
                                                                    </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                                
                                                            </Row>

                                                            <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="gender_flashcard_objective" >The teacher is meeting the objective of each flashcard even if they are not using all prompts provided in the Gender flashcard guide</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_flashcard_objective" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "gender_flashcard_objective")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_flashcard_objective" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "gender_flashcard_objective")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_flashcard_objective" id="neither" value="3" onChange={(e) => this.scoreChange(e, "gender_flashcard_objective")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_flashcard_objective" id="agree" value="4" onChange={(e) => this.scoreChange(e, "gender_flashcard_objective")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_flashcard_objective" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "gender_flashcard_objective")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["gender_flashcard_objective"]}</span>
                                                                            </Col>
                                                                    </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="gender_material_preparation" >The teacher had all materials prepared in advance for the class</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_material_preparation" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "gender_material_preparation")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_material_preparation" id="disagree" value="2"  onChange={(e) => this.scoreChange(e, "gender_material_preparation")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_material_preparation" id="neither" value="3" onChange={(e) => this.scoreChange(e, "gender_material_preparation")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_material_preparation" id="agree" value="4" onChange={(e) => this.scoreChange(e, "gender_material_preparation")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_material_preparation" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "gender_material_preparation")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["gender_material_preparation"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="gender_teacher_preparation" >The teacher was well prepared to facilitate the session</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_teacher_preparation" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "gender_teacher_preparation")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_teacher_preparation" id="disagree" value="2"  onChange={(e) => this.scoreChange(e, "gender_teacher_preparation")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_teacher_preparation" id="neither" value="3" onChange={(e) => this.scoreChange(e, "gender_teacher_preparation")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_teacher_preparation" id="agree" value="4" onChange={(e) => this.scoreChange(e, "gender_teacher_preparation")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_teacher_preparation" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "gender_teacher_preparation")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["gender_teacher_preparation"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="gender_activity_time_allotment" >An appropriate amount of time is allotted for each activity and topic</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_activity_time_allotment" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "gender_activity_time_allotment")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_activity_time_allotment" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "gender_activity_time_allotment")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_activity_time_allotment" id="neither" value="3" onChange={(e) => this.scoreChange(e, "gender_activity_time_allotment")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_activity_time_allotment" id="agree" value="4" onChange={(e) => this.scoreChange(e, "gender_activity_time_allotment")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_activity_time_allotment" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "gender_activity_time_allotment")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["gender_activity_time_allotment"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="gender_beyond_guide" >Teacher has gone beyond the teacher’s guide to build on and/or develop new activities</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_beyond_guide" id="yes" value="1" onChange={(e) => this.scoreChange(e, "gender_beyond_guide")} />{' '}
                                                                                    Yes
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_beyond_guide" id="no" value="0"  onChange={(e) => this.scoreChange(e, "gender_beyond_guide")} />{' '}
                                                                                    No
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["gender_beyond_guide"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col md="8" style={genderBeyondGuideStyle}>
                                                                    <FormGroup >
                                                                        <Label for="gender_beyond_guide_new" >What has the teacher done that is new?</Label> <span class="errorMessage">{this.state.errors["gender_beyond_guide_new"]}</span>
                                                                        <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e, "gender_beyond_guide_new")} value={this.state.gender_beyond_guide_new} id="gender_beyond_guide_new" options={new_activities_options}/>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="gender_subject_comfort" >The teacher is comfortable speaking about this subject</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_subject_comfort" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "gender_subject_comfort")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_subject_comfort" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "gender_subject_comfort")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_subject_comfort" id="neither" value="3" onChange={(e) => this.scoreChange(e, "gender_subject_comfort")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_subject_comfort" id="agree" value="4" onChange={(e) => this.scoreChange(e, "gender_subject_comfort")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_subject_comfort" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "gender_subject_comfort")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["gender_subject_comfort"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="gender_nonjudmental_tone" >The teacher uses a non-judgmental tone while facilitating the session</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_nonjudmental_tone" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "gender_nonjudmental_tone")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_nonjudmental_tone" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "gender_nonjudmental_tone")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_nonjudmental_tone" id="neither" value="3" onChange={(e) => this.scoreChange(e, "gender_nonjudmental_tone")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_nonjudmental_tone" id="agree" value="4" onChange={(e) => this.scoreChange(e, "gender_nonjudmental_tone")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_nonjudmental_tone" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "gender_nonjudmental_tone")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["gender_nonjudmental_tone"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="gender_impartial_opinions" >The teacher does not impose their own values or opinions on the participants</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_impartial_opinions" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "gender_impartial_opinions")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_impartial_opinions" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "gender_impartial_opinions")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_impartial_opinions" id="neither" value="3" onChange={(e) => this.scoreChange(e, "gender_impartial_opinions")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_impartial_opinions" id="agree" value="4" onChange={(e) => this.scoreChange(e, "gender_impartial_opinions")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_impartial_opinions" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "gender_impartial_opinions")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["gender_impartial_opinions"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="gender_student_engagement" >Students are engaged in discussion on flashcard(s)</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_student_engagement" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "gender_student_engagement")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_student_engagement" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "gender_student_engagement")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_student_engagement" id="neither" value="3" onChange={(e) => this.scoreChange(e, "gender_student_engagement")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_student_engagement" id="agree" value="4" onChange={(e) => this.scoreChange(e, "gender_student_engagement")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_student_engagement" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "gender_student_engagement")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["gender_student_engagement"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="gender_student_understanding" >Students understand the main messages of the flashcard(s)</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_student_understanding" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "gender_student_understanding")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_student_understanding" id="disagree" value="2"   onChange={(e) => this.scoreChange(e, "gender_student_understanding")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_student_understanding" id="neither" value="3"  onChange={(e) => this.scoreChange(e, "gender_student_understanding")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_student_understanding" id="agree" value="4"  onChange={(e) => this.scoreChange(e, "gender_student_understanding")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_student_understanding" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "gender_student_understanding")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["gender_student_understanding"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="gender_student_attention" >Students are actively paying attention to the class while the teacher is instructing</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_student_attention" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "gender_student_attention")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_student_attention" id="disagree" value="2"   onChange={(e) => this.scoreChange(e, "gender_student_attention")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_student_attention" id="neither" value="3"  onChange={(e) => this.scoreChange(e, "gender_student_attention")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_student_attention" id="agree" value="4"  onChange={(e) => this.scoreChange(e, "gender_student_attention")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_student_attention" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "gender_student_attention")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["gender_student_attention"]}</span>
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
                                                                        <Label for="gender_timetable_integration" >Management has integrated the Gender program into the school timetable</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_timetable_integration" id="yes" value="1" onChange={(e) => this.scoreChange(e, "gender_timetable_integration")} />{' '}
                                                                                    Yes
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_timetable_integration" id="no" value="0" onChange={(e) => this.scoreChange(e, "gender_timetable_integration")} />{' '}
                                                                                    No
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["gender_timetable_integration"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6" style={genderIntegratedStyle}>
                                                                    <FormGroup >
                                                                        <Label for="gender_class_frequency" >Frequency of class in time table</Label>
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "gender_class_frequency")} value={this.state.gender_class_frequency} name="gender_class_frequency" id="gender_class_frequency">
                                                                            <option value="weekly">Weekly</option>
                                                                            <option value="biweekly">Biweekly</option>
                                                                            <option value="monthly">Monthly</option>
                                                                            <option value="other">Other</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6" style={genderFrequencyOtherStyle}>
                                                                    <FormGroup >
                                                                        <Label for="gender_class_frequency_other" >If other, please specify</Label>
                                                                        <Input value={this.state.gender_class_frequency_other} name="gender_class_frequency_other" id="gender_class_frequency_other" onChange={(e) => {this.inputChange(e, "gender_class_frequency_other")}} ></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            
                                                            <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="gender_two_teacher_assigned" >There are at least 2 teachers assigned to teach the Gender program</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_two_teacher_assigned" id="yes" value="1" onChange={(e) => this.scoreChange(e, "gender_two_teacher_assigned")} />{' '}
                                                                                    Yes
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_two_teacher_assigned" id="no" value="0" onChange={(e) => this.scoreChange(e, "gender_two_teacher_assigned")} />{' '}
                                                                                    No
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["gender_two_teacher_assigned"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="gender_teacher_mgmt_coordination" >There is excellent coordination between management and teachers regarding the Gender program</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_teacher_mgmt_coordination" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "gender_teacher_mgmt_coordination")} />{' '}
                                                                                    {stronglyDisagree}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_teacher_mgmt_coordination" id="disagree" value="2"   onChange={(e) => this.scoreChange(e, "gender_teacher_mgmt_coordination")} />{' '}
                                                                                    {disagree}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_teacher_mgmt_coordination" id="neither" value="3"  onChange={(e) => this.scoreChange(e, "gender_teacher_mgmt_coordination")} />{' '}
                                                                                    {neither}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_teacher_mgmt_coordination" id="agree" value="4"  onChange={(e) => this.scoreChange(e, "gender_teacher_mgmt_coordination")} />{' '}
                                                                                    {agree}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_teacher_mgmt_coordination" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "gender_teacher_mgmt_coordination")} />{' '}
                                                                                    {stronglyAgree}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["gender_teacher_mgmt_coordination"]}</span>
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
                                                                        <Label for="gender_challenge_1" >The school is facing challenges scheduling the Gender class</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_challenge_1" id="yes" value="1" onChange={(e) => {this.inputChange(e, "gender_challenge_1")}} />{' '}
                                                                                    {yes}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_challenge_1" id="no" value="0" onChange={(e) => {this.inputChange(e, "gender_challenge_1")}} />{' '}
                                                                                    {no}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["gender_challenge_1"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            {/* </Row> */}

                                                            {/* <Row> */}
                                                            <Col md="6" style={genderChallenge1Style}>
                                                                    <FormGroup >
                                                                    <Label for="gender_challenge_1_status" >Status of Challenge</Label> <span class="errorMessage">{this.state.errors["gender_challenge_1_status"]}</span>
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "gender_challenge_1_status")} value={this.state.gender_challenge_1_status} name="gender_challenge_1_status" id="gender_challenge_1_status">
                                                                            <option value="resolved">Resolved</option>
                                                                            <option value="unresolved">Unresolved</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="gender_challenge_2" >There are not enough resources</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_challenge_2" id="yes" value="1" onChange={(e) => {this.inputChange(e, "gender_challenge_2")}} />{' '}
                                                                                    Yes
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_challenge_2" id="no" value="0" onChange={(e) => {this.inputChange(e, "gender_challenge_2")}} />{' '}
                                                                                    No
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["gender_challenge_2"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6" style={genderChallenge2Style}>
                                                                <FormGroup >
                                                                    <Label for="gender_challenge_2_status" >Status of Challenge</Label> <span class="errorMessage">{this.state.errors["gender_challenge_2_status"]}</span>
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "gender_challenge_2_status")} value={this.state.gender_challenge_2_status} name="gender_challenge_2_status" id="gender_challenge_2_status">
                                                                            <option value="resolved">Resolved</option>
                                                                            <option value="unresolved">Unresolved</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="gender_challenge_3" >There is no room for the class</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_challenge_3" id="yes" value="1" onChange={(e) => {this.inputChange(e, "gender_challenge_3")}} />{' '}
                                                                                    Yes
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_challenge_3" id="no" value="0" onChange={(e) => {this.inputChange(e, "gender_challenge_3")}} />{' '}
                                                                                    No
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["gender_challenge_3"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6" style={genderChallenge3Style}>
                                                                <FormGroup >
                                                                    <Label for="gender_challenge_3_status" >Status of Challenge</Label> <span class="errorMessage">{this.state.errors["gender_challenge_3_status"]}</span>
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "gender_challenge_3_status")} value={this.state.gender_challenge_3_status} name="gender_challenge_3_status" id="gender_challenge_3_status">
                                                                            <option value="resolved">Resolved</option>
                                                                            <option value="unresolved">Unresolved</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="gender_challenge_4" >There are not enough teachers to teach the Gender class</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_challenge_4" id="yes" value="1" onChange={(e) => {this.inputChange(e, "gender_challenge_4")}} />{' '}
                                                                                    Yes
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_challenge_4" id="no" value="0" onChange={(e) => {this.inputChange(e, "gender_challenge_4")}} />{' '}
                                                                                    No
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["gender_challenge_4"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6" style={genderChallenge4Style}>
                                                                <FormGroup >
                                                                    <Label for="gender_challenge_4_status" >Status of Challenge</Label> <span class="errorMessage">{this.state.errors["gender_challenge_4_status"]}</span>
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "gender_challenge_4_status")} value={this.state.gender_challenge_4_status} name="gender_challenge_4_status" id="gender_challenge_4_status">
                                                                            <option value="resolved">Resolved</option>
                                                                            <option value="unresolved">Unresolved</option>
                                                                        </Input> 
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6" >
                                                                    <FormGroup >
                                                                        <Label for="gender_challenge_5" >The content is irrelevant for the context of the students</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_challenge_5" id="yes" value="1" onChange={(e) => {this.inputChange(e, "gender_challenge_5")}} />{' '}
                                                                                    Yes
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_challenge_5" id="no" value="0" onChange={(e) => {this.inputChange(e, "gender_challenge_5")}} />{' '}
                                                                                    No
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["gender_challenge_5"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6" style={genderChallenge5Style}>
                                                                <FormGroup >
                                                                    <Label for="gender_challenge_5_status" >Status of Challenge</Label> <span class="errorMessage">{this.state.errors["gender_challenge_5_status"]}</span>
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "gender_challenge_5_status")} value={this.state.gender_challenge_5_status} name="gender_challenge_5_status" id="gender_challenge_5_status">
                                                                            <option value="resolved">Resolved</option>
                                                                            <option value="unresolved">Unresolved</option>
                                                                        </Input> 
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6" >
                                                                    <FormGroup>
                                                                        <Label for="gender_challenge_6" >Students are not interested in the content</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_challenge_6" id="yes" value="1" onChange={(e) => {this.inputChange(e, "gender_challenge_6")}} />{' '}
                                                                                    Yes
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_challenge_6" id="no" value="0" onChange={(e) => {this.inputChange(e, "gender_challenge_6")}} />{' '}
                                                                                    No
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["gender_challenge_6"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6" style={genderChallenge6Style}>
                                                                <FormGroup >
                                                                    <Label for="gender_challenge_6_status" >Status of Challenge</Label> <span class="errorMessage">{this.state.errors["gender_challenge_6_status"]}</span> 
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "gender_challenge_6_status")} value={this.state.gender_challenge_6_status} name="gender_challenge_6_status" id="gender_challenge_6_status">
                                                                            <option value="resolved">Resolved</option>
                                                                            <option value="unresolved">Unresolved</option>
                                                                        </Input> 
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
                                                                    <FormGroup style={monitoredGenderStyle}>
                                                                        <Label for="gender_resources_required">Does this school require any resources?</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_resources_required" id="yes" value="1" onChange={(e) => {this.inputChange(e, "gender_resources_required")}} />{' '}
                                                                                    Yes
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_resources_required" id="no" value="0" onChange={(e) => {this.inputChange(e, "gender_resources_required")}} />{' '}
                                                                                    No
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["gender_resources_required"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6" style={genderResourcesRequiredStyle}>
                                                                    <FormGroup >
                                                                        <Label for="gender_guide_required_count" >Gender Flashcard Guides</Label> <span class="errorMessage">{this.state.errors["gender_guide_required_count"]}</span>
                                                                        <Input type="number" value={this.state.gender_guide_required_count} name="gender_guide_required_count" id="gender_guide_required_count" onChange={(e) => {this.inputChange(e, "gender_guide_required_count")}} max="999" min="1" onInput = {(e) =>{ e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,3)}} placeholder="Enter count in numbers"></Input> 
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6" style={genderResourcesRequiredStyle}>
                                                                    <FormGroup >
                                                                        <Label for="gender_book_required_count" >Drawing Books</Label> <span class="errorMessage">{this.state.errors["gender_book_required_count"]}</span>
                                                                        <Input type="number" value={this.state.gender_book_required_count} name="gender_book_required_count" id="gender_book_required_count" onChange={(e) => {this.inputChange(e, "gender_book_required_count")}} max="999" min="1" onInput = {(e) =>{ e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,3)}} placeholder="Enter count in numbers"></Input> 
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6" style={genderResourcesRequiredStyle}>
                                                                    <FormGroup >
                                                                        <Label for="gender_other_required_count" >Other Resource</Label>  <span class="errorMessage">{this.state.errors["gender_other_required_count"]}</span>
                                                                        <Input type="number" value={this.state.gender_other_required_count} name="gender_other_required_count" id="gender_other_required_count" onChange={(e) => {this.inputChange(e, "gender_other_required_count")}} max="999" min="1" onInput = {(e) =>{ e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,3)}} placeholder="Enter count in numbers"></Input> 
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="12" style={genderOtherResourcesReqStyle}>
                                                                    <FormGroup >
                                                                        <Label for="gender_other_required_type" >Specify other type of resource</Label> <span class="errorMessage">{this.state.errors["gender_other_required_type"]}</span> 
                                                                        <Input value={this.state.gender_other_required_type} name="gender_other_required_type" id="gender_other_required_type" onChange={(e) => {this.inputChange(e, "gender_other_required_type")}} placeholder="Enter other type of resource"></Input> 
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>


                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="gender_resources_delivered">Were any resources distributed to this school in this visit?</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_resources_delivered" id="yes" value="1" onChange={(e) => {this.inputChange(e, "gender_resources_delivered")}} />{' '}
                                                                                    Yes
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_resources_delivered" id="no" value="0" onChange={(e) => {this.inputChange(e, "gender_resources_delivered")}} />{' '}
                                                                                    No
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["gender_resources_delivered"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6" style={genderResourcesDeliveredStyle}>
                                                                    <FormGroup >
                                                                        <Label for="gender_guide_delivered_count" >Gender Flashcard Guides</Label> <span class="errorMessage">{this.state.errors["gender_guide_delivered_count"]}</span>
                                                                        <Input type="number" value={this.state.gender_guide_delivered_count} name="gender_guide_delivered_count" id="gender_guide_delivered_count" onChange={(e) => {this.inputChange(e, "gender_guide_delivered_count")}} max="999" min="1" onInput = {(e) =>{ e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,3)}} placeholder="Enter count in numbers"></Input> 
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6" style={genderResourcesDeliveredStyle}>
                                                                    <FormGroup >
                                                                        <Label for="gender_book_delivered_count" >Drawing Books</Label> <span class="errorMessage">{this.state.errors["gender_book_delivered_count"]}</span>
                                                                        <Input type="number" value={this.state.gender_book_delivered_count} name="gender_book_delivered_count" id="gender_book_delivered_count" onChange={(e) => {this.inputChange(e, "gender_book_delivered_count")}} max="999" min="1" onInput = {(e) =>{ e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,3)}} placeholder="Enter count in numbers"></Input> 
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6" style={genderResourcesDeliveredStyle}>
                                                                    <FormGroup >
                                                                        <Label for="gender_other_delivered_count" >Other Resource</Label>  <span class="errorMessage">{this.state.errors["gender_other_delivered_count"]}</span>
                                                                        <Input type="number" value={this.state.gender_other_delivered_count} name="gender_other_delivered_count" id="gender_other_delivered_count" onChange={(e) => {this.inputChange(e, "gender_other_delivered_count")}} max="999" min="1" onInput = {(e) =>{ e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,3)}} placeholder="Enter count in numbers"></Input> 
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="12" style={genderOtherResourcesDelStyle}>
                                                                    <FormGroup >
                                                                        <Label for="gender_other_delivered_type" >Specify other type of resource</Label> <span class="errorMessage">{this.state.errors["gender_other_delivered_type"]}</span>
                                                                        <Input value={this.state.gender_other_delivered_type} name="gender_other_delivered_type" id="gender_other_delivered_type" onChange={(e) => {this.inputChange(e, "gender_other_delivered_type")}} placeholder="Enter other type of resource"></Input> 
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
                                                            <Button color="secondary" id="page_csa_a" style={monitoredCsaStyle}
                                                                className={"btn-shadow " + classnames({ active: this.state.activeTab === '2' })}
                                                                onClick={() => {
                                                                    this.toggle('2');
                                                                }}
                                                            >CSA</Button>
                                                            <Button color="secondary" id="page_csa_b" style={monitoredGenderStyle}
                                                                className={"btn-shadow " + classnames({ active: this.state.activeTab === '3' })}
                                                                onClick={() => {
                                                                    this.toggle('3');
                                                                }}
                                                            >Gender</Button>  

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

export default PrimaryMonitoringExit;


