/*
 * @Author: tahira.niazi@ihsinformatics.com 
 * @Date: 2019-09-15 02:04:54 
 * @Last Modified by: tahira.niazi@ihsinformatics.com
 * @Last Modified time: 2019-10-23 13:55:46
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
import { clearCheckedFields } from "../util/AahungUtil.js";
import moment from 'moment';
import * as Constants from "../util/Constants";
import { getFormTypeByUuid, getLocationsByCategory, getRoleByName, getUsersByRole, getParticipantsByLocation } from "../service/GetService";
import { saveFormData } from "../service/PostService";
import LoadingIndicator from "../widget/LoadingIndicator";
import { MDBContainer, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBBtn } from 'mdbreact';


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

const new_activities_options = [
    { value: 'new_activities', label: 'New activities' },
    { value: 'additional_probes', label: 'Additional Probes' },
    { value: 'additional_info', label: 'Additional Information' },
    { value: 'additional_videos', label: 'Additional videos' },
];

class PrimaryMonitoringRunning extends React.Component {

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
            primary_grade: '1',
            school_sex:'girls',
            class_sex:'girls',
            program_type: 'csa',
            primary_grade: '1',
            csa_challenge_1_status: 'resolved',
            csa_challenge_2_status: 'resolved',
            csa_challenge_3_status: 'resolved',
            csa_challenge_4_status: 'resolved',
            csa_challenge_5_status: 'resolved',
            csa_challenge_6_status: 'resolved',
            csa_flashcard_revision: 'revision',
            csa_class_frequency: 'weekly',
            gender_challenge_1_status: 'resolved',
            gender_challenge_2_status: 'resolved',
            gender_challenge_3_status: 'resolved',
            gender_challenge_4_status: 'resolved',
            gender_challenge_5_status: 'resolved',
            gender_challenge_6_status: 'resolved',
            gender_flashcard_revision: 'revision',
            gender_class_frequency: 'weekly',
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
            isCsa: true,
            isGender: false
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

        this.formTypeId = 0;
        this.csaRequiredFields = ["date_start", "school_id", "monitor", "school_sex", "class_sex", "participant_name", "participant_id", "primary_grade", 
        "class_students" , "class_duration", "program_type", "csa_flashcard", "csa_flashcard_revision", "csa_prompts", "csa_flashcard_objective", 
        "csa_material_preparation", "csa_teacher_preparation", "csa_activity_time_allotment", "csa_beyond_guide", "csa_subject_comfort", "csa_nonjudmental_tone", 
        "csa_impartial_opinions", "csa_student_engagement", "csa_student_understanding", "csa_student_attention", "csa_timetable_integration", 
        "csa_two_teacher_assigned", "csa_teacher_mgmt_coordination", "monitoring_score", "monitoring_score_pct", "csa_challenge_1", 
        "csa_challenge_2", "csa_challenge_3", "csa_challenge_4", "csa_challenge_5", "csa_challenge_6", "csa_resources_required", 
        "csa_resources_delivered"];
        
        this.csaDependantFields = [ "csa_class_frequency", "csa_class_frequency_other", "csa_challenge_1_status", "csa_challenge_2_status", 
        "csa_challenge_3_status", "csa_challenge_4_status", "csa_challenge_5_status", "csa_challenge_6_status"];

        this.csaNonRequiredFields = ["csa_guide_required_count", "csa_book_required_count", "csa_other_required_count", "csa_other_required_type",
        "csa_guide_delivered_count", "csa_book_delivered_count", "csa_other_delivered_count", "csa_other_delivered_type"];

        this.genderRequiredFields = ["date_start", "school_id","monitor", "school_sex", "class_sex", "participant_name","participant_id", "primary_grade", 
        "class_students" , "class_duration", "program_type", "gender_flashcard", "gender_flashcard_revision", "gender_prompts", 
        "gender_flashcard_objective", "gender_material_preparation", "gender_teacher_preparation", "gender_activity_time_allotment", "gender_beyond_guide", 
        "gender_subject_comfort", "gender_nonjudmental_tone", "gender_impartial_opinions", "gender_student_engagement", 
        "gender_student_understanding", "gender_student_attention", "gender_timetable_integration", "gender_class_frequency", 
        "gender_two_teacher_assigned", "gender_teacher_mgmt_coordination", "monitoring_score", 
        "monitoring_score_pct", "gender_challenge_1", "gender_challenge_2", "gender_challenge_3", "gender_challenge_4", "gender_challenge_5", 
        "gender_challenge_6", "gender_resources_required", "gender_resources_delivered"];

        this.genderDependantFields = [ "gender_class_frequency", "gender_class_frequency_other", "gender_challenge_1_status", 
        "gender_challenge_2_status", "gender_challenge_3_status", "gender_challenge_4_status", "gender_challenge_5_status", 
        "gender_challenge_6_status"];

        this.genderNonRequiredFields = ["gender_guide_required_count", "gender_book_required_count", "gender_other_required_count", 
        "gender_other_required_type", "gender_guide_delivered_count", "gender_book_delivered_count", "gender_other_delivered_count", 
        "gender_other_delivered_type"];
        
        this.errors = {};
    }

    componentDidMount() {
        window.addEventListener('beforeunload', this.beforeunload.bind(this));
        this.loadData();

    }

    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.beforeunload.bind(this));
    }

    /**
     * Loads data when the component is mounted
     */
    loadData = async () => {
        try {

            let formTypeObj = await getFormTypeByUuid(Constants.PRIMARY_MONITORING_RUNNING_FORM_UUID);
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
            primary_grade: '1',
            school_sex:'girls',
            class_sex:'girls',
            program_type: 'csa',
            csa_challenge_1_status: 'resolved',
            csa_challenge_2_status: 'resolved',
            csa_challenge_3_status: 'resolved',
            csa_challenge_4_status: 'resolved',
            csa_challenge_5_status: 'resolved',
            csa_challenge_6_status: 'resolved',
            csa_flashcard_revision: 'revision',
            csa_class_frequency: 'weekly',
            gender_challenge_1_status: 'resolved',
            gender_challenge_2_status: 'resolved',
            gender_challenge_3_status: 'resolved',
            gender_challenge_4_status: 'resolved',
            gender_challenge_5_status: 'resolved',
            gender_challenge_6_status: 'resolved',
            gender_flashcard_revision: 'revision',
            gender_class_frequency: 'weekly'
        })
        
    }

    toggleTab(tab) {
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

        console.log(" ============================================================= ");
        if(this.state.isCsa) {
            this.resetForm(this.csaRequiredFields);
            this.resetForm(this.csaDependantFields);
            this.resetForm(this.csaNonRequiredFields);
        }
        if(this.state.isGender) {
            this.resetForm(this.genderRequiredFields);
            this.resetForm(this.genderDependantFields);
            this.resetForm(this.genderNonRequiredFields);
        }
    }

    inputChange(e, name) {

        this.setState({
            [name]: e.target.value
        });

        if(name === "date_start") {
            this.setState({ date_start: e.target.value});
        }

        if(name === "csa_challenge_1") {
            this.isCsaChallenge1 = e.target.id === "yes" ? true : false;
            if(this.isCsaChallenge1)
                this.setState({ csa_challenge_1_status: 'resolved'});
        }
        if(name === "csa_challenge_2") {    
            this.isCsaChallenge2 = e.target.id === "yes" ? true : false;
            if(this.isCsaChallenge2)
                this.setState({ csa_challenge_2_status: 'resolved'});
        }
        if(name === "csa_challenge_3") {
            this.isCsaChallenge3 = e.target.id === "yes" ? true : false;
            if(this.isCsaChallenge3)
                this.setState({ csa_challenge_3_status: 'resolved'});
        }
        if(name === "csa_challenge_4") {
            this.isCsaChallenge4 = e.target.id === "yes" ? true : false;
            if(this.isCsaChallenge4)
                this.setState({ csa_challenge_4_status: 'resolved'});
        }
        if(name === "csa_challenge_5") {
            this.isCsaChallenge5 = e.target.id === "yes" ? true : false;
            if(this.isCsaChallenge5)
                this.setState({ csa_challenge_5_status: 'resolved'});
        }
        if(name === "csa_challenge_6") {
            this.isCsaChallenge6 = e.target.id === "yes" ? true : false;
            if(this.isCsaChallenge6)
                this.setState({ csa_challenge_6_status: 'resolved'});
        }

        // for gender
        if(name === "gender_challenge_1") {
            this.isGenderChallenge1 = e.target.id === "yes" ? true : false;
            if(this.isGenderChallenge1)
                this.setState({ gender_challenge_1_status: 'resolved'});
        }
        if(name === "gender_challenge_2") {    
            this.isGenderChallenge2 = e.target.id === "yes" ? true : false;
            if(this.isGenderChallenge2)
                this.setState({ gender_challenge_2_status: 'resolved'});
        }
        if(name === "gender_challenge_3") {
            this.isGenderChallenge3 = e.target.id === "yes" ? true : false;
            if(this.isGenderChallenge3)
                this.setState({ gender_challenge_3_status: 'resolved'});
        }
        if(name === "gender_challenge_4") {
            this.isGenderChallenge4 = e.target.id === "yes" ? true : false;
            if(this.isGenderChallenge4)
                this.setState({ gender_challenge_4_status: 'resolved'});
        }
        if(name === "gender_challenge_5") {
            this.isGenderChallenge5 = e.target.id === "yes" ? true : false;
            if(this.isGenderChallenge5)
                this.setState({ gender_challenge_5_status: 'resolved'});
        }
        if(name === "gender_challenge_6") {
            this.isGenderChallenge6 = e.target.id === "yes" ? true : false;
            if(this.isGenderChallenge6)
                this.setState({ gender_challenge_6_status: 'resolved'});
        }

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
            
                // empty error becasue switching whole program
                this.errors = {};
                this.setState({
                    isCsa: true,
                    isGender: false,
                    error: this.errors,
                    hasError: false
                });
                
            }
            else if(e.target.value === "gender") {
                
                // empty error becasue switching whole program
                this.errors = {};
                this.setState({
                    isCsa: false,
                    isGender: true,
                    error: this.errors,
                    hasError: false
                });
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

        this.isCsaBeyondGuide ? this.csaDependantFields.push("csa_beyond_guide_new") : this.csaDependantFields = this.csaDependantFields.filter(e => e !== "csa_beyond_guide_new");
        
        this.isGenderBeyondGuide ? this.genderDependantFields.push("gender_beyond_guide_new") : this.genderDependantFields = this.genderDependantFields.filter(e => e !== "gender_beyond_guide_new");


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
              var score = parseInt(this.score);
              var totalScore = parseInt(this.totalScore);
              
              var percent = (score/totalScore)*100;
              percent = percent.toFixed(2);
              this.setState({
                monitoring_score : this.score,
                monitoring_score_pct : percent
              })
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
    async handleChange(e, name) {

        this.setState({
            [name]: e
        });

        try {
            if (name === "school_id") {
                let participants =  await getParticipantsByLocation(e.uuid);
                if (participants != null && participants.length > 0) {
                    this.setState({
                        participants: participants
                    })
                }
                else { 
                    this.setState({
                        participants: []
                    })
                }
            }

            if (name === "participant_name") {
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
            if(this.state.isCsa) {

                var fields = this.csaRequiredFields.concat(this.csaDependantFields);
                fields = fields.concat(this.csaNonRequiredFields);
                for(let i=0; i< fields.length; i++) {

                    if(fields[i] === "csa_flashcard") {
                        dataObj.csa_flashcard = {};
                        dataObj.csa_flashcard.values = [];
                        // generating multiselect for csa_flashcard
                        if((this.state.csa_flashcard != null && this.state.csa_flashcard != undefined)) {
                            for(let i=0; i< this.state.csa_flashcard.length; i++) {
                                dataObj.csa_flashcard.values.push(String(this.state.csa_flashcard[i].value));
                            }
                        }

                        continue;
                    }

                    if(fields[i] === "csa_beyond_guide_new") {
                        dataObj.csa_beyond_guide_new = {};
                        dataObj.csa_beyond_guide_new.values = [];
                        // generating multiselect for csa_beyond_guide_new
                        if((this.state.csa_beyond_guide_new != null && this.state.csa_beyond_guide_new != undefined)) {
                            for(let i=0; i< this.state.csa_beyond_guide_new.length; i++) {
                                dataObj.csa_beyond_guide_new.values.push(String(this.state.csa_beyond_guide_new[i].value));
                            }
                        }

                        continue;
                    }

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


                    var element = document.getElementById(fields[i]);
                    if(element != null) {
                        if(element.offsetParent != null) { // this line is for checking if the element is visible on page
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

            // for gender
            if(this.state.isGender) {
                var fields = this.genderRequiredFields.concat(this.genderDependantFields);
                fields = fields.concat(this.genderNonRequiredFields);
                for(let i=0; i< fields.length; i++) {
                    if(fields[i] === "gender_flashcard") {
                        dataObj.gender_flashcard = {};
                        dataObj.gender_flashcard.values = [];
                        // generating multiselect for gender_flashcard
                        if((this.state.gender_flashcard != null && this.state.gender_flashcard != undefined)) {
                            for(let i=0; i< this.state.gender_flashcard.length; i++) {
                                dataObj.gender_flashcard.values.push(String(this.state.gender_flashcard[i].value));
                            }
                        }
                        continue;
                    }

                    if(fields[i] === "gender_beyond_guide_new") {
                        dataObj.gender_beyond_guide_new = {};
                        dataObj.gender_beyond_guide_new.values = [];
                        // generating multiselect for gender_beyond_guide_new
                        if((this.state.gender_beyond_guide_new != null && this.state.gender_beyond_guide_new != undefined)) {
                            for(let i=0; i< this.state.gender_beyond_guide_new.length; i++) {
                                dataObj.gender_beyond_guide_new.values.push(String(this.state.gender_beyond_guide_new[i].value));
                            }
                        }

                        continue;
                    }

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
                    if(element != null) {
                        if(element.offsetParent != null) { // this line is for checking if the element is visible on page
                            if(element.value != '')    
                                dataObj[fields[i]] = element.value;
                        }
                        else if( this.genderDependantFields.filter(f => f == fields[i]).length == 0) {
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
                        
                        if(this.state.isCsa) {
                            this.resetForm(this.csaRequiredFields);
                            this.resetForm(this.csaDependantFields);
                            this.resetForm(this.csaNonRequiredFields);
                        }
                        if(this.state.isGender) {
                            this.resetForm(this.genderRequiredFields);
                            this.resetForm(this.genderDependantFields);
                            this.resetForm(this.genderNonRequiredFields);
                        }
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
        // check each required state
        
        let formIsValid = true;
        if(this.state.isCsa) {
            
            this.setState({ hasError: this.checkValid(this.csaRequiredFields, this.csaDependantFields) ? false : true });
            formIsValid = this.checkValid(this.csaRequiredFields, this.csaDependantFields);
        }
        
        if(this.state.isGender) {
            
            this.setState({ hasError: this.checkValid(this.genderRequiredFields, this.genderDependantFields) ? false : true });
            formIsValid = this.checkValid(this.genderRequiredFields, this.genderDependantFields);

        }
        this.setState({errors: this.errors});
        return formIsValid;
    }

    /**
     * verifies and notifies for the empty form fields
     */
    checkValid = (requireds, dependants) => {

        let isOk = true;
        this.errors = {};
        const errorText = "Required";
        for(let j=0; j < requireds.length; j++) {
            let stateName = requireds[j];
            
            // for array object
            if(typeof this.state[stateName] === 'object' && this.state[stateName].length === 0) {
                isOk = false;
                this.errors[requireds[j]] = errorText;
            }

            // for text and others
            if(typeof this.state[stateName] != 'object') {
                if(this.state[stateName] === "" || this.state[stateName] == undefined) {
                    isOk = false;
                    this.errors[requireds[j]] = errorText;   
                } 
            }
        }

        for(let j=0; j < dependants.length; j++) {
            var element =  document.getElementById(dependants[j]);
            if(element != null) {
                if(element.offsetParent != null) {
                    let stateName = dependants[j];
                    // for array object
                    if(typeof this.state[stateName] === 'object' && this.state[stateName].length === 0) {
                        isOk = false;
                        this.errors[dependants[j]] = errorText;
                    }

                    // for text and others
                    if(typeof this.state[stateName] != 'object') {
                        if(this.state[stateName] === "" || this.state[stateName] == undefined) {
                            isOk = false;
                            this.errors[dependants[j]] = errorText;   
                        } 
                    }
                }
            }
            else {
                let stateName = dependants[j];
                    // for array object
                    if(typeof this.state[stateName] === 'object' && this.state[stateName].length === 0) {
                        isOk = false;
                        this.errors[dependants[j]] = errorText;
                    }

                    // for text and others
                    if(typeof this.state[stateName] != 'object') {
                        if(this.state[stateName] === "" || this.state[stateName] == undefined) {
                            isOk = false;
                            this.errors[dependants[j]] = errorText;   
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

        clearCheckedFields();
        this.updateDisplay();
    }

    // for modal
    toggle = () => {
        this.setState({
          modal: !this.state.modal
        });
    }


    render() {

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
                            <Form id="primaryRunning" onSubmit={this.handleSubmit}>
                                <Row>
                                    <Col md="6">
                                        <Card className="main-card mb-6">
                                            <CardHeader>
                                                <i className="header-icon lnr-license icon-gradient bg-plum-plate"> </i>
                                                <b>Primary Monitoring Form - Running</b>
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
                                                                        <Label for="date_start" >Form Date</Label>
                                                                        <Input type="date" name="date_start" id="date_start" value={this.state.date_start} onChange={(e) => {this.inputChange(e, "date_start")}} max={moment().format("YYYY-MM-DD")} />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                
                                                                    <FormGroup >
                                                                        <Label for="school_id" >School Name</Label> <span class="errorMessage">{this.state.errors["school_id"]}</span>
                                                                        <Select id="school_id"
                                                                            name="school_id"
                                                                            value={this.state.school_id}
                                                                            onChange={(e) => this.handleChange(e, "school_id")}
                                                                            options={this.state.schools}
                                                                        />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            
                                                            <Row>
                                                                
                                                                
                                                            </Row>
                                                            <Row>
                                                                <Col md="6">
                                                                <FormGroup >
                                                                        <Label for="monitor" >Monitored By</Label> <span class="errorMessage">{this.state.errors["monitor"]}</span>
                                                                        <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e, "monitor")} value={this.state.monitor} id="monitor" options={this.state.monitors} />
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
                                                                <Col md="6">
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
                                                                        <Select id="participant_name" name="participant_name" value={this.state.participant_name} onChange={(e) => this.handleChange(e, "participant_name")} options={this.state.participants} />
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
                                                                        <Label for="primary_grade" >Class</Label> <span class="errorMessage">{this.state.errors["primary_grade"]}</span>
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "primary_grade")} value={this.state.primary_grade} name="primary_grade" id="primary_grade">
                                                                            <option value="1">1</option>
                                                                            <option value="2">2</option>
                                                                            <option value="3">3</option>
                                                                            <option value="4">4</option>
                                                                            <option value="5">5</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="class_students" >Number of Students in Class</Label> <span class="errorMessage">{this.state.errors["class_students"]}</span>
                                                                        <Input type="number" name="class_students" id="class_students" value={this.state.class_students}  onChange={(e) => {this.inputChange(e, "class_students")}} onInput = {(e) =>{ e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,2)}} max="99" min="1"/>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="class_duration" >Time duration of class in minutes</Label> <span class="errorMessage">{this.state.errors["class_duration"]}</span>
                                                                        <Input type="number" name="class_duration" id="class_duration" value={this.state.class_duration}  onChange={(e) => {this.inputChange(e, "class_duration")}} onInput = {(e) =>{ e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,3)}} max="999" min="1"/>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="program_type" >Primary Program</Label> <span class="errorMessage">{this.state.errors["program_type"]}</span>
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
                                                        <Row></Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="csa_flashcard" >CSA Flashcard being run</Label> <span class="errorMessage">{this.state.errors["csa_flashcard"]}</span>
                                                                        <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e, "csa_flashcard")} value={this.state.csa_flashcard} id="csa_flashcard" options={csaFlashcards} />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="csa_flashcard_revision" >Revision or first time flashcard is being taught</Label> <span class="errorMessage">{this.state.errors["csa_flashcard_revision"]}</span>
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "csa_flashcard_revision")} value={this.state.csa_flashcard_revision} name="csa_flashcard_revision" id="csa_flashcard_revision" >
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
                                                                <Col md="8"  style={csaBeyondGuideStyle}>
                                                                    <FormGroup >
                                                                        <Label for="csa_beyond_guide_new" >What has the teacher done that is new?</Label> <span class="errorMessage">{this.state.errors["csa_beyond_guide_new"]}</span>
                                                                        <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e, "csa_beyond_guide_new")} value={this.state.csa_beyond_guide_new} id="csa_beyond_guide_new" options={new_activities_options} />
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
                                                            
                                                            <Row >
                                                                <Col md="6">
                                                                    <FormGroup className="monitoringScoreBox">
                                                                        <Label for="monitoring_score" style={{color: "green"}}><b>Cumulative Monitoring Score</b></Label> <span class="errorMessage">{this.state.errors["monitoring_score"]}</span>
                                                                        <Input value={this.state.monitoring_score} name="monitoring_score" id="monitoring_score" onChange={(e) => {this.inputChange(e, "monitoring_score")}} readOnly></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup className="monitoringScoreBox">
                                                                        {/* TODO: apply style to hide this based on csa/primary question */}
                                                                        <Label for="monitoring_score_pct" style={{color: "green"}}><b>% Monitoring Score</b></Label>
                                                                        <Input name="monitoring_score_pct" id="monitoring_score_pct" value={this.state.monitoring_score_pct} onChange={(e) => {this.inputChange(e, "monitoring_score_pct")}} readOnly></Input>
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
                                                                    <FormGroup style={monitoredCsaStyle}>
                                                                        <Label for="csa_challenge_1" >The school is facing challenges scheduling the CSA class</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_challenge_1" id="yes" value="yes" onChange={(e) => {this.inputChange(e, "csa_challenge_1")}} />{' '}
                                                                                    {yes}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_challenge_1" id="no" value="no" onChange={(e) => {this.inputChange(e, "csa_challenge_1")}} />{' '}
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
                                                                    <FormGroup style={monitoredCsaStyle}>
                                                                        <Label for="csa_challenge_2" >There are not enough resources</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_challenge_2" id="yes" value="yes" onChange={(e) => {this.inputChange(e, "csa_challenge_2")}} />{' '}
                                                                                    Yes
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_challenge_2" id="no" value="no" onChange={(e) => {this.inputChange(e, "csa_challenge_2")}} />{' '}
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
                                                                                    <Input type="radio" name="csa_challenge_3" id="yes" value="yes" onChange={(e) => {this.inputChange(e, "csa_challenge_3")}} />{' '}
                                                                                    Yes
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_challenge_3" id="no" value="no" onChange={(e) => {this.inputChange(e, "csa_challenge_3")}} />{' '}
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
                                                                                    <Input type="radio" name="csa_challenge_4" id="yes" value="yes" onChange={(e) => {this.inputChange(e, "csa_challenge_4")}} />{' '}
                                                                                    Yes
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_challenge_4" id="no" value="no" onChange={(e) => {this.inputChange(e, "csa_challenge_4")}} />{' '}
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
                                                                    <FormGroup >
                                                                        <Label for="csa_challenge_5" >The content is irrelevant for the context of the students</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_challenge_5" id="yes" value="yes" onChange={(e) => {this.inputChange(e, "csa_challenge_5")}} />{' '}
                                                                                    Yes
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_challenge_5" id="no" value="no" onChange={(e) => {this.inputChange(e, "csa_challenge_5")}} />{' '}
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
                                                                                    <Input type="radio" name="csa_challenge_6" id="yes" value="yes" onChange={(e) => {this.inputChange(e, "csa_challenge_6")}} />{' '}
                                                                                    Yes
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_challenge_6" id="no" value="no" onChange={(e) => {this.inputChange(e, "csa_challenge_6")}} />{' '}
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
                                                                    <FormGroup style={monitoredCsaStyle}>
                                                                        <Label for="csa_resources_required">Does this school require any resources?</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_resources_required" id="yes" value="yes" onChange={(e) => {this.inputChange(e, "csa_resources_required")}} />{' '}
                                                                                    Yes
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_resources_required" id="no" value="no" onChange={(e) => {this.inputChange(e, "csa_resources_required")}} />{' '}
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
                                                                        <Label for="csa_guide_required_count" >CSA Flashcard Guides</Label>  <span class="errorMessage">{this.state.errors["csa_guide_required_count"]}</span>
                                                                        <Input type="number" value={this.state.csa_guide_required_count} name="csa_guide_required_count" id="csa_guide_required_count" onChange={(e) => {this.inputChange(e, "csa_guide_required_count")}} max="999" min="0" onInput = {(e) =>{ e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,3)}} placeholder="Enter count in numbers"></Input> 
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6" style={csaResourcesRequiredStyle}>
                                                                    <FormGroup >
                                                                        <Label for="csa_book_required_count" >Drawing Books</Label>  <span class="errorMessage">{this.state.errors["csa_book_required_count"]}</span>
                                                                        <Input type="number" value={this.state.csa_book_required_count} name="csa_book_required_count" id="csa_book_required_count" onChange={(e) => {this.inputChange(e, "csa_book_required_count")}} max="999" min="0" onInput = {(e) =>{ e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,3)}} placeholder="Enter count in numbers"></Input> 
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6" style={csaResourcesRequiredStyle}>
                                                                    <FormGroup >
                                                                        <Label for="csa_other_required_count" >Other Resource</Label> <span class="errorMessage">{this.state.errors["csa_other_required_count"]}</span>
                                                                        <Input type="number" value={this.state.csa_other_required_count} name="csa_other_required_count" id="csa_other_required_count" onChange={(e) => {this.inputChange(e, "csa_other_required_count")}} max="999" min="0" onInput = {(e) =>{ e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,3)}} placeholder="Enter count in numbers"></Input> 
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
                                                                                    <Input type="radio" name="csa_resources_delivered" id="yes" value="yes" onChange={(e) => {this.inputChange(e, "csa_resources_delivered")}} />{' '}
                                                                                    Yes
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="csa_resources_delivered" id="no" value="no" onChange={(e) => {this.inputChange(e, "csa_resources_delivered")}} />{' '}
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
                                                                        <Input type="number" value={this.state.csa_guide_delivered_count} name="csa_guide_delivered_count" id="csa_guide_delivered_count" onChange={(e) => {this.inputChange(e, "csa_guide_delivered_count")}} max="999" min="0" onInput = {(e) =>{ e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,3)}} placeholder="Enter count in numbers"></Input> 
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6" style={csaResourcesDeliveredStyle}>
                                                                    <FormGroup >
                                                                        <Label for="csa_book_delivered_count" >Drawing Books</Label>  <span class="errorMessage">{this.state.errors["csa_book_delivered_count"]}</span>
                                                                        <Input type="number" value={this.csa_book_delivered_count} name="csa_book_delivered_count" id="csa_book_delivered_count" onChange={(e) => {this.inputChange(e, "csa_book_delivered_count")}} max="999" min="0" onInput = {(e) =>{ e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,3)}} placeholder="Enter count in numbers"></Input> 
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6" style={csaResourcesDeliveredStyle}>
                                                                    <FormGroup >
                                                                        <Label for="csa_other_delivered_count" >Other Resource</Label> <span class="errorMessage">{this.state.errors["csa_other_delivered_count"]}</span>
                                                                        <Input type="number" value={this.state.csa_other_delivered_count} name="csa_other_delivered_count" id="csa_other_delivered_count" onChange={(e) => {this.inputChange(e, "csa_other_delivered_count")}} max="999" min="0" onInput = {(e) =>{ e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,3)}} placeholder="Enter count in numbers"></Input> 
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
                                                                        <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e, "gender_flashcard")} value={this.state.gender_flashcard} id="gender_flashcard" options={genderFlashcards} />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="gender_flashcard_revision" >Revision or first time flashcard is being taught</Label> <span class="errorMessage">{this.state.errors["gender_flashcard_revision"]}</span>
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "gender_flashcard_revision")} value={this.state.gender_flashcard_revision} name="gender_flashcard_revision" id="gender_flashcard_revision" >
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
                                                                        {/* <Label for="school_tier" ></Label> */}
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
                                                                        <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e, "gender_beyond_guide_new")} value={this.state.gender_beyond_guide_new} id="gender_beyond_guide_new" options={new_activities_options} />
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
                                                                        <Label for="gender_class_frequency" >Frequency of class in time table</Label> <span class="errorMessage">{this.state.errors["gender_class_frequency"]}</span>
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
                                                                        <Label for="gender_class_frequency_other" >If other, please specify</Label>  <span class="errorMessage">{this.state.errors["gender_class_frequency_other"]}</span>
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
                                                                        <Input value={this.state.monitoring_score} name="monitoring_score" id="monitoring_score"  onChange={(e) => {this.inputChange(e, "monitoring_score")}} readOnly></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup className="monitoringScoreBox">
                                                                        {/* TODO: apply style to hide this based on csa/primary question */}
                                                                        <Label for="monitoring_score_pct" style={{color: "green"}}><b>% Monitoring Score</b></Label>
                                                                        <Input name="monitoring_score_pct" id="monitoring_score_pct" value={this.state.monitoring_score_pct} onChange={(e) => {this.inputChange(e, "monitoring_score_pct")}} readOnly></Input>
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
                                                                                    <Input type="radio" name="gender_challenge_1" id="yes" value="yes" onChange={(e) => {this.inputChange(e, "gender_challenge_1")}} />{' '}
                                                                                    {yes}
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_challenge_1" id="no" value="no" onChange={(e) => {this.inputChange(e, "gender_challenge_1")}} />{' '}
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
                                                                                    <Input type="radio" name="gender_challenge_2" id="yes" value="yes" onChange={(e) => {this.inputChange(e, "gender_challenge_2")}} />{' '}
                                                                                    Yes
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_challenge_2" id="no" value="no" onChange={(e) => {this.inputChange(e, "gender_challenge_2")}} />{' '}
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
                                                                                    <Input type="radio" name="gender_challenge_3" id="yes" value="yes" onChange={(e) => {this.inputChange(e, "gender_challenge_3")}} />{' '}
                                                                                    Yes
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_challenge_3" id="no" value="no" onChange={(e) => {this.inputChange(e, "gender_challenge_3")}} />{' '}
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
                                                                                    <Input type="radio" name="gender_challenge_4" id="yes" value="yes" onChange={(e) => {this.inputChange(e, "gender_challenge_4")}} />{' '}
                                                                                    Yes
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_challenge_4" id="no" value="no" onChange={(e) => {this.inputChange(e, "gender_challenge_4")}} />{' '}
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
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="gender_challenge_5" >The content is irrelevant for the context of the students</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_challenge_5" id="yes" value="yes" onChange={(e) => {this.inputChange(e, "gender_challenge_5")}} />{' '}
                                                                                    Yes
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_challenge_5" id="no" value="no" onChange={(e) => {this.inputChange(e, "gender_challenge_5")}} />{' '}
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
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="gender_challenge_6" >Students are not interested in the content</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_challenge_6" id="yes" value="yes" onChange={(e) => {this.inputChange(e, "gender_challenge_6")}} />{' '}
                                                                                    Yes
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_challenge_6" id="no" value="no" onChange={(e) => {this.inputChange(e, "gender_challenge_6")}} />{' '}
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
                                                                    <FormGroup >
                                                                        <Label for="gender_resources_required">Does this school require any resources?</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_resources_required" id="yes" value="yes" onChange={(e) => {this.inputChange(e, "gender_resources_required")}} />{' '}
                                                                                    Yes
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_resources_required" id="no" value="no" onChange={(e) => {this.inputChange(e, "gender_resources_required")}} />{' '}
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
                                                                        <Input type="number" value={this.state.gender_guide_required_count} name="gender_guide_required_count" id="gender_guide_required_count" onChange={(e) => {this.inputChange(e, "gender_guide_required_count")}} max="999" min="0" onInput = {(e) =>{ e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,3)}} placeholder="Enter count in numbers"></Input> 
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6" style={genderResourcesRequiredStyle}>
                                                                    <FormGroup >
                                                                        <Label for="gender_book_required_count" >Drawing Books</Label> <span class="errorMessage">{this.state.errors["gender_book_required_count"]}</span>
                                                                        <Input type="number" value={this.state.gender_book_required_count} name="gender_book_required_count" id="gender_book_required_count" onChange={(e) => {this.inputChange(e, "gender_book_required_count")}} max="999" min="0" onInput = {(e) =>{ e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,3)}} placeholder="Enter count in numbers"></Input> 
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6" style={genderResourcesRequiredStyle}>
                                                                    <FormGroup >
                                                                        <Label for="gender_other_required_count" >Other Resource</Label>  <span class="errorMessage">{this.state.errors["gender_other_required_count"]}</span>
                                                                        <Input type="number" value={this.state.gender_other_required_count} name="gender_other_required_count" id="gender_other_required_count" onChange={(e) => {this.inputChange(e, "gender_other_required_count")}} max="999" min="0" onInput = {(e) =>{ e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,3)}} placeholder="Enter count in numbers"></Input> 
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
                                                                <Col md="6" >
                                                                    <FormGroup >
                                                                        <Label for="gender_resources_delivered">Were any resources distributed to this school in this visit?</Label>
                                                                        <FormGroup tag="fieldset" row>
                                                                            <Col >
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_resources_delivered" id="yes" value="yes" onChange={(e) => {this.inputChange(e, "gender_resources_delivered")}} />{' '}
                                                                                    Yes
                                                                                </Label>
                                                                                </FormGroup>
                                                                                <FormGroup check inline>
                                                                                <Label check>
                                                                                    <Input type="radio" name="gender_resources_delivered" id="no" value="no" onChange={(e) => {this.inputChange(e, "gender_resources_delivered")}} />{' '}
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
                                                                        <Input type="number" value={this.state.gender_guide_delivered_count} name="gender_guide_delivered_count" id="gender_guide_delivered_count" onChange={(e) => {this.inputChange(e, "gender_guide_delivered_count")}} max="999" min="0" onInput = {(e) =>{ e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,3)}} placeholder="Enter count in numbers"></Input> 
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6" style={genderResourcesDeliveredStyle}>
                                                                    <FormGroup >
                                                                        <Label for="gender_book_delivered_count" >Drawing Books</Label> <span class="errorMessage">{this.state.errors["gender_book_delivered_count"]}</span>
                                                                        <Input type="number" value={this.state.gender_book_delivered_count} name="gender_book_delivered_count" id="gender_book_delivered_count" onChange={(e) => {this.inputChange(e, "gender_book_delivered_count")}} max="999" min="0" onInput = {(e) =>{ e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,3)}} placeholder="Enter count in numbers"></Input> 
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6" style={genderResourcesDeliveredStyle}>
                                                                    <FormGroup >
                                                                        <Label for="gender_other_delivered_count" >Other Resource</Label>  <span class="errorMessage">{this.state.errors["gender_other_delivered_count"]}</span>
                                                                        <Input type="number" value={this.state.gender_other_delivered_count} name="gender_other_delivered_count" id="gender_other_delivered_count" onChange={(e) => {this.inputChange(e, "gender_other_delivered_count")}} max="999" min="0" onInput = {(e) =>{ e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,3)}} placeholder="Enter count in numbers"></Input> 
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
                                                            <Button color="secondary" id="page_csa_a" style={monitoredCsaStyle}
                                                                className={"btn-shadow " + classnames({ active: this.state.activeTab === '2' })}
                                                                onClick={() => {
                                                                    this.toggleTab('2');
                                                                }}
                                                                >CSA</Button>
                                                            <Button color="secondary" id="page_csa_b" style={monitoredGenderStyle}
                                                                className={"btn-shadow " + classnames({ active: this.state.activeTab === '3' })}
                                                                onClick={() => {
                                                                    this.toggleTab('3');
                                                                }}
                                                                >Gender</Button>  

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

export default PrimaryMonitoringRunning;


