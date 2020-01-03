/**
 * @author Tahira Niazi
 * @email tahira.niazi@ihsinformatics.com
 * @create date 2019-09-01 21:23:42
 * @modify date 2019-09-01 21:23:42
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

import moment from 'moment';
import React, { Fragment } from "react";
import Select from 'react-select';
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import { Button, Card, CardBody, CardHeader, Col, Container, Form, FormGroup, Input, Label, Row, TabContent, TabPane } from 'reactstrap';
import CustomModal from "../alerts/CustomModal";
import "../index.css";
import { getDefinitionByDefinitionId, getDefinitionsByDefinitionType, getLocationAttributeTypeByShortName, getLocationByRegexValue, getLocationsByCategory } from '../service/GetService';
import { updateLocation } from "../service/PostService";
import { getObject } from "../util/AahungUtil.js";
import * as Constants from "../util/Constants";
import LoadingIndicator from "../widget/LoadingIndicator";

class InstitutionClosing extends React.Component {

    modal = false;

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);

        this.state = {
            institutions: [],
            participant_id: '',
            participant_name: '',
            dob: '',
            sex: '',
            school_id: [],
            csa_prompts: '',
            subject_taught: [], // all the form elements states are in underscore notation i.e variable names in codebook
            subject_taught_other: '',
            teaching_years: '',
            education_level: 'no_edu',
            institution_id: '',
            institution_name: '',
            partnership_start_date: '',
            partnership_end_date: '',
            partnership_years: '',
            institution_type: '',
            end_partnership_reason: '',
            donor_name: '',
            activeTab: '1',
            page2Show: true,
            viewMode: false,
            editMode: false,
            hasError: false,
            errors: {},
            loading: false,
            loadingMsg: '',
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
        this.checkValid = this.checkValid.bind(this);

        this.isOtherInstitution = false;
        this.errors = {};
        this.fetchedLocation = {};
        this.isEndDateExists = false;
        this.isEndReasonExists = false;
        this.isPartnershipYearsExists = false;
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

            let institutions = await getLocationsByCategory(Constants.INSTITUTION_DEFINITION_UUID);
            if (institutions != null && institutions.length > 0) {
                this.setState({
                    institutions: institutions
                })
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    // for modal
    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    }

    beforeunload(e) {
        e.preventDefault();
        e.returnValue = true;
    }


    cancelCheck = () => {

        console.log(" ============================================================= ");
        this.resetForm([]);
        // receiving value directly from widget but it still requires widget to have on change methods to set it's value
        // alert(document.getElementById("date_start").value);

        // 

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

        if (name === "partnership_end_date") {
            if (this.state.partnership_start_date != undefined || this.state.partnership_start_date != null) {
                var startDate = this.state.partnership_start_date;
                var momentDate = moment(startDate);
                var endDataMoment = moment(e.target.value);
                this.setState({ partnership_years: endDataMoment.diff(momentDate, 'years') });
            }
        }

        this.setState({ errors: this.errors });
    }

    // for single select
    valueChange = (e, name) => {
        console.log(e.target.type);
        this.setState({ sex: e.target.value });
        this.setState({ sex: e.target.value });

        this.setState({
            [name]: e.target.value
        });
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

        if (name === "institution_type") {
            if (getObject('institution_other', e, 'value') != -1) {
                this.isOtherInstitution = true;

            }
            if (getObject('institution_other', e, 'value') == -1) {
                this.isOtherInstitution = false;

            }
        }
    }

    callModal = () => {
        this.setState({ modal: !this.state.modal });
    }

    // for autocomplete single select
    async handleChange(e, name) {

        this.setState({
            [name]: e
        });

        try {
            if (name === "institution_id") {

                this.setState({
                    institution_name: e.locationName,
                    loading: true,
                    loadingMsg: 'Fetching Data...'
                })
                // let attributes = await getLocationAttributesByLocation(e.uuid);
                this.fetchedLocation = await getLocationByRegexValue(e.uuid);
                this.autopopulateFields(this.fetchedLocation.attributes);
            }
        }
        catch (error) {
            console.log(error);
        }
    };



    /**
     * created separate method because async handle was not updating the local variables (location attrs)
     */
    autopopulateFields(locationAttributes) {

        let self = this;
        let attributeValue = '';

        try {

            this.setState({
                end_partnership_reason: ''
            })

            locationAttributes.forEach(async function (obj) {

                let attrTypeName = obj.attributeType.shortName;

                if (obj.attributeType.dataType.toUpperCase() != "JSON" || obj.attributeType.dataType.toUpperCase() != "DEFINITION") {
                    attributeValue = obj.attributeValue;
                }

                if (obj.attributeType.dataType.toUpperCase() == "DEFINITION") {
                    // fetch definition shortname
                    let definitionId = obj.attributeValue;
                    let definition = await getDefinitionByDefinitionId(definitionId);
                    let attrValue = definition.shortName;
                    attributeValue = attrValue;
                }

                if (obj.attributeType.dataType.toUpperCase() == "JSON") {

                    // attr value is a JSON obj e.g > [{"definitionId":13},{"definitionId":14}]
                    let attrValueObj = JSON.parse(obj.attributeValue);
                    let multiSelectString = '';
                    if (attrValueObj != null && attrValueObj.length > 0) {
                        let definitionArray = [];
                        if ('definitionId' in attrValueObj[0]) {
                            definitionArray = await getDefinitionsByDefinitionType(attrTypeName);
                        }
                        attrValueObj.forEach(async function (obj) {
                            if ('definitionId' in obj) {
                                // definitionArr contains only one item because filter will return only one definition
                                let definitionArr = definitionArray.filter(df => df.id == parseInt(obj.definitionId));
                                multiSelectString = multiSelectString.concat(definitionArr[0].definitionName);
                                multiSelectString = multiSelectString.concat(", ");

                                if (attrTypeName === "institution_type") {
                                    // multiSelectString = multiSelectString.substring(0, multiSelectString.length - 2);
                                    self.setState({ institution_type: multiSelectString })
                                }
                            }
                        })
                    }
                    attributeValue = multiSelectString;
                }

                if (attrTypeName != "institution_type") {
                    self.setState({ [attrTypeName]: attributeValue });
                }
                else if (attrTypeName === "institution_type") {
                    // removing last comma from institution types string
                    var institution_types = attributeValue.substring(0, attributeValue.length - 2);
                    self.setState({ [attrTypeName]: institution_types });
                }
            })

            this.setState({
                loading: false
            })

        }
        catch (error) {
            console.log(error);
            var errMsg = '';
            errMsg = "Unable to fetch institution details. Please see error logs for more details. ";

            this.setState({
                loading: false,
                modalHeading: 'Fail!',
                okButtonStyle: { display: 'none' },
                modalText: errMsg,
                modal: !this.state.modal
            });
        }
    }

    handleSubmit = async event => {

        let self = this;
        event.preventDefault();
        if (this.handleValidation()) {

            this.setState({
                // form_disabled: true,
                loading: true,
                loadingMsg: 'Saving Trees...'
            })

            var fetchedAttributes = this.fetchedLocation.attributes;
            fetchedAttributes.forEach(async function (obj) {
                delete obj.createdBy;

                // Number of years of partnership - partnership_years
                if (obj.attributeType.shortName === "partnership_years") {
                    self.isPartnershipYearsExists = true;
                    var years = self.state.partnership_years;
                    obj.attributeValue = String(years);
                }

                // School partnership_end_date
                if (obj.attributeType.shortName === "partnership_end_date") {
                    self.isEndDateExists = true;
                    obj.attributeValue = self.state.partnership_end_date;
                }

                // School - end_partnership_reason
                if (obj.attributeType.shortName === "end_partnership_reason") {
                    self.isEndReasonExists = true;
                    obj.attributeValue = self.state.end_partnership_reason;
                }
            })

            if (!this.isPartnershipYearsExists) {
                var attrType = await getLocationAttributeTypeByShortName("partnership_years");
                var attributeObject = new Object(); //top level obj
                attributeObject.attributeType = {};
                attributeObject.attributeType.attributeTypeId = attrType.attributeTypeId
                attributeObject.attributeType.uuid = attrType.uuid;
                attributeObject.attributeType.attributeName = attrType.attributeName;
                attributeObject.attributeType.shortName = attrType.shortName;
                attributeObject.attributeType.dataType = attrType.dataType;
                attributeObject.attributeType.dateCreated = attrType.dateCreated;
                var years = self.state.partnership_years;
                attributeObject.attributeValue = String(years);
                fetchedAttributes.push(attributeObject);
            }

            if (!this.isEndDateExists) {
                var attrType = await getLocationAttributeTypeByShortName("partnership_end_date");
                var attributeObject = new Object(); //top level obj
                attributeObject.attributeType = {};
                attributeObject.attributeType.attributeTypeId = attrType.attributeTypeId
                attributeObject.attributeType.uuid = attrType.uuid;
                attributeObject.attributeType.attributeName = attrType.attributeName;
                attributeObject.attributeType.shortName = attrType.shortName;
                attributeObject.attributeType.dataType = attrType.dataType;
                attributeObject.attributeType.dateCreated = attrType.dateCreated;
                attributeObject.attributeValue = this.state.partnership_end_date; // attributeValue obj
                fetchedAttributes.push(attributeObject);
            }

            if (!this.isEndReasonExists) {
                var attrType = await getLocationAttributeTypeByShortName("end_partnership_reason");
                var attributeObject = new Object(); //top level obj
                attributeObject.attributeType = {};
                attributeObject.attributeType.attributeTypeId = attrType.attributeTypeId
                attributeObject.attributeType.uuid = attrType.uuid;
                attributeObject.attributeType.attributeName = attrType.attributeName;
                attributeObject.attributeType.shortName = attrType.shortName;
                attributeObject.attributeType.dataType = attrType.dataType;
                attributeObject.attributeType.dateCreated = attrType.dateCreated;
                attributeObject.attributeValue = this.state.end_partnership_reason; // attributeValue obj
                fetchedAttributes.push(attributeObject);
            }

            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
            console.log(this.fetchedLocation);
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");

            delete this.fetchedLocation.createdBy;
            if (this.fetchedLocation.parentLocation != null && this.fetchedLocation.parentLocation != undefined) {
                delete this.fetchedLocation.parentLocation.createdBy;
            }

            updateLocation(this.fetchedLocation, this.fetchedLocation.uuid)
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

                            this.resetForm([]);

                        }
                        else if (String(responseData).includes("Error")) {

                            var submitMsg = '';
                            submitMsg = "Unable to submit Institution Closing form. \
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

    handleValidation() {
        // check each required state

        let formIsValid = true;
        // console.log(this.requiredFields);
        // this.setState({ hasError: this.checkValid(this.requiredFields) ? false : true });
        // formIsValid = this.checkValid(this.requiredFields);
        // this.setState({errors: this.errors});
        return formIsValid;
    }

    /**
     * verifies and notifies for the empty form fields
     */
    checkValid = (fields) => {

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
     * clear fields
     */
    resetForm = (fields) => {

        var fields = ["institution_id", "institution_name", "partnership_start_date", "partnership_end_date", "partnership_years", "institution_type", "end_partnership_reason"];

        for (let j = 0; j < fields.length; j++) {
            let stateName = fields[j];

            var el = document.getElementById(stateName).value = '';

            // for array object
            if (typeof this.state[stateName] === 'object') {
                this.state[stateName] = [];
            }

            // for text and others
            if (typeof this.state[stateName] != 'object') {
                this.state[stateName] = '';
            }
        }
    }

    render() {
        const page2style = this.state.page2Show ? {} : { display: 'none' };
        // for view mode
        const setDisable = this.state.viewMode ? "disabled" : "";
        const otherInstitutionStyle = this.isOtherInstitution ? {} : { display: 'none' };

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
                            <Container>
                                <Form id="institutionClosing" onSubmit={this.handleSubmit}>
                                    <Row>
                                        <Col md="6">
                                            <Card className="main-card mb-6">
                                                <CardHeader>
                                                    <i className="header-icon lnr-license icon-gradient bg-plum-plate"> </i>
                                                    <b>Institution Closing Form</b>
                                                </CardHeader>

                                            </Card>
                                        </Col>
                                    </Row>
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
                                                                        <FormGroup >
                                                                            <Label for="institution_id" >Select Institution ID</Label> <span class="errorMessage">{this.state.errors["institution_id"]}</span>
                                                                            <Select id="institution_id" name="institution_id" value={this.state.institution_id} onChange={(e) => this.handleChange(e, "institution_id")} options={this.state.institutions} />

                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="institution_name" >Name of Institution</Label> <span class="errorMessage">{this.state.errors["institution_name"]}</span>
                                                                            <Input name="institution_name" id="institution_name" value={this.state.institution_name} onChange={(e) => { this.inputChange(e, "institution_name") }} placeholder="Institution Name" maxLength="100" required disabled />
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="partnership_start_date" >Date partnership with Aahung was formed</Label> <span class="errorMessage">{this.state.errors["partnership_start_date"]}</span>
                                                                            <Input type="date" name="partnership_start_date" id="partnership_start_date" value={this.state.partnership_start_date} onChange={(e) => { this.inputChange(e, "partnership_start_date") }} max={moment().format("YYYY-MM-DD")} disabled />
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="partnership_end_date" >Date partnership with Aahung ended</Label> <span class="errorMessage">{this.state.errors["partnership_end_date"]}</span>
                                                                            <Input type="date" name="partnership_end_date" id="partnership_end_date" value={this.state.partnership_end_date} onChange={(e) => { this.inputChange(e, "partnership_end_date") }} max={moment().format("YYYY-MM-DD")} required />
                                                                        </FormGroup>
                                                                    </Col>

                                                                </Row>
                                                                <Row>
                                                                    <Col md="6" >
                                                                        <FormGroup >
                                                                            <Label for="partnership_years" >Number of years of partnership</Label> <span class="errorMessage">{this.state.errors["partnership_years"]}</span>
                                                                            <Input type="number" value={this.state.partnership_years} name="partnership_years" id="partnership_years" onChange={(e) => { this.inputChange(e, "partnership_years") }} max="99" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 2) }} placeholder="Enter number" disabled required></Input>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="institution_type" >Type of Institution</Label> <span class="errorMessage">{this.state.errors["institution_type"]}</span>
                                                                            <Input name="institution_type" id="institution_type" value={this.state.institution_type} onChange={(e) => { this.inputChange(e, "institution_type") }} placeholder="Institution Type" required disabled />
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup style={otherInstitutionStyle}>
                                                                            <Label for="institution_type_other" >Specify other type of institution</Label>
                                                                            <Input name="institution_type_other" id="institution_type_other" value={this.state.institution_type_other} onChange={(e) => { this.inputChange(e, "institution_type_other") }} placeholder="Specify other" />
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="end_partnership_reason" >Reason for end of partnership</Label> <span class="errorMessage">{this.state.errors["end_partnership_reason"]}</span>
                                                                            <Input type="textarea" name="end_partnership_reason" id="end_partnership_reason" value={this.state.end_partnership_reason} onChange={(e) => { this.inputChange(e, "end_partnership_reason") }} placeholder="Specify reason" required />
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>
                                                                {/* please don't remove this div unless you are adding multiple questions here*/}
                                                                {/* <div style={{height: '250px'}}><span>   </span></div> */}
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
                                                            <Button className="mb-2 mr-2" color="success" size="sm" type="submit" >Submit</Button>
                                                            <Button className="mb-2 mr-2" color="danger" size="sm" onClick={this.cancelCheck} >Clear</Button>
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

export default InstitutionClosing;