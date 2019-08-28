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

const participantTypes = [
    { value: 'journalists', label: 'Journalists' },
    { value: 'bloggers', label: 'Bloggers' },
    { value: 'screenwriters', label: 'Screenwriters' },
    { value: 'other_media_personnel', label: 'Other Media Personnel' },
    { value: 'other', label: 'Other' }
];

const materialTypes = [
    { value: 'annual_report', label: 'Annual Report' },
    { value: 'aahung_profile', label: 'Aahung Profile' },
    { value: 'pamphlet', label: 'Pamphlet' },
    { value: 'booklet', label: 'Booklet' },
    { value: 'report', label: 'Report' },
    { value: 'aahung_branding_material', label: 'Aahung Branding Material' },
    { value: 'other', label: 'Other' }

];


const postPlatformOptions = [
    { value: 'facebook', label: 'Facebook' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'web_portal', label: 'Web Portal' },
    { value: 'other', label: 'Other' }
];

const coveredTopics = [
    { value: 'csa', label: 'CSA' },
    { value: 'gender', label: 'Gender' },
    { value: 'puberty', label: 'Puberty' },
    { value: 'sexual_harassment', label: 'Sexual Harassment' },
    { value: 'lsbe', label: 'LSBE' },
    { value: 'other', label: 'Other' }
];


