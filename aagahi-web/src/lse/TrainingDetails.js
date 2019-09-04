/**
 * @author Tahira Niazi
 * @email tahira.niazi@ihsinformatics.com
 * @create date 2019-08-21 20:29:08
 * @modify date 2019-08-21 20:29:08
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
import $ from 'jquery';
import CustomModal from "../alerts/CustomModal";
import { useBeforeunload } from 'react-beforeunload';
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
import { location, getDistrictsByProvince} from "../util/LocationUtil.js";
import moment from 'moment';

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
    { label: 'Urdu', value: 'urdu' },
    { label: 'Social Studies', value: 'social_studies'},
    { label: 'Islamiat', value: 'islamiat'},
    { label: 'Art', value: 'art' },
    { label: 'Music', value: 'music'},
    { label: 'Other', value: 'other' },
];


const schools = [
    { value: 'hogwarts_school', label: 'Hogwarts School' },
    { value: 'diagon_alley', label: 'Diagon Alley' },
    { value: 'hogwarts_witchcraft', label: 'Hogwarts School of Witchcraft' },
    { value: 'hogwarts_castle', label: 'Hogwarts Castle School' },
];

const monitors = [
    { value: 'uuid1', label: 'Harry Potter' },
    { value: 'uuid2', label: 'Ron Weasley' },
    { value: 'uuid3', label: 'Hermione Granger' },
    { value: 'uuid4', label: 'Albus Dumbledore' },
];

const particpants = [
    { value: 'par1', label: 'Harry Potter', location: "Hogwarts School", pre_test_score: "" },
    { value: 'par2', label: 'Ron Weasley', location: "Diagon Alley", pre_test_score: "" },
    { value: 'par3', label: 'Hermione Granger', location: "Hogwarts School of Witchcraft", pre_test_score: "" },
    { value: 'par4', label: 'Albus Dumbledore', location: "Hogwarts School", pre_test_score: "" },
    { value: 'par5', label: 'Harry Potter', location: "Hogwarts School of Witchcraft", pre_test_score: "" }
];

const formatOptionLabel = ({ value, label, location }) => (
    <div style={{ display: "flex" }}>
      <div>{label} |</div>
      <div style={{ marginLeft: "10px", color: "#9e9e9e" }}>
        {location}
      </div>
    </div>
  );

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

class TrainingDetails extends React.Component {

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
            participant_name: [],
            donor_name: '',
            activeTab: '1',
            page2Show: true,
            viewMode: false,
            editMode: false,
            errors: {},
            isCsa: true,
            isGender: false,
            hasError: false,
            users: [],
            participants: [],
            participantForm: [],
        };


        this.cancelCheck = this.cancelCheck.bind(this);
        this.callModal = this.callModal.bind(this);
        this.valueChangeMulti = this.valueChangeMulti.bind(this);
        this.valueChange = this.valueChange.bind(this);
        this.calculateScore = this.calculateScore.bind(this);
        this.getObject = this.getObject.bind(this);
        this.inputChange = this.inputChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.createUI = this.createUI.bind(this);

        this.myRef = React.createRef();
        
    }

    componentDidMount() {

        // TODO: checking view mode, view mode will become active after the form is populated
        // this.setState({
            // school_id : this.getObject('khyber_pakhtunkhwa', schools, 'value'), // autopopulate in view: for single select autocomplete
            // monitor: [{value: 'sindh'}, {value: 'punjab'}], // // autopopulate in view: for multi-select autocomplete
            // viewMode : true,    
        // })

        // alert("School Details: Component did mount called!");
        window.addEventListener('beforeunload', this.beforeunload.bind(this));



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

        let errors = {};
        console.log("printing users");
        console.log(this.state.users);

        // TODO: check this piece of code
        var node = document.getElementById('pre_pre_score_0');
        // node.dispatchEvent(event);

        // alert(node.value);

        // alert(this.state.users.length);

        const partss = [...this.state.users];
        

        var part_two = [];

        for (let i = 0; i < partss.length; i++) {

            var pre_pre_score_node = document.getElementById(`pre_pre_score_${ i }`);
            // alert(pre_pre_score_node.value);
            this.setState(prevState => ({ 
                users: [...prevState.users, { name: "Tahira Niazi", location: partss[i].location, pre_test_score : pre_pre_score_node.value }]
            }))
            part_two[i] =  {name: partss[i].name, location: partss[i].location, pre_test_score : pre_pre_score_node.value};
        }
        
        console.log("2nd >>>>>>>>>>>>>>>>>> printing part_two");
        console.log(part_two);

        this.setState(prevState => ({
            users: [...prevState.users, []]
        }))

        

        this.setState(prevState => ({
            users: [...prevState.users, part_two]
        }))

        console.log("3rd >>>>>>>>>>>>>>>>>> printing part_two");
        console.log(this.state.users);


        var jsonData = {};
        jsonData['training_venue'] =  this.state.training_venue;
        jsonData['participants'] =  part_two;

        console.log("4th >>>>>>>>>>>>>>>>>> printing json data");
        console.log(jsonData);

        console.log(" ============================================================= ")
        // alert(this.state.program_implemented + " ----- " + this.state.school_level + "-----" + this.state.sex);
        console.log("program_implemented below:");
        console.log(this.state.program_implemented);
        console.log("school_level below:");
        console.log(this.state.school_level);
        console.log("school_id below:");
        console.log(this.state.school_id);
        console.log(this.getObject('khyber_pakhtunkhwa', schools, 'value'));
        console.log(this.state.donor_name);
        console.log(this.state.date_start);
        console.log(this.state.users);
        this.handleValidation();

        this.setState({
            hasError : true
        })


        // receiving value directly from widget but it still requires widget to have on change methods to set it's value
        // alert(document.getElementById("date_start").value);
    }

    // for text and numeric questions
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
        
        // appending dash after 4th position in phone number
        if(name === "point_person_contact") {
            this.setState({ point_person_contact: e.target.value});
            let hasDash = false;
            if(e.target.value.length == 4 && !hasDash) {
                this.setState({ point_person_contact: ''});
            }
            if(this.state.donor_name.length == 3 && !hasDash) {
                this.setState({ point_person_contact: ''});
                this.setState({ point_person_contact: e.target.value});
                this.setState({ point_person_contact: `${e.target.value}-` });
                this.hasDash = true;
            }
        }

        if(name === "date_start") {
            this.setState({ date_start: e.target.value});
        }
    }


    // setting autocomplete single select tag when receiving value from server
    // value is the uuid, arr is the options array, prop either label/value, mostly value because it is uuid
    getObject(value, arr, prop) {
        for(var i = 0; i < arr.length; i++) {
            if(arr[i][prop] === value) {
                // alert(arr[i]);
                return arr[i];

            }
        }
        return -1; //to handle the case where the value doesn't exist
    }

    // for single select
    valueChange = (e, name) => {
        this.setState ({sex : e.target.value });
        this.setState ({sex : e.target.value });
        this.setState({
            [name]: e.target.value
        });

        if(e.target.id === "primary_program_monitored")
        if(e.target.value === "csa") {
            // alert("csa program selected");
            this.setState({isCsa : true });
            this.setState({isGender : false });
            
        }
        else if(e.target.value === "gender") {
            this.setState({isCsa : false });
            this.setState({isGender : true });
        }

    }

    // calculate score from scoring questions (radiobuttons)
    calculateScore = (e, name) => {
        this.setState({
            [name]: e.target.value
        });
        // alert(e.target.name);
        // alert(e.target.id);
        // alert(e.target.value);

    }

    // for multi select and for React-Select isMulti
    valueChangeMulti(e, name) {
        // console.log(e);
        // alert(e.length);
        // alert(value[0].label + "  ----  " + value[0].value);
        
        this.setState({
            [name]: e
        });
    
        if(name === "participant_name") {

            let difference = this.state.participant_name.filter(x => !e.includes(x));
            console.log('Printing differnece ==============');  

            if(difference.length > 0 ) {
                // alert("difference greater than 0");
                // alert(difference[0].label);
                for (var i = this.state.users.length - 1; i >= 0; --i) {
                    if (this.state.users[i].label == difference[0].label) {
                        // alert("parcipant name matched");
                        this.state.users.splice(i,1);
                    }
                }
            }
            console.log('Removed: ', difference);  


            if( e != null) {
                if(e.length > 0 ) {
                    // alert("e is not null");
                    this.createUI(e);
                    // alert(this.state.users.length);
                    
                }
            }
            else if(e == null) {
                // alert("e is null");
                this.setState({
                    participantForm: [],
                    users : []
                });
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

        if(name === "province"){
            let districts = getDistrictsByProvince(e.id); // sending province integer id
            console.log(districts);
            this.setState({
                districtArray : districts
            })
        }
    };

    createUI(e){
        // alert("in create UI method");
        // alert(e[0].label);
        // alert(e[0].location);
        // this.setState(prevState => ({ 
        //     users: [...prevState.users, { firstName: e.label, lastName: e.location }]
        // }))

        
        var array = this.state.participantForm;
        array = [];

        // TODO: check this, figure out when to make it persistent and when to empty
        this.setState(prevState => ({ 
            users: []
        }))

        for (let i = 0; i < e.length; i++) {

            this.setState(prevState => ({ 
                users: [...prevState.users, { name: e[i].label, location: e[i].location }]
            }))

            array.push(
            <div><div key={i} class="monitoringScoreBox">
            <Container >
                <Row>
                    <Col md="6">
                        <Label><h6><b>{e[i].label} </b></h6></Label><Label style={{color: "#9e9e9e"}}><h7><b> ({e[i].location})</b></h7></Label>
                    </Col>
                </Row>
                <Row>
                <Col md="6">
                    <Label >Pre-Test Score</Label> 
                    <Input placeholder="Enter Pre-Test Score" type="number" ref={el => this[`pre_pre_score_${ i }`] = el} id={ `pre_pre_score_${ i }` } name="pre_test_score"  onChange={this.handleParticipant.bind(this, i)} onInput = {(e) =>{ e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,3)}} max="999" min="1" />
                </Col>
                <Col md="6">
                    <Label >Pre-Test Score %</Label> 
                    <Input placeholder="Enter Score %" ref={this[`pre_score_${ i }`] } id={ `pre_score_${ i }` } name="pre_score_percentage" onChange={this.handleParticipant.bind(this, i)}  maxLength="5"/>
                </Col>
                </Row>

                <Row>
                <Col md="6">
                <Label >Post-Test Score</Label> 
                    <Input placeholder="Enter Post-Test Score" type="number" ref={this[`post_post_score_${ i }`]} id={`post_post_score_${ i }`} name="post_test_score"  onChange={this.handleParticipant.bind(this, i)} onInput = {(e) =>{ e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,3)}} max="999" min="1" />
                </Col>
                <Col md="6">
                    <Label >Post-Test Score %</Label> 
                    <Input placeholder="Enter Score %" ref={this[`post_score_${ i }`]} id={ `post_score_${ i }` } name="post_score_percentage" onChange={this.handleParticipant.bind(this, i)} maxLength="5"/>
                </Col>
                </Row>

            
                <br/>
            </Container>
            
            
           </div>
           <div style={{height: '20px'}}><span>   </span></div>
           </div>
           )   
        }

        this.setState({
            participantForm: array
        });

     }

     handleParticipant(i, e) {
         
      const { name, value } = e.target;
      let users = [...this.state.users];
      users[i] = {...users[i], [name]: value};
      this.setState({ users });
      console.log(this.state.users)
   }
    

    // handleOnSubmit = e => {
    //     e.preventDefault();
    //     // pass form data
    //     // get it from state
    //     const formData = {};
    //     this.finallySubmit(formData);
    //   };

    finallySubmit = formData => {
        // alert("Form submitted!");
    };


    handleValidation(){
        // check each required state
        let errors = {};
        let formIsValid = true;
        console.log("showing csa_prompts")
        console.log(this.state.csa_prompts);
        if(this.state.csa_prompts === '') {
            formIsValid = false;
            // alert("csa_prompts is not selected");
            errors["csa_prompts"] = "Cannot be empty";
            // alert(errors["csa_prompts"]);
        }

        // //Name
        // if(!fields["name"]){
        //   formIsValid = false;
        //   errors["name"] = "Cannot be empty";
        // }
    
        this.setState({errors: errors});
        // alert(this.state.errors);
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
                                                <b>Training Details</b>
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

                                                <Form id="testForm">
                                                    <fieldset >
                                                        <TabContent activeTab={this.state.activeTab}>
                                                            <TabPane tabId="1">
                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup inline>
                                                                        {/* TODO: autopopulate current date */}
                                                                            <Label for="date_start" >Form Date</Label>
                                                                            <Input type="date" name="date_start" id="date_start" value={this.state.date_start} onChange={(e) => {this.inputChange(e, "date_start")}} max={moment().format("YYYY-MM-DD")} required/>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup>
                                                                            <Label for="province" >Province</Label> <span class="errorMessage">{this.state.errors["province"]}</span>
                                                                            <Select id="province" name="province" value={this.state.province} onChange={(e) => this.handleChange(e, "province")} options={location.provinces} required/>
                                                                        </FormGroup>
                                                                    </Col>

                                                                    <Col md="6">
                                                                        <FormGroup> 
                                                                            <Label for="district" >District</Label> <span class="errorMessage">{this.state.errors["district"]}</span>
                                                                            <Select id="district" name="district" value={this.state.district} onChange={(e) => this.handleChange(e, "district")} options={this.state.districtArray} required/>
                                                                        </FormGroup>
                                                                    </Col>

                                                                </Row>

                                                                <Row>
                                                                    <Col md="6">
                                                                        <FormGroup > 
                                                                                <Label for="training_venue" >Training Venue</Label> <span class="errorMessage">{this.state.errors["training_venue"]}</span>
                                                                                <Input type="select" onChange={(e) => this.valueChange(e, "training_venue")} value={this.state.training_venue} name="training_venue" id="training_venue">
                                                                                    <option>Select... </option>
                                                                                    <option value="aahung_office">Aahung Office</option>
                                                                                    <option value="school_campus">School Campus</option>
                                                                                    <option value="other_training_facility">Other Training Facility</option>
                                                                                    <option value="hotel_restaurant">Hotel/Restaurant</option>
                                                                                </Input>
                                                                            </FormGroup>
                                                                            
                                                                    </Col>
                                                                    <Col md="6">
                                                                        <FormGroup > 
                                                                            <Label for="training_id" >Training ID</Label> <span class="errorMessage">{this.state.errors["training_id"]}</span>
                                                                            <Input name="training_id" id="training_id" value={this.state.training_id} onChange={(e) => { this.inputChange(e, "training_id") }} />
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                <Col md="6">
                                                                    <FormGroup > 
                                                                            <Label for="training_type" >Type of Training</Label> <span class="errorMessage">{this.state.errors["training_type"]}</span>
                                                                            <Input type="select" onChange={(e) => this.valueChange(e, "training_type")} value={this.state.training_type} name="training_type" id="training_type">
                                                                                <option>Initial Training</option>
                                                                                <option>Refresher Training</option>
                                                                                <option>MT Training</option>
                                                                                <option>Roll Out/Step Down</option>
                                                                            </Input>
                                                                        </FormGroup>
                                                                        
                                                                </Col>

                                                                <Col md="6">
                                                                    <FormGroup > 
                                                                            <Label for="school_level_trained" >Level of school(s) being trained</Label>
                                                                            <Input type="select" onChange={(e) => this.valueChange(e, "school_level_trained")} value={this.state.school_level_trained} name="school_level_trained" id="school_level_trained">
                                                                                <option value="primary">Primary</option>
                                                                                <option value="secondary">Secondary</option>
                                                                            </Input>
                                                                        </FormGroup>                                                                       
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                {/* TODO: apply skip logic */}
                                                                    <FormGroup > 
                                                                            <Label for="program_type_trained" >Type of program</Label>
                                                                            <Input type="select" onChange={(e) => this.valueChange(e, "program_type_trained")} value={this.state.program_type_trained} name="program_type_trained" id="program_type_trained">
                                                                                <option>CSA</option>
                                                                                <option>Gender</option>
                                                                                <option>LSBE</option>
                                                                            </Input>
                                                                        </FormGroup>                                                                       
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="trainer" >Name(s) of Trainer(s)</Label> <span class="errorMessage">{this.state.errors["trainer"]}</span>
                                                                        <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e, "trainer")} value={this.state.trainer} id="trainer" options={monitors} required/>
                                                                    </FormGroup>                                                                    
                                                                </Col>

                                                                <Col>
                                                                    <FormGroup >
                                                                        <Label for="training_days" >Number of Days</Label>  <span class="errorMessage">{this.state.errors["training_days"]}</span>
                                                                        <Input type="number" value={this.state.training_days} name="training_days" id="training_days" onChange={(e) => {this.inputChange(e, "training_days")}} max="99" min="1" onInput = {(e) =>{ e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,2)}} placeholder="Enter number of days"></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                <FormGroup >
                                                                        <Label for="school_id" >Select Schools</Label> <span class="errorMessage">{this.state.errors["school_id"]}</span>
                                                                        <Select onChange={(e) => this.valueChangeMulti(e, "school_id")} value={this.state.school_id} id="school_id" options={schools} isMulti required/>
                                                                    </FormGroup>                                                            
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="participant_name" >Participant(s)</Label> <span class="errorMessage">{this.state.errors["participant_name"]}</span>
                                                                        <Select onChange={(e) => this.valueChangeMulti(e, "participant_name")} value={this.state.participant_name} id="participant_name" options={particpants} formatOptionLabel={formatOptionLabel} isMulti required/>
                                                                    </FormGroup>  
                                                                </Col>
                                                            </Row>  

                                                            <div>
                                                            { 
                                                                this.state.participantForm.map(input => {
                                                                    return input
                                                                })

                                                                
                                                            }
                                                                    
                                                            </div>
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
                            </Container>
                        </div>
                    </ReactCSSTransitionGroup>
                </Fragment>
            </div>
        );
    }
}

export default TrainingDetails;