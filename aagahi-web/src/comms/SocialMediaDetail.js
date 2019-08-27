/**
 * @author Tahira Niazi
 * @email tahira.niazi@ihsinformatics.com
 * @create date 2019-08-26 20:37:46
 * @modify date 2019-08-26 20:37:46
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

const evaluators = [
    { value: 'sindh', label: 'Sindh' },
    { value: 'punjab', label: 'Punjab' },
    { value: 'balochistan', label: 'Balochistan' },
    { value: 'khyber_pakhtunkhwa', label: 'Khyber Pakhtunkhwa' },
];

const postComponentOptions = [
    { value: 'comms', label: 'Comms' },
    { value: 'lse', label: 'LSE' },
    { value: 'srhm', label: 'SRHM' },
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

class SocialMediaDetail extends React.Component {

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
            this.isOtherrPostBoosted = e.target.id === "yes" ? true : false;
        }
    }

    // for single select
    valueChange = (e, name) => {
        this.setState ({sex : e.target.value });
        this.setState ({sex : e.target.value });
        this.setState({
            [name]: e.target.value
        });

        if(e.target.id === "post_type") {
            this.isPostOther = e.target.value === "other" ? true : false;
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

        if (name === "post_topic") {
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
                                                                        <Label for="date_start" >Form Date</Label> <span class="errorMessage">{this.state.errors["date_start"]}</span>
                                                                        <Input type="date" name="date_start" id="date_start" value={this.state.date_start} onChange={(e) => {this.inputChange(e, "date_start")}} />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="post_component" >Post Relevant for</Label> <span class="errorMessage">{this.state.errors["post_component"]}</span>
                                                                        <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e, "post_component")} value={this.state.post_component} id="post_component" options={postComponentOptions} required/>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="post_date" >Date/Time of Post</Label> <span class="errorMessage">{this.state.errors["post_date"]}</span>
                                                                        <Input type="date" name="post_date" id="post_date" value={this.state.post_date} onChange={(e) => {this.inputChange(e, "post_date")}} />
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
                                                                        <Label for="post_topic" >Topic(s) Covered by the Post</Label> <span class="errorMessage">{this.state.errors["post_topic"]}</span>
                                                                        <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e, "post_topic")} value={this.state.post_topic} id="post_topic" options={postTopicOptions} />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="6" style={postTopicOtherStyle}>
                                                                    <FormGroup >
                                                                        <Label for="post_topic_other" >Specify Other</Label> <span class="errorMessage">{this.state.errors["post_topic_other"]}</span>
                                                                        <Input name="post_topic_other" id="post_topic_other" value={this.state.post_topic_other} onChange={(e) => {this.inputChange(e, "post_topic_other")}} maxLength="200" placeholder="Enter other"/>
                                                                    </FormGroup>
                                                                </Col>
                                                            
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="post_platform" >Platform used</Label> <span class="errorMessage">{this.state.errors["post_platform"]}</span>
                                                                        <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e, "post_platform")} value={this.state.post_platform} id="post_platform" options={postPlatformOptions} />
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
                                                                                        <Input type="radio" name="twitter_post_boosted" id="yes" value="1" onChange={(e) => {this.inputChange(e, "twitter_post_boosted")}} />{' '}
                                                                                        {yes}
                                                                                    </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                    <Label check>
                                                                                        <Input type="radio" name="twitter_post_boosted" id="no" value="0" onChange={(e) => {this.inputChange(e, "twitter_post_boosted")}} />{' '}
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
                                                                        <Label for="twitter_post_boosted_num" >Number of boosted reach</Label> <span class="errorMessage">{this.state.errors["twitter_post_boosted_num"]}</span>
                                                                        <Input type="number" value={this.state.twitter_post_boosted_num} name="twitter_post_boosted_num" id="twitter_post_boosted_num" onChange={(e) => { this.inputChange(e, "twitter_post_boosted_num") }} max="99999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 5) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="twitter_post_likes_num" >Number of Likes</Label> <span class="errorMessage">{this.state.errors["twitter_post_likes_num"]}</span>
                                                                            <Input type="number" value={this.state.twitter_post_likes_num} name="twitter_post_likes_num" id="twitter_post_likes_num" onChange={(e) => { this.inputChange(e, "twitter_post_likes_num") }} max="99999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 5) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="twitter_post_comments_num" >Number of Comments</Label> <span class="errorMessage">{this.state.errors["twitter_post_comments_num"]}</span>
                                                                        <Input type="number" value={this.state.twitter_post_comments_num} name="twitter_post_comments_num" id="twitter_post_comments_num" onChange={(e) => { this.inputChange(e, "twitter_post_comments_num") }} max="99999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 5) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="twitter_post_shares_num" >Number of Shares</Label> <span class="errorMessage">{this.state.errors["twitter_post_shares_num"]}</span>
                                                                            <Input type="number" value={this.state.twitter_post_shares_num} name="twitter_post_shares_num" id="twitter_post_shares_num" onChange={(e) => { this.inputChange(e, "twitter_post_shares_num") }} max="99999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 5) }} placeholder="Enter number"></Input>
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
                                                                                        <Input type="radio" name="facebook_post_boosted" id="yes" value="1" onChange={(e) => {this.inputChange(e, "facebook_post_boosted")}} />{' '}
                                                                                        {yes}
                                                                                    </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                    <Label check>
                                                                                        <Input type="radio" name="facebook_post_boosted" id="no" value="0" onChange={(e) => {this.inputChange(e, "facebook_post_boosted")}} />{' '}
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
                                                                        <Label for="facebook_post_boosted_num" >Number of boosted reach</Label> <span class="errorMessage">{this.state.errors["facebook_post_boosted_num"]}</span>
                                                                        <Input type="number" value={this.state.facebook_post_boosted_num} name="facebook_post_boosted_num" id="facebook_post_boosted_num" onChange={(e) => { this.inputChange(e, "facebook_post_boosted_num") }} max="99999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 5) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    
                                                                    <FormGroup >
                                                                        <Label for="facebook_post_likes_num" >Number of Likes</Label> <span class="errorMessage">{this.state.errors["facebook_post_likes_num"]}</span>
                                                                        <Input type="number" value={this.state.facebook_post_likes_num} name="facebook_post_likes_num" id="facebook_post_likes_num" onChange={(e) => { this.inputChange(e, "facebook_post_likes_num") }} max="99999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 5) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6">
                                                                    
                                                                    <FormGroup >
                                                                        <Label for="facebook_post_comments_num" >Number of Comments</Label> <span class="errorMessage">{this.state.errors["facebook_post_comments_num"]}</span>
                                                                        <Input type="number" value={this.state.facebook_post_comments_num} name="facebook_post_comments_num" id="facebook_post_comments_num" onChange={(e) => { this.inputChange(e, "facebook_post_comments_num") }} max="99999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 5) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    
                                                                    <FormGroup >
                                                                        <Label for="facebook_post_shares_num" >Number of Shares</Label> <span class="errorMessage">{this.state.errors["facebook_post_shares_num"]}</span>
                                                                            <Input type="number" value={this.state.facebook_post_shares_num} name="facebook_post_shares_num" id="facebook_post_shares_num" onChange={(e) => { this.inputChange(e, "facebook_post_shares_num") }} max="99999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 5) }} placeholder="Enter number"></Input>
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
                                                                                        <Input type="radio" name="instagram_post_boosted" id="yes" value="1" onChange={(e) => {this.inputChange(e, "instagram_post_boosted")}} />{' '}
                                                                                        {yes}
                                                                                    </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                    <Label check>
                                                                                        <Input type="radio" name="instagram_post_boosted" id="no" value="0" onChange={(e) => {this.inputChange(e, "instagram_post_boosted")}} />{' '}
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
                                                                        <Label for="instagram_post_boosted_num" >Number of boosted reach</Label> <span class="errorMessage">{this.state.errors["instagram_post_boosted_num"]}</span>
                                                                        <Input type="number" value={this.state.instagram_post_boosted_num} name="instagram_post_boosted_num" id="instagram_post_boosted_num" onChange={(e) => { this.inputChange(e, "instagram_post_boosted_num") }} max="99999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 5) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    
                                                                    <FormGroup >
                                                                        <Label for="instagram_post_likes_num" >Number of Likes</Label> <span class="errorMessage">{this.state.errors["instagram_post_likes_num"]}</span>
                                                                        <Input type="number" value={this.state.instagram_post_likes_num} name="instagram_post_likes_num" id="instagram_post_likes_num" onChange={(e) => { this.inputChange(e, "instagram_post_likes_num") }} max="99999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 5) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6">
                                                                    
                                                                    <FormGroup >
                                                                        <Label for="instagram_post_comments_num" >Number of Comments</Label> <span class="errorMessage">{this.state.errors["instagram_post_comments_num"]}</span>
                                                                        <Input type="number" value={this.state.instagram_post_comments_num} name="instagram_post_comments_num" id="instagram_post_comments_num" onChange={(e) => { this.inputChange(e, "instagram_post_comments_num") }} max="99999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 5) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    
                                                                    <FormGroup >
                                                                        <Label for="instagram_post_shares_num" >Number of Shares</Label> <span class="errorMessage">{this.state.errors["instagram_post_shares_num"]}</span>
                                                                        <Input type="number" value={this.state.instagram_post_shares_num} name="instagram_post_shares_num" id="instagram_post_shares_num" onChange={(e) => { this.inputChange(e, "instagram_post_shares_num") }} max="99999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 5) }} placeholder="Enter number"></Input>
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
                                                                                        <Input type="radio" name="web_portal_post_boosted" id="yes" value="1" onChange={(e) => {this.inputChange(e, "web_portal_post_boosted")}} />{' '}
                                                                                        {yes}
                                                                                    </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                    <Label check>
                                                                                        <Input type="radio" name="web_portal_post_boosted" id="no" value="0" onChange={(e) => {this.inputChange(e, "web_portal_post_boosted")}} />{' '}
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
                                                                        <Label for="web_portal_post_boosted_num" >Number of boosted reach</Label> <span class="errorMessage">{this.state.errors["web_portal_post_boosted_num"]}</span>
                                                                        <Input type="number" value={this.state.web_portal_post_boosted_num} name="web_portal_post_boosted_num" id="web_portal_post_boosted_num" onChange={(e) => { this.inputChange(e, "web_portal_post_boosted_num") }} max="99999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 5) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    
                                                                    <FormGroup >
                                                                        <Label for="web_portal_post_likes_num" >Number of Likes</Label> <span class="errorMessage">{this.state.errors["web_portal_post_likes_num"]}</span>
                                                                        <Input type="number" value={this.state.web_portal_post_likes_num} name="web_portal_post_likes_num" id="web_portal_post_likes_num" onChange={(e) => { this.inputChange(e, "web_portal_post_likes_num") }} max="99999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 5) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6">
                                                                    
                                                                    <FormGroup >
                                                                        <Label for="web_portal_post_comments_num" >Number of Comments</Label> <span class="errorMessage">{this.state.errors["web_portal_post_comments_num"]}</span>
                                                                        <Input type="number" value={this.state.web_portal_post_comments_num} name="web_portal_post_comments_num" id="web_portal_post_comments_num" onChange={(e) => { this.inputChange(e, "web_portal_post_comments_num") }} max="99999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 5) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="web_portal_post_shares_num" >Number of Shares</Label> <span class="errorMessage">{this.state.errors["web_portal_post_shares_num"]}</span>
                                                                        <Input type="number" value={this.state.web_portal_post_shares_num} name="web_portal_post_shares_num" id="web_portal_post_shares_num" onChange={(e) => { this.inputChange(e, "web_portal_post_shares_num") }} max="99999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 5) }} placeholder="Enter number"></Input>
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
                                                                                        <Input type="radio" name="other_post_boosted" id="yes" value="1" onChange={(e) => {this.inputChange(e, "other_post_boosted")}} />{' '}
                                                                                        {yes}
                                                                                    </Label>
                                                                                    </FormGroup>
                                                                                    <FormGroup check inline>
                                                                                    <Label check>
                                                                                        <Input type="radio" name="other_post_boosted" id="no" value="0" onChange={(e) => {this.inputChange(e, "other_post_boosted")}} />{' '}
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
                                                                        <Label for="other_post_boosted_num" >Number of boosted reach</Label> <span class="errorMessage">{this.state.errors["other_post_boosted_num"]}</span>
                                                                        <Input type="number" value={this.state.other_post_boosted_num} name="other_post_boosted_num" id="other_post_boosted_num" onChange={(e) => { this.inputChange(e, "other_post_boosted_num") }} max="99999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 5) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="other_post_likes_num" >Number of Likes</Label> <span class="errorMessage">{this.state.errors["other_post_likes_num"]}</span>
                                                                        <Input type="number" value={this.state.other_post_likes_num} name="other_post_likes_num" id="other_post_likes_num" onChange={(e) => { this.inputChange(e, "other_post_likes_num") }} max="99999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 5) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="other_post_comments_num" >Number of Comments</Label> <span class="errorMessage">{this.state.errors["other_post_comments_num"]}</span>
                                                                        <Input type="number" value={this.state.other_post_comments_num} name="other_post_comments_num" id="other_post_comments_num" onChange={(e) => { this.inputChange(e, "other_post_comments_num") }} max="99999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 5) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="other_post_shares_num" >Number of Shares</Label> <span class="errorMessage">{this.state.errors["other_post_shares_num"]}</span>
                                                                        <Input type="number" value={this.state.other_post_shares_num} name="other_post_shares_num" id="other_post_shares_num" onChange={(e) => { this.inputChange(e, "other_post_shares_num") }} max="99999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 5) }} placeholder="Enter number"></Input>
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

export default SocialMediaDetail;