import React, { Component } from "react";
import { MDBListGroup, MDBListGroupItem, MDBTable, MDBTableBody, MDBTableHead, MDBContainer, MDBRow, MDBCol, MDBTabPane, MDBTabContent, MDBNav, MDBNavItem, MDBNavLink, MDBIcon } from
"mdbreact";
import { Input, Label, Form, FormGroup, Container, Card, CardBody, TabContent, 
    TabPane , Row, Col, Button, CardHeader, ButtonGroup } from 'reactstrap';
    
    class ReportsMainPage extends Component {

        state = {
            activeItemJustified: "1"
        }
        
        toggleJustified = tab => e => {

            if (this.state.activeItemJustified !== tab) {
                this.setState({
                    activeItemJustified: tab
                });
            }
        };
        
    render() {
    return (
      <MDBContainer>
        <MDBNav tabs className="nav-justified" color='indigo'>
          <MDBNavItem>
            <MDBNavLink to="#" active={this.state.activeItemJustified === "1"} onClick={this.toggleJustified("1")} role="tab" >
              <MDBIcon icon="form" /> LSE
            </MDBNavLink>
          </MDBNavItem>
          <MDBNavItem>
            <MDBNavLink to="#" active={this.state.activeItemJustified === "2"} onClick={this.toggleJustified("2")} role="tab" >
              <MDBIcon icon="form" /> SRHM
            </MDBNavLink>
          </MDBNavItem>
          <MDBNavItem>
            <MDBNavLink to="#" active={this.state.activeItemJustified === "3"} onClick={this.toggleJustified("3")} role="tab" >
              <MDBIcon icon="form" /> COMMS
            </MDBNavLink>
          </MDBNavItem>
        </MDBNav>
        <MDBTabContent
          className="card"
          activeItem={this.state.activeItemJustified}
        >
          <MDBTabPane tabId="1" role="tabpanel">
          <MDBTable bordered>
            <MDBTableBody>
              <tr>
                <td>
                  {/* <MDBContainer> */}
                    <MDBListGroup style={{ width: "22rem" }}>
                      <MDBListGroupItem href="#" active>Report 1</MDBListGroupItem>
                      <MDBListGroupItem href="#">Report 2</MDBListGroupItem>
                      <MDBListGroupItem href="#">Report 3</MDBListGroupItem>
                      <MDBListGroupItem href="#">Report 4</MDBListGroupItem>
                      <MDBListGroupItem href="#">Report 5</MDBListGroupItem>
                    </MDBListGroup>

                  {/* </MDBContainer> */}
                </td>
                
              </tr>

            </MDBTableBody>
          </MDBTable>
          </MDBTabPane>
          <MDBTabPane tabId="2" role="tabpanel">
          <MDBTable bordered>
            <MDBTableBody>
              <tr>
                <td>
                  <MDBContainer>
                    <MDBListGroup style={{ width: "22rem" }}>
                      <MDBListGroupItem href="#" active>Report 1</MDBListGroupItem>
                      <MDBListGroupItem href="#">Report 2</MDBListGroupItem>
                      <MDBListGroupItem href="#">Report 3</MDBListGroupItem>
                      <MDBListGroupItem href="#">Report 4</MDBListGroupItem>
                      <MDBListGroupItem href="#">Report 5</MDBListGroupItem>
                    </MDBListGroup>
                  </MDBContainer>
                </td>
              </tr>
            </MDBTableBody>
          </MDBTable>
          </MDBTabPane>
          <MDBTabPane tabId="3" role="tabpanel">
          <MDBTable bordered>
            <MDBTableBody>
              <tr>
                <td>
                  <MDBContainer>
                    <MDBListGroup style={{ width: "22rem" }}>
                      <MDBListGroupItem href="#" active>Report 1</MDBListGroupItem>
                      <MDBListGroupItem href="#">Report 2</MDBListGroupItem>
                      <MDBListGroupItem href="#">Report 3</MDBListGroupItem>
                      <MDBListGroupItem href="#">Report 4</MDBListGroupItem>
                      <MDBListGroupItem href="#">Report 5</MDBListGroupItem>
                    </MDBListGroup>
                  </MDBContainer>
                </td>
              </tr>
            </MDBTableBody>
          </MDBTable>
          </MDBTabPane>
        </MDBTabContent>
      </MDBContainer>
    );
  }
}

export default ReportsMainPage;