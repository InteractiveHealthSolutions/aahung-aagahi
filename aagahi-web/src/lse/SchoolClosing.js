/**
 * @author Tahira Niazi
 * @email tahira.niazi@ihsinformatics.com
 * @create date 2019-08-19 15:26:53
 * @modify date 2019-08-19 15:26:53
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
import Select from 'react-select';
import CustomModal from "../alerts/CustomModal";
import moment from 'moment';
import { getObject, schoolDefinitionUuid } from "../util/AahungUtil.js";
import { getLocationsByCategory, getLocationByShortname, getLocationAttributesByLocation, getDefinitionsByDefinitionId, getDefinitionsByDefinitionType } from '../service/GetService';


const schools = [
    { value: 'khileahi', label: 'Karachi Learning High School' },
    { value: 'khibahcol', label: 'Bahria College Karsaz' },
    { value: 'khihbpub', label: 'Habib Public School' },
];

const programsImplemented = [
    { label: 'CSA', value: 'csa' },
    { label: 'Gender', value: 'gender' },
    { label: 'LSBE', value: 'lsbe' },
];

const options = [
    { label: 'Math', value: 'math' },
    { label: 'Science', value: 'science' },
    { label: 'English', value: 'def' },
    { label: 'Urdu', value: 'urdu', },
    { label: 'Social Studies', value: 'social_studies' },
    { label: 'Islamiat', value: 'islamiat' },
    { label: 'Art', value: 'art', },
    { label: 'Music', value: 'music' },
    { label: 'Other', value: 'other', },
];


const evaluators = [
    { value: 'sindh', label: 'Sindh' },
    { value: 'punjab', label: 'Punjab' },
    { value: 'balochistan', label: 'Balochistan' },
    { value: 'khyber_pakhtunkhwa', label: 'Khyber Pakhtunkhwa' },
];

const participantGenderOptions = [
    { value: 'female', label: 'Female' },
    { value: 'male', label: 'Male' },
    { value: 'other', label: 'Other' },
];


const participantAgeOptions = [
    { value: 'six_ten', label: '6-10' },
    { value: 'eleven_fifteen', label: '11-15' },
    { value: 'sixteen_twenty', label: '16-20' },
    { value: 'twentyone_twentyfive', label: '21-25' },
    { value: 'twentysix_thirty', label: '26-30' },
    { value: 'thirtyone_thirtyfive', label: '31-35' },
    { value: 'thirtysix_forty', label: '36-40' },
    { value: 'fortyone_fortyfive', label: '41-45' },
    { value: 'fortysix_fifty', label: '46-50' },
    { value: 'fiftyone_plus', label: '51+' },
];

const participantTypeOptions = [
    { value: 'students', label: 'Students' },
    { value: 'parents', label: 'Parents' },
    { value: 'teachers', label: 'Teachers' },
    { value: 'school_staff', label: 'School Staff' },
    { value: 'call_agents', label: 'Call Agents' },
    { value: 'other_professionals', label: 'Other Professionals' },
    { value: 'other', label: 'Other' },
];


const staffUsers = [
    { value: 'uuid1', label: 'Harry Potter' },
    { value: 'uuid2', label: 'Ron Weasley' },
    { value: 'uuid3', label: 'Hermione Granger' },
    { value: 'uuid4', label: 'Albus Dumbledore' },
];

class SchoolClosing extends React.Component {

    modal = false;

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);

        this.state = {
            locationObj: {},
            schools: [],
            participant_id: '',
            participant_name: '',
            dob: '123',
            sex: '',
            school_id: [],
            partnership_years: '',
            subject_taught: [], // all the form elements states are in underscore notation i.e variable names in codebook
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

        this.partnership_years = '1222';
    }

    componentDidMount() {

        // alert("School Details: Component did mount called!");
        window.addEventListener('beforeunload', this.beforeunload.bind(this));
        // alert(this.partnership_years);
        this.loadData();
    }

    componentWillUnmount() {

        // alert("School Details: ComponentWillUnMount called!");
        window.removeEventListener('beforeunload', this.beforeunload.bind(this));
    }

    /**
     * Loads data when the component is mounted
     */
    loadData = async () => {


        try {
            // let locationObj = await getLocationByShortname('BWLSE-81');
            // console.log(locationObj);
            let schools = await getLocationsByCategory(schoolDefinitionUuid);
            console.log(schools);

            if (schools != null && schools.length > 0) {
                this.setState({
                    schools: schools
                })
            }

        }
        catch (error) {
            console.log(error);
        }
    }


    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
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

        let errors = {};

        console.log(" ============================================================= ")
        // alert(this.state.program_implemented + " ----- " + this.state.school_level + "-----" + this.state.sex);
        // this.handleValidation();


        // receiving value directly from widget but it still requires widget to have on change methods to set it's value
        // alert(document.getElementById("date_start").value);
    }

    // for text and numeric questions
    inputChange(e, name) {


        // appending dash to contact number after 4th digit
        if (name === "donor_name") {
            this.setState({ donor_name: e.target.value });
            let hasDash = false;
            if (e.target.value.length == 4 && !hasDash) {
                this.setState({ donor_name: '' });
            }
            if (this.state.donor_name.length == 3 && !hasDash) {
                this.setState({ donor_name: '' });
                this.setState({ donor_name: e.target.value });
                this.setState({ donor_name: `${e.target.value}-` });
                this.hasDash = true;
            }
        }

        // appending dash after 4th position in phone number
        if (name === "point_person_contact") {
            this.setState({ point_person_contact: e.target.value });
            let hasDash = false;
            if (e.target.value.length == 4 && !hasDash) {
                this.setState({ point_person_contact: '' });
            }
            if (this.state.donor_name.length == 3 && !hasDash) {
                this.setState({ point_person_contact: '' });
                this.setState({ point_person_contact: e.target.value });
                this.setState({ point_person_contact: `${e.target.value}-` });
                this.hasDash = true;
            }
        }



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
    }

    // for single select
    valueChange = (e, name) => {
        this.setState({ sex: e.target.value });
        this.setState({ sex: e.target.value });
        this.setState({
            [name]: e.target.value
        });

        if (e.target.id === "primary_program_monitored")
            if (e.target.value === "csa") {
                this.setState({ isCsa: true });
                this.setState({ isGender: false });

            }
            else if (e.target.value === "gender") {
                this.setState({ isCsa: false });
                this.setState({ isGender: true });
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
        // alert(e.length);
        // alert(value[0].label + "  ----  " + value[0].value);

        this.setState({
            [name]: e
        });
    }

    callModal = () => {
        this.setState({ modal: !this.state.modal });
    }

    // for autocomplete single select
    async handleChange(e, name) {

        this.setState({
            [name]: e
        });

        console.log(this.state.selectedOption)
        console.log("=============")
        // console.log(`Option selected:`, school_id);
        console.log(this.state.school_id);

        try {
            if (name === "school_id") {
                let locationObj = await getLocationByShortname(e.shortName);
                console.log(locationObj);
                if (locationObj != null && locationObj != undefined) {
                    this.setState({
                        school_name: locationObj.locationName
                    })
                }
                let attributes = await getLocationAttributesByLocation(locationObj.uuid);
                this.autopopulateFields(attributes);
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
        let count = 0;
        locationAttributes.forEach(async function (obj) {
            let attrTypeName = obj.attributeType.shortName;
            if (attrTypeName === "partnership_years")
                return;


            if (obj.attributeType.dataType.toUpperCase() != "JSON" || obj.attributeType.dataType.toUpperCase() != "DEFINITION") {
                attributeValue = obj.attributeValue;

            }

            if (obj.attributeType.dataType.toUpperCase() == "DEFINITION") {
                // fetch definition shortname
                let definitionId = obj.attributeValue;
                let definition = await getDefinitionsByDefinitionId(definitionId);
                let attrValue = definition.shortname;
                attributeValue = obj.attributeValue;

            }

            if (obj.attributeType.dataType.toUpperCase() == "JSON") {

                // attr value is a JSON obj > [{"definitionId":13},{"definitionId":14}]
                let attrValueObj = JSON.parse(obj.attributeValue);
                let multiSelectString = '';
                if (attrValueObj != null && attrValueObj.length > 0) {
                    let definitionArray = [];
                    if ('definitionId' in attrValueObj[0]) {
                        definitionArray = await getDefinitionsByDefinitionType(attrTypeName);
                    }
                    attrValueObj.forEach(async function (obj) {
                        count++;
                        if ('definitionId' in obj) {

                            // definitionArr contains only one item because filter will return only one definition
                            let definitionArr = definitionArray.filter(df => df.id == parseInt(obj.definitionId));
                            if (count != attrValueObj.length) {
                                multiSelectString = multiSelectString.concat(", ");
                            }
                            multiSelectString = multiSelectString.concat(definitionArr[0].definitionName);
                            if (attrTypeName === "program_implemented")
                                self.setState({ program_implemented: multiSelectString })
                        }
                    })
                }
                attributeValue = multiSelectString;

            }

            if (attrTypeName != "program_implemented")
                self.setState({ [attrTypeName]: attributeValue });

        })
    }

    finallySubmit = formData => {
    };


    handleValidation() {
        // check each required state
        let errors = {};
        let formIsValid = true;
        console.log("showing csa_prompts")
        console.log(this.state.csa_prompts);
        if (this.state.csa_prompts === '') {
            formIsValid = false;
            errors["csa_prompts"] = "Cannot be empty";
            // alert(errors["csa_prompts"]);
        }

        // //Name
        // if(!fields["name"]){
        //   formIsValid = false;
        //   errors["name"] = "Cannot be empty";
        // }

        this.setState({ errors: errors });
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

        const monitoredCsaStyle = this.state.isCsa ? {} : { display: 'none' };
        const monitoredGenderStyle = this.state.isGender ? {} : { display: 'none' };
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
                                                <b>School Closing</b>
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
                                                    <span class="errorMessage"><u>Errors: <br /></u> Form has some errors. Please check for required or invalid fields.<br /></span>
                                                </div>

                                                <br />
                                                <Form id="testForm">
                                                    <fieldset >
                                                        <TabContent activeTab={this.state.activeTab}>
                                                            <TabPane tabId="1">
                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup inline>
                                                                            {/* TODO: autopopulate current date */}
                                                                            <Label for="date_start" >Form Date</Label>
                                                                            <Input type="date" name="date_start" id="date_start" value={this.state.date_start} onChange={(e) => { this.inputChange(e, "date_start") }} max={moment().format("YYYY-MM-DD")} required />
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="school_id" >School ID</Label>
                                                                            <Select id="school_id" name="school_id" value={this.state.school_id} onChange={(e) => this.handleChange(e, "school_id")} options={this.state.schools} />
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            {/* TODO: autopopulate */}
                                                                            <Label for="school_name" >School Name</Label>
                                                                            <Input name="school_name" id="school_name" value={this.state.school_name} disabled />
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup inline>
                                                                            <Label for="partnership_start_date" >Date partnership with Aahung was formed</Label>
                                                                            <Input type="date" name="partnership_start_date" id="partnership_start_date" value={this.state.partnership_start_date} onChange={(e) => { this.inputChange(e, "partnership_start_date") }} max={moment().format("YYYY-MM-DD")} required disabled />
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6">
                                                                        <FormGroup inline>
                                                                            <Label for="partnership_end_date" >Date partnership with Aahung ended</Label>
                                                                            <Input type="date" name="partnership_end_date" id="partnership_end_date" value={this.state.partnership_end_date} onChange={(e) => { this.inputChange(e, "partnership_end_date") }} max={moment().format("YYYY-MM-DD")} required />
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="partnership_years">Number of years of partnership</Label> <span class="errorMessage">{this.state.errors["partnership_years"]}</span>
                                                                            <Input type="number" value={this.state.partnership_years} name="partnership_years" id="partnership_years" onChange={(e) => { this.inputChange(e, "partnership_years") }} max="99" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 2) }} placeholder="Enter count in numbers"></Input>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            {/* TODO: autopopulate from school */}
                                                                            <Label for="school_level" >Level of Program</Label>
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
                                                                            {/* TODO: autopopulate from school */}
                                                                            <Label for="program_implemented" >Type of program(s) implemented in school</Label>
                                                                            <Input name="program_implemented" id="program_implemented" value={this.state.program_implemented} disabled />
                                                                            {/* <Input type="select" onChange={(e) => this.valueChange(e, "program_implemented")} value={this.state.program_implemented} name="program_implemented" id="program_implemented">
                                                                            <option value="csa">CSA</option>
                                                                            <option value="gender">Gender</option>
                                                                            <option value="lsbe">LSBE</option>
                                                                        </Input> */}
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6">
                                                                        <FormGroup >
                                                                            <Label for="school_tier" >School Tier</Label> <span class="errorMessage">{this.state.errors["school_tier"]}</span>
                                                                            <Input type="select" name="school_tier" id="school_tier" onChange={(e) => this.valueChange(e, "school_tier")}>
                                                                                <option value="school_tier_new">New</option>
                                                                                <option value="school_tier_running">Running</option>
                                                                                <option value="school_tier_exit">Exit</option>
                                                                            </Input>
                                                                        </FormGroup>
                                                                    </Col>

                                                                </Row>

                                                                <Row>
                                                                    <Col md="12">
                                                                        <FormGroup >
                                                                            <Label for="end_partnership_reason" >Reason for end of partnership</Label> <span class="errorMessage">{this.state.errors["end_partnership_reason"]}</span>
                                                                            <Input type="textarea" name="end_partnership_reason" id="end_partnership_reason" value={this.state.end_partnership_reason} onChange={(e) => { this.inputChange(e, "end_partnership_reason") }} maxLength="250" placeholder="Enter reason" />
                                                                        </FormGroup>
                                                                    </Col>

                                                                </Row>

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
                                                        <Button className="mb-2 mr-2" color="success" size="sm" type="submit" onClick={this.handleSubmit} disabled={setDisable}>Submit</Button>
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
                            </Container>

                        </div>
                    </ReactCSSTransitionGroup>
                </Fragment>

            </div>
        );
    }
}

export default SchoolClosing;