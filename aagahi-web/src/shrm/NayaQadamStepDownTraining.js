/**
 * @author Tahira Niazi
 * @email tahira.niazi@ihsinformatics.com
 * @create date 2019-08-28 15:41:38
 * @modify date 2019-09-18 02:04:04
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
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
import { getObject} from "../util/AahungUtil.js";
import { location, getDistrictsByProvince} from "../util/LocationUtil.js";
import moment from 'moment';
import * as Constants from "../util/Constants";
import { getFormTypeByUuid, getDefinitionId , getAllUsers, getRoleByName, getUsersByRole, getAllDonors} from "../service/GetService";
import { saveFormData } from "../service/PostService";
import LoadingIndicator from "../widget/LoadingIndicator";
import { MDBContainer, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBBtn } from 'mdbreact';


const topicCoveredOptions = [
    { label: 'VCAT', value: 'vcat'},
    { label: 'AYSRH Client Centred Care', value: 'aysrh_client_centred_care'},
    { label: 'Prevention of unwanted pregnancy', value: 'prevention_pregnancy'},
    { label: 'Provision of AYSRH services', value: 'provision_aysrh_services'},
    { label: 'Other', value: 'other'},
];


const schools = [
    { value: 'sindh', label: 'Sindh' },
    { value: 'punjab', label: 'Punjab' },
    { value: 'balochistan', label: 'Balochistan' },
    { value: 'khyber_pakhtunkhwa', label: 'Khyber Pakhtunkhwa' },
];


class NayaQadamStepDownTraining extends React.Component {
    
    modal = false;
    
    constructor(props) {
        super(props);
        
        this.toggle = this.toggle.bind(this);
        
        this.state = {

            district_sindh: 'karachi',
            district_punjab: 'Rawalpindi',
            facilitator_designation: 'preservice',
            date_start: '',
            activeTab: '1',
            page2Show: true,
            viewMode: false,
            editMode: false,
            errors: {},
            isCsa: true,
            isGender: false,
            hasError: false,
            loading: false,
            form_disabled : false
        };

        this.cancelCheck = this.cancelCheck.bind(this);
        this.callModal = this.callModal.bind(this);
        this.valueChangeMulti = this.valueChangeMulti.bind(this);
        this.valueChange = this.valueChange.bind(this);
        this.calculateScore = this.calculateScore.bind(this);
        this.inputChange = this.inputChange.bind(this);

        this.isTopicOther = false;
        this.isOtherTopic = false;
        this.isPunjab = false;
        this.isSindh = false;

        this.loading = false;
        this.form_disabled = false;

        this.formTypeId = 0;
        this.requiredFields = ["date_start", "province", "facilitator_name", "topic_covered", "nqsd_participant_count"];
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

            
            try {
                let formTypeObj = await getFormTypeByUuid(Constants.NAYA_QADAM_STEP_DOWN_TRAINING_FORM_UUID);
                this.formTypeId = formTypeObj.formTypeId;
                
            }
            catch(error) {
                console.log(error);
            }

        }
        catch(error) {
            console.log(error);
        }
    }

    updateDisplay() {

        this.setState({
            
            district_sindh: 'karachi',
            district_punjab: 'Rawalpindi',
            facilitator_designation: 'preservice',
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

        console.log(" ============================================================= ");
        this.resetForm(this.requiredFields);
        // receiving value directly from widget but it still requires widget to have on change methods to set it's value
        // alert(document.getElementById("date_start").value);
    }

    // for text and numeric questions
    inputChange(e, name) {

        console.log(e);
        console.log(e.target.id);
        console.log(e.target.type);
        console.log(e.target.pattern);
        let errorText = '';
        if(e.target.pattern != "" ) {
            
            console.log(e.target.value.match(e.target.pattern));
            errorText = e.target.value.match(e.target.pattern) != e.target.value ? "invalid!" : '';
            console.log(errorText);
            this.errors[name] = errorText;
        }

        this.setState({
            [name]: e.target.value
        });

        this.setState({errors: this.errors});
    }

    // for single select
    valueChange = (e, name) => {
        this.setState ({sex : e.target.value });
        this.setState ({sex : e.target.value });

        this.setState({
            [name]: e.target.value
        });

        if(name === "province") {

            this.isSindh  = e.target.value === "sindh" ? true : false;
            this.isPunjab  = e.target.value === "punjab" ? true : false;

            // this.state.isParticipantTypeOther ? this.requiredFields.push("other_attendant_count") : this.requiredFields = this.requiredFields.filter(e => e !== "other_attendant_count");
            // this.state.isParticipantTypeOther ? this.requiredFields.push("other_attendant_count") : this.requiredFields = this.requiredFields.filter(e => e !== "other_attendant_count");
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

        if (name === "topic_covered") {
            if (getObject('other', e, 'value') != -1) {
                this.isOtherTopic = true;
            }
            if (getObject('other', e, 'value') == -1) {
                this.isOtherTopic = false
            }
        }

        this.isOtherTopic ? this.requiredFields.push("topic_covered_other") : this.requiredFields = this.requiredFields.filter(e => e !== "topic_covered_other");
    }

    callModal = () => {
        this.setState({ modal : !this.state.modal });
    }

    // for autocomplete single select
    handleChange(e, name) {
        // alert(e.label); // label: Punjab
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
    

    handleSubmit = event => {
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
            jsonData.data.topic_covered = {};
            jsonData.data.topic_covered.values = [];
            
            
            // adding required properties in data property
            jsonData.data.date_start = this.state.date_start;
            jsonData.data.province = data.get('province');

            if(this.isSindh) {
                jsonData.data.district = data.get('district_sindh');
            }
            if(this.isPunjab) {
                jsonData.data.district = data.get('district_punjab');
            }

            jsonData.data.facilitator_name = this.state.facilitator_name;
            jsonData.data.facilitator_designation = this.state.facilitator_designation;

            // generating multiselect for topic_covered
            if((this.state.topic_covered != null && this.state.topic_covered != undefined)) {
                for(let i=0; i< this.state.topic_covered.length; i++) {
                    jsonData.data.topic_covered.values.push(String(this.state.topic_covered[i].value));
                }
            }
            
            if(this.isOtherTopic)
                jsonData.data.topic_covered_other = data.get('topic_covered_other');
            
            jsonData.data.nqsd_participant_count = parseInt(data.get('nqsd_participant_count'));
   
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

        this.isOtherTopic ? this.requiredFields.push("topic_covered_other") : this.requiredFields = this.requiredFields.filter(e => e !== "topic_covered_other");

        console.log(this.requiredFields);
        this.setState({ hasError: this.checkValid(this.requiredFields) ? false : true });
        formIsValid = this.checkValid(this.requiredFields);
        
        this.setState({errors: this.errors});
        // alert(formIsValid);
        return formIsValid;
    }

    /**
     * verifies and notifies for the empty form fields
     */
    checkValid = (fields) => {

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
        const otherTopicStyle = this.isOtherTopic ? {} : { display: 'none' };
        
        const districtPunjabStyle = this.isPunjab ? {} : { display: 'none' };
        const districtSindhStyle = this.isSindh ? {} : { display: 'none' };
        
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
                            <Form id="oneTouch" onSubmit={this.handleSubmit} >
                                <Row>
                                    <Col md="6">
                                        <Card className="main-card mb-6">
                                            <CardHeader>
                                                <i className="header-icon lnr-license icon-gradient bg-plum-plate"> </i>
                                                <b>Naya Qadam Step Down Training</b>
                                            </CardHeader>
                                        </Card>
                                    </Col>
                                    <Col md="3">
                                    </Col>
                                    <Col md="3">
                                    
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
                                                <fieldset disabled={this.form_disabled}>
                                                    <TabContent activeTab={this.state.activeTab}>
                                                        <TabPane tabId="1">
                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup inline>
                                                                    {/* TODO: autopopulate current date */}
                                                                        <Label for="date_start" >Form Date</Label> <span class="errorMessage">{this.state.errors["date_start"]}</span>
                                                                        <Input type="date" name="date_start" id="date_start" value={this.state.date_start} onChange={(e) => {this.inputChange(e, "date_start")}} max={moment().format("YYYY-MM-DD")}/>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6" >
                                                                <FormGroup >
                                                                        <Label for="province">Province</Label> <span class="errorMessage">{this.state.errors["province"]}</span>
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "province")} value={this.state.province} name="province" id="province">
                                                                            <option value="">Select...</option>
                                                                            <option value="sindh">Sindh</option>
                                                                            <option value="punjab">Punjab</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" style={districtSindhStyle}>
                                                                    <FormGroup >
                                                                        <Label for="district_sindh">District </Label> <span class="errorMessage">{this.state.errors["district_sindh"]}</span>
                                                                    
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "district_sindh")} value={this.state.district_sindh} name="district_sindh" id="district_sindh">
                                                                            <option value="karachi">Karachi</option>
                                                                            <option value="larkana">Larkana</option>
                                                                            <option value="sba">SBA</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" style={districtPunjabStyle}>
                                                                    <FormGroup >
                                                                        <Label for="district_punjab">District</Label> <span class="errorMessage">{this.state.errors["district_sindh"]}</span>
                                                                    
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "district_punjab")} value={this.state.district_punjab} name="district_punjab" id="district_punjab">
                                                                            <option value="rawalpindi">Rawalpindi</option>
                                                                            <option value="okara">Okara</option>
                                                                            <option value="pakpattan">Pakpattan</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>

                                                                
                                                                <Col md="6">
                                                                    <FormGroup>
                                                                        <Label for="facilitator_name" >Facilitator Name</Label> <span class="errorMessage">{this.state.errors["facilitator_name"]}</span>
                                                                        <Input name="facilitator_name" id="facilitator_name" value={this.state.facilitator_name} onChange={(e) => {this.inputChange(e, "facilitator_name")}} maxLength="100" placeholder="Enter name" pattern="^[A-Za-z ]+" />
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" >
                                                                    <FormGroup >
                                                                        <Label for="facilitator_designation">Facilitator Designation</Label> <span class="errorMessage">{this.state.errors["facilitator_designation"]}</span>
                                                                        <Input type="select" onChange={(e) => this.valueChange(e, "facilitator_designation")} value={this.state.facilitator_designation} name="facilitator_designation" id="facilitator_designation">
                                                                            <option value="preservice">Pre-service</option>
                                                                            <option value="inservice">In-service</option>
                                                                            <option value="lhs">LHS</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                
                                                            </Row>

                                                            <Row>    
                                                                <Col md="6">
                                                                    <FormGroup > 
                                                                        <Label for="topic_covered" >Topics Covered</Label> <span class="errorMessage">{this.state.errors["topic_covered"]}</span>
                                                                        <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e, "topic_covered")} value={this.state.topic_covered} id="topic_covered" options={topicCoveredOptions} />
                                                                    </FormGroup>
                                                                </Col>
                                                                

                                                                <Col md="6" style={otherTopicStyle}>
                                                                    <FormGroup >
                                                                        <Label for="topic_covered_other" >Specify Other</Label> <span class="errorMessage">{this.state.errors["topic_covered_other"]}</span>
                                                                        <Input name="topic_covered_other" id="topic_covered_other" value={this.state.topic_covered_other} onChange={(e) => {this.inputChange(e, "topic_covered_other")}} maxLength="100" placeholder="Specify other" />
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" >
                                                                    <FormGroup >
                                                                        <Label for="nqsd_participant_count" >Number of Participants</Label> <span class="errorMessage">{this.state.errors["nqsd_participant_count"]}</span>
                                                                        <Input type="number" value={this.state.nqsd_participant_count} name="nqsd_participant_count" id="nqsd_participant_count" onChange={(e) => { this.inputChange(e, "nqsd_participant_count") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter number"></Input>
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
                                                        <Button className="mb-2 mr-2" color="success" size="sm" type="submit">Submit</Button>
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

export default NayaQadamStepDownTraining;