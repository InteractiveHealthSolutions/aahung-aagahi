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
import * as Constants from "../util/Constants";
import { getFormTypeByUuid, getLocationsByCategory, getRoleByName, getUsersByRole, getParticipantsByLocation } from "../service/GetService";
import { saveFormData } from "../service/PostService";
import LoadingIndicator from "../widget/LoadingIndicator";
import { MDBContainer, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBBtn } from 'mdbreact';

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
            date_start: '',
            schools: [],
            monitors: [],
            participants : [],
            participant_id : '',
            participant_name: '',
            program_type: 'csa',
            csa_flashcard: '1',
            school_level : 'school_level_primary',
            mt_lsbe_level: 'level_1',
            mt_lsbe_level_1 : 'communication',
            mt_lsbe_level_2: 'effective_communication',
            activeTab: '1',
            page2Show: true,
            viewMode: false,
            editMode: false,
            hasError: false,
            errors: {},
            loading: false,
            modal: false,
            modalText: '',
            okButtonStyle: {},
            modalHeading: '',
        };

        
        
        this.cancelCheck = this.cancelCheck.bind(this);
        this.callModal = this.callModal.bind(this);
        this.valueChangeMulti = this.valueChangeMulti.bind(this);
        this.valueChange = this.valueChange.bind(this);
        this.scoreChange = this.scoreChange.bind(this);
        this.inputChange = this.inputChange.bind(this);
        
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
        this.score = 0;
        this.totalScore = 0; 
        this.scoreArray = [];

        this.formTypeId = 0;
        this.csaRequiredFields = [ "date_start", "district", "province", "school_id", "monitor", "participant_name", "participant_id", "school_level", "program_type", "csa_flashcard",
         "mt_csa_prompts", "mt_csa_flashcard_objective", "mt_csa_understanding", "mt_csa_subject_comfort", "mt_csa_nonjudmental_tone", 
         "mt_csa_impartial_opinions", "mt_csa_probing_style", "mt_mock_score", "mt_mock_score_pct"]

        this.csaDependantFields = [];

        this.lsbeRequiredFields = [ "date_start","district", "province", "school_id", "monitor", "participant_name", "participant_id", "school_level", "program_type",
            "mt_lsbe_level", "mt_lsbe_prompts", "mt_lsbe_understanding", "mt_material_prep", "mt_content_prep", 
        "mt_activity_time_allotment", "mt_lsbe_subject_comfort", "mt_lsbe_nonjudmental_tone", "mt_lsbe_impartial_opinions", 
        "mt_lsbe_probing_style", "mt_mock_score", "mt_mock_score_pct"];

        this.lsbeDependantFields = [];

        this.errors = {};
    }

    componentDidMount() {

        window.addEventListener('beforeunload', this.beforeunload.bind(this));

        this.loadData();

        // this will be fetched from school 
        this.setState({ program_type:  "csa"});
        this.programType = "csa";
        // alert(this.programType);
        
        // if(this.programType === "lsbe") {
        //     alert("it's lsbe");
        // }



    }

    /**
     * Loads data when the component is mounted
     */
    loadData = async () => {
        try {

            let formTypeObj = await getFormTypeByUuid(Constants.MASTER_TRAINER_MOCK_SESSION_FORM_UUID);
            this.formTypeId = formTypeObj.formTypeId;
            this.formTypeId = formTypeObj.formTypeId;

            let role = await getRoleByName(Constants.LSE_MONITOR_ROLE_NAME);
            console.log( "Role ID:" + role.roleId);
            console.log(role.roleName);
            let trainersArray = await getUsersByRole(role.uuid);
            if(trainersArray != null && trainersArray.length > 0) {
                this.setState({
                    monitors : trainersArray
                })
            }

            let schools = await getLocationsByCategory(Constants.SCHOOL_DEFINITION_UUID);
            if (schools != null && schools.length > 0) {
                this.setState({
                    schools: schools
                })
            }
        }
        catch(error) {
            console.log(error);
        }
    }

    updateDisplay() {

        this.setState({
            program_type: 'csa',
            school_level : 'school_level_primary',
            mt_lsbe_level: 'level_1',
            mt_lsbe_level_1 : 'communication',
            mt_lsbe_level_2: 'effective_communication',
        })
        
    }

    toggleTab(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
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

        // document.getElementById("mt_csa_prompts").checked = false;

        var x = document.getElementsByName("mt_csa_prompts");
        for(let i=0; i< x.length; x++) {
            x.checked = false;
        }

        if(this.programType === "csa") {
            this.resetForm(this.csaRequiredFields);
            this.resetForm(this.csaDependantFields);
        }
        if(this.programType === "lsbe") {
            this.resetForm(this.csaRequiredFields);
            this.resetForm(this.csaDependantFields);
        }

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

        if(name === "school_level") {
            if(e.target.value === "school_level_secondary") {
                this.errors = {};
                this.setState({
                    program_type:  "lsbe"
                });

                this.programType = "lsbe";
            }
            else {
                this.errors = {};
                this.setState({
                    program_type:  "csa"
                });

                this.programType = "csa";
            }
        }

        if(name === "program_type") {
            if(e.target.value === "csa") {
                this.errors = {};
                this.programType = "csa";
            }
            else if(e.target.value === "lsbe") {
                this.errors = {};
                this.programType = "lsbe";
            }
        }

        if(name === "mt_lsbe_level") {
                this.isLevel1 = e.target.value === "level_1" ? true : false;
                this.isLevel2 = e.target.value === "level_2" ? true : false;

                this.isLevel1Communication = e.target.value === "level_1" ? true : false;
                this.isLevel2Effective = e.target.value === "level_2" ? true : false;
                
        }

        if(name === "mt_lsbe_level_1") {

        
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

        if(name === "mt_lsbe_level_2") {

            if(e.target.value === "effective_communication") {
                this.isLevel2Effective =  true;
            }
            else {
                this.isLevel2Effective =  true;
            }

            this.isLevel2Effective = e.target.value === "effective_communication" ? true : false; 
            this.isLevel2Youth = e.target.value === "youth_family" ? true : false; 
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
                mt_mock_score : this.score,
                mt_mock_score_pct : percent
              })
            //   alert(percent);
              console.log(this.scoreArray);
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
    async handleChange(e, name) {

        this.setState({
            [name]: e
        });
        
        try {
            
            if(name === "province"){
                let districts = getDistrictsByProvince(e.id); // sending province integer id
                console.log(districts);
                this.setState({
                    districtArray : districts
                })
            }

            if (name === "school_id") {

                // alert(e.uuid);
                let participants =  await getParticipantsByLocation(e.uuid);
                if (participants != null && participants.length > 0) {
                    this.setState({
                        participants: participants,
                        school_name: e.locationName
                    })
                }
                else { 
                    this.setState({
                        participants: []
                    })
                }
            }

            if (name === "participant_name") {
                // alert(e.identifier);
                this.setState({ participant_id: e.identifier });
            }
        }
        catch (error) {
            console.log(error);
        }
    };
    

    handleSubmit = async event => {
        event.preventDefault();
        if(this.handleValidation()) {
            
            console.log("in submission");
            
            this.setState({ 
                // form_disabled: true,
                loading : true
            })
            
            const data = new FormData(event.target);
            var jsonData = new Object();
            jsonData.formDate =  this.state.date_start;
            jsonData.formType = {};
            jsonData.formType.formTypeId = this.formTypeId;
            jsonData.referenceId = "";

            jsonData.location = {};
            jsonData.location.locationId = this.state.school_id.id;
            
            jsonData.data = {};

            var dataObj = {};

            // for csa
            if(this.programType === "csa") {

                var fields = this.csaRequiredFields.concat(this.csaDependantFields);
                for(let i=0; i< fields.length; i++) {
                    // alert(fields[i]);

                    
                    if(fields[i] === "monitor") {
                        dataObj.monitor = [];
                        // monitor
                        if((this.state.monitor != null && this.state.monitor != undefined)) {
                            for(let i=0; i< this.state.monitor.length; i++) {
                                dataObj.monitor.push({ 
                                    "userId" : this.state.monitor[i].id
                                });
                            }
                        }
                        continue;

                    }

                    if(fields[i] == "district") {
                        dataObj.district = this.state.district.label;
                        continue;
                    }

                    if(fields[i] == "province") {
                        dataObj.province = this.state.province.name;
                        continue;
                    }


                    var element = document.getElementById(fields[i]);
                    // alert(element);
                    if(element != null) {
                        if(element.offsetParent != null) { // this line is for checking if the element is visible on page
                            // alert("it's visible:   >>> value: " + element.value);
                            if(element.value != '')    
                                dataObj[fields[i]] = element.value;
                        }
                        else if( this.csaDependantFields.filter(f => f == fields[i]).length == 0) {
                            if(element.value != '')    
                                dataObj[fields[i]] = element.value;
                        }
                    }
                    else {
                        if(this.state[fields[i]] != undefined && this.state[fields[i]] != '') {
                            dataObj[fields[i]] = this.state[fields[i]];
                        }
                    }
                }
                console.log(dataObj);
            }

            // for lsbe
            if(this.programType === "lsbe") {
                var fields = this.lsbeRequiredFields.concat(this.lsbeDependantFields);
                for(let i=0; i< fields.length; i++) {
                    // alert(fields[i]);

                    
                    if(fields[i] === "monitor") {
                        dataObj.monitor = [];
                        // trainer
                        if((this.state.monitor != null && this.state.monitor != undefined)) {
                            for(let i=0; i< this.state.monitor.length; i++) {
                                dataObj.monitor.push({ 
                                    "userId" : this.state.monitor[i].id
                                });
                            }
                        }
                        continue;
                    }
                    
                    var element = document.getElementById(fields[i]);
                    // alert(element);
                    if(element != null) {
                        if(element.offsetParent != null) {
                            if(element.value != '')    
                                dataObj[fields[i]] = element.value;
                        }
                        else if( this.lsbeDependantFields.filter(f => f == fields[i]).length == 0) {
                            if(element.value != '')    
                                dataObj[fields[i]] = element.value;
                        }
                    }
                    else {
                        if(this.state[fields[i]] != undefined && this.state[fields[i]] != '') {
                            dataObj[fields[i]] = this.state[fields[i]];
                        }
                    }
                }
                console.log(dataObj);
            }

            jsonData.data = dataObj;
            console.log(jsonData);

            
            saveFormData(jsonData)
            .then(
                responseData => {
                    console.log(responseData);
                    if(!(String(responseData).includes("Error"))) {
                        
                        this.setState({ 
                            loading: false,
                            modalHeading : 'Success!',
                            okButtonStyle : { display: 'none' },
                            modalText : 'Data saved successfully.',
                            modal: !this.state.modal
                        });
                        
                        if(this.programType === "csa") {
                            this.resetForm(this.csaRequiredFields);
                            this.resetForm(this.csaDependantFields);
                        }
                        if(this.programType === "lsbe") {
                            this.resetForm(this.csaRequiredFields);
                            this.resetForm(this.csaDependantFields);
                        }
                        
                        // document.getElementById("projectForm").reset();
                        // this.messageForm.reset();
                    }
                    else if(String(responseData).includes("Error")) {
                        
                        var submitMsg = '';
                        submitMsg = "Unable to submit Form. \
                        " + String(responseData);
                        
                        this.setState({ 
                            loading: false,
                            modalHeading : 'Fail!',
                            okButtonStyle : { display: 'none' },
                            modalText : submitMsg,
                            modal: !this.state.modal
                        });
                    }
                }
            );

        }
    }

    handleValidation(){


        this.isLevel2Effective ? this.lsbeDependantFields.push("imp_communicaton_l2") : this.lsbeDependantFields = this.lsbeDependantFields.filter(e => e !== "imp_communicaton_l2");
        this.isLevel2Effective ? this.lsbeDependantFields.push("describe_communication_comp") : this.lsbeDependantFields = this.lsbeDependantFields.filter(e => e !== "describe_communication_comp");
        this.isLevel2Gender ? this.lsbeDependantFields.push("diff_sex_gender_l2") : this.lsbeDependantFields = this.lsbeDependantFields.filter(e => e !== "diff_sex_gender_l2");
        this.isLevel2Gender ? this.lsbeDependantFields.push("explain_gender_norm_sterotypes") : this.lsbeDependantFields = this.lsbeDependantFields.filter(e => e !== "explain_gender_norm_sterotypes");
        this.isLevel2Gender ? this.lsbeDependantFields.push("gender_discrimination_impact") : this.lsbeDependantFields = this.lsbeDependantFields.filter(e => e !== "gender_discrimination_impact");
        this.isLevel2Puberty ? this.lsbeDependantFields.push("explain_puberty_l2") : this.lsbeDependantFields = this.lsbeDependantFields.filter(e => e !== "explain_puberty_l2");
        this.isLevel2Puberty ? this.lsbeDependantFields.push("myths_puberty") : this.lsbeDependantFields = this.lsbeDependantFields.filter(e => e !== "myths_puberty");
        this.isLevel2Youth ? this.lsbeDependantFields.push("describe_nikah_nama") : this.lsbeDependantFields = this.lsbeDependantFields.filter(e => e !== "describe_nikah_nama");
        this.isLevel2Maternal ? this.lsbeDependantFields.push("descibe_maternal_mortality") : this.lsbeDependantFields = this.lsbeDependantFields.filter(e => e !== "descibe_maternal_mortality");
        this.isLevel2Maternal ? this.lsbeDependantFields.push("link_age_maternal_health") : this.lsbeDependantFields = this.lsbeDependantFields.filter(e => e !== "link_age_maternal_health");
        this.isLevel2Hiv ? this.lsbeDependantFields.push("describe_hiv") : this.lsbeDependantFields = this.lsbeDependantFields.filter(e => e !== "describe_hiv");
        this.isLevel2Hiv ? this.lsbeDependantFields.push("describe_hiv_transmission") : this.lsbeDependantFields = this.lsbeDependantFields.filter(e => e !== "describe_hiv_transmission");
        this.isLevel2Hiv ? this.lsbeDependantFields.push("describe_hiv_prevention") : this.lsbeDependantFields = this.lsbeDependantFields.filter(e => e !== "describe_hiv_prevention");
        this.isLevel2Violence ? this.lsbeDependantFields.push("describe_violence_types") : this.lsbeDependantFields = this.lsbeDependantFields.filter(e => e !== "describe_violence_types");
        this.isLevel2Violence ? this.lsbeDependantFields.push("describe_violence_imapct") : this.lsbeDependantFields = this.lsbeDependantFields.filter(e => e !== "describe_violence_imapct");


        this.isLevel1Communication ? this.lsbeDependantFields.push("imp_communication") : this.lsbeDependantFields = this.lsbeDependantFields.filter(e => e !== "imp_communication");
        this.isLevel1Values ? this.lsbeDependantFields.push("def_values") : this.lsbeDependantFields = this.lsbeDependantFields.filter(e => e !== "def_values");
        this.isLevel1Gender ? this.lsbeDependantFields.push("diff_sex_gender") : this.lsbeDependantFields = this.lsbeDependantFields.filter(e => e !== "diff_sex_gender");
        this.isLevel1Self ? this.lsbeDependantFields.push("explain_self_protection") : this.lsbeDependantFields = this.lsbeDependantFields.filter(e => e !== "explain_self_protection");
        this.isLevel1Peer ? this.lsbeDependantFields.push("explain_peer_pressure") : this.lsbeDependantFields = this.lsbeDependantFields.filter(e => e !== "explain_peer_pressure");
        this.isLevel1Puberty ? this.lsbeDependantFields.push("explain_puberty") : this.lsbeDependantFields = this.lsbeDependantFields.filter(e => e !== "explain_puberty");

        // check each required state
        
        let formIsValid = true;
        if(this.programType === "csa") {
            
            this.setState({ hasError: this.checkValid(this.csaRequiredFields, this.csaDependantFields) ? false : true });
            formIsValid = this.checkValid(this.csaRequiredFields, this.csaDependantFields);
        }
        
        if(this.programType === "lsbe") {
            
            this.setState({ hasError: this.checkValid(this.lsbeRequiredFields, this.lsbeDependantFields) ? false : true });
            formIsValid = this.checkValid(this.lsbeRequiredFields, this.lsbeDependantFields);

        }
        
        // alert("final output");
        // alert(formIsValid);
        this.setState({errors: this.errors});
        return formIsValid;
    }

    /**
     * verifies and notifies for the empty form fields
     */
    checkValid = (requireds, dependants) => {

        let isOk = true;
        this.errors = {};
        for(let j=0; j < requireds.length; j++) {
            
            // alert(requireds[j]);

            let stateName = requireds[j];
            
            // for array object
            if(typeof this.state[stateName] === 'object' && this.state[stateName].length === 0) {
                // alert("object is empty");
                isOk = false;
                this.errors[requireds[j]] = "Please fill in this field!";
                
            }

            // for text and others
            if(typeof this.state[stateName] != 'object') {
                if(this.state[stateName] === "" || this.state[stateName] == undefined) {
                    // alert("value is empty");
                    isOk = false;
                    this.errors[requireds[j]] = "Please fill in this field!";   
                } 
            }
        }

        for(let j=0; j < dependants.length; j++) {
            var element =  document.getElementById(dependants[j]);
            
            // alert(dependants[j]);
            if(element != null) {
                if(element.offsetParent != null) {

                    let stateName = dependants[j];
                    
                    // for array object
                    if(typeof this.state[stateName] === 'object' && this.state[stateName].length === 0) {
                        // alert("object is empty");
                        isOk = false;
                        this.errors[dependants[j]] = "Please fill in this field!";
                        
                    }

                    // for text and others
                    if(typeof this.state[stateName] != 'object') {
                        if(this.state[stateName] === "" || this.state[stateName] == undefined) {
                            // alert("value is empty");
                            isOk = false;
                            this.errors[dependants[j]] = "Please fill in this field!";   
                        } 
                    }
                }
            }
            else {
                let stateName = dependants[j];
                    
                    // for array object
                    if(typeof this.state[stateName] === 'object' && this.state[stateName].length === 0) {
                        // alert("object is empty");
                        isOk = false;
                        this.errors[dependants[j]] = "Please fill in this field!";
                        
                    }

                    // for text and others
                    if(typeof this.state[stateName] != 'object') {
                        if(this.state[stateName] === "" || this.state[stateName] == undefined) {
                            // alert("value is empty");
                            isOk = false;
                            this.errors[dependants[j]] = "Please fill in this field!";   
                        } 
                    }
            }
        }

        return isOk;
    }

    /**
     * verifies and notifies for the empty form fields
     */
    resetForm = (fields) => {

        fields.push("school_name");

        for(let j=0; j < fields.length; j++) {
            
            let stateName = fields[j];
            
            // for array object
            if(typeof this.state[stateName] === 'object') {
                this.state[stateName] = [];
            }

            // for text and others
            if(typeof this.state[stateName] != 'object' ) {
                this.state[stateName] = ''; 
            }
        }

        this.updateDisplay();
    }

    // for modal
    toggle = () => {
        this.setState({
          modal: !this.state.modal
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
                                <Form id="testForm" onSubmit={this.handleSubmit}>
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
                                                <fieldset >
                                                    <TabContent activeTab={this.state.activeTab}>
                                                        <TabPane tabId="1">
                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup inline>
                                                                        <Label for="date_start" >Form Date</Label> <span class="errorMessage">{this.state.errors["date_start"]}</span>
                                                                        <Input type="date" name="date_start" id="date_start" value={this.state.date_start} onChange={(e) => {this.inputChange(e, "date_start")}} max={moment().format("YYYY-MM-DD")} />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                                
                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup>
                                                                        <Label for="province" >Province</Label> <span class="errorMessage">{this.state.errors["province"]}</span>
                                                                        <Select id="province" name="province" value={this.state.province} onChange={(e) => this.handleChange(e, "province")} options={location.provinces} />
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6">
                                                                    <FormGroup> 
                                                                        <Label for="district" >District</Label> <span class="errorMessage">{this.state.errors["district"]}</span>
                                                                        <Select id="district" name="district" value={this.state.district} onChange={(e) => this.handleChange(e, "district")} options={this.state.districtArray} />
                                                                    </FormGroup>
                                                                </Col>

                                                            </Row>

                                                            <Row>
                                                            <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="school_id" >School ID</Label> <span class="errorMessage">{this.state.errors["school_id"]}</span>
                                                                        <Select id="school_id"
                                                                            name="school_id"
                                                                            value={this.state.school_id}
                                                                            onChange={(e) => this.handleChange(e, "school_id")}
                                                                            options={this.state.schools}
                                                                        />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="school_name" >School Name</Label> <span class="errorMessage">{this.state.errors["school_name"]}</span>
                                                                        <Input name="school_name" id="school_name" value={this.state.school_name} disabled/>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                            <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="monitor">Monitored By</Label> <span class="errorMessage">{this.state.errors["monitor"]}</span>
                                                                        <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e, "monitor")} value={this.state.monitor} id="monitor" options={this.state.monitors} required/>
                                                                    </FormGroup>
                                                                    
                                                                </Col>
                                                            
                                                                <Col md="6">
                                                                    <FormGroup> 
                                                                    { /* Single Select */ }
                                                                    {/* TODO: skip logic, Show if step_down_program_monitored = CSA */}
                                                                        <Label for="participant_name" >Name of Teacher</Label> <span class="errorMessage">{this.state.errors["participant_name"]}</span>
                                                                        <Select id="participant_name"
                                                                            name="participant_name"
                                                                            value={this.state.participant_name}
                                                                            onChange={(e) => this.handleChange(e, "participant_name")}
                                                                            options={this.state.participants}
                                                                        />
                                                                    </FormGroup>
                                                                </Col>

                                                            </Row>
                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="participant_id" >Teacher ID</Label> <span class="errorMessage">{this.state.errors["participant_id"]}</span>
                                                                        <Input name="participant_id" id="participant_id" value={this.state.participant_id} disabled/>
                                                                    </FormGroup>
                                                                </Col>
                                                            
                                                                <Col md="6">
                                                                    <FormGroup > 
                                                                        <Label for="school_level" >Level of Program</Label> <span class="errorMessage">{this.state.errors["school_level"]}</span>
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "school_level")} value={this.state.school_level} name="school_level" id="school_level">
                                                                            <option value="school_level_primary">Primary</option>
                                                                            <option value="school_level_secondary">Secondary</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                    
                                                                </Col>

                                                            </Row>
                                                            <Row>
                                                            
                                                            <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="program_type" >Type of program being evaluated</Label> <span class="errorMessage">{this.state.errors["program_type"]}</span>
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
                                                                        <Label for="csa_mt_num">CSA Flashcard being run</Label> <span class="errorMessage">{this.state.errors["csa_flashcard"]}</span>
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "csa_flashcard")} value={this.state.mt_csa_flashcard} name="csa_flashcard" id="csa_flashcard">
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
                                                                                    <Input type="radio" name="mt_csa_prompts" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_csa_prompts")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_prompts" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "mt_csa_prompts")} />{' '}
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
                                                                        <Label for="mt_csa_flashcard_objective" >Master Trainer is meeting the objective of their flashcard even if they are not using all prompts provided in the CSA flashcard guide</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_flashcard_objective" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_csa_flashcard_objective")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_flashcard_objective" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "mt_csa_flashcard_objective")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_flashcard_objective" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_csa_flashcard_objective")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_flashcard_objective" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_csa_flashcard_objective")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_csa_flashcard_objective" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_csa_flashcard_objective")} />{' '}
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
                                                                                    <Input type="radio" name="mt_csa_nonjudmental_tone" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "mt_csa_nonjudmental_tone")} />{' '}
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
                                                                                    <Input type="radio" name="mt_csa_impartial_opinions" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "mt_csa_impartial_opinions")} />{' '}
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
                                                                        <Label for="mt_csa_probing_style" >Master Trainer is leading participants to the main message of the flashcard through probes and not providing the message to participants in a lecture style presentation</Label>
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
                                                                                    <Input type="radio" name="mt_csa_probing_style" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "mt_csa_probing_style")} />{' '}
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
                                                                    <Label for="mt_lsbe_level" >Level Master Trainer is facilitating</Label> <span class="errorMessage">{this.state.errors["mt_lsbe_level"]}</span>
                                                                    <Input type="select" onChange={(e) => this.valueChange(e, "mt_lsbe_level")} value={this.state.mt_lsbe_level} name="mt_lsbe_level" id="mt_lsbe_level" >
                                                                        <option value="level_1">Level 1</option>
                                                                        <option value="level_2">Level 2</option>
                                                                    </Input>
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col md="6" style={level1Style}>
                                                                    <FormGroup >
                                                                        <Label for="mt_lsbe_level_1" >Subject Master Trainer is facilitating</Label> <span class="errorMessage">{this.state.errors["mt_lsbe_level_1"]}</span>
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "mt_lsbe_level_1")} value={this.state.mt_lsbe_level_1} name="mt_lsbe_level_1" id="mt_lsbe_level_1" >
                                                                            
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
                                                                        <Label for="mt_lsbe_level_2" >Subject Master Trainer is facilitating</Label> <span class="errorMessage">{this.state.errors["mt_lsbe_level_2"]}</span>
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "mt_lsbe_level_2")} value={this.state.mt_lsbe_level_2} name="mt_lsbe_level_2" id="mt_lsbe_level_2" >
                                                                            
                                                                            <option value="effective_communication">Effective Communication</option>
                                                                            <option value="gender">Gender</option>
                                                                            <option value="puberty">Puberty</option>
                                                                            <option value="youth_family">Youth and Family</option>
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
                                                                                <Label check>
                                                                                    <Input type="radio" name="imp_communication" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "imp_communication")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="imp_communication" id="disagree" value="2"  onChange={(e) => this.scoreChange(e, "imp_communication")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="imp_communication" id="neither" value="3" onChange={(e) => this.scoreChange(e, "imp_communication")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="imp_communication" id="agree" value="4" onChange={(e) => this.scoreChange(e, "imp_communication")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="imp_communication" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "imp_communication")} />{' '}
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
                                                                                    <Input type="radio" name="def_values" id="strongly_disagree" value="1"  onChange={(e) => this.scoreChange(e, "def_values")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="def_values" id="disagree" value="2"  onChange={(e) => this.scoreChange(e, "def_values")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="def_values" id="neither" value="3" onChange={(e) => this.scoreChange(e, "def_values")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="def_values" id="agree" value="4" onChange={(e) => this.scoreChange(e, "def_values")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="def_values" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "def_values")} />{' '}
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
                                                                                    <Input type="radio" name="diff_sex_gender" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "diff_sex_gender")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="diff_sex_gender" id="disagree" value="2"  onChange={(e) => this.scoreChange(e, "diff_sex_gender")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="diff_sex_gender" id="neither" value="3" onChange={(e) => this.scoreChange(e, "diff_sex_gender")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="diff_sex_gender" id="agree" value="4" onChange={(e) => this.scoreChange(e, "diff_sex_gender")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="diff_sex_gender" id="strongly_agree" value="5"  onChange={(e) => this.scoreChange(e, "diff_sex_gender")} />{' '}
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
                                                                                    <Input type="radio" name="explain_self_protection" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "explain_self_protection")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="explain_self_protection" id="disagree" value="2" onChange={(e) => this.scoreChange(e, "explain_self_protection")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="explain_self_protection" id="neither" value="3" onChange={(e) => this.scoreChange(e, "explain_self_protection")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="explain_self_protection" id="agree" value="4" onChange={(e) => this.scoreChange(e, "explain_self_protection")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="explain_self_protection" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "explain_self_protection")} />{' '}
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
                                                                                    <Input type="radio" name="explain_peer_pressure" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "explain_peer_pressure")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="explain_peer_pressure" id="disagree" value="2"  onChange={(e) => this.scoreChange(e, "explain_peer_pressure")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="explain_peer_pressure" id="neither" value="3" onChange={(e) => this.scoreChange(e, "explain_peer_pressure")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="explain_peer_pressure" id="agree" value="4" onChange={(e) => this.scoreChange(e, "explain_peer_pressure")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="explain_peer_pressure" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "explain_peer_pressure")} />{' '}
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
                                                                                    <Input type="radio" name="explain_puberty" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "explain_puberty")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="explain_puberty" id="disagree" value="2"  onChange={(e) => this.scoreChange(e, "explain_puberty")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="explain_puberty" id="neither" value="3" onChange={(e) => this.scoreChange(e, "explain_puberty")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="explain_puberty" id="agree" value="4" onChange={(e) => this.scoreChange(e, "explain_puberty")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="explain_puberty" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "explain_puberty")} />{' '}
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
                                                                        <Label for="imp_communicaton_l2" >Master Trainer was able to effectively relay the importance of communication</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                            <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="imp_communicaton_l2" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "imp_communicaton_l2")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="imp_communicaton_l2" id="disagree" value="2"  onChange={(e) => this.scoreChange(e, "imp_communicaton_l2")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="imp_communicaton_l2" id="neither" value="3" onChange={(e) => this.scoreChange(e, "imp_communicaton_l2")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="imp_communicaton_l2" id="agree" value="4" onChange={(e) => this.scoreChange(e, "imp_communicaton_l2")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="imp_communicaton_l2" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "imp_communicaton_l2")} />{' '}
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
                                                                                    <Input type="radio" name="describe_communication_comp" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "describe_communication_comp")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="describe_communication_comp" id="disagree" value="2"  onChange={(e) => this.scoreChange(e, "describe_communication_comp")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="describe_communication_comp" id="neither" value="3" onChange={(e) => this.scoreChange(e, "describe_communication_comp")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="describe_communication_comp" id="agree" value="4" onChange={(e) => this.scoreChange(e, "describe_communication_comp")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="describe_communication_comp" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "describe_communication_comp")} />{' '}
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
                                                                                    <Input type="radio" name="diff_sex_gender_l2" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "diff_sex_gender_l2")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="diff_sex_gender_l2" id="disagree" value="2"  onChange={(e) => this.scoreChange(e, "diff_sex_gender_l2")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="diff_sex_gender_l2" id="neither" value="3" onChange={(e) => this.scoreChange(e, "diff_sex_gender_l2")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="diff_sex_gender_l2" id="agree" value="4" onChange={(e) => this.scoreChange(e, "diff_sex_gender_l2")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="diff_sex_gender_l2" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "diff_sex_gender_l2")} />{' '}
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
                                                                                    <Input type="radio" name="explain_gender_norm_sterotypes" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "explain_gender_norm_sterotypes")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="explain_gender_norm_sterotypes" id="disagree" value="2"  onChange={(e) => this.scoreChange(e, "explain_gender_norm_sterotypes")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="explain_gender_norm_sterotypes" id="neither" value="3" onChange={(e) => this.scoreChange(e, "explain_gender_norm_sterotypes")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="explain_gender_norm_sterotypes" id="agree" value="4" onChange={(e) => this.scoreChange(e, "explain_gender_norm_sterotypes")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="explain_gender_norm_sterotypes" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "explain_gender_norm_sterotypes")} />{' '}
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
                                                                                    <Input type="radio" name="gender_discrimination_impact" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "gender_discrimination_impact")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_discrimination_impact" id="disagree" value="2"  onChange={(e) => this.scoreChange(e, "gender_discrimination_impact")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_discrimination_impact" id="neither" value="3" onChange={(e) => this.scoreChange(e, "gender_discrimination_impact")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_discrimination_impact" id="agree" value="4" onChange={(e) => this.scoreChange(e, "gender_discrimination_impact")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_discrimination_impact" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "gender_discrimination_impact")} />{' '}
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
                                                                                    <Input type="radio" name="explain_puberty_l2" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "explain_puberty_l2")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="explain_puberty_l2" id="disagree" value="2"  onChange={(e) => this.scoreChange(e, "explain_puberty_l2")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="explain_puberty_l2" id="neither" value="3" onChange={(e) => this.scoreChange(e, "explain_puberty_l2")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="explain_puberty_l2" id="agree" value="4" onChange={(e) => this.scoreChange(e, "explain_puberty_l2")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="explain_puberty_l2" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "explain_puberty_l2")} />{' '}
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
                                                                                    <Input type="radio" name="myths_puberty" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "myths_puberty")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="myths_puberty" id="disagree" value="2"  onChange={(e) => this.scoreChange(e, "myths_puberty")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="myths_puberty" id="neither" value="3" onChange={(e) => this.scoreChange(e, "myths_puberty")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="myths_puberty" id="agree" value="4" onChange={(e) => this.scoreChange(e, "myths_puberty")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="myths_puberty" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "myths_puberty")} />{' '}
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
                                                                                    <Input type="radio" name="describe_nikah_nama" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "describe_nikah_nama")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="describe_nikah_nama" id="disagree" value="2"  onChange={(e) => this.scoreChange(e, "describe_nikah_nama")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="describe_nikah_nama" id="neither" value="3" onChange={(e) => this.scoreChange(e, "describe_nikah_nama")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="describe_nikah_nama" id="agree" value="4" onChange={(e) => this.scoreChange(e, "describe_nikah_nama")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="describe_nikah_nama" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "describe_nikah_nama")} />{' '}
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
                                                                                    <Input type="radio" name="descibe_maternal_mortality" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "descibe_maternal_mortality")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="descibe_maternal_mortality" id="disagree" value="2"  onChange={(e) => this.scoreChange(e, "descibe_maternal_mortality")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="descibe_maternal_mortality" id="neither" value="3" onChange={(e) => this.scoreChange(e, "descibe_maternal_mortality")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="descibe_maternal_mortality" id="agree" value="4" onChange={(e) => this.scoreChange(e, "descibe_maternal_mortality")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="descibe_maternal_mortality" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "descibe_maternal_mortality")} />{' '}
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
                                                                                    <Input type="radio" name="link_age_maternal_health" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "link_age_maternal_health")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="link_age_maternal_health" id="disagree" value="2"  onChange={(e) => this.scoreChange(e, "link_age_maternal_health")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="link_age_maternal_health" id="neither" value="3" onChange={(e) => this.scoreChange(e, "link_age_maternal_health")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="link_age_maternal_health" id="agree" value="4" onChange={(e) => this.scoreChange(e, "link_age_maternal_health")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="link_age_maternal_health" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "link_age_maternal_health")} />{' '}
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
                                                                                    <Input type="radio" name="describe_hiv" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "describe_hiv")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="describe_hiv" id="disagree" value="2"  onChange={(e) => this.scoreChange(e, "describe_hiv")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="describe_hiv" id="neither" value="3" onChange={(e) => this.scoreChange(e, "describe_hiv")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="describe_hiv" id="agree" value="4" onChange={(e) => this.scoreChange(e, "describe_hiv")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="describe_hiv" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "describe_hiv")} />{' '}
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
                                                                                    <Input type="radio" name="describe_hiv_transmission" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "describe_hiv_transmission")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="describe_hiv_transmission" id="disagree" value="2"  onChange={(e) => this.scoreChange(e, "describe_hiv_transmission")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="describe_hiv_transmission" id="neither" value="3" onChange={(e) => this.scoreChange(e, "describe_hiv_transmission")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="describe_hiv_transmission" id="agree" value="4" onChange={(e) => this.scoreChange(e, "describe_hiv_transmission")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="describe_hiv_transmission" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "describe_hiv_transmission")} />{' '}
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
                                                                                    <Input type="radio" name="describe_hiv_prevention" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "describe_hiv_prevention")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="describe_hiv_prevention" id="disagree" value="2"  onChange={(e) => this.scoreChange(e, "describe_hiv_prevention")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="describe_hiv_prevention" id="neither" value="3" onChange={(e) => this.scoreChange(e, "describe_hiv_prevention")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="describe_hiv_prevention" id="agree" value="4" onChange={(e) => this.scoreChange(e, "describe_hiv_prevention")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="describe_hiv_prevention" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "describe_hiv_prevention")} />{' '}
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
                                                                                    <Input type="radio" name="describe_violence_types" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "describe_violence_types")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="describe_violence_types" id="disagree" value="2"  onChange={(e) => this.scoreChange(e, "describe_violence_types")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="describe_violence_types" id="neither" value="3" onChange={(e) => this.scoreChange(e, "describe_violence_types")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="describe_violence_types" id="agree" value="4" onChange={(e) => this.scoreChange(e, "describe_violence_types")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="describe_violence_types" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "describe_violence_types")} />{' '}
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
                                                            <Col md="12" style={level2ViolenceStyle}>
                                                                    <FormGroup >
                                                                        <Label for="describe_violence_imapct" >Master Trainer has effectively described the impact of violence on an individual’s life</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                        
                                                                            <Col >
                                                                            <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="describe_violence_imapct" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "describe_violence_imapct")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="describe_violence_imapct" id="disagree" value="2"  onChange={(e) => this.scoreChange(e, "describe_violence_imapct")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="describe_violence_imapct" id="neither" value="3" onChange={(e) => this.scoreChange(e, "describe_violence_imapct")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="describe_violence_imapct" id="agree" value="4" onChange={(e) => this.scoreChange(e, "describe_violence_imapct")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="describe_violence_imapct" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "describe_violence_imapct")} />{' '}
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
                                                                                    <Input type="radio" name="mt_lsbe_prompts" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_lsbe_prompts")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_prompts" id="disagree" value="2"  onChange={(e) => this.scoreChange(e, "mt_lsbe_prompts")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_prompts" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_lsbe_prompts")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_prompts" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_lsbe_prompts")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_prompts" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_lsbe_prompts")} />{' '}
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
                                                                                    <Input type="radio" name="mt_lsbe_understanding" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_lsbe_understanding")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_understanding" id="disagree" value="2"  onChange={(e) => this.scoreChange(e, "mt_lsbe_understanding")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_understanding" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_lsbe_understanding")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_understanding" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_lsbe_understanding")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_understanding" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_lsbe_understanding")} />{' '}
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
                                                                                    <Input type="radio" name="mt_material_prep" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_material_prep")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_material_prep" id="disagree" value="2"  onChange={(e) => this.scoreChange(e, "mt_material_prep")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_material_prep" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_material_prep")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_material_prep" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_material_prep")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_material_prep" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_material_prep")} />{' '}
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
                                                                                    <Input type="radio" name="mt_content_prep" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_content_prep")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_content_prep" id="disagree" value="2"  onChange={(e) => this.scoreChange(e, "mt_content_prep")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_content_prep" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_content_prep")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_content_prep" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_content_prep")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_content_prep" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_content_prep")} />{' '}
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
                                                                                    <Input type="radio" name="mt_activity_time_allotment" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_activity_time_allotment")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_activity_time_allotment" id="disagree" value="2"  onChange={(e) => this.scoreChange(e, "mt_activity_time_allotment")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_activity_time_allotment" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_activity_time_allotment")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_activity_time_allotment" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_activity_time_allotment")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_activity_time_allotment" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_activity_time_allotment")} />{' '}
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
                                                                                    <Input type="radio" name="mt_lsbe_subject_comfort" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_lsbe_subject_comfort")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_subject_comfort" id="disagree" value="2"  onChange={(e) => this.scoreChange(e, "mt_lsbe_subject_comfort")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_subject_comfort" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_lsbe_subject_comfort")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_subject_comfort" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_lsbe_subject_comfort")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_subject_comfort" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_lsbe_subject_comfort")} />{' '}
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
                                                                                    <Input type="radio" name="mt_lsbe_nonjudmental_tone" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_lsbe_nonjudmental_tone")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_nonjudmental_tone" id="disagree" value="2"  onChange={(e) => this.scoreChange(e, "mt_lsbe_nonjudmental_tone")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_nonjudmental_tone" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_lsbe_nonjudmental_tone")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_nonjudmental_tone" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_lsbe_nonjudmental_tone")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_nonjudmental_tone" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_lsbe_nonjudmental_tone")} />{' '}
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
                                                                                    <Input type="radio" name="mt_lsbe_impartial_opinions" id="strongly_disagree" value="1" onChange={(e) => this.scoreChange(e, "mt_lsbe_impartial_opinions")} />{' '}
                                                                                    Strongly Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_impartial_opinions" id="disagree" value="2"  onChange={(e) => this.scoreChange(e, "mt_lsbe_impartial_opinions")} />{' '}
                                                                                    Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_impartial_opinions" id="neither" value="3" onChange={(e) => this.scoreChange(e, "mt_lsbe_impartial_opinions")} />{' '}
                                                                                    Neither Agree nor Disagree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_impartial_opinions" id="agree" value="4" onChange={(e) => this.scoreChange(e, "mt_lsbe_impartial_opinions")} />{' '}
                                                                                    Agree
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="mt_lsbe_impartial_opinions" id="strongly_agree" value="5" onChange={(e) => this.scoreChange(e, "mt_lsbe_impartial_opinions")} />{' '}
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
                                                                    this.toggleTab('1');
                                                                }}
                                                            >Form</Button>
                                                            <Button color="secondary" id="page_csa_a" style={csaStyle}
                                                                className={"btn-shadow " + classnames({ active: this.state.activeTab === '2' })}
                                                                onClick={() => {
                                                                    this.toggleTab('2');
                                                                }}
                                                                >CSA</Button>
                                                            <Button color="secondary" id="page_csa_b" style={lsbeStyle}
                                                                className={"btn-shadow " + classnames({ active: this.state.activeTab === '3' })}
                                                                onClick={() => {
                                                                    this.toggleTab('3');
                                                                }}
                                                            >LSBE</Button>
                                                        </ButtonGroup>
                                                        {/* </div> */}
                                                    </Col>
                                                    <Col md="2">
                                                    </Col>
                                                    <Col md="2">
                                                    </Col>
                                                    <Col md="2">
                                                        <LoadingIndicator loading={this.state.loading}/>
                                                    </Col>
                                                    <Col md="3">
                                                        {/* <div className="btn-actions-pane-left"> */}
                                                        <Button className="mb-2 mr-2" color="success" size="sm" type="submit" disabled={setDisable}>Submit</Button>
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

                                    <MDBContainer>
                                    {/* <MDBBtn onClick={this.toggle}>Modal</MDBBtn> */}
                                    <MDBModal isOpen={this.state.modal} toggle={this.toggle}>
                                        <MDBModalHeader toggle={this.toggle}>{this.state.modalHeading}</MDBModalHeader>
                                        <MDBModalBody>
                                            {this.state.modalText}
                                        </MDBModalBody>
                                        <MDBModalFooter>
                                        <MDBBtn color="secondary" onClick={this.toggle}>OK!</MDBBtn>
                                        {/* <MDBBtn color="primary" style={this.state.okButtonStyle} onClick={this.confirm}>OK!</MDBBtn> */}
                                        </MDBModalFooter>
                                        </MDBModal>
                                    </MDBContainer>
                                    
                                    </Form>
                                    
                            </Container>

                            

                        </div>
                    </ReactCSSTransitionGroup>
                </Fragment>

            </div>
        );
    }

}

export default MasterTrainerMockSessionEvaluation;