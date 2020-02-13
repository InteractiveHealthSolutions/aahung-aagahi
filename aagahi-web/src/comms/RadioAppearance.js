/*
 * @Author: tahira.niazi@ihsinformatics.com 
 * @Date: date 2019-08-27 14:34:23 
 * @Last Modified by: tahira.niazi@ihsinformatics.com
 * @Last Modified time: 2020-02-13 12:52:12
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

import { MDBIcon } from 'mdbreact';
import moment from 'moment';
import React, { Fragment } from "react";
import DatePicker from "react-datepicker";
import { BrowserRouter as Router } from 'react-router-dom';
import Select from 'react-select';
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import { Button, Card, CardBody, CardHeader, Col, Container, Form, FormGroup, Input, Label, Row, TabContent, TabPane } from 'reactstrap';
import CustomModal from "../alerts/CustomModal";
import "../index.css";
import { getAllUsers, getFormDataById, getFormTypeByUuid } from "../service/GetService";
import { saveFormData, updateFormData } from "../service/PostService";
import { getObject, loadFormState, resetFormState } from "../util/AahungUtil.js";
import * as Constants from "../util/Constants";
import FormNavBar from "../widget/FormNavBar";
import LoadingIndicator from "../widget/LoadingIndicator";
import { UserService } from '../service/UserService';

const coveredTopics = [
    { value: 'csa', label: 'CSA' },
    { value: 'gender', label: 'Gender' },
    { value: 'puberty', label: 'Puberty' },
    { value: 'sexual_harrassment', label: 'Sexual Harassment' },
    { value: 'lsbe', label: 'LSBE' },
    { value: 'other', label: 'Other' }
];

class RadioAppearance extends React.Component {

    modal = false;

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);

        this.state = {
            time_radio_show: new Date(),
            users: [],
            date_start: '',
            activeTab: '1',
            page2Show: true,
            viewMode: false,
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
        this.calculateScore = this.calculateScore.bind(this);
        this.inputChange = this.inputChange.bind(this);
        this.checkValid = this.checkValid.bind(this);

        this.isCityOther = false;
        this.isOtherTopic = false;
        this.formTypeId = 0;
        this.requiredFields = ["date_start", "time_radio_show", "radio_channel_name", "radio_channel_frequency", "city", "topic_covered", "aahung_staff_appearance", "live_call_count"];
        this.nonRequiredFields = ["listener_count", "topic_covered_other"];
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
            let userArray = await getAllUsers();
            let formTypeObj = await getFormTypeByUuid(Constants.RADIO_APPEARANCE_FORM_UUID);
            this.formTypeId = formTypeObj.formTypeId;

            if (userArray != null && userArray.length > 0) {
                this.setState({
                    users: userArray
                })
            }

            if (this.editMode) {
                this.fetchedForm = await getFormDataById(String(this.props.location.state.formId));
                this.state = loadFormState(this.fetchedForm, this.state); // autopopulates the whole form
                this.setState({
                    date_start: moment(this.fetchedForm.formDate).format('YYYY-MM-DD')
                })
                this.editUpdateDisplay();
            }

            this.setState({
                loading: false
            })
        }
        catch (error) {
            console.log(error);
        }
    }

    beforeunload(e) {
        e.preventDefault();
        e.returnValue = true;
    }


    cancelCheck = () => {
        // console.log(moment(this.state.time_radio_show).format('h:mm A'));
        // console.log(this.state.aahung_staff_appearance);
        this.resetForm(this.requiredFields);
    }

    // for text and numeric questions
    inputChange(e, name) {

        console.log(e);
        console.log(e.target.id);
        console.log(e.target.type);
        console.log(e.target.pattern);
        let errorText = '';
        if (e.target.pattern != "" && name != "radio_channel_frequency") {
            errorText = e.target.value.match(e.target.pattern) != e.target.value ? "invalid!" : '';
            this.errors[name] = errorText;
        }

        if (name === "radio_channel_frequency") {
            var regexp = /^\d+(\.\d{1,2})?$/;
            errorText = regexp.test(e.target.value) == false ? "invalid!" : '';
            this.errors[name] = errorText;
        }


        this.setState({
            [name]: e.target.value
        });

        if (name === "date_start") {
            this.setState({ date_start: e.target.value });
        }

        this.setState({ errors: this.errors });
    }

    // for single select
    valueChange = (e, name) => {
        console.log(e.target.type);

        this.setState({
            [name]: e.target.value
        });

        if (name === "city") {
            this.isCityOther = e.target.value === "Other" ? true : false;
            // this.isCityOther ? this.requiredFields.push("city_other") : this.requiredFields = this.requiredFields.filter(e => e !== "city_other");
        }
    }

    handleDate(date, name) {
        console.log(typeof date.toString())
        this.setState({
            [name]: date
        });

    };

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
                this.isOtherTopic = false;

            }

            // this.isOtherTopic ? this.requiredFields.push("topic_covered_other") : this.requiredFields = this.requiredFields.filter(e => e !== "topic_covered_other");
        }


    }

    callModal = () => {
        this.setState({ modal: !this.state.modal });
    }

    // for autocomplete single select
    handleChange(e, name) {

        this.setState({
            [name]: e
        });
    }


    handleSubmit = event => {
        event.preventDefault();
        if (this.handleValidation()) {

            console.log("in submission");
            this.setState({
                loading: true,
                loadingMsg: "Saving trees..."
            })

            const data = new FormData(event.target);
            var dataObject = new Object();
            var topicCovered = [];
            var topicCoveredObject = new Object();

            dataObject.date_start = this.state.date_start;
            dataObject.time_radio_show = moment(this.state.time_radio_show).format('h:mm A');
            dataObject.radio_channel_name = data.get('radio_channel_name');
            dataObject.radio_channel_frequency = parseFloat(data.get(('radio_channel_frequency')));
            dataObject.city = this.state.city;
            if (this.isCityOther)
                dataObject.city_other = data.get('city_other');

            // generating multiselect for topic covered
            if ((this.state.topic_covered != null && this.state.topic_covered != undefined)) {
                for (let i = 0; i < this.state.topic_covered.length; i++) {
                    topicCovered.push(String(this.state.topic_covered[i].value));
                }
            }
            topicCoveredObject.values = topicCovered;
            // var topicCoveredString = JSON.stringify(topicCoveredObject);
            dataObject.topic_covered = topicCoveredObject;
            if (this.isOtherTopic)
                dataObject.topic_covered_other = data.get('topic_covered_other');

            // aahung_staff_appearance
            let aahungUsers = [];
            if ((this.state.aahung_staff_appearance != null && this.state.aahung_staff_appearance != undefined)) {
                for (let i = 0; i < this.state.aahung_staff_appearance.length; i++) {
                    aahungUsers.push({
                        "userId": this.state.aahung_staff_appearance[i].id
                    });
                }
            }

            dataObject.aahung_staff_appearance = aahungUsers;
            dataObject.live_call_count = parseInt(data.get('live_call_count'));
            if (data.get('listener_count') != null && data.get('listener_count') != undefined) {
                dataObject.listener_count = parseInt(data.get('listener_count'));
            }

            var jsonData = new Object();
            var formTypeObject = new Object();
            formTypeObject.formTypeId = this.formTypeId;
            jsonData.formType = formTypeObject;
            jsonData.data = dataObject;
            jsonData.formDate = this.state.date_start;
            jsonData.referenceId = "";
            console.log("printing final json object");
            console.log(jsonData);

            if (this.editMode) {
                jsonData.uuid = this.fetchedForm.uuid;
                jsonData.referenceId = this.fetchedForm.referenceId;

                updateFormData(jsonData)
                    .then(
                        responseData => {
                            if (!(String(responseData).includes("Error"))) {

                                this.setState({
                                    loading: false,
                                    modalHeading: 'Success!',
                                    okButtonStyle: { display: 'none' },
                                    modalText: 'Data updated successfully.',
                                    modal: !this.state.modal
                                });

                                this.resetForm(this.requiredFields);
                            }
                            else if (String(responseData).includes("Error")) {

                                var submitMsg = '';
                                submitMsg = "Unable to update data. Please see error logs for details. \
                            " + String(responseData);

                                this.setState({
                                    loading: false,
                                    modalHeading: 'Fail!',
                                    okButtonStyle: { display: 'none' },
                                    modalText: submitMsg,
                                    modal: !this.state.modal
                                });
                            }
                        }
                    );
            }
            else {

                saveFormData(jsonData)
                    .then(
                        responseData => {
                            console.log(responseData);
                            if (!(String(responseData).includes("Error"))) {

                                this.setState({
                                    loading: false,
                                    modalHeading: 'Success!',
                                    okButtonStyle: { display: 'none' },
                                    modalText: 'Data saved successfully.',
                                    modal: !this.state.modal
                                });

                                this.resetForm(this.requiredFields);
                            }
                            else if (String(responseData).includes("Error")) {

                                var submitMsg = '';
                                submitMsg = "Unable to submit Form. \
                            " + String(responseData);

                                this.setState({
                                    loading: false,
                                    modalHeading: 'Fail!',
                                    okButtonStyle: { display: 'none' },
                                    modalText: submitMsg,
                                    modal: !this.state.modal
                                });
                            }
                        }
                    );
            }

        }
    }

    handleValidation() {
        // check each required state

        let formIsValid = true;
        console.log(this.requiredFields);
        this.setState({ hasError: true });
        this.setState({ hasError: this.checkValid(this.requiredFields) ? false : true });
        formIsValid = this.checkValid(this.requiredFields);
        this.setState({ errors: this.errors });
        return formIsValid;
    }

    /**
     * verifies and notifies for the empty form fields
     */
    checkValid = (fields) => {

        this.isOtherTopic ? fields.push("topic_covered_other") : fields = fields.filter(e => e !== "topic_covered_other");
        this.isCityOther ? fields.push("city_other") : fields = fields.filter(e => e !== "city_other");

        let isOk = true;
        this.errors = {};
        const errorText = "Required";
        for (let j = 0; j < fields.length; j++) {
            let stateName = fields[j];

            // for array object
            if (typeof this.state[stateName] === 'object' && this.state[stateName].length === 0) {
                isOk = false;
                this.errors[fields[j]] = errorText;
            }

            // for text and others
            if (typeof this.state[stateName] != 'object') {
                if (this.state[stateName] === "" || this.state[stateName] == undefined) {
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
        fields = fields.concat(this.nonRequiredFields);
        this.state = resetFormState(fields, this.state);
        this.updateDisplay();
    }

    updateDisplay() {
        this.isCityOther = false;
        this.isOtherTopic = false;
    }

    editUpdateDisplay() {

        this.isCityOther = this.state.city === "Other" ? true : false;

        if (this.state.topic_covered != undefined && this.state.topic_covered != '') {
            if (getObject('other', this.state.topic_covered, 'value') != -1) {
                this.isOtherTopic = true;
            }
            if (getObject('other', this.state.topic_covered, 'value') == -1) {
                this.isOtherTopic = false;
            }
        }
    }

    // for modal
    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    }

    render() {

        // skip logics
        const cityOtherStyle = this.isCityOther ? {} : { display: 'none' };
        const otherTopicStyle = this.isOtherTopic ? {} : { display: 'none' };
        var formNavVisible = false;
        if (this.props.location.state !== undefined) {
            formNavVisible = this.props.location.state.edit ? true : false;
        }
        else {
            formNavVisible = false;
        }
        // if the user does not have edit rights
        var buttonDisabled = false; 
        if(this.editMode) {
            buttonDisabled = UserService.hasAccess('Edit FormData') ? false : true;
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
                                <Form id="testForm" onSubmit={this.handleSubmit}>
                                    <Row>
                                        <Col md="6">
                                            <Card className="main-card mb-6">
                                                <CardHeader>
                                                    {/* <i className="header-icon lnr-license icon-gradient bg-plum-plate"> </i> */}
                                                    {/* <MDBIcon icon="file-alt" className="mr-3" size="lg"/> */}
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
                                                        <span class="errorMessage"><u>Error: <br /></u> Form has some errors. Please check for required and invalid fields.<br /></span>
                                                    </div>

                                                    <br />

                                                    <fieldset >
                                                        <TabContent activeTab={this.state.activeTab}>
                                                            <TabPane tabId="1">
                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup inline>
                                                                            <Label for="date_start" >Date <span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["date_start"]}</span>
                                                                            <Input type="date" name="date_start" id="date_start" value={this.state.date_start} onChange={(e) => { this.inputChange(e, "date_start") }} max={moment().format("YYYY-MM-DD")} />
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6">
                                                                        <FormGroup>
                                                                            <Label for="time_radio_show" >Time of Radio Show Start</Label> <span class="errorMessage">{this.state.errors["time_radio_show"]}</span> <br />
                                                                            {/* <TimeField onChange={(e) => {this.getTime(e, "time_radio_show")}} input={<Input id="time" value={this.state.time_radio_show} onChange={(e) => {this.inputChange(e, "time_radio_show")}} />}  colon=":" required/> */}
                                                                            <DatePicker
                                                                                selected={this.state.time_radio_show}
                                                                                onChange={(date) => this.handleDate(date, "time_radio_show")}
                                                                                selectsStart
                                                                                startDate={this.state.time_radio_show}
                                                                                showTimeSelect
                                                                                showTimeSelectOnly
                                                                                timeIntervals={5}
                                                                                timeCaption="Time"
                                                                                dateFormat="h:mm aa"
                                                                                className="timeWidget"
                                                                            />
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="radio_channel_name" >Name of Radio <span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["radio_channel_name"]}</span>
                                                                            <Input name="radio_channel_name" id="radio_channel_name" value={this.state.radio_channel_name} onChange={(e) => { this.inputChange(e, "radio_channel_name") }} maxLength="200" placeholder="Enter name" pattern="^[A-Za-z0-9. ]+" />
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="radio_channel_frequency" >Radio Frequency <span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["radio_channel_frequency"]}</span>
                                                                            <Input name="radio_channel_frequency" id="radio_channel_frequency" value={this.state.radio_channel_frequency} onChange={(e) => { this.inputChange(e, "radio_channel_frequency") }} maxLength="5" pattern="^\d{1,10}(\.\d{1,4})?$" placeholder="Enter input" />
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="city" >City <span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["city"]}</span>
                                                                            <Input type="select" onChange={(e) => this.valueChange(e, "city")} value={this.state.city} name="city" id="city" >
                                                                                <option value="">Select</option>
                                                                                <option value="Karachi">Karachi</option>
                                                                                <option value="Islamabad">Islamabad</option>
                                                                                <option value="Lahore">Lahore</option>
                                                                                <option value="Quetta">Quetta</option>
                                                                                <option value="Peshawar">Peshawar</option>
                                                                                <option value="Hyderabad">Hyderabad</option>
                                                                                <option value="SBA">SBA</option>
                                                                                <option value="Other">Other</option>
                                                                            </Input>
                                                                        </FormGroup>

                                                                    </Col>
                                                                    <Col md="6" style={cityOtherStyle}>
                                                                        <FormGroup >
                                                                            <Label for="city_other" >Specify Other City</Label> <span class="errorMessage">{this.state.errors["city_other"]}</span>
                                                                            <Input name="city_other" id="city_other" value={this.state.city_other} onChange={(e) => { this.inputChange(e, "city_other") }} maxLength="200" placeholder="Enter other" />
                                                                        </FormGroup>
                                                                    </Col>

                                                                </Row>
                                                                <Row>

                                                                    <Col md="6" >
                                                                        <FormGroup >
                                                                            <Label for="topic_covered" >Topics Covered <span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["topic_covered"]}</span>
                                                                            <Select onChange={(e) => this.valueChangeMulti(e, "topic_covered")} value={this.state.topic_covered} id="topic_covered" options={coveredTopics} required isMulti />
                                                                        </FormGroup>
                                                                    </Col>


                                                                    <Col md="6" style={otherTopicStyle}>
                                                                        <FormGroup >
                                                                            <Label for="topic_covered_other" >Specify Other Topic</Label> <span class="errorMessage">{this.state.errors["topic_covered_other"]}</span>
                                                                            <Input name="topic_covered_other" id="topic_covered_other" value={this.state.topic_covered_other} onChange={(e) => { this.inputChange(e, "topic_covered_other") }} maxLength="200" placeholder="Enter other" />
                                                                        </FormGroup>
                                                                    </Col>

                                                                </Row>
                                                                <Row>

                                                                    <Col md="6" >
                                                                        <FormGroup >
                                                                            <Label for="aahung_staff_appearance">Aahung Staff on Radio <span className="required">*</span></Label> <span class="errorMessage">{this.state.errors["aahung_staff_appearance"]}</span>
                                                                            <Select onChange={(e) => this.valueChangeMulti(e, "aahung_staff_appearance")} value={this.state.aahung_staff_appearance} id="aahung_staff_appearance" options={this.state.users} isMulti />
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6" >
                                                                        <FormGroup >
                                                                            <Label for="live_call_count" >Number of Live Calls During Show <span className="required">*</span> </Label> <span class="errorMessage">{this.state.errors["live_call_count"]}</span>
                                                                            <Input type="number" value={this.state.live_call_count} name="live_call_count" id="live_call_count" onChange={(e) => { this.inputChange(e, "live_call_count") }} max="999" min="0" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter number"></Input>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6" >
                                                                        <FormGroup >
                                                                            <Label for="listener_count" >Listenership</Label> <span class="errorMessage">{this.state.errors["listener_count"]}</span>
                                                                            <Input type="number" value={this.state.listener_count} name="listener_count" id="listener_count" onChange={(e) => { this.inputChange(e, "listener_count") }} max="99999999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 8) }} placeholder="Enter number"></Input>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                {/* please don't remove this div unless you are adding multiple questions here*/}
                                                                <div style={{ height: '250px' }}><span>   </span></div>
                                                            </TabPane>
                                                        </TabContent>
                                                    </fieldset>
                                                </CardBody>
                                            </Card>
                                        </Col>
                                    </Row>

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
                                                            <LoadingIndicator loading={this.state.loading} msg={this.state.loadingMsg} />
                                                        </Col>
                                                        <Col md="3">
                                                            <Button className="mb-2 mr-2" color="success" size="sm" type="submit" disabled={buttonDisabled}>Submit<MDBIcon icon="smile" className="ml-2" size="lg" /></Button>
                                                            <Button className="mb-2 mr-2" color="danger" size="sm" onClick={this.cancelCheck} disabled={buttonDisabled}>Clear<MDBIcon icon="window-close" className="ml-2" size="lg" /></Button>
                                                        </Col>
                                                    </Row>

                                                </CardHeader>
                                            </Card>
                                        </Col>
                                    </Row>
                                    <CustomModal modal = {this.state.modal} modalHeading= {this.state.modalHeading} modalText= {this.state.modalText} toggle = {this.toggle} />
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