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

/**
 * @author Tahira Niazi
 * @email tahira.niazi@ihsinformatics.com
 * @create date 2019-08-01 13:41:42
 * @modify date 2019-08-01 13:41:42
 * @desc [description]
 */

 

import React, { Fragment } from "react";
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import { Input, Label, CustomInput, Form, FormGroup, Container, Card, CardBody, TabContent, TabPane, CardTitle, Row, Col } from 'reactstrap';
import { Button, CardHeader, ButtonGroup } from 'reactstrap';
import "../index.css"
import classnames from 'classnames';
import Select from 'react-select';

const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
  ];

class TestPage extends React.Component {

    

    constructor(props) {
        super(props);

        // this.onUnload = this.onUnload.bind(this);

        this.toggle = this.toggle.bind(this);

        this.state = {
            activeTab: '1',
            selectedOption: null,
        };
    }

    handleChange = selectedOption => {
        this.setState({ selectedOption });
        console.log(`Option selected:`, selectedOption);
      };

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    // componentWillUnmount() {
    //     window.removeEventListener('onbeforeunload', this.onUnload);
    // }

    // onUnload() {
    //     this.context.router.push('/mainMenu');
    // }

    // handleOnSubmit = e => {
    //     e.preventDefault();
    //     // pass form data
    //     // get it from state
    //     const formData = {};
    //     this.finallySubmit(formData);
    //   };

