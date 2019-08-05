/**
 * @author Tahira Niazi
 * @email tahira.niazi@ihsinformatics.com
 * @create date 2019-07-30 12:53:25
 * @modify date 2019-07-30 12:53:25
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
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';


const options = [
    { value: 'Sindh', label: 'Sindh' },
    { value: 'Punjab', label: 'Punjab' },
    { value: 'Balochistan', label: 'Balochistan' },
    { value: 'Khyber Pakhtunkhwa', label: 'Khyber Pakhtunkhwa' },
];

const programsImplemented = [
    { label: 'CSA', value: 1},
    { label: 'Gender', value: 2},
    { label: 'LSBE', value: 3},
];

class SchoolDetailsB extends React.Component {

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);

        this.state = {
            activeTab: '1',
            selectedOption: null,
            page2Show: true,
        };


        this.cancelCheck = this.cancelCheck.bind(this);
    }

    componentDidMount() {
        // this.cancelCheck = this.cancelCheck.bind(this);
    }


    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    cancelCheck = () => {
        // $("page2").hide();
        this.setState({ page2Show: false });
    }

    handleChange = selectedOption => {
        this.setState({ selectedOption });
        console.log(`Option selected:`, selectedOption);
    };

    // handleOnSubmit = e => {
    //     e.preventDefault();
    //     // pass form data
    //     // get it from state
    //     const formData = {};
    //     this.finallySubmit(formData);
    //   };

    finallySubmit = formData => {
        console.log("Form submitted!");
    };

    handleSubmit(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        console.log(data.get('participantScore'));

        fetch('/api/form-submit-url', {
            method: 'POST',
            body: data,
        });

    }

    valueChange(e) {
        // alert("selected changed event fired!!");
        console.log(e.target.value);
        console.log(e.target.id);
        // alert(program_implemented_multi.value);

    }



    render() {

        const page2style = this.state.page2Show ? {} : { display: 'none' };
        const { selectedOption } = this.state;

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
                                            {/* <CardBody> */}

                                            {/* <h6><b>Parent Organization Registration</b></h6> */}

                                            {/* </CardBody> */}

                                            <CardHeader>
                                                <i className="header-icon lnr-license icon-gradient bg-plum-plate"> </i>
                                                <b>School Details Form - B</b>
                                            </CardHeader>

                                        </Card>
                                    </Col>

                                </Row>

                                {/* <br/> */}

                                <Row>
                                    <Col md="12">
                                        <Card className="main-card mb-6 center-col">
                                            <CardBody>

                                                {/* <CardTitle>Form Details</CardTitle> */}
                                                <Form id="testForm" >
                                                    <TabContent activeTab={this.state.activeTab}>
                                                        <TabPane tabId="1">
                                                            <Row>
                                                                {/* <Col md="3"></Col> */}
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="date" >Form Date</Label>

                                                                        <Input type="date" name="date_start" id="date_start" />


                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="3"></Col>
                                                            </Row>
                                                            <Row>
                                                                {/* <Col md="3"></Col> */}
                                                                <Col md="6">
                                                                    <FormGroup>
                                                                        <Label for="province" >Province</Label>
                                                                        {/* <Label for="count" >User ID</Label> */}
                                                                        <Select id="province"
                                                                            name="province"
                                                                            value={selectedOption}
                                                                            onChange={this.handleChange}
                                                                            options={options}
                                                                        />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="3"></Col>
                                                            </Row>
                                                            <Row>
                                                                {/* <Col md="3"></Col> */}
                                                                <Col md="6">
                                                                    <FormGroup>
                                                                        <Label for="district" >District</Label>
                                                                        <Select id="district"
                                                                            name="district"
                                                                            value={selectedOption}
                                                                            onChange={this.handleChange}
                                                                            options={options}
                                                                        />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="3"></Col>
                                                            </Row>
                                                            <Row>
                                                                {/* <Col md="3"></Col> */}
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="parent_organization_id" >Parent Organization ID</Label>
                                                                        <Select id="parent_organization_id"
                                                                            name="parent_organization_id"
                                                                            value={selectedOption}
                                                                            onChange={this.handleChange}
                                                                            options={options}
                                                                        />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="3"></Col>
                                                            </Row>
                                                            <Row>
                                                                {/* <Col md="3"></Col> */}
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="parent_organization_name" >Parent Organization Name</Label>
                                                                        <Input name="parent_organization_name" id="parent_organization_name" disabled />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="3"></Col>
                                                            </Row>
                                                            <Row>
                                                            {/* <Col md="3"></Col> */}
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="school_name" >School Name</Label>
                                                                        <Input name="school_name" id="school_name" placeholder="Enter school name" />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="3"></Col>
                                                                </Row>
                                                                <Row>
                                                                {/* <Col md="3"></Col> */}
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="school_id" >School ID</Label>
                                                                        <Input name="school_id" id="school_id" disabled />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="3"></Col>
                                                            </Row>
                                                            <Row>
                                                            {/* <Col md="3"></Col> */}
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="partnership_date" >Date partnership with Aahung was formed</Label>
                                                                        <Input type="date" name="date_start" id="date_start" />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="3"></Col>
                                                                </Row>
                                                                <Row>
                                                                {/* <Col md="3"></Col> */}
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="partnership_years" >Number of years of partnership</Label>
                                                                        <Input name="partnership_years" id="partnership_years" disabled />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="3"></Col>
                                                            </Row>
                                                            <Row>
                                                            {/* <Col md="3"></Col> */}
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="school_type" >Type of School</Label>
                                                                        <Input type="select" name="school_type" id="school_type">
                                                                            <option>Public</option>
                                                                            <option>Private</option>
                                                                            <option>Government Adopted by Private</option>
                                                                            <option>local Government Schools</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="3"></Col>
                                                                </Row>
                                                                <Row>
                                                                {/* <Col md="3"></Col> */}
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="school_sex" >Classification of School by Sex</Label>
                                                                        <Input type="select" name="school_sex" id="school_sex">
                                                                            <option>Girls</option>
                                                                            <option>Boys</option>
                                                                            <option>Co-ed</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="3"></Col>
                                                            </Row>
                                                            <Row>
                                                            {/* <Col md="3"></Col> */}
                                                                <Col md="6">
                                                                <FormGroup >
                                                                        <Label for="school_level" >Level of Program</Label>
                                                                        <Input type="select" onChange={this.valueChange} name="school_level" id="school_level">
                                                                            <option>Primary</option>
                                                                            <option>Secondary</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                    
                                                                </Col>
                                                                <Col md="3"></Col>
                                                                </Row>
                                                                {/* <Row>
                                                                <Col md="3"></Col>
                                                                <Col md="6">
                                                                <FormGroup >
                                                                        <Label for="program_implemented" >Type of program(s) implemented in school</Label>
                                                                        <Input type="select" name="program_implemented" id="program_implemented" multiple>
                                                                            <option>CSA</option>
                                                                            <option>Gender</option>
                                                                            <option>LSBE</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="3"></Col>
                                                            </Row> */}
                                                            <Row>
                                                                {/* <Col md="3"></Col> */}
                                                                <Col md="6">
                                                                <FormGroup >
                                                                        <Label for="program_implemented" >Type of program(s) implemented in school</Label>
                                                                        <ReactMultiSelectCheckboxes id="program_implemented" options={programsImplemented} />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="3"></Col>
                                                                </Row>
                                                                {/* please don't remove this div unless you are adding another form question here*/}
                                                                <div style={{height: '160px'}}><span>   </span></div>
                                                                

                                                        </TabPane>
                                                        <TabPane tabId="2" id="testTab">
                                                            <Row>
                                                            {/* <Col md="3"></Col> */}
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="donor_id" >Donor ID</Label>
                                                                        <Select id="donor_id"
                                                                            name="donor_id"
                                                                            value={selectedOption}
                                                                            onChange={this.handleChange}
                                                                            options={options}
                                                                        />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="3"></Col>
                                                                </Row>
                                                                <Row>
                                                                {/* <Col md="3"></Col> */}
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="donor_name" >Donor Name</Label>
                                                                        <Input name="donor_name" id="donor_name" disabled />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="3"></Col>
                                                            </Row>

                                                            <Row>
                                                            {/* <Col md="3"></Col> */}
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="school_tier" >School Tier</Label>
                                                                        <Input type="select" name="school_tier" id="school_tier">
                                                                            <option>New</option>
                                                                            <option>Running</option>
                                                                            <option>Exit</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="3"></Col>
                                                                </Row>
                                                                <Row>
                                                                {/* <Col md="3"></Col> */}
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="school_category_new" >New Schools Category</Label>
                                                                        <Input type="select" name="school_category_new" id="school_category_new">
                                                                            <option>Newly Inducted</option>
                                                                            <option>Implementation > 1 Cycle</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="3"></Col>
                                                            </Row>

                                                            <Row>
                                                            {/* <Col md="3"></Col> */}
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="school_category_running" >Running Schools Category</Label>
                                                                        <Input type="select" name="school_category_running" id="school_category_running">
                                                                            <option>Low Performing</option>
                                                                            <option>Average Performing</option>
                                                                            <option>High Performing</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="3"></Col>
                                                                </Row>
                                                                <Row>
                                                                {/* <Col md="3"></Col> */}
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="school_category_exit" >Exit Schools Category</Label>
                                                                        <Input type="select" name="school_category_exit" id="school_category_exit">
                                                                            <option>Initial Phase</option>
                                                                            <option>Mid Phase</option>
                                                                            <option>Exit Phase</option>
                                                                        </Input>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="3"></Col>
                                                            </Row>
                                                            <Row>
                                                            {/* <Col md="3"></Col> */}
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="point_person_name" >Name of point of contact for school</Label>
                                                                        <Input name="point_person_name" id="point_person_name" />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="3"></Col>
                                                                </Row>
                                                                <Row>
                                                                {/* <Col md="3"></Col> */}
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="point_person_contact" >Phone number for point of contact at school</Label>
                                                                        <Input name="point_person_contact" id="point_person_contact" maxLength="12" />
                                                                    </FormGroup>
                                                                </Col>

                                                            </Row>

                                                            <Row>
                                                            {/* <Col md="3"></Col> */}
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="point_person_email" >Email address for point of contact at school</Label>
                                                                        <Input type="email" name="point_person_email" id="point_person_email" />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="3"></Col>
                                                                </Row>
                                                                <Row>
                                                                {/* <Col md="3"></Col> */}
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="school_students" >Approximate number of students </Label>
                                                                        <Input type="number" name="school_students" id="school_students" maxLength="5" />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="3"></Col>

                                                            </Row>
                                                        </TabPane>
                                                    </TabContent>
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
                                                        {/* <div className="btn-actions-pane-left"> */}
                                                        <ButtonGroup size="sm">
                                                            <Button color="secondary" id="page1"
                                                                className={"btn-shadow " + classnames({ active: this.state.activeTab === '1' })}
                                                                onClick={() => {
                                                                    this.toggle('1');
                                                                }}
                                                            >Page 1</Button>
                                                            <Button color="secondary" id="page2" style={page2style}
                                                                className={"btn-shadow " + classnames({ active: this.state.activeTab === '2' })}
                                                                onClick={() => {
                                                                    this.toggle('2');
                                                                }}
                                                            >Page 2</Button>

                                                        </ButtonGroup>
                                                        {/* </div> */}
                                                    </Col>
                                                    <Col md="3">
                                                    </Col>
                                                    <Col md="3">
                                                    </Col>
                                                    <Col md="3">
                                                        {/* <div className="btn-actions-pane-left"> */}
                                                        <Button className="mb-2 mr-2" color="success" size="sm" type="submit" onClick="handleSubmit" >Submit</Button>
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
                            </Container>
                        </div>
                    </ReactCSSTransitionGroup>
                </Fragment>

            </div>
        );
    }

}

export default SchoolDetailsB;