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
import { location, getDistrictsByProvince} from "../util/LocationUtil.js";
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

class StepDownTraining extends React.Component {

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
            program_type : '',
            school_level: '',
            donor_name: '',
            activeTab: '1',
            isCsaSubjectHealth: false,
            isCsaSubjectGender: false,
            isCsaSubjectCsa: false,
            isCsaSubjectImpl: false,
            isLsbeSubjectVcat: false,
            isLsbeSubjectHuman: false,
            isLsbeSubjectGender: false,
            isLsbeSubjectSexual: false,
            isLsbeSubjectViolence: false,
            isLsbeSubjectPuberty: false,
            isLsbeSubjectImpl: false,
            isCsaSubjectImpl: false,
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

        this.programType = '';
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

        // this will be fetched from school 
        this.setState({ program_type:  "csa"});
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
        
        this.setState({
            [name]: e.target.value
        });

        // TODO: will be handled by school autopopulate
        if(name === "school_level") {
            if(e.target.value === "school_level_secondary") {
                this.setState({
                    program_type:  "lsbe"
                });

                this.programType = "lsbe";
            }
            else {
                this.setState({
                    program_type:  "csa"
                });

                this.programType = "csa";
            }
        }

        
        if(name === "program_type") {
            
            if(e.target.value === "csa") {
                this.programType = "csa";    
            }
            else if(e.target.value === "lsbe") {
                this.programType = "lsbe";
            }
        }
    }

    // calculate score from scoring questions (radiobuttons)
    scoreChange = (e, name) => {
        this.setState({
            [name]: e.target.value
        });

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
                mt_sd_training_score : this.score,
                mt_sd_training_score_pct : percent
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

        if (name === "mt_csa_subject") {
            // checking twice because when another value is selected and other is unchecked, it still does not change the state
            if (getObject('health', e, 'value') != -1) { 
                this.setState({ isCsaSubjectHealth: true });
            }
            if (getObject('health', e, 'value') == -1) {
                this.setState({ isCsaSubjectHealth: false });
            }

            if (getObject('gender', e, 'value') != -1) {
                this.setState({ isCsaSubjectGender: true });
            }
            if (getObject('gender', e, 'value') == -1) {
                this.setState({ isCsaSubjectGender: false });
            }

            if (getObject('csa', e, 'value') != -1) {
                this.setState({ isCsaSubjectCsa: true }); 
            }
            if (getObject('csa', e, 'value') == -1) {
                this.setState({ isCsaSubjectCsa: false });
            }
            
            if (getObject('implementation_feedback', e, 'value') != -1) {
                this.setState({ isCsaSubjectImpl: true });
            }
            if (getObject('implementation_feedback', e, 'value') == -1) {
                this.setState({ isCsaSubjectImpl: false });
            }
        }

        if (name === "mt_lsbe_subject") {
            // checking twice because when another value is selected and other is unchecked, it still does not change the state
            if (getObject('vcat', e, 'value') != -1) {
                this.setState({ isLsbeSubjectVcat: true });
            }
            if (getObject('vcat', e, 'value') == -1) {
                this.setState({ isLsbeSubjectVcat: false });
            }

            if (getObject('human_rights', e, 'value') != -1) {
                this.setState({ isLsbeSubjectHuman: true });
            }
            if (getObject('human_rights', e, 'value') == -1) {
                this.setState({ isLsbeSubjectHuman: false });
            }

            if (getObject('gender_equality', e, 'value') != -1) {
                this.setState({ isLsbeSubjectGender: true }); 
            }
            if (getObject('gender_equality', e, 'value') == -1) {
                this.setState({ isLsbeSubjectGender: false });
            }
            
            if (getObject('sexual_health_rights', e, 'value') != -1) {
                this.setState({ isLsbeSubjectSexual: true });
            }
            if (getObject('sexual_health_rights', e, 'value') == -1) {
                this.setState({ isLsbeSubjectSexual: false });
            }

            if (getObject('violence', e, 'value') != -1) {
                this.setState({ isLsbeSubjectViolence: true }); 
            }
            if (getObject('violence', e, 'value') == -1) {
                this.setState({ isLsbeSubjectViolence: false });
            }
            
            if (getObject('puberty', e, 'value') != -1) {
                this.setState({ isLsbeSubjectPuberty: true });
            }
            if (getObject('puberty', e, 'value') == -1) {
                this.setState({ isLsbeSubjectPuberty: false });
            }

            if (getObject('implementation_feedback', e, 'value') != -1) {
                this.setState({ isLsbeSubjectImpl: true });
            }
            if (getObject('implementation_feedback', e, 'value') == -1) {
                this.setState({ isLsbeSubjectImpl: false });
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

        // skip logic style for CSA 
        const csaHealthStyle = this.state.isCsaSubjectHealth ? {} : { display: 'none' };
        const csaGenderStyle = this.state.isCsaSubjectGender ? {} : { display: 'none' };
        const csaCsaStyle = this.state.isCsaSubjectCsa ? {} : { display: 'none' };
        const csaImplStyle = this.state.isCsaSubjectImpl ? {} : { display: 'none' };
        
        // skip logic style for LSBE 
        const lsbeVcatStyle = this.state.isLsbeSubjectVcat ? {} : { display: 'none' };
        const lsbeHumanStyle = this.state.isLsbeSubjectHuman ? {} : { display: 'none' };
        const lsbeGenderStyle = this.state.isLsbeSubjectGender ? {} : { display: 'none' };
        const lsbeSexualStyle = this.state.isLsbeSubjectSexual ? {} : { display: 'none' };
        const lsbeViolenceStyle = this.state.isLsbeSubjectViolence ? {} : { display: 'none' };
        const lsbePubertyStyle = this.state.isLsbeSubjectPuberty ? {} : { display: 'none' };
        const lsbeImplStyle = this.state.isLsbeSubjectImpl ? {} : { display: 'none' };

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
                                                <b>Step Down Training Monitoring Form</b>
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
                                                            </Row>
                                                                
                                                            <Row>
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

                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="school_id" >School ID</Label>
                                                                        <Select id="school_id" name="school_id" value={this.state.school_id} onChange={(e) => this.handleChange(e, "school_id")} options={schools} />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        {/* TODO: autopopulate */}
                                                                        <Label for="school_name" >School Name</Label>
                                                                        <Input name="school_name" id="school_name" value={this.state.school_name} disabled/>
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
                                                            </Row>
                                                            
                                                            <Row>
                                                            <Col md="6">
                                                                <FormGroup > 
                                                                {/* TODO: autopopulate from school */}
                                                                        <Label for="school_level" >Level of Program</Label>
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "school_level")} value={this.state.school_level} name="school_level" id="school_level">
                                                                            <option value="school_level_primary">Primary</option>
                                                                            <option value="school_level_secondary">Secondary</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                    
                                                            </Col>
                                                            
                                                            <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="program_type" >Type of Program</Label>
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "program_type")} value={this.state.program_type} name="program_type" id="program_type">
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
                                                                        {/* TODO: skip logic, Show if program_type = CSA */}
                                                                        <Label for="csa_mt_num">Total Number of Master Trainers</Label>
                                                                        <Input type="number" value={this.state.csa_mt_num} name="csa_mt_num" id="csa_mt_num" onChange={(e) => {this.inputChange(e, "csa_mt_num")}} max="999" min="1" onInput = {(e) =>{ e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,2)}} placeholder="Enter in number"></Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                </Row>

                                                                <Row>
                                                                <Col md="6">
                                                                    <FormGroup> 
                                                                    { /* Single Select */ }
                                                                    {/* TODO: skip logic, Show if program_type = CSA */}
                                                                        <Label for="participant_name" >Name of Master Trainer</Label>
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
                                                                        <Label for="mt_csa_subject" >Subject Master Trainer is facilitating</Label> <span class="errorMessage">{this.state.errors["mt_csa_subject"]}</span>
                                                                        <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e, "mt_csa_subject")} value={this.state.mt_csa_subject} id="mt_csa_subject" options={csa_subject_options} />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="12" style={csaHealthStyle}>
                                                                    <FormGroup >
                                                                        <Label for="mt_def_sexual_health" >Master Trainer is able to accurately define sexual health</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                {/* TODO: fill UUIDs */}
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_def_sexual_health" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_def_sexual_health")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_def_sexual_health" id="disagree" value="2"  onChange={(e) => this.scoreChange(e, "mt_def_sexual_health")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_def_sexual_health" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_def_sexual_health")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_def_sexual_health" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_def_sexual_health")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_def_sexual_health" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_def_sexual_health")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["mt_def_sexual_health"]}</span>
                                                                            </Col>
                                                                    </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                                
                                                            </Row>

                                                            <Row>
                                                            <Col md="12" style={csaHealthStyle}>
                                                                    <FormGroup >
                                                                        <Label for="pts_link_health_aspects" >Participants demonstrate an understanding of the three aspects of health and how they are interlinked</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="pts_link_health_aspects" id="strongly_disagree" value="1"  onChange={(e) => this.scoreChange(e, "pts_link_health_aspects")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="pts_link_health_aspects" id="disagree" value="2"  onChange={(e) => this.scoreChange(e, "pts_link_health_aspects")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="pts_link_health_aspects" id="neither" value="3" onChange={(e) => this.scoreChange(e, "pts_link_health_aspects")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="pts_link_health_aspects" id="agree" value="4" onChange={(e) => this.scoreChange(e, "pts_link_health_aspects")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="pts_link_health_aspects" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "pts_link_health_aspects")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["pts_link_health_aspects"]}</span>
                                                                            </Col>
                                                                    </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12" style={csaGenderStyle}>
                                                                    <FormGroup >
                                                                        <Label for="pts_dif_sex_gender" >Participants demonstrate understanding of the difference between sex and gender</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="pts_dif_sex_gender" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "pts_dif_sex_gender")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="pts_dif_sex_gender" id="disagree" value="2"  onChange={(e) => this.scoreChange(e, "pts_dif_sex_gender")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="pts_dif_sex_gender" id="neither" value="3" onChange={(e) => this.scoreChange(e, "pts_dif_sex_gender")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="pts_dif_sex_gender" id="agree" value="4" onChange={(e) => this.scoreChange(e, "pts_dif_sex_gender")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="pts_dif_sex_gender" id="strongly_agree" value="5"  onChange={(e) => this.scoreChange(e, "pts_dif_sex_gender")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["pts_dif_sex_gender"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12" style={csaGenderStyle}>
                                                                    <FormGroup >
                                                                        <Label for="pts_gender_norm_sterotype" >Participants demonstrate understanding of gender norms and stereotypes and factors that regulate them</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="pts_gender_norm_sterotype" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "pts_gender_norm_sterotype")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="pts_gender_norm_sterotype" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "pts_gender_norm_sterotype")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="pts_gender_norm_sterotype" id="neither" value="3" onChange={(e) => this.scoreChange(e, "pts_gender_norm_sterotype")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="pts_gender_norm_sterotype" id="agree" value="4" onChange={(e) => this.scoreChange(e, "pts_gender_norm_sterotype")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="pts_gender_norm_sterotype" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "pts_gender_norm_sterotype")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["pts_gender_norm_sterotype"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12" style={csaCsaStyle}>
                                                                    <FormGroup >
                                                                        <Label for="pts_def_csa" >Participants demonstrate understanding of the definition of CSA</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="pts_def_csa" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "pts_def_csa")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="pts_def_csa" id="disagree" value="2"  onChange={(e) => this.scoreChange(e, "pts_def_csa")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="pts_def_csa" id="neither" value="3" onChange={(e) => this.scoreChange(e, "pts_def_csa")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="pts_def_csa" id="agree" value="4" onChange={(e) => this.scoreChange(e, "pts_def_csa")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="pts_def_csa" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "pts_def_csa")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["pts_def_csa"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12" style={csaCsaStyle}>
                                                                    <FormGroup >
                                                                        <Label for="pts_identify_csa" >Participants are able to accurately identify signs of CSA</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                            <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="pts_identify_csa" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "pts_identify_csa")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="pts_identify_csa" id="disagree" value="2"  onChange={(e) => this.scoreChange(e, "pts_identify_csa")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="pts_identify_csa" id="neither" value="3" onChange={(e) => this.scoreChange(e, "pts_identify_csa")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="pts_identify_csa" id="agree" value="4" onChange={(e) => this.scoreChange(e, "pts_identify_csa")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="pts_identify_csa" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "pts_identify_csa")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["pts_identify_csa"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12" style={csaCsaStyle}>
                                                                    <FormGroup >
                                                                        <Label for="pts_prevention_csa" >Participants are able to identify CSA prevention strategies</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                            <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="pts_prevention_csa" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "pts_prevention_csa")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="pts_prevention_csa" id="disagree" value="2"  onChange={(e) => this.scoreChange(e, "pts_prevention_csa")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="pts_prevention_csa" id="neither" value="3" onChange={(e) => this.scoreChange(e, "pts_prevention_csa")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="pts_prevention_csa" id="agree" value="4" onChange={(e) => this.scoreChange(e, "pts_prevention_csa")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="pts_prevention_csa" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "pts_prevention_csa")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["pts_prevention_csa"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12" style={csaCsaStyle}>
                                                                    <FormGroup >
                                                                        <Label for="mt_explain_csa_myth" >Master Trainer accurately explains and dispels all myths associated with CSA</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                            <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_explain_csa_myth" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_explain_csa_myth")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_explain_csa_myth" id="disagree" value="2"  onChange={(e) => this.scoreChange(e, "mt_explain_csa_myth")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_explain_csa_myth" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_explain_csa_myth")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_explain_csa_myth" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_explain_csa_myth")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_explain_csa_myth" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_explain_csa_myth")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["mt_explain_csa_myth"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12" style={csaCsaStyle}>
                                                                    <FormGroup >
                                                                        <Label for="mt_csa_video_aid" >Master Trainer uses videos on CSA as aids in facilitation</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                            <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_video_aid" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_csa_video_aid")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_video_aid" id="disagree" value="2"  onChange={(e) => this.scoreChange(e, "mt_csa_video_aid")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_video_aid" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_csa_video_aid")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_video_aid" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_csa_video_aid")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_video_aid" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_csa_video_aid")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["mt_csa_video_aid"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>                                                            

                                                            <Row>
                                                            <Col md="12" style={csaImplStyle}>
                                                                    <FormGroup >
                                                                        <Label for="mt_csa_constructive_feedback" >Master Trainer provides constructive feedback to participants after implementation of flashcards using the ‘Burger Method’</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                            <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_constructive_feedback" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_csa_constructive_feedback")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_constructive_feedback" id="disagree" value="2"  onChange={(e) => this.scoreChange(e, "mt_csa_constructive_feedback")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_constructive_feedback" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_csa_constructive_feedback")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_constructive_feedback" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_csa_constructive_feedback")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_constructive_feedback" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_csa_constructive_feedback")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["mt_csa_constructive_feedback"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="mt_csa_prompts" >Master Trainer is actively using the training guide to aid in facilitation of content</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                            <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_prompts" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_csa_prompts")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_prompts" id="disagree" value="2"  onChange={(e) => this.scoreChange(e, "mt_csa_prompts")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_prompts" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_csa_prompts")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_prompts" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_csa_prompts")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_prompts" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_csa_prompts")} />{' '}
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
                                                                        <Label for="mt_csa_understanding" >Master Trainer demonstrates good understanding of the training content</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                            <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_understanding" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_csa_understanding")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_understanding" id="disagree" value="2"  onChange={(e) => this.scoreChange(e, "mt_csa_understanding")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_understanding" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_csa_understanding")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_understanding" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_csa_understanding")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_understanding" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_csa_understanding")} />{' '}
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
                                                                        <Label for="mt_csa_material_prep" >Master Trainer had all materials prepared in advance for the session</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                            <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_material_prep" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_csa_material_prep")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_material_prep" id="disagree" value="2"  onChange={(e) => this.scoreChange(e, "mt_csa_material_prep")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_material_prep" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_csa_material_prep")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_material_prep" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_csa_material_prep")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_material_prep" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_csa_material_prep")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["mt_csa_material_prep"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>                                                                                                                    

                                                            <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="mt_csa_content_prep" >Master Trainer was well prepared in their facilitation of the content</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                            <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_content_prep" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_csa_content_prep")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_content_prep" id="disagree" value="2"  onChange={(e) => this.scoreChange(e, "mt_csa_content_prep")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_content_prep" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_csa_content_prep")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_content_prep" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_csa_content_prep")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_content_prep" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_csa_content_prep")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["mt_csa_content_prep"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="mt_csa_activity_time_allotment" >An appropriate amount of time is allotted to each activity and topic</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                            <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_activity_time_allotment" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_csa_activity_time_allotment")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_activity_time_allotment" id="disagree" value="2"  onChange={(e) => this.scoreChange(e, "mt_csa_activity_time_allotment")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_activity_time_allotment" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_csa_activity_time_allotment")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_activity_time_allotment" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_csa_activity_time_allotment")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_activity_time_allotment" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_csa_activity_time_allotment")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["mt_csa_activity_time_allotment"]}</span>
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
                                                                                    <Input type="radio" name="mt_csa_subject_comfort" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_csa_subject_comfort")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_subject_comfort" id="disagree" value="2"  onChange={(e) => this.scoreChange(e, "mt_csa_subject_comfort")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_subject_comfort" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_csa_subject_comfort")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_subject_comfort" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_csa_subject_comfort")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_subject_comfort" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_csa_subject_comfort")} />{' '}
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
                                                                                    <Input type="radio" name="mt_csa_nonjudmental_tone" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_csa_nonjudmental_tone")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_nonjudmental_tone" id="disagree" value="2"  onChange={(e) => this.scoreChange(e, "mt_csa_nonjudmental_tone")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_nonjudmental_tone" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_csa_nonjudmental_tone")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_nonjudmental_tone" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_csa_nonjudmental_tone")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_nonjudmental_tone" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_csa_nonjudmental_tone")} />{' '}
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
                                                                                    <Input type="radio" name="mt_csa_impartial_opinions" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_csa_impartial_opinions")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_impartial_opinions" id="disagree" value="2"  onChange={(e) => this.scoreChange(e, "mt_csa_impartial_opinions")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_impartial_opinions" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_csa_impartial_opinions")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_impartial_opinions" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_csa_impartial_opinions")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_impartial_opinions" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_csa_impartial_opinions")} />{' '}
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
                                                                        <Label for="mt_csa_probing_style" >Master Trainer is engaging participants in discussion throughout session by providing probes</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                            <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_probing_style" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_csa_probing_style")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_probing_style" id="disagree" value="2"  onChange={(e) => this.scoreChange(e, "mt_csa_probing_style")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_probing_style" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_csa_probing_style")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_probing_style" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_csa_probing_style")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_probing_style" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_csa_probing_style")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["mt_csa_probing_style"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="mt_csa_pts_engagement" >Participants are actively participating in discussion</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                            <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_pts_engagement" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_csa_pts_engagement")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_pts_engagement" id="disagree" value="2"  onChange={(e) => this.scoreChange(e, "mt_csa_pts_engagement")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_pts_engagement" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_csa_pts_engagement")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_pts_engagement" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_csa_pts_engagement")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_pts_engagement" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_csa_pts_engagement")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["mt_csa_pts_engagement"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="mt_csa_pts_attention" >Participants are actively paying attention to the session while the Master Trainer is instructing</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                            <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_pts_attention" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_csa_pts_attention")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_pts_attention" id="disagree" value="2"  onChange={(e) => this.scoreChange(e, "mt_csa_pts_attention")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_pts_attention" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_csa_pts_attention")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_pts_attention" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_csa_pts_attention")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_pts_attention" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_csa_pts_attention")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["mt_csa_pts_attention"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            
                                                            <Row >
                                                                <Col md="6">
                                                                    <FormGroup className="monitoringScoreBox">
                                                                        <Label for="mt_sd_training_score" style={{color: "green"}}><b>Cumulative MT Stepdown Training Score</b></Label>
                                                                        <Input value={this.state.mt_sd_training_score} name="mt_sd_training_score" id="mt_sd_training_score" onChange={(e) => {this.inputChange(e, "mt_sd_training_score")}} ></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup className="monitoringScoreBox">
                                                                        {/* TODO: apply style to hide this based on csa/primary question */}
                                                                        <Label for="mt_sd_training_score_pct" style={{color: "green"}}><b>% Score</b></Label>
                                                                        <Input name="mt_sd_training_score_pct" id="mt_sd_training_score_pct" value={this.state.mt_sd_training_score_pct} onChange={(e) => {this.inputChange(e, "mt_sd_training_score_pct")}} ></Input>
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
                                                                    <FormGroup>
                                                                        {/* TODO: skip logic, Show if program_type = CSA */}
                                                                        <Label for="lsbe_mt_num">Total Number of Master Trainers</Label>
                                                                        <Input type="number" value={this.state.lsbe_mt_num} name="lsbe_mt_num" id="lsbe_mt_num" onChange={(e) => {this.inputChange(e, "lsbe_mt_num")}} max="999" min="1" onInput = {(e) =>{ e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,2)}} placeholder="Enter in number"></Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                </Row>

                                                                <Row>
                                                                <Col md="6">
                                                                    <FormGroup> 
                                                                    { /* Single Select */ }
                                                                    {/* TODO: skip logic, Show if program_type = CSA */}
                                                                        <Label for="participant_name" >Name of Master Trainer</Label>
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
                                                                        <Label for="mt_lsbe_subject" >Subject Master Trainer is facilitating</Label> <span class="errorMessage">{this.state.errors["mt_lsbe_subject"]}</span>
                                                                        <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e, "mt_lsbe_subject")} value={this.state.mt_lsbe_subject} id="mt_lsbe_subject" options={lsbe_subject_options}/>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="12" style={lsbeVcatStyle}>
                                                                    <FormGroup >
                                                                        <Label for="mt_crossline_activity" >Master Trainer correctly conducts the Cross the Line activity</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_crossline_activity" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_crossline_activity")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_crossline_activity" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "mt_crossline_activity")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_crossline_activity" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_crossline_activity")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_crossline_activity" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_crossline_activity")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_crossline_activity" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_crossline_activity")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["mt_crossline_activity"]}</span>
                                                                            </Col>
                                                                    </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                                
                                                            </Row>

                                                            <Row>
                                                            <Col md="12" style={lsbeVcatStyle}>
                                                                    <FormGroup >
                                                                        <Label for="mt_def_values" >Master Trainer clearly defines values</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_def_values" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_def_values")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_def_values" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "mt_def_values")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_def_values" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_def_values")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_def_values" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_def_values")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_def_values" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_def_values")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["mt_def_values"]}</span>
                                                                            </Col>
                                                                    </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12" style={lsbeVcatStyle}>
                                                                    <FormGroup >
                                                                        <Label for="pts_understand_values" >Participants clearly understand the factors that regulate values</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="pts_understand_values" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "pts_understand_values")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="pts_understand_values" id="disagree" value="2"  onChange={(e) => this.scoreChange(e, "pts_understand_values")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="pts_understand_values" id="neither" value="3" onChange={(e) => this.scoreChange(e, "pts_understand_values")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="pts_understand_values" id="agree" value="4" onChange={(e) => this.scoreChange(e, "pts_understand_values")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="pts_understand_values" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "pts_understand_values")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["pts_understand_values"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12" style={lsbeHumanStyle}>
                                                                    <FormGroup >
                                                                        <Label for="mt_describe_human_rights" >Master trainer clearly describes human rights</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_describe_human_rights" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_describe_human_rights")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_describe_human_rights" id="disagree" value="2"  onChange={(e) => this.scoreChange(e, "mt_describe_human_rights")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_describe_human_rights" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_describe_human_rights")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_describe_human_rights" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_describe_human_rights")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_describe_human_rights" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_describe_human_rights")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["mt_describe_human_rights"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12" style={lsbeHumanStyle}>
                                                                    <FormGroup >
                                                                        <Label for="pts_understand_human_rights" >Participants demonstrate clear understanding of the impact of human rights violations</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="pts_understand_human_rights" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "pts_understand_human_rights")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="pts_understand_human_rights" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "pts_understand_human_rights")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="pts_understand_human_rights" id="neither" value="3" onChange={(e) => this.scoreChange(e, "pts_understand_human_rights")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="pts_understand_human_rights" id="agree" value="4" onChange={(e) => this.scoreChange(e, "pts_understand_human_rights")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="pts_understand_human_rights" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "pts_understand_human_rights")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["pts_understand_human_rights"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12" style={lsbeGenderStyle}>
                                                                    <FormGroup >
                                                                        <Label for="mt_diff_sex_gender" >Master Trainer correctly differentiates between sex and gender</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_diff_sex_gender" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_diff_sex_gender")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_diff_sex_gender" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "mt_diff_sex_gender")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_diff_sex_gender" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_diff_sex_gender")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_diff_sex_gender" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_diff_sex_gender")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_diff_sex_gender" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_diff_sex_gender")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["mt_diff_sex_gender"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12" style={lsbeGenderStyle}>
                                                                    <FormGroup >
                                                                        <Label for="pts_understand_gender_norm" >Participants show clear understanding of gender norms and stereotypes</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="pts_understand_gender_norm" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "pts_understand_gender_norm")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="pts_understand_gender_norm" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "pts_understand_gender_norm")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="pts_understand_gender_norm" id="neither" value="3" onChange={(e) => this.scoreChange(e, "pts_understand_gender_norm")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="pts_understand_gender_norm" id="agree" value="4" onChange={(e) => this.scoreChange(e, "pts_understand_gender_norm")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="pts_understand_gender_norm" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "pts_understand_gender_norm")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["pts_understand_gender_norm"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12" style={lsbeSexualStyle}>
                                                                    <FormGroup >
                                                                        <Label for="mt_def_sexual_health" >Master Trainer accurately defines sexual health</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_def_sexual_health" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_def_sexual_health")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_def_sexual_health" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "mt_def_sexual_health")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_def_sexual_health" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_def_sexual_health")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_def_sexual_health" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_def_sexual_health")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_def_sexual_health" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_def_sexual_health")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["mt_def_sexual_health"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12" style={lsbeSexualStyle}>
                                                                    <FormGroup >
                                                                        <Label for="pts_understand_health_links" >Participants demonstrate an understanding of the three aspects of health and how they are interlinked</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="pts_understand_health_links" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "pts_understand_health_links")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="pts_understand_health_links" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "pts_understand_health_links")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="pts_understand_health_links" id="neither" value="3" onChange={(e) => this.scoreChange(e, "pts_understand_health_links")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="pts_understand_health_links" id="agree" value="4" onChange={(e) => this.scoreChange(e, "pts_understand_health_links")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="pts_understand_health_links" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "pts_understand_health_links")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["pts_understand_health_links"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12" style={lsbeViolenceStyle}>
                                                                    <FormGroup >
                                                                        <Label for="mt_describe_violence_types" >Master Trainer has correctly described the different types of violence</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_describe_violence_types" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_describe_violence_types")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_describe_violence_types" id="disagree" value="2"   onChange={(e) => this.scoreChange(e, "mt_describe_violence_types")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_describe_violence_types" id="neither" value="3"  onChange={(e) => this.scoreChange(e, "mt_describe_violence_types")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_describe_violence_types" id="agree" value="4"  onChange={(e) => this.scoreChange(e, "mt_describe_violence_types")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_describe_violence_types" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_describe_violence_types")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["mt_describe_violence_types"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12" style={lsbeViolenceStyle}>
                                                                    <FormGroup >
                                                                        <Label for="mt_describe_violence_impact" >Master Trainer has effectively described the impact of violence on an individual’s life</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_describe_violence_impact" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_describe_violence_impact")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_describe_violence_impact" id="disagree" value="2"   onChange={(e) => this.scoreChange(e, "mt_describe_violence_impact")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_describe_violence_impact" id="neither" value="3"  onChange={(e) => this.scoreChange(e, "mt_describe_violence_impact")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_describe_violence_impact" id="agree" value="4"  onChange={(e) => this.scoreChange(e, "mt_describe_violence_impact")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_describe_violence_impact" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_describe_violence_impact")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["mt_describe_violence_impact"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12" style={lsbePubertyStyle}>
                                                                    <FormGroup >
                                                                        <Label for="mt_explain_puberty" >Master Trainer was able to clearly explain changes that occur during puberty for boys and girls</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_explain_puberty" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_explain_puberty")} />{' '}
                                                                                    {stronglyDisagree}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_explain_puberty" id="disagree" value="2"   onChange={(e) => this.scoreChange(e, "mt_explain_puberty")} />{' '}
                                                                                    {disagree}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_explain_puberty" id="neither" value="3"  onChange={(e) => this.scoreChange(e, "mt_explain_puberty")} />{' '}
                                                                                    {neither}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_explain_puberty" id="agree" value="4"  onChange={(e) => this.scoreChange(e, "mt_explain_puberty")} />{' '}
                                                                                    {agree}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_explain_puberty" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_explain_puberty")} />{' '}
                                                                                    {stronglyAgree}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["mt_explain_puberty"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>


                                                            <Row>
                                                            <Col md="12" style={lsbePubertyStyle}>
                                                                    <FormGroup >
                                                                        <Label for="mt_dispell_puberty_myths" >Master Trainer has clearly explained and dispelled myths related to puberty in both boys and girls</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_dispell_puberty_myths" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_dispell_puberty_myths")} />{' '}
                                                                                    {stronglyDisagree}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_dispell_puberty_myths" id="disagree" value="2"   onChange={(e) => this.scoreChange(e, "mt_dispell_puberty_myths")} />{' '}
                                                                                    {disagree}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_dispell_puberty_myths" id="neither" value="3"  onChange={(e) => this.scoreChange(e, "mt_dispell_puberty_myths")} />{' '}
                                                                                    {neither}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_dispell_puberty_myths" id="agree" value="4"  onChange={(e) => this.scoreChange(e, "mt_dispell_puberty_myths")} />{' '}
                                                                                    {agree}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_dispell_puberty_myths" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_dispell_puberty_myths")} />{' '}
                                                                                    {stronglyAgree}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["mt_dispell_puberty_myths"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12">
                                                                    <FormGroup style={lsbeImplStyle}>
                                                                        <Label for="mt_lsbe_constructive_feedback" >Master Trainer provides constructive feedback to participants after implementation of flashcards using the ‘Burger Method’</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_constructive_feedback" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_lsbe_constructive_feedback")} />{' '}
                                                                                    {stronglyDisagree}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_constructive_feedback" id="disagree" value="2"   onChange={(e) => this.scoreChange(e, "mt_lsbe_constructive_feedback")} />{' '}
                                                                                    {disagree}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_constructive_feedback" id="neither" value="3"  onChange={(e) => this.scoreChange(e, "mt_lsbe_constructive_feedback")} />{' '}
                                                                                    {neither}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_constructive_feedback" id="agree" value="4"  onChange={(e) => this.scoreChange(e, "mt_lsbe_constructive_feedback")} />{' '}
                                                                                    {agree}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_constructive_feedback" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_lsbe_constructive_feedback")} />{' '}
                                                                                    {stronglyAgree}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["mt_lsbe_constructive_feedback"]}</span>
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
                                                                                    <Input type="radio" name="mt_lsbe_prompts" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_lsbe_prompts")} />{' '}
                                                                                    {stronglyDisagree}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_prompts" id="disagree" value="2"   onChange={(e) => this.scoreChange(e, "mt_lsbe_prompts")} />{' '}
                                                                                    {disagree}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_prompts" id="neither" value="3"  onChange={(e) => this.scoreChange(e, "mt_lsbe_prompts")} />{' '}
                                                                                    {neither}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_prompts" id="agree" value="4"  onChange={(e) => this.scoreChange(e, "mt_lsbe_prompts")} />{' '}
                                                                                    {agree}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_prompts" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_lsbe_prompts")} />{' '}
                                                                                    {stronglyAgree}
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
                                                                                    <Input type="radio" name="mt_lsbe_understanding" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_lsbe_understanding")} />{' '}
                                                                                    {stronglyDisagree}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_understanding" id="disagree" value="2"   onChange={(e) => this.scoreChange(e, "mt_lsbe_understanding")} />{' '}
                                                                                    {disagree}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_understanding" id="neither" value="3"  onChange={(e) => this.scoreChange(e, "mt_lsbe_understanding")} />{' '}
                                                                                    {neither}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_understanding" id="agree" value="4"  onChange={(e) => this.scoreChange(e, "mt_lsbe_understanding")} />{' '}
                                                                                    {agree}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_understanding" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_lsbe_understanding")} />{' '}
                                                                                    {stronglyAgree}
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
                                                                        <Label for="mt_lsbe_material_prep" >Master Trainer had all materials prepared in advance for the session</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_material_prep" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_lsbe_material_prep")} />{' '}
                                                                                    {stronglyDisagree}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_material_prep" id="disagree" value="2"   onChange={(e) => this.scoreChange(e, "mt_lsbe_material_prep")} />{' '}
                                                                                    {disagree}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_material_prep" id="neither" value="3"  onChange={(e) => this.scoreChange(e, "mt_lsbe_material_prep")} />{' '}
                                                                                    {neither}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_material_prep" id="agree" value="4"  onChange={(e) => this.scoreChange(e, "mt_lsbe_material_prep")} />{' '}
                                                                                    {agree}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_material_prep" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_lsbe_material_prep")} />{' '}
                                                                                    {stronglyAgree}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["mt_lsbe_material_prep"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="mt_lsbe_content_prep" >Master Trainer was well prepared in their facilitation of the content</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_content_prep" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_lsbe_content_prep")} />{' '}
                                                                                    {stronglyDisagree}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_content_prep" id="disagree" value="2"   onChange={(e) => this.scoreChange(e, "mt_lsbe_content_prep")} />{' '}
                                                                                    {disagree}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_content_prep" id="neither" value="3"  onChange={(e) => this.scoreChange(e, "mt_lsbe_content_prep")} />{' '}
                                                                                    {neither}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_content_prep" id="agree" value="4"  onChange={(e) => this.scoreChange(e, "mt_lsbe_content_prep")} />{' '}
                                                                                    {agree}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_content_prep" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_lsbe_content_prep")} />{' '}
                                                                                    {stronglyAgree}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["mt_lsbe_content_prep"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="mt_lsbe_activity_time_allotment" >An appropriate amount of time is allotted to each activity and topic</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_activity_time_allotment" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_lsbe_activity_time_allotment")} />{' '}
                                                                                    {stronglyDisagree}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_activity_time_allotment" id="disagree" value="2"   onChange={(e) => this.scoreChange(e, "mt_lsbe_activity_time_allotment")} />{' '}
                                                                                    {disagree}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_activity_time_allotment" id="neither" value="3"  onChange={(e) => this.scoreChange(e, "mt_lsbe_activity_time_allotment")} />{' '}
                                                                                    {neither}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_activity_time_allotment" id="agree" value="4"  onChange={(e) => this.scoreChange(e, "mt_lsbe_activity_time_allotment")} />{' '}
                                                                                    {agree}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_activity_time_allotment" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_lsbe_activity_time_allotment")} />{' '}
                                                                                    {stronglyAgree}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["mt_lsbe_activity_time_allotment"]}</span>
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
                                                                                    <Input type="radio" name="mt_lsbe_subject_comfort" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_lsbe_subject_comfort")} />{' '}
                                                                                    {stronglyDisagree}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_subject_comfort" id="disagree" value="2"   onChange={(e) => this.scoreChange(e, "mt_lsbe_subject_comfort")} />{' '}
                                                                                    {disagree}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_subject_comfort" id="neither" value="3"  onChange={(e) => this.scoreChange(e, "mt_lsbe_subject_comfort")} />{' '}
                                                                                    {neither}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_subject_comfort" id="agree" value="4"  onChange={(e) => this.scoreChange(e, "mt_lsbe_subject_comfort")} />{' '}
                                                                                    {agree}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_subject_comfort" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_lsbe_subject_comfort")} />{' '}
                                                                                    {stronglyAgree}
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
                                                                                    <Input type="radio" name="mt_lsbe_nonjudmental_tone" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_lsbe_nonjudmental_tone")} />{' '}
                                                                                    {stronglyDisagree}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_nonjudmental_tone" id="disagree" value="2"   onChange={(e) => this.scoreChange(e, "mt_lsbe_nonjudmental_tone")} />{' '}
                                                                                    {disagree}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_nonjudmental_tone" id="neither" value="3"  onChange={(e) => this.scoreChange(e, "mt_lsbe_nonjudmental_tone")} />{' '}
                                                                                    {neither}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_nonjudmental_tone" id="agree" value="4"  onChange={(e) => this.scoreChange(e, "mt_lsbe_nonjudmental_tone")} />{' '}
                                                                                    {agree}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_nonjudmental_tone" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_lsbe_nonjudmental_tone")} />{' '}
                                                                                    {stronglyAgree}
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
                                                                                    <Input type="radio" name="mt_lsbe_impartial_opinions" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_lsbe_impartial_opinions")} />{' '}
                                                                                    {stronglyDisagree}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_impartial_opinions" id="disagree" value="2"   onChange={(e) => this.scoreChange(e, "mt_lsbe_impartial_opinions")} />{' '}
                                                                                    {disagree}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_impartial_opinions" id="neither" value="3"  onChange={(e) => this.scoreChange(e, "mt_lsbe_impartial_opinions")} />{' '}
                                                                                    {neither}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_impartial_opinions" id="agree" value="4"  onChange={(e) => this.scoreChange(e, "mt_lsbe_impartial_opinions")} />{' '}
                                                                                    {agree}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_impartial_opinions" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_lsbe_impartial_opinions")} />{' '}
                                                                                    {stronglyAgree}
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
                                                                                    <Input type="radio" name="mt_lsbe_probing_style" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_lsbe_probing_style")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_probing_style" id="disagree" value="2"  onChange={(e) => this.scoreChange(e, "mt_lsbe_probing_style")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_probing_style" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_lsbe_probing_style")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_probing_style" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_lsbe_probing_style")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_probing_style" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_lsbe_probing_style")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["mt_lsbe_probing_style"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="mt_lsbe_pts_engagement" >Participants are actively participating in discussion</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                            <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_pts_engagement" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_lsbe_pts_engagement")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_pts_engagement" id="disagree" value="2"  onChange={(e) => this.scoreChange(e, "mt_lsbe_pts_engagement")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_pts_engagement" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_lsbe_pts_engagement")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_pts_engagement" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_lsbe_pts_engagement")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_pts_engagement" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_lsbe_pts_engagement")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["mt_lsbe_pts_engagement"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="12">
                                                                    <FormGroup >
                                                                        <Label for="mt_lsbe_pts_attention" >Participants are actively paying attention to the session while the Master Trainer is instructing</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                            <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_pts_attention" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_lsbe_pts_attention")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_pts_attention" id="disagree" value="2"  onChange={(e) => this.scoreChange(e, "mt_lsbe_pts_attention")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_pts_attention" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_lsbe_pts_attention")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_pts_attention" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_lsbe_pts_attention")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_pts_attention" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_lsbe_pts_attention")} />{' '}
                                                                                    Strongly Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <span class="errorMessage">{this.state.errors["mt_lsbe_pts_attention"]}</span>
                                                                            </Col>
                                                                        </FormGroup>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>                                                            

                                                            <Row >
                                                                <Col md="6">
                                                                    <FormGroup className="monitoringScoreBox">
                                                                        <Label for="mt_sd_training_score" style={{color: "green"}}><b>Cumulative MT Stepdown Training Score</b></Label>
                                                                        <Input value={this.state.mt_sd_training_score} name="mt_sd_training_score" id="mt_sd_training_score" onChange={(e) => {this.inputChange(e, "mt_sd_training_score")}} ></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup className="monitoringScoreBox">
                                                                        <Label for="mt_sd_training_score_pct" style={{color: "green"}}><b>% Score</b></Label>
                                                                        <Input name="mt_sd_training_score_pct" id="mt_sd_training_score_pct" value={this.state.mt_sd_training_score_pct} onChange={(e) => {this.inputChange(e, "mt_sd_training_score_pct")}} ></Input>
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

export default StepDownTraining;