    finallySubmit = formData => {
        alert("Form submitted!");
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

    cancelCourse = () => {

        document.getElementById("testForm").reset();
        alert(document.getElementById("testForm"));
        console.log(document.getElementById("testForm"));
    }

    render() {
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
                                                <b>Parent Organization Registration</b>

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
                                                <Form id="testForm">
                                                    <TabContent activeTab={this.state.activeTab}>
                                                        <TabPane tabId="1">
                                                        <Row>
                                                            <Col md="6">
                                                                <FormGroup>
                                                                    <Label for="count" >Participant Score</Label>
                                                                    {/* <Col sm={10}> */}
                                                                    <Input name="participantScore" id="count" placeholder="input score" />
                                                                    {/* </Col> */}

                                                                </FormGroup>
                                                            {/* </Col> */}
                                                            {/* <Col md="6"> */}
                                                                <FormGroup>
                                                                    <div>
                                                                        <Label for="exampleSelectMulti">School Cateogry</Label>
                                                                        <CustomInput type="checkbox" id="exampleCustomCheckbox"
                                                                            label="Only Girls" />
                                                                        <CustomInput type="checkbox" id="exampleCustomCheckbox2"
                                                                            label="Only Boys" />
                                                                        <CustomInput type="checkbox" id="exampleCustomCheckbox3"
                                                                            label="Co-ed"
                                                                            disabled />
                                                                    </div>
                                                                </FormGroup>
                                                                <FormGroup>
                                                                    <Label for="exampleCustomMutlipleSelect">Type of Institution</Label>
                                                                    <CustomInput type="select" id="exampleCustomMutlipleSelect"
                                                                        name="customSelect"
                                                                        multiple>
                                                                        <option value="">Select</option>
                                                                        <option>Medical</option>
                                                                        <option>Nursing</option>
                                                                        <option>Midwifery</option>
                                                                        <option>Other</option>
                                                                    </CustomInput>

                                                                </FormGroup>
                                                                <FormGroup>
                                                                    <div>
                                                                        <Label for="exampleSelectMulti">School Cateogry</Label>
                                                                        <CustomInput type="checkbox" id="exampleCustomCheckbox"
                                                                            label="Only Girls" />
                                                                        <CustomInput type="checkbox" id="exampleCustomCheckbox2"
                                                                            label="Only Boys" />
                                                                        <CustomInput type="checkbox" id="exampleCustomCheckbox3"
                                                                            label="Co-ed"
                                                                            disabled />
                                                                    </div>
                                                                </FormGroup>
                                                                <FormGroup>
                                                                    <Label for="exampleCustomMutlipleSelect">Type of Institution</Label>
                                                                    <CustomInput type="select" id="exampleCustomMutlipleSelect"
                                                                        name="customSelect"
                                                                        multiple>
                                                                        <option value="">Select</option>
                                                                        <option>Medical</option>
                                                                        <option>Nursing</option>
                                                                        <option>Midwifery</option>
                                                                        <option>Other</option>
                                                                    </CustomInput>

                                                                </FormGroup>
                                                            </Col>
                                                            <Col md="6">
                                                                <FormGroup>
                                                                    <Label for="count" >Participant Score</Label>
                                                                    
                                                                    <Input name="participantScore" id="count" placeholder="input score" />
                                                                    

                                                                </FormGroup>
                                                            </Col>
                                                            </Row> 
                                                        </TabPane>
                                                        <TabPane tabId="2">
                                                            <Col md="6">
                                                                <FormGroup>
                                                                    <Label for="exampleSelectMulti">Select Partipant Cateogry</Label>
                                                                    <Input type="select" name="selectMulti" id="exampleSelectMulti" multiple>
                                                                        <option>A</option>
                                                                        <option>B</option>
                                                                        <option>C</option>
                                                                        <option>D</option>
                                                                        <option>E</option>
                                                                    </Input>

                                                                </FormGroup>
                                                            </Col>
                                                            <Col md="6">
                                                                <FormGroup>
                                                                    <div>
                                                                        <Label for="exampleSelectMulti">School Cateogry</Label>
                                                                        <CustomInput type="checkbox" id="exampleCustomCheckbox"
                                                                            label="Only Girls" />
                                                                        <CustomInput type="checkbox" id="exampleCustomCheckbox2"
                                                                            label="Only Boys" />
                                                                        <CustomInput type="checkbox" id="exampleCustomCheckbox3"
                                                                            label="Co-ed"
                                                                            disabled />
                                                                    </div>
                                                                </FormGroup>
                                                            </Col>
                                                        </TabPane>
                                                        <TabPane tabId="3">
                                                            <Col md="6">
                                                                <FormGroup>
                                                                    <Label for="exampleCustomMutlipleSelect">Type of Institution</Label>
                                                                    <CustomInput type="select" id="exampleCustomMutlipleSelect"
                                                                        name="customSelect"
                                                                        multiple>
                                                                        <option value="">Select</option>
                                                                        <option>Medical</option>
                                                                        <option>Nursing</option>
                                                                        <option>Midwifery</option>
                                                                        <option>Other</option>
                                                                    </CustomInput>

                                                                </FormGroup>
                                                                <FormGroup>
                                                                    <Label for="exampleText">Text Area</Label>
                                                                    <Input type="textarea" name="text" id="exampleText" />
                                                                    
                                                                </FormGroup>
                                                                <FormGroup>
                                                                <Select
                                                                    value={selectedOption}
                                                                    onChange={this.handleChange}
                                                                    options={options}
                                                                />
                                                                </FormGroup>
                                                            </Col>
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
                                                            <Button color="secondary"
                                                                className={"btn-shadow " + classnames({ active: this.state.activeTab === '1' })}
                                                                onClick={() => {
                                                                    this.toggle('1');
                                                                }}
                                                            >Page 1</Button>
                                                            <Button color="secondary"
                                                                className={"btn-shadow " + classnames({ active: this.state.activeTab === '2' })}
                                                                onClick={() => {
                                                                    this.toggle('2');
                                                                }}
                                                            >Page 2</Button>
                                                            <Button color="secondary"
                                                                className={"btn-shadow " + classnames({ active: this.state.activeTab === '3' })}
                                                                onClick={() => {
                                                                    this.toggle('3');
                                                                }}
                                                            >Page 3</Button>
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
                                                    <Button className="mb-2 mr-2" color="danger" size="sm" type="reset" onClick={this.cancelCourse} >Clear</Button>
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

export default TestPage;