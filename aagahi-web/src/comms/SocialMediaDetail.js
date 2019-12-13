/*
 * @Author: tahira.niazi@ihsinformatics.com 
 * @Date: 2019-08-26 20:37:46 
 * @Last Modified by: tahira.niazi@ihsinformatics.com
 * @Last Modified time: 2019-12-13 14:40:57
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

import { MDBBtn, MDBContainer, MDBModal, MDBModalBody, MDBModalFooter, MDBModalHeader, MDBIcon } from 'mdbreact';
import moment from 'moment';
import React, { Fragment } from "react";
import DatePicker from "react-datepicker";
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import { Button, Card, CardBody, CardHeader, Col, Container, Form, FormGroup, Input, Label, Row, TabContent, TabPane } from 'reactstrap';
import "../index.css";
import { getFormTypeByUuid, getFormDataById } from "../service/GetService";
import * as Constants from "../util/Constants";
import LoadingIndicator from "../widget/LoadingIndicator";
import Select from 'react-select';
import { getObject, loadFormState, resetFormState } from "../util/AahungUtil.js";
import { BrowserRouter as Router } from 'react-router-dom';
import { saveFormData, updateFormData } from "../service/PostService";
import FormNavBar from "../widget/FormNavBar";

const postComponentOptions = [
    { value: 'comms', label: 'Comms' },
    { value: 'lse', label: 'LSE' },
    { value: 'srhm', label: 'SRHM' },
    { value: 'rme', label: 'RME'}
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

class SocialMediaDetail extends React.Component {

    modal = false;

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);

        this.state = {
            post_date: new Date(),
            post_type : '',
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
        this.inputChange = this.inputChange.bind(this);

        this.isPostOther = false;
        this.isPostTopicOther = false;
        this.isPostPlatformOther = false;
        this.isTwitter = false;
        this.isTwitterPostBoosted = false;
        this.isInstagram = false;
        this.isInstagramPostBoosted = false;
        this.isFacebook = false;
        this.isFacebookPostBoosted = false;
        this.isWebPortal = false;
        this.isWebPortalPostBoosted = false;
        this.isOther = false;
        this.isOtherrPostBoosted = false;
        
        this.formTypeId = 0;
        this.requiredFields = ["date_start", "post_component", "post_date", "post_type", "topic_covered", "post_platform"];
        this.errors = {};
        this.editMode = false;
        this.fetchedForm = {};
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
            this.editMode = (this.props.location.state !== undefined && this.props.location.state.edit) ? true : false;
            this.setState({
                loading: true,
                loadingMsg: 'Fetching Data...'
            })
            // default value
            this.setState({
                post_component : [{ value: 'comms', label: 'Comms' }],
                post_type: 'picture'
            });
      
            let formTypeObj = await getFormTypeByUuid(Constants.SOCIAL_MEDIA_DETAILS_FORM_UUID);
            this.formTypeId = formTypeObj.formTypeId;
            if(this.editMode) {
                this.fetchedForm = await getFormDataById(String(this.props.location.state.formId));
                
                if(this.fetchedForm !== null) {
                    this.state = loadFormState(this.fetchedForm, this.state); // autopopulates the whole form
                    this.setState({
                        date_start: moment(this.fetchedForm.formDate).format('YYYY-MM-DD')
                    })
                    this.editUpdateDisplay();

                    // TODO: see if the platform fields can be edited

                }
                else {
                    throw new Error("Unable to get form data. Please see error logs for more details.");
                }
            }
            
            this.setState({ 
                loading: false
            })
        }
        catch(error) {
            var errorMsg = String(error);
            this.setState({ 
                loading: false,
                modalHeading : 'Fail!',
                okButtonStyle : { display: 'none' },
                modalText : errorMsg,
                modal: !this.state.modal
            });
        }
    }

    updateDisplay() {
        // default value
        this.setState({
            post_component : [{ value: 'comms', label: 'Comms' }],
            post_type: 'picture'
        });

        this.isPostOther = false;
        this.isPostTopicOther = false;
        this.isPostPlatformOther = false;
        this.isTwitter = false;
        this.isTwitterPostBoosted = false;
        this.isInstagram = false;
        this.isInstagramPostBoosted = false;
        this.isFacebook = false;
        this.isFacebookPostBoosted = false;
        this.isWebPortal = false;
        this.isWebPortalPostBoosted = false;
        this.isOther = false;
        this.isOtherrPostBoosted = false;

    }

    editUpdateDisplay() {
        this.isPostOther = this.state.post_type === "other" ? true : false;

        if (this.state.post_platform != undefined && this.state.post_platform.length > 0) {
            var postPlatformValues = this.state.post_platform;
            // checking twice because when another value is selected and other is unchecked, it still does not change the state
            if (getObject('facebook', postPlatformValues, 'value') != -1) {
                this.isFacebook =  true ;
            }
            if (getObject('facebook', postPlatformValues, 'value') == -1) {
                
                this.isFacebook =  false ;
            }

            if (getObject('twitter', postPlatformValues, 'value') != -1) {
                this.isTwitter = true ;
            }
            if (getObject('twitter', postPlatformValues, 'value') == -1) {
                this.isTwitter = false ;
            }

            if (getObject('instagram', postPlatformValues, 'value') != -1) {
                this.isInstagram = true ; 
            }
            if (getObject('instagram', postPlatformValues, 'value') == -1) {
                this.isInstagram = false;
            }
            
            if (getObject('web_portal', postPlatformValues, 'value') != -1) {
                this.isWebPortal = true;
            }
            if (getObject('web_portal', postPlatformValues, 'value') == -1) {
                this.isWebPortal = false;
            }

            if (getObject('other', postPlatformValues, 'value') != -1) {
                this.isOther = true;
                this.isPostPlatformOther = true;
            }
            if (getObject('other', postPlatformValues, 'value') == -1) {
                this.isOther = false;
                this.isPostPlatformOther = false;
            }
        }

        if (this.state.topic_covered !== undefined && this.state.topic_covered.length > 0 ) {
            var topicsValues = this.state.topic_covered;
            if (getObject('other', topicsValues, 'value') != -1) {
                this.isPostTopicOther = true;
                
            }
            if (getObject('other', topicsValues, 'value') == -1) {
                this.isPostTopicOther = false;
            }
        }
    }

    beforeunload(e) {
        e.preventDefault();
        e.returnValue = true;
    }
    
    cancelCheck = () => {
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

        if(name === "twitter_post_boosted") {
            this.isTwitterPostBoosted = e.target.id === "yes" ? true : false;
        }
        if(name === "instagram_post_boosted") {
            this.isInstagramPostBoosted = e.target.id === "yes" ? true : false;
        }
        if(name === "facebook_post_boosted") {
            this.isFacebookPostBoosted = e.target.id === "yes" ? true : false;
        }
        if(name === "web_portal_post_boosted") {
            this.isWebPortalPostBoosted = e.target.id === "yes" ? true : false;
        }
        if(name === "other_post_boosted") {
            this.isOtherPostBoosted = e.target.id === "yes" ? true : false;
        }
    }

    // for single select
    valueChange = (e, name) => {
        
        this.setState({
            [name]: e.target.value
        });

        if(e.target.id === "post_type") {
            this.isPostOther = e.target.value === "other" ? true : false;
        }
    }

    handleDate(date, name) {
        console.log(typeof date.toString())
        this.setState({
            [name]: date
        });
    };

    // for multi select
    valueChangeMulti(e, name) {
        console.log(e);

        this.setState({
            [name]: e
        });

        if (name === "post_platform") {
            // checking twice because when another value is selected and other is unchecked, it still does not change the state
            if (getObject('facebook', e, 'value') != -1) {
                this.isFacebook =  true ;
            }
            if (getObject('facebook', e, 'value') == -1) {
                
                this.isFacebook =  false ;
            }

            if (getObject('twitter', e, 'value') != -1) {
                this.isTwitter = true ;
            }
            if (getObject('twitter', e, 'value') == -1) {
                this.isTwitter = false ;
            }

            if (getObject('instagram', e, 'value') != -1) {
                this.isInstagram = true ; 
            }
            if (getObject('instagram', e, 'value') == -1) {
                this.isInstagram = false;
            }
            
            if (getObject('web_portal', e, 'value') != -1) {
                this.isWebPortal = true;
            }
            if (getObject('web_portal', e, 'value') == -1) {
                this.isWebPortal = false;
            }

            if (getObject('other', e, 'value') != -1) {
                this.isOther = true;
                this.isPostPlatformOther = true;
            }
            if (getObject('other', e, 'value') == -1) {
                this.isOther = false;
                this.isPostPlatformOther = false;
            }
        }

        if (name === "topic_covered") {
            if (getObject('other', e, 'value') != -1) {
                this.isPostTopicOther = true;
                
            }
            if (getObject('other', e, 'value') == -1) {
                this.isPostTopicOther = false;
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

    };
    
    handleSubmit = async event => {
        event.preventDefault();
        if(this.handleValidation()) {
            
            console.log("in submission");
            this.setState({ 
                // form_disabled: true,
                loading : true,
                loadingMsg: "Saving trees..."
            })
            
            const data = new FormData(event.target);
            var jsonData = new Object();
            jsonData.formDate =  this.state.date_start;
            jsonData.formType = {};
            jsonData.formType.formTypeId = this.formTypeId;
            jsonData.referenceId = "";

            jsonData.data = {};
            
            jsonData.data.post_component = {};
            jsonData.data.post_component.values = [];
            jsonData.data.topic_covered = {};
            jsonData.data.topic_covered.values = [];
            jsonData.data.post_platform = {};
            jsonData.data.post_platform.values = [];
            jsonData.data.platform_scores = [];
            // jsonData.data.platform_scores.values = [];
            
            // adding required properties in data property
            jsonData.data.date_start = this.state.date_start;
            jsonData.data.post_date = moment(this.state.post_date).format('YYYY-MM-DD HH:mm:ss');
            jsonData.data.post_type = this.state.post_type;
            if(this.isPostOther) 
                jsonData.data.post_type_other = data.get('post_type_other');

            if(this.isPostTopicOther) 
                jsonData.data.topic_covered_other = data.get('topic_covered_other');
            
            if(this.isPostPlatformOther)
                jsonData.data.post_platform_other = data.get('post_platform_other');
            
            // generating multiselect for post_component
            if((this.state.post_component != null && this.state.post_component != undefined)) {
                for(let i=0; i< this.state.post_component.length; i++) {
                    jsonData.data.post_component.values.push(String(this.state.post_component[i].value));
                }
            }
            
            // generating multiselect for topic covered
            if((this.state.topic_covered != null && this.state.topic_covered != undefined)) {
                for(let i=0; i< this.state.topic_covered.length; i++) {
                    jsonData.data.topic_covered.values.push(String(this.state.topic_covered[i].value));
                }
            }

            // generating multiselect for topic covered
            if((this.state.post_platform != null && this.state.post_platform != undefined)) {
                for(let i=0; i< this.state.post_platform.length; i++) {
                    jsonData.data.post_platform.values.push(String(this.state.post_platform[i].value));
                }
            }

            // add all platform if applicable
            if(this.isTwitter) {
                var platform_details = {};
                platform_details.post_platform = "Twitter";
                platform_details.post_boosted = data.get('twitter_post_boosted');
                
                if(this.isTwitterPostBoosted) {
                    platform_details.post_boosted_count = parseInt(data.get('twitter_post_boosted_count'));
                }
                platform_details.post_likes_count = parseInt(data.get('twitter_post_likes_count'));
                platform_details.post_comments_count = parseInt(data.get('twitter_post_comments_count'));
                platform_details.post_shares_count = parseInt(data.get('twitter_post_shares_count'));
                platform_details.post_url = data.get('twitter_post_url');

                jsonData.data.platform_scores.push(platform_details);
            }

            if(this.isFacebook) {
                var platform_details = {};
                platform_details.post_platform = "Facebook";
                platform_details.post_boosted = data.get('facebook_post_boosted');
                
                if(this.isFacebookPostBoosted) {
                    platform_details.post_boosted_count = parseInt(data.get('facebook_post_boosted_count'));
                }
                
                platform_details.post_likes_count = parseInt(data.get('facebook_post_likes_count'));
                platform_details.post_comments_count = parseInt(data.get('facebook_post_comments_count'));
                platform_details.post_shares_count = parseInt(data.get('facebook_post_shares_count'));
                platform_details.post_url = data.get('facebook_post_url');

                jsonData.data.platform_scores.push(platform_details);
            }

            if(this.isInstagram) {
                var platform_details = {};
                platform_details.post_platform = "Instagram";
                platform_details.post_boosted = data.get('instagram_post_boosted');
                
                if(this.isWebPortalPostBoosted) {
                    platform_details.post_boosted_count = parseInt(data.get('instagram_post_boosted_count'));
                }
                
                platform_details.post_likes_count = parseInt(data.get('instagram_post_likes_count'));
                platform_details.post_comments_count = parseInt(data.get('instagram_post_comments_count'));
                platform_details.post_shares_count = parseInt(data.get('instagram_post_shares_count'));
                platform_details.post_url = data.get('instagram_post_url');

                jsonData.data.platform_scores.push(platform_details);
            }

            if(this.isWebPortal) {
                var platform_details = {};
                platform_details.post_platform = "Web Portal";
                platform_details.post_boosted = data.get('web_portal_post_boosted');
                
                if(this.isWebPortalPostBoosted) {
                    platform_details.post_boosted = parseInt(data.get('web_portal_post_boosted_count'));
                }
                
                platform_details.post_likes_count = parseInt(data.get('web_portal_post_likes_count'));
                platform_details.post_comments_count = parseInt(data.get('web_portal_post_comments_count'));
                platform_details.post_shares_count = parseInt(data.get('web_portal_post_shares_count'));
                platform_details.post_url = data.get('web_portal_post_url');

                jsonData.data.platform_scores.push(platform_details);
            }

            if(this.isOther) {
                var platform_details = {};
                platform_details.post_platform = data.get('post_platform_other');
                platform_details.post_boosted = data.get('other_post_boosted');
                
                if(this.isWebPortalPostBoosted) {
                    platform_details.post_boosted_count = parseInt(data.get('other_post_boosted_count'));
                }
                
                platform_details.post_likes_count = parseInt(data.get('other_post_likes_count'));
                platform_details.post_comments_count = parseInt(data.get('other_post_comments_count'));
                platform_details.post_shares_count = parseInt(data.get('other_post_shares_count'));
                platform_details.post_url = data.get('other_post_url');

                jsonData.data.platform_scores.push(platform_details);
            }
            
            console.log(jsonData);
            // JSON.parse(JSON.stringify(dataObject));
            
            if(this.editMode) {
                jsonData.uuid = this.fetchedForm.uuid;
                jsonData.referenceId =  this.fetchedForm.referenceId;

                // updateFormData(jsonData)
                // .then(
                //     responseData => {
                //         if(!(String(responseData).includes("Error"))) {
                            
                //             this.setState({ 
                //                 loading: false,
                //                 modalHeading : 'Success!',
                //                 okButtonStyle : { display: 'none' },
                //                 modalText : 'Data updated successfully.',
                //                 modal: !this.state.modal
                //             });
                            
                //             this.resetForm(this.requiredFields);
                //         }
                //         else if(String(responseData).includes("Error")) {
                            
                            var submitMsg = '';
                            submitMsg = "This form can not be edited at the moment. Please see error logs for details.";
                            
                            this.setState({ 
                                loading: false,
                                modalHeading : 'Fail!',
                                okButtonStyle : { display: 'none' },
                                modalText : submitMsg,
                                modal: !this.state.modal
                            });
                //         }
                //     }
                // );
            }
            else {
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
    }

    handleValidation(){
        // check each required state
        
        let formIsValid = true;
        console.log(this.requiredFields);
        this.setState({ hasError: this.checkValid(this.requiredFields) ? false : true });
        formIsValid = this.checkValid(this.requiredFields);
        this.setState({errors: this.errors});
        return formIsValid;
    }

    /**
     * verifies and notifies for the empty form fields
     */
    checkValid = (fields) => {

        this.isTwitter ? fields.push("twitter_post_boosted") : fields = fields.filter(e => e !== "twitter_post_boosted");
        this.isTwitter ? fields.push("twitter_post_likes_count") : fields = fields.filter(e => e !== "twitter_post_likes_count");
        this.isTwitter ? fields.push("twitter_post_comments_count") : fields = fields.filter(e => e !== "twitter_post_comments_count");
        this.isTwitter ? fields.push("twitter_post_shares_count") : fields = fields.filter(e => e !== "twitter_post_shares_count");
        this.isTwitter ? fields.push("twitter_post_url") : fields = fields.filter(e => e !== "twitter_post_url");

        this.isFacebook ? fields.push("facebook_post_boosted") : fields = fields.filter(e => e !== "facebook_post_boosted");
        this.isFacebook ? fields.push("facebook_post_likes_count") : fields = fields.filter(e => e !== "facebook_post_likes_count");
        this.isFacebook ? fields.push("facebook_post_comments_count") : fields = fields.filter(e => e !== "facebook_post_comments_count");
        this.isFacebook ? fields.push("facebook_post_shares_count") : fields = fields.filter(e => e !== "facebook_post_shares_count");
        this.isFacebook ? fields.push("facebook_post_url") : fields = fields.filter(e => e !== "facebook_post_url");

        this.isInstagram ? fields.push("instagram_post_boosted") : fields = fields.filter(e => e !== "instagram_post_boosted");
        this.isInstagram ? fields.push("instagram_post_likes_count") : fields = fields.filter(e => e !== "instagram_post_likes_count");
        this.isInstagram ? fields.push("instagram_post_comments_count") : fields = fields.filter(e => e !== "instagram_post_comments_count");
        this.isInstagram ? fields.push("instagram_post_shares_count") : fields = fields.filter(e => e !== "instagram_post_shares_count");
        this.isInstagram ? fields.push("instagram_post_url") : fields = fields.filter(e => e !== "instagram_post_url");

        this.isWebPortal ? fields.push("web_portal_post_boosted") : fields = fields.filter(e => e !== "web_portal_post_boosted");
        this.isWebPortal ? fields.push("web_portal_post_likes_count") : fields = fields.filter(e => e !== "web_portal_post_likes_count");
        this.isWebPortal ? fields.push("web_portal_post_comments_count") : fields = fields.filter(e => e !== "web_portal_post_comments_count");
        this.isWebPortal ? fields.push("web_portal_post_shares_count") : fields = fields.filter(e => e !== "web_portal_post_shares_count");
        this.isWebPortal ? fields.push("web_portal_post_url") : fields = fields.filter(e => e !== "web_portal_post_url");

        
        this.isPostPlatformOther ? fields.push("post_platform_other") : fields = fields.filter(e => e !== "post_platform_other");
        this.isPostPlatformOther ? fields.push("other_post_boosted") : fields = fields.filter(e => e !== "other_post_boosted");
        this.isPostPlatformOther ? fields.push("other_post_likes_count") : fields = fields.filter(e => e !== "other_post_likes_count");
        this.isPostPlatformOther ? fields.push("other_post_comments_count") : fields = fields.filter(e => e !== "other_post_comments_count");
        this.isPostPlatformOther ? fields.push("other_post_shares_count") : fields = fields.filter(e => e !== "other_post_shares_count");
        this.isPostPlatformOther ? fields.push("other_post_url") : fields = fields.filter(e => e !== "other_post_url");

        this.isTwitterPostBoosted ? fields.push("twitter_post_boosted_count") : fields = fields.filter(e => e !== "twitter_post_boosted_count");
        this.isInstagramPostBoosted ? fields.push("instagram_post_boosted_count") : fields = fields.filter(e => e !== "instagram_post_boosted_count");
        this.isFacebookPostBoosted ? fields.push("facebook_post_boosted_count") : fields = fields.filter(e => e !== "facebook_post_boosted_count");
        this.isWebPortalPostBoosted ? fields.push("web_portal_post_boosted_count") : fields = fields.filter(e => e !== "web_portal_post_boosted_count");
        this.isOtherPostBoosted ? fields.push("other_post_boosted_count") : fields = fields.filter(e => e !== "other_post_boosted_count");

        this.isPostTopicOther ? fields.push("topic_covered_other") : fields = fields.filter(e => e !== "topic_covered_other");
        this.isPostOther ? fields.push("post_type_other") : fields = fields.filter(e => e !== "post_type_other");

        let isOk = true;
        this.errors = {};
        const errorText = "Required";
        for(let j=0; j < fields.length; j++) {
            let stateName = fields[j];
            
            // for array object
            if(typeof this.state[stateName] === 'object' && this.state[stateName].length === 0) {
                isOk = false;
                this.errors[fields[j]] = errorText;
                
            }

            // for text and others
            if(typeof this.state[stateName] != 'object') {
                if(this.state[stateName] === "" || this.state[stateName] == undefined) {
                    isOk = false;
                    this.errors[fields[j]] = errorText;   
                } 
            }
        }

        return isOk;
    }

    /**
     * verifies and notifies for the empty form fields
     */
    resetForm = (fields) => {

        this.state = resetFormState(fields, this.state);
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
        
        const postOtherStyle = this.isPostOther ? {} : { display: 'none' };
        const postTopicOtherStyle = this.isPostTopicOther ? {} : { display: 'none' };
        const postPlatformOtherStyle = this.isPostPlatformOther ? {} : { display: 'none' };
        const twitterStyle = this.isTwitter ? {} : { display: 'none' };
        const instagramStyle = this.isInstagram ? {} : { display: 'none' };
        const facebookStyle = this.isFacebook ? {} : { display: 'none' };
        const webPortalStyle = this.isWebPortal ? {} : { display: 'none' };
        const otherStyle = this.isOther ? {} : { display: 'none' };
        const twitterPostBoostedStyle = this.isTwitterPostBoosted ? {} : { display: 'none' };
        const instagramPostBoostedStyle = this.isInstagramPostBoosted ? {} : { display: 'none' };
        const facebookPostBoostedStyle = this.isFacebookPostBoosted ? {} : { display: 'none' };
        const webPortalPostBoosted = this.isWebPortalPostBoosted ? {} : { display: 'none' };
        const otherPostBoosted = this.isOtherPostBoosted ? {} : { display: 'none' };

        const yes = "Yes";
        const no = "No";

        var formNavVisible = false;
        if(this.props.location.state !== undefined) {
            formNavVisible = this.props.location.state.edit ? true : false ;
        }
        else {
            formNavVisible = false;
        }

        return (
            
            <div id="formDiv">
                <Router>
                    <header>
                    <FormNavBar isVisible={formNavVisible} {...this.props} componentName="LSE" />
                    </header>        
                </Router>
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
                                                <b>Social Media Details</b>
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
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="post_component" >Post Relevant for</Label> <span class="errorMessage">{this.state.errors["post_component"]}</span>
                                                                        <Select onChange={(e) => this.valueChangeMulti(e, "post_component")} value={this.state.post_component} id="partner_components" options={postComponentOptions} required isMulti/>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="post_date" >Date/Time of Post</Label> <span class="errorMessage">{this.state.errors["post_date"]}</span> <br/>
                                                                        {/* <Input type="date" name="post_date" id="post_date" value={this.state.post_date} onChange={(e) => {this.inputChange(e, "post_date")}} max={moment().format("YYYY-MM-DD")} /> */}
                                                                        <DatePicker
                                                                            selected={this.state.post_date}
                                                                            onChange={(date) => this.handleDate(date, "post_date")}
                                                                            selectsStart
                                                                            startDate={this.state.post_date}
                                                                            showTimeSelect
                                                                            timeIntervals={5}
                                                                            timeCaption="Time"
                                                                            dateFormat="MMMM d, yyyy h:mm aa"
                                                                            className="timeWidget postDateTime"
                                                                            placeholderText="Post Date/Time"
                                                                            maxDate={new Date()}
                                                                        />
                                                                    </FormGroup>
                                                                </Col>
                                                            
                                                                <Col md="6">
                                                                    <FormGroup > 
                                                                            <Label for="post_type" >Type of Post</Label> <span class="errorMessage">{this.state.errors["post_type"]}</span>
                                                                            <Input type="select" onChange={(e) => this.valueChange(e, "post_type")} value={this.state.post_type} name="post_type" id="post_type">
                                                                                <option value="picture">Picture </option>
                                                                                <option value="video">Video</option>
                                                                                <option value="infographic">Infographic</option>
                                                                                <option value="other">Other</option>
                                                                            </Input>
                                                                        </FormGroup>
                                                                        
                                                                </Col>
                                                                
                                                                <Col md="12" style={postOtherStyle}>
                                                                    <FormGroup >
                                                                        <Label for="post_type_other" >Specify Other</Label> <span class="errorMessage">{this.state.errors["post_type_other"]}</span>
                                                                        <Input name="post_type_other" id="post_type_other" value={this.state.post_type_other} onChange={(e) => {this.inputChange(e, "post_type_other")}} maxLength="200" placeholder="Enter other"/>
                                                                    </FormGroup>
                                                                </Col>

                                                                
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="topic_covered" >Topic(s) Covered by the Post</Label> <span class="errorMessage">{this.state.errors["topic_covered"]}</span>
                                                                        <Select onChange={(e) => this.valueChangeMulti(e, "topic_covered")} value={this.state.topic_covered} id="topic_covered" options={postTopicOptions} isMulti/>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6" style={postTopicOtherStyle}>
                                                                    <FormGroup >
                                                                        <Label for="topic_covered_other" >Specify Other</Label> <span class="errorMessage">{this.state.errors["topic_covered_other"]}</span>
                                                                        <Input name="topic_covered_other" id="topic_covered_other" value={this.state.topic_covered_other} onChange={(e) => {this.inputChange(e, "topic_covered_other")}} maxLength="200" placeholder="Enter other"/>
                                                                    </FormGroup>
                                                                </Col>
                                                            
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="post_platform" >Platform used</Label> <span class="errorMessage">{this.state.errors["post_platform"]}</span>
                                                                        <Select onChange={(e) => this.valueChangeMulti(e, "post_platform")} value={this.state.post_platform} id="post_platform" options={postPlatformOptions} isMulti/>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6" style={postPlatformOtherStyle}>
                                                                    <FormGroup >
                                                                        <Label for="post_platform_other" >Specify Other</Label> <span class="errorMessage">{this.state.errors["post_platform_other"]}</span>
                                                                        <Input name="post_platform_other" id="post_platform_other" value={this.state.post_platform_other} onChange={(e) => {this.inputChange(e, "post_platform_other")}} maxLength="200" placeholder="Enter other"/>
                                                                    </FormGroup>
                                                                </Col>

                                                            </Row>

                                                            {/* Twitter */}
                                                            <div id="twitter" style={twitterStyle}>
                                                            <Row>
                                                            <Col md="6">
                                                                <Label><h7><u><b>Twitter</b></u></h7></Label>
                                                            </Col>

                                                            </Row>
                                                            <Row>
                                                                <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="twitter_post_boosted" >Was this a boosted post?</Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                    <Label check>
                                                                                        <Input type="radio" name="twitter_post_boosted" id="yes" value="yes" onChange={(e) => {this.inputChange(e, "twitter_post_boosted")}} />{' '}
                                                                                        {yes}
                                                                                    </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                    <Label check>
                                                                                        <Input type="radio" name="twitter_post_boosted" id="no" value="no" onChange={(e) => {this.inputChange(e, "twitter_post_boosted")}} />{' '}
                                                                                        {no}
                                                                                    </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["twitter_post_boosted"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                </Col>

                                                                <Col md="6" style={twitterPostBoostedStyle}>
                                                                    <FormGroup >
                                                                        <Label for="twitter_post_boosted_count" >Number of boosted reach</Label> <span class="errorMessage">{this.state.errors["twitter_post_boosted_count"]}</span>
                                                                        <Input type="number" value={this.state.twitter_post_boosted_count} name="twitter_post_boosted_count" id="twitter_post_boosted_count" onChange={(e) => { this.inputChange(e, "twitter_post_boosted_count") }} max="9999999" min="0" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 7) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="twitter_post_likes_count" >Number of Likes</Label> <span class="errorMessage">{this.state.errors["twitter_post_likes_count"]}</span>
                                                                            <Input type="number" value={this.state.twitter_post_likes_count} name="twitter_post_likes_count" id="twitter_post_likes_count" onChange={(e) => { this.inputChange(e, "twitter_post_likes_count") }} max="9999999" min="0" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 7) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="twitter_post_comments_count" >Number of Comments</Label> <span class="errorMessage">{this.state.errors["twitter_post_comments_count"]}</span>
                                                                        <Input type="number" value={this.state.twitter_post_comments_count} name="twitter_post_comments_count" id="twitter_post_comments_count" onChange={(e) => { this.inputChange(e, "twitter_post_comments_count") }} max="9999999" min="0" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 7) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="twitter_post_shares_count" >Number of Shares</Label> <span class="errorMessage">{this.state.errors["twitter_post_shares_count"]}</span>
                                                                            <Input type="number" value={this.state.twitter_post_shares_count} name="twitter_post_shares_count" id="twitter_post_shares_count" onChange={(e) => { this.inputChange(e, "twitter_post_shares_count") }} max="9999999" min="0" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 7) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="twitter_post_url" >Post URL</Label> <span class="errorMessage">{this.state.errors["twitter_post_url"]}</span>
                                                                        <Input value={this.state.twitter_post_url} name="twitter_post_url" id="twitter_post_url" onChange={(e) => { this.inputChange(e, "twitter_post_url") }} placeholder="Enter url"></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                        </div>

                                                            {/* Facebook */}
                                                            <div id="facebook" style={facebookStyle}>
                                                            <Row>
                                                            <Col md="6">
                                                                <Label><h7><u><b>Facebook</b></u></h7></Label>
                                                            </Col>

                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="facebook_post_boosted" >Was this a boosted post?</Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                    <Label check>
                                                                                        <Input type="radio" name="facebook_post_boosted" id="yes" value="yes" onChange={(e) => {this.inputChange(e, "facebook_post_boosted")}} />{' '}
                                                                                        {yes}
                                                                                    </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                    <Label check>
                                                                                        <Input type="radio" name="facebook_post_boosted" id="no" value="no" onChange={(e) => {this.inputChange(e, "facebook_post_boosted")}} />{' '}
                                                                                        {no}
                                                                                    </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["facebook_post_boosted"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                </Col>

                                                                <Col md="6" style={facebookPostBoostedStyle}>
                                                                    
                                                                    <FormGroup >
                                                                        <Label for="facebook_post_boosted_count" >Number of boosted reach</Label> <span class="errorMessage">{this.state.errors["facebook_post_boosted_count"]}</span>
                                                                        <Input type="number" value={this.state.facebook_post_boosted_count} name="facebook_post_boosted_count" id="facebook_post_boosted_count" onChange={(e) => { this.inputChange(e, "facebook_post_boosted_count") }} max="9999999" min="0" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 7) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    
                                                                    <FormGroup >
                                                                        <Label for="facebook_post_likes_count" >Number of Likes</Label> <span class="errorMessage">{this.state.errors["facebook_post_likes_count"]}</span>
                                                                        <Input type="number" value={this.state.facebook_post_likes_count} name="facebook_post_likes_count" id="facebook_post_likes_count" onChange={(e) => { this.inputChange(e, "facebook_post_likes_count") }} max="9999999" min="0" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 7) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6">
                                                                    
                                                                    <FormGroup >
                                                                        <Label for="facebook_post_comments_count" >Number of Comments</Label> <span class="errorMessage">{this.state.errors["facebook_post_comments_count"]}</span>
                                                                        <Input type="number" value={this.state.facebook_post_comments_count} name="facebook_post_comments_count" id="facebook_post_comments_count" onChange={(e) => { this.inputChange(e, "facebook_post_comments_count") }} max="9999999" min="0" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 7) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    
                                                                    <FormGroup >
                                                                        <Label for="facebook_post_shares_count" >Number of Shares</Label> <span class="errorMessage">{this.state.errors["facebook_post_shares_count"]}</span>
                                                                            <Input type="number" value={this.state.facebook_post_shares_count} name="facebook_post_shares_count" id="facebook_post_shares_count" onChange={(e) => { this.inputChange(e, "facebook_post_shares_count") }} max="9999999" min="0" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 7) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6">
                                                                    
                                                                    <FormGroup >
                                                                        <Label for="facebook_post_url" >Post URL</Label> <span class="errorMessage">{this.state.errors["facebook_post_url"]}</span>
                                                                        <Input value={this.state.facebook_post_url} name="facebook_post_url" id="facebook_post_url" onChange={(e) => { this.inputChange(e, "facebook_post_url") }} placeholder="Enter url"></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            </div>


                                                            {/* Instagram */}
                                                            <div id="instagram" style={instagramStyle}>
                                                            <Row>
                                                            <Col md="6">
                                                                <Label><h7><u><b>Instagram</b></u></h7></Label>
                                                            </Col>

                                                            </Row>
                                                            <Row>
                                                                <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="instagram_post_boosted" >Was this a boosted post?</Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                    <Label check>
                                                                                        <Input type="radio" name="instagram_post_boosted" id="yes" value="yes" onChange={(e) => {this.inputChange(e, "instagram_post_boosted")}} />{' '}
                                                                                        {yes}
                                                                                    </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                    <Label check>
                                                                                        <Input type="radio" name="instagram_post_boosted" id="no" value="no" onChange={(e) => {this.inputChange(e, "instagram_post_boosted")}} />{' '}
                                                                                        {no}
                                                                                    </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["instagram_post_boosted"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                </Col>

                                                                <Col md="6" style={instagramPostBoostedStyle}>
                                                                    
                                                                    <FormGroup >
                                                                        <Label for="instagram_post_boosted_count" >Number of boosted reach</Label> <span class="errorMessage">{this.state.errors["instagram_post_boosted_count"]}</span>
                                                                        <Input type="number" value={this.state.instagram_post_boosted_count} name="instagram_post_boosted_count" id="instagram_post_boosted_count" onChange={(e) => { this.inputChange(e, "instagram_post_boosted_count") }} max="9999999" min="0" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 7) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="instagram_post_likes_count" >Number of Likes</Label> <span class="errorMessage">{this.state.errors["instagram_post_likes_count"]}</span>
                                                                        <Input type="number" value={this.state.instagram_post_likes_count} name="instagram_post_likes_count" id="instagram_post_likes_count" onChange={(e) => { this.inputChange(e, "instagram_post_likes_count") }} max="9999999" min="0" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 7) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="instagram_post_comments_count" >Number of Comments</Label> <span class="errorMessage">{this.state.errors["instagram_post_comments_count"]}</span>
                                                                        <Input type="number" value={this.state.instagram_post_comments_count} name="instagram_post_comments_count" id="instagram_post_comments_count" onChange={(e) => { this.inputChange(e, "instagram_post_comments_count") }} max="9999999" min="0" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 7) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    
                                                                    <FormGroup >
                                                                        <Label for="instagram_post_shares_count" >Number of Shares</Label> <span class="errorMessage">{this.state.errors["instagram_post_shares_count"]}</span>
                                                                        <Input type="number" value={this.state.instagram_post_shares_count} name="instagram_post_shares_count" id="instagram_post_shares_count" onChange={(e) => { this.inputChange(e, "instagram_post_shares_count") }} max="9999999" min="0" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 7) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6">
                                                                    
                                                                    <FormGroup >
                                                                        <Label for="instagram_post_url" >Post URL</Label> <span class="errorMessage">{this.state.errors["instagram_post_url"]}</span>
                                                                        <Input value={this.state.instagram_post_url} name="instagram_post_url" id="instagram_post_url" onChange={(e) => { this.inputChange(e, "instagram_post_url") }} placeholder="Enter url"></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            </div>
                                                            
                                                            {/* Web Portal */}
                                                            <div id="web_portal" style={webPortalStyle}>
                                                            <Row>
                                                            <Col md="6">
                                                                <Label><h7><u><b>Web Portal</b></u></h7></Label>
                                                            </Col>

                                                            </Row>
                                                            <Row>
                                                                <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="web_portal_post_boosted" >Was this a boosted post?</Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                    <Label check>
                                                                                        <Input type="radio" name="web_portal_post_boosted" id="yes" value="yes" onChange={(e) => {this.inputChange(e, "web_portal_post_boosted")}} />{' '}
                                                                                        {yes}
                                                                                    </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                    <Label check>
                                                                                        <Input type="radio" name="web_portal_post_boosted" id="no" value="no" onChange={(e) => {this.inputChange(e, "web_portal_post_boosted")}} />{' '}
                                                                                        {no}
                                                                                    </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["web_portal_post_boosted"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                </Col>

                                                                <Col md="6" style={webPortalPostBoosted}>
                                                                    
                                                                    <FormGroup >
                                                                        <Label for="web_portal_post_boosted_count" >Number of boosted reach</Label> <span class="errorMessage">{this.state.errors["web_portal_post_boosted_count"]}</span>
                                                                        <Input type="number" value={this.state.web_portal_post_boosted_count} name="web_portal_post_boosted_count" id="web_portal_post_boosted_count" onChange={(e) => { this.inputChange(e, "web_portal_post_boosted_count") }} max="9999999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 7) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    
                                                                    <FormGroup >
                                                                        <Label for="web_portal_post_likes_count" >Number of Likes</Label> <span class="errorMessage">{this.state.errors["web_portal_post_likes_count"]}</span>
                                                                        <Input type="number" value={this.state.web_portal_post_likes_count} name="web_portal_post_likes_count" id="web_portal_post_likes_count" onChange={(e) => { this.inputChange(e, "web_portal_post_likes_count") }} max="9999999" min="0" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 7) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6">
                                                                    
                                                                    <FormGroup >
                                                                        <Label for="web_portal_post_comments_count" >Number of Comments</Label> <span class="errorMessage">{this.state.errors["web_portal_post_comments_count"]}</span>
                                                                        <Input type="number" value={this.state.web_portal_post_comments_count} name="web_portal_post_comments_count" id="web_portal_post_comments_count" onChange={(e) => { this.inputChange(e, "web_portal_post_comments_count") }} max="9999999" min="0" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 7) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="web_portal_post_shares_count" >Number of Shares</Label> <span class="errorMessage">{this.state.errors["web_portal_post_shares_count"]}</span>
                                                                        <Input type="number" value={this.state.web_portal_post_shares_count} name="web_portal_post_shares_count" id="web_portal_post_shares_count" onChange={(e) => { this.inputChange(e, "web_portal_post_shares_count") }} max="9999999" min="0" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 7) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="web_portal_post_url" >Post URL</Label> <span class="errorMessage">{this.state.errors["web_portal_post_url"]}</span>
                                                                        <Input value={this.state.web_portal_post_url} name="web_portal_post_url" id="web_portal_post_url" onChange={(e) => { this.inputChange(e, "web_portal_post_url") }} placeholder="Enter url"></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            </div>

                                                            {/* Other */}
                                                            <div id="other" style={otherStyle}>
                                                            <Row>
                                                            <Col md="6">
                                                                <Label><h7><u><b>Other</b></u></h7></Label>
                                                            </Col>

                                                            </Row>
                                                            <Row>
                                                                <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="other_post_boosted" >Was this a boosted post?</Label>
                                                                            <FormGroup tag="fieldset" row>
                                                                                <Col >
                                                                                    <FormGroup check inline>
                                                                                    <Label check>
                                                                                        <Input type="radio" name="other_post_boosted" id="yes" value="yes" onChange={(e) => {this.inputChange(e, "other_post_boosted")}} />{' '}
                                                                                        {yes}
                                                                                    </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                    <Label check>
                                                                                        <Input type="radio" name="other_post_boosted" id="no" value="no" onChange={(e) => {this.inputChange(e, "other_post_boosted")}} />{' '}
                                                                                        {no}
                                                                                    </Label>
                                                                                    </FormGroup>
                                                                                    <span class="errorMessage">{this.state.errors["other_post_boosted"]}</span>
                                                                                </Col>
                                                                            </FormGroup>
                                                                        </FormGroup>
                                                                </Col>

                                                                <Col md="6" style={otherPostBoosted}>
                                                                    <FormGroup >
                                                                        <Label for="other_post_boosted_count" >Number of boosted reach</Label> <span class="errorMessage">{this.state.errors["other_post_boosted_count"]}</span>
                                                                        <Input type="number" value={this.state.other_post_boosted_count} name="other_post_boosted_count" id="other_post_boosted_count" onChange={(e) => { this.inputChange(e, "other_post_boosted_count") }} max="9999999" min="0" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 7) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="other_post_likes_count" >Number of Likes</Label> <span class="errorMessage">{this.state.errors["other_post_likes_count"]}</span>
                                                                        <Input type="number" value={this.state.other_post_likes_count} name="other_post_likes_count" id="other_post_likes_count" onChange={(e) => { this.inputChange(e, "other_post_likes_count") }} max="9999999" min="0" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 7) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="other_post_comments_count" >Number of Comments</Label> <span class="errorMessage">{this.state.errors["other_post_comments_count"]}</span>
                                                                        <Input type="number" value={this.state.other_post_comments_count} name="other_post_comments_count" id="other_post_comments_count" onChange={(e) => { this.inputChange(e, "other_post_comments_count") }} max="9999999" min="0" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 7) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="other_post_shares_count" >Number of Shares</Label> <span class="errorMessage">{this.state.errors["other_post_shares_count"]}</span>
                                                                        <Input type="number" value={this.state.other_post_shares_count} name="other_post_shares_count" id="other_post_shares_count" onChange={(e) => { this.inputChange(e, "other_post_shares_count") }} max="9999999" min="0" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 7) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="other_post_url" >Post URL</Label> <span class="errorMessage">{this.state.errors["other_post_url"]}</span>
                                                                        <Input value={this.state.other_post_url} name="other_post_url" id="other_post_url" onChange={(e) => { this.inputChange(e, "other_post_url") }} placeholder="Enter url"></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            </div>

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
                                                    <LoadingIndicator loading={this.state.loading} msg={this.state.loadingMsg}/>
                                                    </Col>
                                                    <Col md="3">
                                                        <Button className="mb-2 mr-2" color="success" size="sm" type="submit">Submit<MDBIcon icon="smile" className="ml-2" size="lg"/></Button>
                                                        <Button className="mb-2 mr-2" color="danger" size="sm" onClick={this.cancelCheck} >Clear<MDBIcon icon="window-close" className="ml-2" size="lg" /></Button>
                                                    </Col>
                                                </Row>
                                            </CardHeader>
                                        </Card>
                                    </Col>
                                </Row>

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

export default SocialMediaDetail;