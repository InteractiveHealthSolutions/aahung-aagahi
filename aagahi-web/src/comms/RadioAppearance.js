/**
 * @author Tahira Niazi
 * @email tahira.niazi@ihsinformatics.com
 * @create date 2019-08-27 14:34:23
 * @modify date 2019-08-27 14:34:23
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
import { getObject} from "../util/AahungUtil.js";
import TimePicker from 'react-time-picker';
import TimeField from 'react-simple-timefield';

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


const coveredTopics = [
    { value: 'csa', label: 'CSA' },
    { value: 'gender', label: 'Gender' },
    { value: 'puberty', label: 'Puberty' },
    { value: 'sexual_harassment', label: 'Sexual Harassment' },
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
        this.checkValid =  this.checkValid.bind(this);

        this.isCityOther = false;
        this.isLocationOther = false;
        this.isMaterialTypeOther = false;
        this.isAnnualReport = false;
        this.isAahungProfile = false;
        this.isPamphlet = false;
        this.isBooklet = false;
        this.isReport = false;
        this.isBrandingMaterial = false;

        this.isTopicOther = false;
        this.isAahungInformation = false;
        this.isAahungMug = false;
        this.isAahungFolder = false;
        this.isAahungNotebook = false;
        this.isNikahNama = false;
        this.isPuberty = false; 
        this.isRti = false; 
        this.isUngei = false;
        this.isSti = false; 
        this.isSexualHealth = false;
        this.isPreMarital = false;
        this.isPac = false;
        this.isMaternalHealth = false;
        this.isOtherTopic = false;
        this.isRecipientOther = false;

        this.isRemoveInfo = false;

        this.errors = {};

        this.distributionTopics = [
            { value: 'aahung_information', label: 'Aahung Information' },
            { value: 'aahung_mugs', label: 'Aahung Mugs' },
            { value: 'aahung_folders', label: 'Aahung Folders' },
            { value: 'aahung_notebooks', label: 'Aahung Notebooks' },
            { value: 'nikah_nama', label: 'Nikah Nama' },
            { value: 'puberty', label: 'puberty' },
            { value: 'rtis', label: 'RTIs' },
            { value: 'ungei', label: 'UNGEI' },
            { value: 'stis', label: 'STIs' },
            { value: 'sexual_health', label: 'Sexual Health' },
            { value: 'pre_marital_information', label: 'Pre-marital Information' },
            { value: 'pac', label: 'PAC' },
            { value: 'maternal_health', label: 'Maternal Health' },
            { value: 'other', label: 'Other' }
        
        ];

    }

    componentDidMount() {

        // TODO: checking view mode, view mode will become active after the form is populated
        // this.setState({
            // school_id : getObject('khyber_pakhtunkhwa', schools, 'value'), // autopopulate in view: for single select autocomplete
            // monitor: [{value: 'sindh'}, {value: 'punjab'}], // // autopopulate in view: for multi-select autocomplete
            // viewMode : true,    
        // })

        window.addEventListener('beforeunload', this.beforeunload.bind(this));

    }

    componentWillUnmount() {

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

        // this.setState({
        //     hasError : true
        // })

        // receiving value directly from widget but it still requires widget to have on change methods to set it's value
        // alert(document.getElementById("date_start").value);
    }

    // for text and numeric questions
    inputChange(e, name) {

        console.log(e);
        console.log(e.target.id);
        console.log(e.target.type);
        console.log(e.target.pattern);
        
        let errorText = e.target.value.match(e.target.pattern) ? '' : "invalid!";
        // alert(errorText);
        this.errors[name] = errorText;
        
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
        this.setState ({sex : e.target.value });
        this.setState ({sex : e.target.value });

        this.setState({
            [name]: e.target.value
        });

        if(e.target.id === "city") {
            this.isCityOther = e.target.value === "other" ? true : false;
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

        if (name === "radio_show_topic") {
            if (getObject('other', e, 'value') != -1) {
                this.isOtherTopic = true;
                
            }
            if (getObject('other', e, 'value') == -1) {
                this.isOtherTopic = false;
                
            }
        }

        if(name === "distribution_recipents_type") {
            if (getObject('other', e, 'value') != -1) {
                this.isRecipientOther = true;
                
            }
            if (getObject('other', e, 'value') == -1) {
                this.isRecipientOther = false;
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

        console.log(this.state.selectedOption)
        console.log("=============")
        // console.log(`Option selected:`, school_id);
        console.log(this.state.school_id);
        // console.log(this.state.school_id.value);
    };
    
    // submitForm(event) {
    //     alert("submitting");
    //     event.preventDefault();
    //     const data = new FormData(event.target);
    //     console.log(data);
            
    //   }

    handleSubmit = event => {
        let axios = require('axios');
        console.log(event.target);
        this.handleValidation();
        const data = new FormData(event.target);
        event.preventDefault();
        console.log(data);
        console.log(data.get('radio_channel_name'));
        // const data = new FormData(event.target);
        // console.log(data.get('participantScore'));

        var jsonData = {};
        jsonData['username'] =  'sarah.khan';
        jsonData['fullName'] =  'Sarah Khan';
        jsonData['password'] =  'Sarah4737';

        console.log(jsonData);

        axios.post('http://199.172.1.76:8080/aahung-aagahi/api/user', jsonData, { 'headers': {
            'Authorization': 'Basic YWRtaW46YWRtaW4xMjM=',
            } 
        })
        .then(res => {
            console.log(res);
            return res;
        });
    }

    handleValidation(){
        // check each required state
        
        let formIsValid = true;
        console.log("showing csa_prompts")
        console.log(this.state.csa_prompts);

        let requiredFields = ["radio_channel_name", "radio_show_topic", "aahung_staff_appearance"];
        let dependentFields = ["city", "radio_show_topic", "aahung_staff_appearance"];
        this.setState({ hasError: true });
        this.setState({ hasError: this.checkValid(requiredFields) ? false : true });

        this.setState({errors: this.errors});
        return formIsValid;
    }

    /**
     * verifies and notifies for the empty form fields
     */
    checkValid = (fields) => {

        let isOk = true;
        this.errors = {};
        for(let j=0; j < fields.length; j++) {
            let stateName = fields[j];
            
            // for array object
            if(typeof this.state[stateName] === 'object' && this.state[stateName].length === 0)
                isOk = false;
            
            // for text and others
            if(typeof this.state[stateName] != 'object') {
                if(this.state[stateName] === "" || this.state[stateName] == undefined)
                    isOk = false;
                if(!isOk) {
                    this.errors[fields[j]] = "Please fill in this field!";
                }   
            }
        }

        return isOk;
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
                                                                    {/* TODO: autopopulate current date */}
                                                                        <Label for="date_start" >Form Date</Label> <span class="errorMessage">{this.state.errors["date_start"]}</span>
                                                                        <Input type="date" name="date_start" id="date_start" value={this.state.date_start} onChange={(e) => {this.inputChange(e, "date_start")}} required/>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6">
                                                                    <FormGroup>
                                                                    <Label for="time_radio_show" >Time of Radio Show Start</Label> <span class="errorMessage">{this.state.errors["time_radio_show"]}</span> <br/>
                                                                    {/* <TimePicker id="time_radio_show" value={this.state.time_radio_show} onChange={(e) => {this.inputChange(e, "time_radio_show")}} /> */}
                                                                    <TimeField onChange={(e) => {this.getTime(e, "time_radio_show")}} input={<Input id="time" />} colon=":" required/>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="radio_channel_name" >Name of Radio</Label> <span class="errorMessage">{this.state.errors["radio_channel_name"]}</span>
                                                                        <Input name="radio_channel_name" id="radio_channel_name" value={this.state.radio_channel_name} onChange={(e) => {this.inputChange(e, "radio_channel_name")}} maxLength="200" placeholder="Enter name" pattern="^[A-Za-z. ]+" required/>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="radio_channel_frequency" >Radio Frequency</Label> <span class="errorMessage">{this.state.errors["radio_channel_frequency"]}</span> 
                                                                        <Input name="radio_channel_frequency" id="radio_channel_frequency" value={this.state.radio_channel_frequency} onChange={(e) => {this.inputChange(e, "radio_channel_frequency")}} maxLength="4" placeholder="Enter input" pattern="^[A-Za-z. ]+" required/>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>

                                                                <Col md="6">
                                                                    <FormGroup > 
                                                                            <Label for="city" >City</Label> <span class="errorMessage">{this.state.errors["city"]}</span>
                                                                            <Input type="select" onChange={(e) => this.valueChange(e, "city")} value={this.state.city} name="city" id="city" required>
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

                         

                                                                <Col md="6" >
                                                                    <FormGroup >
                                                                        <Label for="radio_show_topic" >Topics Covered</Label> <span class="errorMessage">{this.state.errors["radio_show_topic"]}</span>
                                                                        <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e, "radio_show_topic")} value={this.state.radio_show_topic} id="radio_show_topic" options={coveredTopics} required/>  
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" style={otherTopicStyle}>
                                                                    <FormGroup >
                                                                        <Label for="radio_show_topic_other" >Specify Other Topic</Label> <span class="errorMessage">{this.state.errors["radio_show_topic_other"]}</span>
                                                                        <Input name="radio_show_topic_other" id="radio_show_topic_other" value={this.state.radio_show_topic_other} onChange={(e) => {this.inputChange(e, "radio_show_topic_other")}} maxLength="200" placeholder="Enter other"/>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" >
                                                                    <FormGroup > 
                                                                        <Label for="aahung_staff_appearance">Aahung Staff on Radio</Label> <span class="errorMessage">{this.state.errors["aahung_staff_appearance"]}</span>
                                                                        <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e, "aahung_staff_appearance")} value={this.state.aahung_staff_appearance} id="aahung_staff_appearance" options={users} required/>  
                                                                    </FormGroup>
                                                                </Col>
                                                               
                                                                <Col md="6" >
                                                                    <FormGroup >
                                                                        <Label for="live_calls_num" >Number of Live Calls During Show</Label> <span class="errorMessage">{this.state.errors["live_calls_num"]}</span>
                                                                        <Input type="number" value={this.state.live_calls_num} name="live_calls_num" id="live_calls_num" onChange={(e) => { this.inputChange(e, "live_calls_num") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter number" required></Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" >
                                                                    <FormGroup >
                                                                        <Label for="listeners_num" >Number of Listeners</Label> <span class="errorMessage">{this.state.errors["listeners_num"]}</span>
                                                                        <Input type="number" value={this.state.listeners_num} name="listeners_num" id="listeners_num" onChange={(e) => { this.inputChange(e, "listeners_num") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 4) }} placeholder="Enter number"></Input>
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
                                                        <Button type="submit" className="mb-2 mr-2" color="success" size="sm" type="submit" >Submit</Button>
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