const trainers = [
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

    // for text and numeric questions
    inputChange(e, name) {

        alert(e);
        alert("time_radio_show");
        console.log(e);
        this.setState({
            [name]: e.target.value
        });
        
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

        if(e.target.id === "city") {
            this.isCityOther = e.target.value === "other" ? true : false;
        }
        
        if(e.target.id === "distribution_location") {
            this.isLocationOther = e.target.value === "other" ? true : false;
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

        if (name === "distribution_material_type") {
            // checking twice because when another value is selected and other is unchecked, it still does not change the state
            if (getObject('annual_report', e, 'value') != -1) {
                this.isAnnualReport =  true ;
                this.isRemoveInfo = false;
                
            }
            if (getObject('annual_report', e, 'value') == -1) {
                
                this.isAnnualReport =  false ;
                
            }

            if (getObject('aahung_profile', e, 'value') != -1) {
                this.isAahungProfile =  true ;
                this.isRemoveInfo = false;
                
            }
            if (getObject('aahung_profile', e, 'value') == -1) {
                
                this.isAahungProfile =  false ;
                
            }

            if (getObject('pamphlet', e, 'value') != -1) {
                this.isPamphlet =  true ;
                 this.isRemoveInfo = true;
            }
            if (getObject('pamphlet', e, 'value') == -1) {
                this.isPamphlet =  false ;
                // this.distributionTopics.unshift([{value: 'aahung_information', label: 'Aahung Information'}]);
            }

            if (getObject('booklet', e, 'value') != -1) {
                this.isBooklet =  true ;
                this.isRemoveInfo = true;

            }
            if (getObject('booklet', e, 'value') == -1) {
                this.isBooklet =  false ;
            }

            if (getObject('report', e, 'value') != -1) {
                this.isReport =  true ;
                this.isRemoveInfo = true;

            }
            if (getObject('report', e, 'value') == -1) {
                
                this.isReport =  false ;
            }

            if (getObject('aahung_branding_material', e, 'value') != -1) {
                this.isBrandingMaterial =  true ;
                this.isRemoveInfo = false;
            }
            if (getObject('aahung_branding_material', e, 'value') == -1) {
                
                this.isBrandingMaterial =  false ;
            }
            
            if (getObject('other', e, 'value') != -1) {
                this.isMaterialTypeOther =  true ;
                this.isRemoveInfo = false;
            }
            if (getObject('other', e, 'value') == -1) {
                this.isMaterialTypeOther =  false ;
            }           
        }

        if(getObject('annual_report', e, 'value') != -1 || getObject('aahung_profile', e, 'value') != -1 ) {
            // Autoselect distribution_topic = Aahung Information
            this.setState({
                distribution_topic: [{value: 'aahung_information', label: 'Aahung Information'}]
            })
        }
        else if(getObject('annual_report', e, 'value') == -1 && getObject('aahung_profile', e, 'value') == -1 ) {
            this.setState({
                distribution_topic: []
            })
        }
        // if(this.isRemoveInfo) {
        //     for( var i = 0; i < this.distributionTopics.length; i++){ 
        //         if ( this.distributionTopics[i].value === "aahung_information") {
        //             this.distributionTopics.splice(i, 1); 
        //         }
        //     }
        // }
        // else if(!this.isRemoveInfo) {
        //     this.distributionTopics.unshift({value: 'aahung_information', label: 'Aahung Information'});
        // }

        if (name === "distribution_topic") {
            
            if (getObject('aahung_information', e, 'value') != -1) {
                this.isAahungInformation = true;
                
            }
            if (getObject('aahung_information', e, 'value') == -1) {
                this.isAahungInformation = false;
            }
            
            if (getObject('aahung_mugs', e, 'value') != -1) {
                this.isAahungMug = true;
                
            }
            if (getObject('aahung_mugs', e, 'value') == -1) {
                this.isAahungMug = false;
            }

            if (getObject('aahung_folders', e, 'value') != -1) {
                this.isAahungFolder = true;
                
            }
            if (getObject('aahung_folders', e, 'value') == -1) {
                this.isAahungFolder = false;
            }

            if (getObject('aahung_notebooks', e, 'value') != -1) {
                this.isAahungNotebook = true;
                
            }
            if (getObject('aahung_notebooks', e, 'value') == -1) {
                this.isAahungNotebook = false;
            }

            if (getObject('nikah_nama', e, 'value') != -1) {
                this.isNikahNama = true;
                
            }
            if (getObject('nikah_nama', e, 'value') == -1) {
                this.isNikahNama = false;
            }

            if (getObject('puberty', e, 'value') != -1) {
                this.isPuberty = true;
                
            }
            if (getObject('puberty', e, 'value') == -1) {
                this.isPuberty = false;
            }
            
            if (getObject('rtis', e, 'value') != -1) {
                this.isRti = true;
                
            }
            if (getObject('rtis', e, 'value') == -1) {
                this.isRti = false;
            }

            if (getObject('ungei', e, 'value') != -1) {
                this.isUngei = true;
                
            }
            if (getObject('ungei', e, 'value') == -1) {
                this.isUngei = false;
            }

            if (getObject('stis', e, 'value') != -1) {
                this.isSti = true;
                
            }
            if (getObject('stis', e, 'value') == -1) {
                this.isSti = false;
            }

            if (getObject('sexual_health', e, 'value') != -1) {
                this.isSexualHealth = true;
                
            }
            if (getObject('sexual_health', e, 'value') == -1) {
                this.isSexualHealth = false;
            }

            if (getObject('pre_marital_information', e, 'value') != -1) {
                this.isPreMarital = true;
                
            }
            if (getObject('pre_marital_information', e, 'value') == -1) {
                this.isPreMarital = false;
            }

            if (getObject('pac', e, 'value') != -1) {
                this.isPac = true;
                
            }
            if (getObject('pac', e, 'value') == -1) {
                this.isPac = false;
            }

            if (getObject('maternal_health', e, 'value') != -1) {
                this.isMaternalHealth = true;
                
            }
            if (getObject('maternal_health', e, 'value') == -1) {
                this.isMaternalHealth = false;
            }

            if (getObject('other', e, 'value') != -1) {
                this.isTopicOther = true;
                
            }
            if (getObject('other', e, 'value') == -1) {
                this.isTopicOther = false;
                
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

        // skip logics
        const cityOtherStyle = this.isCityOther ? {} : { display: 'none' };
        const locationOtherStyle = this.isLocationOther ? {} : { display: 'none' };
        
        const annualReportStyle = this.isAnnualReport ? {} : { display: 'none' };
        const aahungProfileStyle = this.isAahungProfile ? {} : { display: 'none' };
        const pamphletStyle = this.isPamphlet ? {} : { display: 'none' };
        const bookletStyle = this.isBooklet ? {} : { display: 'none' };
        const reportStyle = this.isReport ? {} : { display: 'none' };
        const brandingMaterialStyle = this.isBrandingMaterial ? {} : { display: 'none' };
        const materialTypeOtherStyle = this.isMaterialTypeOther ? {} : { display: 'none' };

        const aahungInformationStyle = this.isAahungInformation ? {} : { display: 'none' };
        const aahungMugStyle = this.isAahungMug ? {} : { display: 'none' };
        const aahungFolderStyle = this.isAahungFolder ? {} : { display: 'none' };
        const aahungNotebookStyle = this.isAahungNotebook ? {} : { display: 'none' };
        const nikahNamaStyle = this.isNikahNama ? {} : { display: 'none' };
        const pubertyStyle = this.isPuberty ? {} : { display: 'none' };
        const rtiStyle = this.isRti ? {} : { display: 'none' };
        const ungeiStyle = this.isUngei ? {} : { display: 'none' };
        const stiStyle = this.isSti ? {} : { display: 'none' };
        const sexualHealthStyle = this.isSexualHealth ? {} : { display: 'none' };
        const preMaritalStyle = this.isPreMarital ? {} : { display: 'none' };
        const pacStyle = this.isPac ? {} : { display: 'none' };
        const maternalHealthStyle = this.isMaternalHealth ? {} : { display: 'none' };
        const otherTopicStyle = this.isOtherTopic ? {} : { display: 'none' };
        const otherParticipantStyle = this.isRecipientOther ? {} : { display: 'none' };

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
                                                                        <Label for="date_start" >Form Date</Label> <span class="errorMessage">{this.state.errors["date_start"]}</span>
                                                                        <Input type="date" name="date_start" id="date_start" value={this.state.date_start} onChange={(e) => {this.inputChange(e, "date_start")}} />
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6">
                                                                    <FormGroup>
                                                                    <Label for="time_radio_show" >Time of Radio Show Start</Label> <span class="errorMessage">{this.state.errors["time_radio_show"]}</span> <br/>
                                                                    {/* <TimePicker id="time_radio_show" value={this.state.time_radio_show} onChange={(e) => {this.inputChange(e, "time_radio_show")}} /> */}
                                                                    <TimeField onChange={(e) => {this.getTime(e, "time_radio_show")}} input={<Input id="time" />} colon=":"/>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6" style={cityOtherStyle}>
                                                                    <FormGroup >
                                                                        <Label for="radio_channel_name" >Name of Radio</Label> <span class="errorMessage">{this.state.errors["radio_channel_name"]}</span>
                                                                        <Input name="radio_channel_name" id="radio_channel_name" value={this.state.radio_channel_name} onChange={(e) => {this.inputChange(e, "radio_channel_name")}} maxLength="200" placeholder="Enter name"/>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" style={cityOtherStyle}>
                                                                    <FormGroup >
                                                                        <Label for="radio_channel_frequency" >Radio Frequency</Label> <span class="errorMessage">{this.state.errors["radio_channel_frequency"]}</span>
                                                                        <Input name="radio_channel_frequency" id="radio_channel_frequency" value={this.state.radio_channel_frequency} onChange={(e) => {this.inputChange(e, "radio_channel_name")}} maxLength="4" placeholder="Enter input"/>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>

                                                                <Col md="6">
                                                                    <FormGroup > 
                                                                            <Label for="city" >City</Label> <span class="errorMessage">{this.state.errors["city"]}</span>
                                                                            <Input type="select" onChange={(e) => this.valueChange(e, "city")} value={this.state.city} name="city" id="city">
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
                                                                        <Label for="city_other" >Specify Other City</Label> <span class="errorMessage">{this.state.errors["v"]}</span>
                                                                        <Input name="city_other" id="city_other" value={this.state.city_other} onChange={(e) => {this.inputChange(e, "city_other")}} maxLength="200" placeholder="Enter other"/>
                                                                    </FormGroup>
                                                                </Col>

                                                            </Row>

                                                            <Row>

                                                                <Col md="6" >
                                                                    <FormGroup >
                                                                        <Label for="radio_show_topic" >Topics Covered</Label> <span class="errorMessage">{this.state.errors["radio_show_topic"]}</span>
                                                                        <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e, "radio_show_topic")} value={this.state.radio_show_topic} id="radio_show_topic" options={coveredTopics} />  
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" >
                                                                    <FormGroup >
                                                                        <Label for="trainer" >Aahung Trainer(s)</Label> <span class="errorMessage">{this.state.errors["trainer"]}</span>
                                                                        <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e, "trainer")} value={this.state.trainer} id="trainer" options={trainers} />
                                                                        
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6">
                                                                    <FormGroup > 
                                                                            <Label for="comms_training_venue" >Training Venue</Label> <span class="errorMessage">{this.state.errors["comms_training_venue"]}</span>
                                                                            <Input type="select" onChange={(e) => this.valueChange(e, "comms_training_venue")} value={this.state.comms_training_venue} name="comms_training_venue" id="comms_training_venue">
                                                                                <option value="lse">Aahung Office</option>
                                                                                <option value="srhm">Other</option>
                                                                            </Input>
                                                                    </FormGroup>
                                                                </Col>

                                                            </Row>

                                                            <Row>
                                                                <Col md="6" >
                                                                {/* TODO: apply skip logic */}
                                                                    <FormGroup >
                                                                        <Label for="comms_training_venue_other" >Specify Other Venue</Label> <span class="errorMessage">{this.state.errors["comms_training_venue_other"]}</span>
                                                                        <Input name="comms_training_venue_other" id="comms_training_venue_other" value={this.state.comms_training_venue_other} onChange={(e) => {this.inputChange(e, "comms_training_venue_other")}} maxLength="200" placeholder="Enter other"/>
                                                                    </FormGroup>
                                                                </Col>

                                                            </Row>

                                                            <Row>                                                                
                                                                <Col md="6" >
                                                                    {/* TODO: appy skip logic */}
                                                                    <FormGroup >
                                                                        <Label for="comms_training_days" >Number of Days</Label> <span class="errorMessage">{this.state.errors["comms_training_days"]}</span>
                                                                        <Input type="number" value={this.state.comms_training_days} name="comms_training_days" id="comms_training_days" onChange={(e) => { this.inputChange(e, "comms_training_days") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" >
                                                                    <FormGroup >
                                                                        <Label for="comms_topic" >Topics Covered</Label> <span class="errorMessage">{this.state.errors["comms_topic"]}</span>
                                                                        <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e, "comms_topic")} value={this.state.comms_topic} id="comms_topic" options={coveredTopics} />  
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>

                                                                <Col md="6" >
                                                                {/* TODO: apply skip logic */}
                                                                    <FormGroup >
                                                                        <Label for="comms_topic_other" >Specify Other Topic</Label> <span class="errorMessage">{this.state.errors["comms_topic_other"]}</span>
                                                                        <Input name="comms_topic_other" id="comms_topic_other" value={this.state.comms_topic_other} onChange={(e) => {this.inputChange(e, "comms_topic_other")}} maxLength="200" placeholder="Enter other"/>
                                                                    </FormGroup>
                                                                </Col>

                                                            </Row>

                                                            <Row>

                                                                <Col md="6" >
                                                                    <FormGroup >
                                                                        <Label for="comms_training_pts" >Type of Participants</Label> <span class="errorMessage">{this.state.errors["comms_training_pts"]}</span>
                                                                        <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e, "comms_training_pts")} value={this.state.comms_training_pts} id="comms_training_pts" options={participantTypes} />  
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" >
                                                                {/* TODO: apply skip logic */}
                                                                    <FormGroup >
                                                                        <Label for="comms_training_pts_other" >Specify Other Type of Participants</Label> <span class="errorMessage">{this.state.errors["comms_training_pts_other"]}</span>
                                                                        <Input name="comms_training_pts_other" id="comms_training_pts_other" value={this.state.comms_training_pts_other} onChange={(e) => {this.inputChange(e, "comms_training_pts_other")}} maxLength="200" placeholder="Enter other"/>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    {/* TODO: appy skip logic */}
                                                                    <FormGroup >
                                                                        <Label for="comms_journalist_num" >Number of Journalists</Label> <span class="errorMessage">{this.state.errors["comms_journalist_num"]}</span>
                                                                        <Input type="number" value={this.state.comms_journalist_num} name="comms_journalist_num" id="comms_journalist_num" onChange={(e) => { this.inputChange(e, "comms_journalist_num") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6">
                                                                    {/* TODO: appy skip logic */}
                                                                    <FormGroup >
                                                                        <Label for="comms_blogger_num" >Number of Bloggers</Label> <span class="errorMessage">{this.state.errors["comms_blogger_num"]}</span>
                                                                        <Input type="number" value={this.state.comms_blogger_num} name="comms_blogger_num" id="comms_blogger_num" onChange={(e) => { this.inputChange(e, "comms_blogger_num") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="6">
                                                                    {/* TODO: appy skip logic */}
                                                                    <FormGroup >
                                                                        <Label for="comms_screenwriter_num" >Number of Screenwriters</Label> <span class="errorMessage">{this.state.errors["comms_screenwriter_num"]}</span>
                                                                        <Input type="number" value={this.state.comms_screenwriter_num} name="comms_screenwriter_num" id="comms_screenwriter_num" onChange={(e) => { this.inputChange(e, "comms_screenwriter_num") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6">
                                                                    {/* TODO: appy skip logic */}
                                                                    <FormGroup >
                                                                        <Label for="comms_other_media_num" >Number of Other Media personnel</Label> <span class="errorMessage">{this.state.errors["comms_other_media_num"]}</span>
                                                                        <Input type="number" value={this.state.comms_other_media_num} name="comms_other_media_num" id="comms_other_media_num" onChange={(e) => { this.inputChange(e, "comms_other_media_num") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6" >
                                                                    {/* TODO: appy skip logic */}
                                                                    <FormGroup >
                                                                        <Label for="comms_other_num" >Number of Other</Label> <span class="errorMessage">{this.state.errors["comms_other_num"]}</span>
                                                                        <Input type="number" value={this.state.comms_other_num} name="comms_other_num" id="comms_other_num" onChange={(e) => { this.inputChange(e, "comms_other_num") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            
                                                            {/* please don't remove this div unless you are adding multiple questions here*/}
                                                            <div style={{height: '250px'}}><span>   </span></div>

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
                                                        <Button className="mb-2 mr-2" color="success" size="sm" type="submit" onClick={this.handleSubmit} >Submit</Button>
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
                            </Container>

                        </div>
                    </ReactCSSTransitionGroup>
                </Fragment>

            </div>
        );
    }
}

export default RadioAppearance;