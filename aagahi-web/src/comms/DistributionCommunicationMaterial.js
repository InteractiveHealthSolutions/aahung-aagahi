/*
 * @Author: tahira.niazi@ihsinformatics.com 
 * @Date: 2019-08-27 10:21:45 
 * @Last Modified by: tahira.niazi@ihsinformatics.com
 * @Last Modified time: 2019-09-16 16:57:08
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
import * as Constants from "../util/Constants";
import { getFormTypeByUuid, getDefinitionId } from "../service/GetService";
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
    { value: 'sindh', label: 'Sindh' },
    { value: 'punjab', label: 'Punjab' },
    { value: 'balochistan', label: 'Balochistan' },
    { value: 'khyber_pakhtunkhwa', label: 'Khyber Pakhtunkhwa' },
];

const participantTypes = [
    { value: 'students', label: 'Students' },
    { value: 'parents', label: 'Parents' },
    { value: 'teachers', label: 'Teachers' },
    { value: 'conference_attendees', label: 'Conference attendees' },
    { value: 'stakeholders', label: 'Stakeholders' },
    { value: 'policy_makers', label: 'Policy Makers' },
    { value: 'other_government_officials', label: 'Other government officials' },
    { value: 'school_partners', label: 'School partners' },
    { value: 'other', label: 'Other' }
];

const materialTypes = [
    { value: 'annual_report', label: 'Annual Report' },
    { value: 'aahung_profile', label: 'Aahung Profile' },
    { value: 'pamphlet', label: 'Pamphlet' },
    { value: 'booklet', label: 'Booklet' },
    { value: 'report', label: 'Report' },
    { value: 'aahung_mugs', label: 'Aahung Mugs' },
    { value: 'aahung_folders', label: 'Aahung Folders' },
    { value: 'aahung_notebooks', label: 'Aahung Notebooks' },
    { value: 'other', label: 'Other' }

];

const postPlatformOptions = [
    { value: 'facebook', label: 'Facebook' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'web_portal', label: 'Web Portal' },
    { value: 'other', label: 'Other' }
];

const postTopicOptions = [
    { value: 'news_article', label: 'News Article' },
    { value: 'csa_lsbe_infographic', label: 'CSA/LSBE Infographic' },
    { value: 'radio_appearance', label: 'Radio Appearance' },
    { value: 'tv_appearance', label: 'TV Appearance' },
    { value: 'international_day_post', label: 'International Day Post' },
    { value: 'srhr_infographic', label: 'SRHR Infographic' },
    { value: 'conference_panel Appearance ', label: 'Conference/Panel Appearance ' },
    { value: 'aahung video', label: 'Aahung video' },
    { value: 'other', label: 'Other' }
];

const staffUsers = [
    { value: 'uuid1', label: 'Harry Potter' },
    { value: 'uuid2', label: 'Ron Weasley' },
    { value: 'uuid3', label: 'Hermione Granger' },
    { value: 'uuid4', label: 'Albus Dumbledore' },
];

class DistributionCommunicationMaterial extends React.Component {

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
            partner_components : 'lse',
            city: 'karachi',
            distribution_location: 'conference',
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
            modalHeading: ''
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
        this.isAttendantOther = false;

        this.isRemoveInfo = false;

        this.formTypeId = 0;
        this.requiredFields = ["date_start", "partner_components", "city", "distribution_location", "distribution_location_name", "distribution_material_type", "event_attendant", "topic_covered"];
        this.errors = {};

        this.distributionTopics = [
            { value: 'aahung_information', label: 'Aahung Information' },
            { value: 'aahung_branding_material', label: 'Aahung Branding Material' },
            { value: 'nikah_nama', label: 'Nikah Nama' },
            { value: 'puberty', label: 'puberty' },
            { value: 'rti', label: 'RTIs' },
            { value: 'ungei', label: 'UNGEI' },
            { value: 'sti', label: 'STIs' },
            { value: 'sexual_health', label: 'Sexual Health' },
            { value: 'pre_marital_information', label: 'Pre-marital Information' },
            { value: 'pac', label: 'PAC' },
            { value: 'maternal_health', label: 'Maternal Health' },
            { value: 'other', label: 'Other' }
        ];

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

            let formTypeObj = await getFormTypeByUuid(Constants.DISTRIBUTION_COMMS_MATERIAL_FORM_UUID);
            this.formTypeId = formTypeObj.formTypeId;

        }
        catch(error) {
            console.log(error);
        }
    }

    updateDisplay() {

        this.setState({
            partner_components : 'lse',
            city: 'karachi',
            distribution_location: 'conference'
        })
        
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

        // receiving value directly from widget but it still requires widget to have on change methods to set it's value
        // alert(document.getElementById("date_start").value);

        this.resetForm(this.requiredFields);
    }

    // for text and numeric questions
    inputChange(e, name) {

        this.setState({
            [name]: e.target.value
        });
        
        if(name === "date_start") {
            this.setState({ date_start: e.target.value});
        }

        
    }

    // for single select
    valueChange = (e, name) => {
        
        this.setState({
            [name]: e.target.value
        });

        if(e.target.id === "city") {
            this.isCityOther = e.target.value === "other" ? true : false;
            this.isCityOther ? this.requiredFields.push("city_other") : this.requiredFields = this.requiredFields.filter(e => e !== "city_other");    
        }
        
        if(e.target.id === "distribution_location") {
            this.isLocationOther = e.target.value === "other" ? true : false;
            this.isLocationOther ? this.requiredFields.push("distribution_location_other") : this.requiredFields = this.requiredFields.filter(e => e !== "distribution_location_other");
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

            if (getObject('other', e, 'value') != -1) {
                this.isMaterialTypeOther =  true ;
                this.isRemoveInfo = false;
            }
            if (getObject('other', e, 'value') == -1) {
                this.isMaterialTypeOther =  false ;
            }
            
            

            if(getObject('annual_report', e, 'value') != -1 || getObject('aahung_profile', e, 'value') != -1 ) {
                // Autoselect topic_covered = Aahung Information
                this.setState({
                    topic_covered: [{value: 'aahung_information', label: 'Aahung Information'}]
                })

                this.isAahungInformation = true;
            }
            else if(getObject('annual_report', e, 'value') == -1 && getObject('aahung_profile', e, 'value') == -1 ) {

                
                this.setState({
                    topic_covered: []
                })

                this.isAahungInformation = false;
            }
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

        if (name === "topic_covered") {
            
            if (getObject('aahung_information', e, 'value') != -1) {
                this.isAahungInformation = true;
                
            }
            if (getObject('aahung_information', e, 'value') == -1) {
                this.isAahungInformation = false;
            }

            if (getObject('aahung_branding_material', e, 'value') != -1) {
                this.isBrandingMaterial =  true ;
                this.isRemoveInfo = false;
            }
            if (getObject('aahung_branding_material', e, 'value') == -1) {
                
                this.isBrandingMaterial =  false ;
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
            
            if (getObject('rti', e, 'value') != -1) {
                this.isRti = true;
                
            }
            if (getObject('rti', e, 'value') == -1) {
                this.isRti = false;
            }

            if (getObject('ungei', e, 'value') != -1) {
                this.isUngei = true;
                
            }
            if (getObject('ungei', e, 'value') == -1) {
                this.isUngei = false;
            }

            if (getObject('sti', e, 'value') != -1) {
                this.isSti = true;
                
            }
            if (getObject('sti', e, 'value') == -1) {
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
                this.isOtherTopic = true;
                
                
            }
            if (getObject('other', e, 'value') == -1) {
                this.isOtherTopic = false;
                
            }
        }

        if(name === "event_attendant") {
            if (getObject('other', e, 'value') != -1) {
                this.isAttendantOther = true;
                
            }
            if (getObject('other', e, 'value') == -1) {
                this.isAttendantOther = false;
                
            }
        }

        this.isAnnualReport ? this.requiredFields.push("annual_report_count") : this.requiredFields = this.requiredFields.filter(e => e !== "annual_report_count");
        this.isAahungProfile ? this.requiredFields.push("aahung_profile_count") : this.requiredFields = this.requiredFields.filter(e => e !== "aahung_profile_count");
        this.isPamphlet ? this.requiredFields.push("phamplet_count") : this.requiredFields = this.requiredFields.filter(e => e !== "phamplet_count");
        this.isBooklet ? this.requiredFields.push("booklet_count") : this.requiredFields = this.requiredFields.filter(e => e !== "booklet_count");
        this.isReport ? this.requiredFields.push("report_count") : this.requiredFields = this.requiredFields.filter(e => e !== "report_count");
        this.isAahungMug ? this.requiredFields.push("aahung_mugs_count") : this.requiredFields = this.requiredFields.filter(e => e !== "aahung_mugs_count");
        this.isAahungFolder ? this.requiredFields.push("aahung_folders_count") : this.requiredFields = this.requiredFields.filter(e => e !== "aahung_folders_count");
        this.isAahungNotebook ? this.requiredFields.push("aahung_notebooks_count") : this.requiredFields = this.requiredFields.filter(e => e !== "aahung_notebooks_count");
        this.isMaterialTypeOther ? this.requiredFields.push("distribution_material_type_other") : this.requiredFields = this.requiredFields.filter(e => e !== "distribution_material_type_other");
        this.isMaterialTypeOther ? this.requiredFields.push("other_material_count") : this.requiredFields = this.requiredFields.filter(e => e !== "other_material_count");
        
        this.isAahungInformation ? this.requiredFields.push("aahung_info_count") : this.requiredFields = this.requiredFields.filter(e => e !== "aahung_info_count");
        this.isBrandingMaterial ? this.requiredFields.push("aahung_branding_material_count") : this.requiredFields = this.requiredFields.filter(e => e !== "aahung_branding_material_count");
        this.isNikahNama ? this.requiredFields.push("nikkah_nama_count") : this.requiredFields = this.requiredFields.filter(e => e !== "nikkah_nama_count");
        this.isPuberty ? this.requiredFields.push("puberty_count") : this.requiredFields = this.requiredFields.filter(e => e !== "puberty_count");
        this.isRti ? this.requiredFields.push("rti_count") : this.requiredFields = this.requiredFields.filter(e => e !== "rti_count");
        this.isUngei ? this.requiredFields.push("ungei_count") : this.requiredFields = this.requiredFields.filter(e => e !== "ungei_count");
        this.isSti ? this.requiredFields.push("sti_count") : this.requiredFields = this.requiredFields.filter(e => e !== "sti_count");
        this.isSexualHealth ? this.requiredFields.push("sexual_health_count") : this.requiredFields = this.requiredFields.filter(e => e !== "sexual_health_count");
        this.isPreMarital ? this.requiredFields.push("premarital_info_count") : this.requiredFields = this.requiredFields.filter(e => e !== "premarital_info_count");
        this.isPac ? this.requiredFields.push("pac_count") : this.requiredFields = this.requiredFields.filter(e => e !== "pac_count");
        this.isMaternalHealth ? this.requiredFields.push("maternal_health_count") : this.requiredFields = this.requiredFields.filter(e => e !== "maternal_health_count");
        
        this.isOtherTopic ? this.requiredFields.push("topic_covered_other") : this.requiredFields = this.requiredFields.filter(e => e !== "topic_covered_other");
        this.isOtherTopic ? this.requiredFields.push("other_topic_count") : this.requiredFields = this.requiredFields.filter(e => e !== "other_topic_count");
        this.isAttendantOther ? this.requiredFields.push("event_attendant_other") : this.requiredFields = this.requiredFields.filter(e => e !== "event_attendant_other");
        

    }

    callModal = () => {
        this.setState({ modal : !this.state.modal });
    }

    // for autocomplete single select
    handleChange(e, name) {

        this.setState({
            [name]: e
        });

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

            jsonData.data = {};
            
            jsonData.data.distribution_material_type = {};
            jsonData.data.distribution_material_type.values = [];
            jsonData.data.topic_covered = {};
            jsonData.data.topic_covered.values = [];
            jsonData.data.event_attendant = {};
            jsonData.data.event_attendant.values = [];
            
            
            // adding required properties in data property
            jsonData.data.date_start = this.state.date_start;
            jsonData.data.partner_components = await getDefinitionId("partner_components", this.state.partner_components);
            jsonData.data.city = data.get('city');
            
            if(this.isCityOther) 
                jsonData.data.city_other = data.get('city_other');

            jsonData.data.distribution_location = await getDefinitionId("distribution_location", this.state.distribution_location);

            if(this.isLocationOther) 
                jsonData.data.distribution_location_other = data.get('distribution_location_other');
            
            jsonData.data.distribution_location_name = data.get('distribution_location_name');
            
            // generating multiselect for distribution_material_type
            if((this.state.distribution_material_type != null && this.state.distribution_material_type != undefined)) {
                for(let i=0; i< this.state.distribution_material_type.length; i++) {
                    jsonData.data.distribution_material_type.values.push(String(this.state.distribution_material_type[i].value));
                }
            }
            
            if(this.isMaterialTypeOther) {
                jsonData.data.distribution_material_type_other = data.get('distribution_material_type_other');
                jsonData.data.other_material_count = data.get('other_material_count');
            }

            if(this.isAnnualReport) 
                jsonData.data.annual_report_count = data.get('annual_report_count');

            if(this.isAahungProfile) 
                jsonData.data.aahung_profile_count = data.get('aahung_profile_count');
            
            if(this.isPamphlet) 
                jsonData.data.phamplet_count = data.get('phamplet_count');

            if(this.isBooklet) 
                jsonData.data.booklet_count = data.get('booklet_count');

            if(this.isReport) 
                jsonData.data.report_count = data.get('report_count');

            if(this.isAahungMug) 
                jsonData.data.aahung_mugs_count = data.get('aahung_mugs_count');

            if(this.isAahungFolder) 
                jsonData.data.aahung_mugs_count = data.get('aahung_folders_count');
            
            if(this.isAahungNotebook) 
                jsonData.data.aahung_mugs_count = data.get('aahung_notebooks_count');

            
            // generating multiselect for topic covered
            if((this.state.topic_covered != null && this.state.topic_covered != undefined)) {
                for(let i=0; i< this.state.topic_covered.length; i++) {
                    jsonData.data.topic_covered.values.push(String(this.state.topic_covered[i].value));
                }
            }
            
            
            if(this.isOtherTopic) {
                jsonData.data.topic_covered_other = data.get('topic_covered_other');
                jsonData.data.other_topic_count = data.get('other_topic_count');
            }


            if(this.isAahungInformation) 
                jsonData.data.aahung_info_count = data.get('aahung_info_count');

            if(this.isBrandingMaterial) 
                jsonData.data.aahung_branding_material_count = data.get('aahung_branding_material_count');

            if(this.isNikahNama) 
                jsonData.data.nikkah_nama_count = data.get('nikkah_nama_count');

            if(this.isPuberty) 
                jsonData.data.puberty_count = data.get('puberty_count');

            if(this.isRti) 
                jsonData.data.rti_count = data.get('rti_count');

            if(this.isUngei) 
                jsonData.data.ungei_count = data.get('ungei_count');

            if(this.isSti) 
                jsonData.data.sti_count = data.get('sti_count');

            if(this.isSexualHealth) 
                jsonData.data.sexual_health_count = data.get('sexual_health_count');

            if(this.isPreMarital) 
                jsonData.data.premarital_info_count = data.get('premarital_info_count');
            
            if(this.isPac) 
                jsonData.data.pac_count = data.get('pac_count');

            if(this.isMaternalHealth) 
                jsonData.data.maternal_health_count = data.get('maternal_health_count');
            
            
            // generating multiselect for topic covered
            if((this.state.event_attendant != null && this.state.event_attendant != undefined)) {
                for(let i=0; i< this.state.event_attendant.length; i++) {
                    jsonData.data.event_attendant.values.push(String(this.state.event_attendant[i].value));
                }
            }

            if(this.isAttendantOther)
                jsonData.data.event_attendant_other = data.get('event_attendant_other');

            
            console.log(jsonData);
            // JSON.parse(JSON.stringify(dataObject));
            
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
                        
                        this.resetForm(this.requiredFields);
                        
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
        // check each required state
        
        let formIsValid = true;
        console.log(this.requiredFields);
        this.setState({ hasError: true });
        this.setState({ hasError: this.checkValid(this.requiredFields) ? false : true });
        formIsValid = this.checkValid(this.requiredFields);
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
            if(typeof this.state[stateName] === 'object' && this.state[stateName].length === 0) {
                isOk = false;
                this.errors[fields[j]] = "Please fill in this field!";
                
            }

            // for text and others
            if(typeof this.state[stateName] != 'object') {
                if(this.state[stateName] === "" || this.state[stateName] == undefined) {
                    isOk = false;
                    this.errors[fields[j]] = "Please fill in this field!";   
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
            if(typeof this.state[stateName] != 'object') {
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
        const otherParticipantStyle = this.isAttendantOther ? {} : { display: 'none' };

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
                            <Form id="socialMedia" onSubmit={this.handleSubmit}>
                                <Row>
                                    <Col md="6">
                                        <Card className="main-card mb-6">
                                            <CardHeader>
                                                <i className="header-icon lnr-license icon-gradient bg-plum-plate"> </i>
                                                <b>Distribution of Communication Material</b>
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
                                                                    {/* TODO: autopopulate current date */}
                                                                        <Label for="date_start" >Form Date</Label> <span class="errorMessage">{this.state.errors["date_start"]}</span>
                                                                        <Input type="date" name="date_start" id="date_start" value={this.state.date_start} onChange={(e) => {this.inputChange(e, "date_start")}} max={moment().format("YYYY-MM-DD")} />
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6">
                                                                    <FormGroup > 
                                                                            <Label for="partner_components" >Component</Label> <span class="errorMessage">{this.state.errors["partner_components"]}</span>
                                                                            <Input type="select" onChange={(e) => this.valueChange(e, "partner_components")} value={this.state.partner_components} name="partner_components" id="partner_components">
                                                                                <option value="lse">LSE </option>
                                                                                <option value="srhm">SRHM</option>
                                                                                <option value="comms">Comms</option>
                                                                                <option value="rme">RME</option>
                                                                                <option value="hr_finance">HR/ Finance</option>
                                                                            </Input>
                                                                        </FormGroup>
                                                                </Col>

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
                                                                        <Label for="city_other" >Specify Other</Label> <span class="errorMessage">{this.state.errors["v"]}</span>
                                                                        <Input name="city_other" id="city_other" value={this.state.city_other} onChange={(e) => {this.inputChange(e, "city_other")}} maxLength="200" placeholder="Enter other"/>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6">
                                                                    <FormGroup > 
                                                                            <Label for="distribution_location">Location</Label> <span class="errorMessage">{this.state.errors["distribution_location"]}</span>
                                                                            <Input type="select" onChange={(e) => this.valueChange(e, "distribution_location")} value={this.state.distribution_location} name="distribution_location" id="distribution_location">
                                                                                <option value="conference">Conference</option>
                                                                                <option value="school">School</option>
                                                                                <option value="festival_stall">Festival stall</option>
                                                                                <option value="stakeholder_meeting">Stakeholder Meeting</option>
                                                                                <option value="aahung_office">Aahung Office</option>
                                                                                <option value="other">Other</option>
                                                                            </Input>
                                                                        </FormGroup>
                                                                        
                                                                </Col>

                                                                <Col md="6" style={locationOtherStyle}>
                                                                
                                                                    <FormGroup >
                                                                        <Label for="distribution_location_other" >Specify Other</Label> <span class="errorMessage">{this.state.errors["distribution_location_other"]}</span>
                                                                        <Input name="distribution_location_other" id="distribution_location_other" value={this.state.distribution_location_other} onChange={(e) => {this.inputChange(e, "distribution_location_other")}} maxLength="200" placeholder="Enter other"/>
                                                                    </FormGroup>
                                                                </Col>
                                                          
                                                                <Col md="6" >
                                                                    <FormGroup >
                                                                        <Label for="distribution_location_name" >Name of Location</Label> <span class="errorMessage">{this.state.errors["distribution_location_name"]}</span>
                                                                        <Input name="distribution_location_name" id="distribution_location_name" value={this.state.distribution_location_name} onChange={(e) => {this.inputChange(e, "distribution_location_name")}} maxLength="200" placeholder="Enter other"/>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="distribution_material_type" >Type of Material</Label> <span class="errorMessage">{this.state.errors["distribution_material_type"]}</span>
                                                                        <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e, "distribution_material_type")} value={this.state.distribution_material_type} id="distribution_material_type" options={materialTypes} required/>
                                                                    </FormGroup>
                                                                </Col>


                                                                <Col md="6" style={materialTypeOtherStyle}>
                                                                
                                                                    <FormGroup >
                                                                        <Label for="distribution_material_type_other" >Specify Other</Label> <span class="errorMessage">{this.state.errors["distribution_material_type_other"]}</span>
                                                                        <Input name="distribution_material_type_other" id="distribution_material_type_other" value={this.state.distribution_material_type_other} onChange={(e) => {this.inputChange(e, "distribution_material_type_other")}} maxLength="200" placeholder="Enter other"/>
                                                                    </FormGroup>
                                                                </Col>
                                                            
                                                                <Col md="6" style={annualReportStyle}>
                                                                    
                                                                    <FormGroup >
                                                                        <Label for="annual_report_count" >Number of Annual Report</Label> <span class="errorMessage">{this.state.errors["annual_report_count"]}</span>
                                                                        <Input type="number" value={this.state.annual_report_count} name="annual_report_count" id="annual_report_count" onChange={(e) => { this.inputChange(e, "annual_report_count") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" style={aahungProfileStyle}>
                                                                    
                                                                    <FormGroup >
                                                                        <Label for="aahung_profile_count" >Number of Aahung Profile</Label> <span class="errorMessage">{this.state.errors["aahung_profile_count"]}</span>
                                                                        <Input type="number" value={this.state.aahung_profile_count} name="aahung_profile_count" id="aahung_profile_count" onChange={(e) => { this.inputChange(e, "aahung_profile_count") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" style={pamphletStyle}>
                                                                     
                                                                    <FormGroup >
                                                                        <Label for="phamplet_count" >Number of Pamphlet</Label> <span class="errorMessage">{this.state.errors["phamplet_count"]}</span>
                                                                        <Input type="number" value={this.state.phamplet_count} name="phamplet_count" id="phamplet_count" onChange={(e) => { this.inputChange(e, "phamplet_count") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" style={bookletStyle}>
                                                                     
                                                                    <FormGroup >
                                                                        <Label for="booklet_count" >Number of Booklet</Label> <span class="errorMessage">{this.state.errors["booklet_count"]}</span>
                                                                        <Input type="number" value={this.state.booklet_count} name="booklet_count" id="booklet_count" onChange={(e) => { this.inputChange(e, "booklet_count") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6" style={reportStyle}>
                                                                     
                                                                    <FormGroup >
                                                                        <Label for="report_count" >Number of Report</Label> <span class="errorMessage">{this.state.errors["report_count"]}</span>
                                                                        <Input type="number" value={this.state.report_count} name="report_count" id="report_count" onChange={(e) => { this.inputChange(e, "report_count") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" style={aahungMugStyle}>
                                                                     
                                                                     <FormGroup >
                                                                         <Label for="aahung_mugs_count" >Number of Aahung Mugs</Label> <span class="errorMessage">{this.state.errors["aahung_mugs_count"]}</span>
                                                                         <Input type="number" value={this.state.aahung_mugs_count} name="aahung_mugs_count" id="aahung_mugs_count" onChange={(e) => { this.inputChange(e, "aahung_mugs_count") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter number"></Input>
                                                                     </FormGroup>
                                                                 </Col>

                                                            </Row>

                                                            <Row>
                                                                <Col md="6" style={aahungFolderStyle}>
                                                                     
                                                                    <FormGroup >
                                                                        <Label for="aahung_folders_count" >Number of Aahung Folders</Label> <span class="errorMessage">{this.state.errors["aahung_folders_count"]}</span>
                                                                        <Input type="number" value={this.state.aahung_folders_count} name="aahung_folders_count" id="aahung_folders_count" onChange={(e) => { this.inputChange(e, "aahung_folders_count") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" style={aahungNotebookStyle}>
                                                                     
                                                                    <FormGroup >
                                                                        <Label for="aahung_notebooks_count" >Number of Aahung Notebooks</Label> <span class="errorMessage">{this.state.errors["aahung_notebooks_count"]}</span>
                                                                        <Input type="number" value={this.state.aahung_notebooks_count} name="aahung_notebooks_count" id="aahung_notebooks_count" onChange={(e) => { this.inputChange(e, "aahung_notebooks_count") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6" style={materialTypeOtherStyle}>
                                                                     
                                                                    <FormGroup >
                                                                        <Label for="other_material_count" >Number of Other</Label> <span class="errorMessage">{this.state.errors["other_material_count"]}</span>
                                                                        <Input type="number" value={this.state.other_material_count} name="other_material_count" id="other_material_count" onChange={(e) => { this.inputChange(e, "other_material_count") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>

                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="topic_covered" >Topic</Label> <span class="errorMessage">{this.state.errors["topic_covered"]}</span>
                                                                        <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e, "topic_covered")} value={this.state.topic_covered} id="topic_covered" options={this.distributionTopics} required/>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" style={otherTopicStyle}>
                                                                 
                                                                    <FormGroup >
                                                                        <Label for="topic_covered_other" >Specify Other</Label> <span class="errorMessage">{this.state.errors["topic_covered_other"]}</span>
                                                                        <Input name="topic_covered_other" id="topic_covered_other" value={this.state.topic_covered_other} onChange={(e) => {this.inputChange(e, "topic_covered_other")}} maxLength="200" placeholder="Enter other"/>
                                                                    </FormGroup>
                                                                </Col>
                                                           
                                                                <Col md="6" style={aahungInformationStyle}>
                                                                     
                                                                    <FormGroup >
                                                                        <Label for="aahung_info_count" >Number of Aahung Information </Label> <span class="errorMessage">{this.state.errors["aahung_info_count"]}</span>
                                                                        <Input type="number" value={this.state.aahung_info_count} name="aahung_info_count" id="aahung_info_count" onChange={(e) => { this.inputChange(e, "aahung_info_count") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>
          
                                                        

                                                                <Col md="6" style={brandingMaterialStyle}>
                                                                     
                                                                     <FormGroup >
                                                                         <Label for="aahung_branding_material_count" >Number of Aahung Branding Material</Label> <span class="errorMessage">{this.state.errors["aahung_branding_material_count"]}</span>
                                                                         <Input type="number" value={this.state.aahung_branding_material_count} name="aahung_branding_material_count" id="aahung_branding_material_count" onChange={(e) => { this.inputChange(e, "aahung_branding_material_count") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter number"></Input>
                                                                     </FormGroup>
                                                                 </Col>

                                                                <Col md="6" style={nikahNamaStyle}>
                                                                     
                                                                    <FormGroup >
                                                                        <Label for="nikkah_nama_count" >Number of Nikah Nama</Label> <span class="errorMessage">{this.state.errors["nikkah_nama_count"]}</span>
                                                                        <Input type="number" value={this.state.nikkah_nama_count} name="nikkah_nama_count" id="nikkah_nama_count" onChange={(e) => { this.inputChange(e, "nikkah_nama_count") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" style={pubertyStyle}>
                                                                     
                                                                    <FormGroup >
                                                                        <Label for="puberty_count" >Number of Puberty</Label> <span class="errorMessage">{this.state.errors["puberty_count"]}</span>
                                                                        <Input type="number" value={this.state.puberty_count} name="puberty_count" id="puberty_count" onChange={(e) => { this.inputChange(e, "puberty_count") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            
                                                                <Col md="6" style={rtiStyle}>
                                                                     
                                                                    <FormGroup >
                                                                        <Label for="rti_count" >Number of RTIs</Label> <span class="errorMessage">{this.state.errors["rti_count"]}</span>
                                                                        <Input type="number" value={this.state.rti_count} name="rti_count" id="rti_count" onChange={(e) => { this.inputChange(e, "rti_count") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" style={ungeiStyle}>
                                                                     
                                                                    <FormGroup >
                                                                        <Label for="ungei_count">Number of UNGEI</Label> <span class="errorMessage">{this.state.errors["ungei_count"]}</span>
                                                                        <Input type="number" value={this.state.ungei_count} name="ungei_count" id="ungei_count" onChange={(e) => { this.inputChange(e, "ungei_count") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            
                                                                <Col md="6" style={stiStyle}>
                                                                     
                                                                    <FormGroup >
                                                                        <Label for="sti_count" >Number of STIs</Label> <span class="errorMessage">{this.state.errors["sti_count"]}</span>
                                                                        <Input type="number" value={this.state.sti_count} name="sti_count" id="sti_count" onChange={(e) => { this.inputChange(e, "sti_count") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" style={sexualHealthStyle}>
                                                                     
                                                                    <FormGroup >
                                                                        <Label for="sexual_health_count" >Number of Sexual Health</Label> <span class="errorMessage">{this.state.errors["sexual_health_count"]}</span>
                                                                        <Input type="number" value={this.state.sexual_health_count} name="sexual_health_count" id="sexual_health_count" onChange={(e) => { this.inputChange(e, "sexual_health_count") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                                

                                                                <Col md="6" style={preMaritalStyle}>
                                                                     
                                                                    <FormGroup >
                                                                        <Label for="premarital_info_count">Number of Pre-marital Information</Label> <span class="errorMessage">{this.state.errors["premarital_info_count"]}</span>
                                                                        <Input type="number" value={this.state.premarital_info_count} name="premarital_info_count" id="premarital_info_count" onChange={(e) => { this.inputChange(e, "premarital_info_count") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" style={pacStyle}>
                                                                     
                                                                    <FormGroup >
                                                                        <Label for="pac_count" >Number of PAC</Label> <span class="errorMessage">{this.state.errors["pac_count"]}</span>
                                                                        <Input type="number" value={this.state.pac_count} name="pac_count" id="pac_count" onChange={(e) => { this.inputChange(e, "pac_count") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>
                          
                                                                

                                                                <Col md="6" style={maternalHealthStyle}>
                                                                     
                                                                    <FormGroup >
                                                                        <Label for="maternal_health_count">Number of Maternal Health</Label> <span class="errorMessage">{this.state.errors["maternal_health_count"]}</span>
                                                                        <Input type="number" value={this.state.maternal_health_count} name="maternal_health_count" id="maternal_health_count" onChange={(e) => { this.inputChange(e, "maternal_health_count") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" style={otherTopicStyle}>
                                                                     
                                                                    <FormGroup >
                                                                        <Label for="other_topic_count" >Number of Other</Label> <span class="errorMessage">{this.state.errors["other_topic_count"]}</span>
                                                                        <Input type="number" value={this.state.other_topic_count} name="other_topic_count" id="other_topic_count" onChange={(e) => { this.inputChange(e, "other_topic_count") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>
                                  
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="event_attendant" >Type of Participants</Label> <span class="errorMessage">{this.state.errors["event_attendant"]}</span>
                                                                        <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e, "event_attendant")} value={this.state.event_attendant} id="event_attendant" options={participantTypes} required/>
                                                                    </FormGroup>
                                                                </Col>
                                                            

                                                                <Col md="12" style={otherParticipantStyle}>
                                                                 
                                                                    <FormGroup >
                                                                        <Label for="event_attendant_other" >Specify Other</Label> <span class="errorMessage">{this.state.errors["event_attendant_other"]}</span>
                                                                        <Input name="event_attendant_other" id="event_attendant_other" value={this.state.event_attendant_other} onChange={(e) => {this.inputChange(e, "event_attendant_other")}} maxLength="200" placeholder="Enter other"/>
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
                                                        <Button className="mb-2 mr-2" color="success" size="sm" type="submit" >Submit</Button>
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

                                <MDBContainer>
                                    {/* <MDBBtn onClick={this.toggle}>Modal</MDBBtn> */}
                                    <MDBModal isOpen={this.state.modal} toggle={this.toggle}>
                                        <MDBModalHeader toggle={this.toggle}>{this.state.modalHeading}</MDBModalHeader>
                                        <MDBModalBody>
                                            {this.state.modalText}
                                        </MDBModalBody>
                                        <MDBModalFooter>
                                        <MDBBtn color="secondary" onClick={this.toggle}>Cancel</MDBBtn>
                                        <MDBBtn color="primary" style={this.state.okButtonStyle} onClick={this.confirm}>OK!</MDBBtn>
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

export default DistributionCommunicationMaterial;