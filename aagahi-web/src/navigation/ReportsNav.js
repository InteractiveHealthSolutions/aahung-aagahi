import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch, MemoryRouter } from 'react-router-dom';
import { Label} from 'reactstrap';
import { MDBMask, MDBView, MDBNavbar, MDBNavbarBrand, MDBSelect, MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBCardHeader, MDBBtn } from "mdbreact";
import { MDBListGroup, MDBListGroupItem, MDBTable, MDBTableBody, MDBTableHead, MDBContainer, MDBRow, MDBCol, MDBTabPane, MDBTabContent, MDBNav, MDBNavItem, MDBNavLink, MDBIcon, MDBDatePicker  } from
"mdbreact";
import  "../index.css";
import { getAllFormTypes, getDefinitionsByDefinitionType} from '../service/GetService';
import Select from 'react-select';
import classnames from 'classnames';
import { apiUrl } from "../util/AahungUtil.js";
import { getDistrictsByProvince, location, getDistrictsByMultipleProvinces } from "../util/LocationUtil.js";
import { getReportByName } from "../util/ReportsListUtil.js";
import { RangeDatePicker } from '@y0c/react-datepicker';
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
import 'moment/locale/ko';
var serverAddress = apiUrl;

class ReportsNav extends Component {

  constructor(props) {
    super(props);
    
    this.rest_header = localStorage.getItem('auth_header'); 

    this.state = {
      formTypes: [],
      districtArray: [],
      errors: {},
      firstFilterName: '',
      secondFilterName: '',
      firstFilterOptionSelected: '',
      secondFilterOptionSelected: '',
      firstFilterOptions: [],
      secondFilterOptions: [],
      activeItemJustified: "1",
      isDumps: false,
      noFilter: false
    }

    this.formTypeUuid = '';
    this.requestURL = '';
    this.errors = {};
    this.hasFirstFilter = false;
    this.hasSecondFilter = false;
  }

  componentDidMount() {
      this.loadData();
  }

  /**
   * Loads data when the component is mounted
   */
  loadData = async () => {
      try {
          let formTypeList = await getAllFormTypes();
          if (formTypeList != null && formTypeList.length > 0) {
              this.setState({
                  formTypes: formTypeList
              })
          }
      }
      catch (error) {
          console.log(error);
      }
  }

  // for autocomplete single select
  handleChange(e, name) {

    this.setState({
      [name]: e
    });

    if (name === "form_type") {
      this.formTypeUuid = e.uuid;
    }

    if(name === "province"){
      let districts = getDistrictsByProvince(e.id); // sending province integer id
      console.log(districts);
      this.setState({
          districtArray : districts,
          district: []
      })
    }
  };

  // for multi select
  valueChangeMulti(e, name) {
        
    console.log(e);

    this.setState({
        [name]: e
    });

    if (name === "province") {
        let districts = getDistrictsByMultipleProvinces(e);
        console.log(districts);
        this.setState({
            districtArray : districts,
            district: []
        })

    }
  }

  toggleJustified = tab => e => {
    if (this.state.activeItemJustified !== tab) {
      this.setState({
        className: {active: this.state.activeItemJustified === tab},
        activeItemJustified: tab
      });
    }
    
    this.setState({
      isDumps: tab === "4" ? true : false
    })
  };

  downloadFormData = () => {
    this.requestURL = serverAddress + "/report/form/" + this.formTypeUuid;
    fetch(this.requestURL, { 'headers': {
      'Authorization': sessionStorage.getItem('auth_header'),
      }} )
      .then(response => {
        response.blob().then(blob => {
          let url = window.URL.createObjectURL(blob);
          let a = document.createElement('a');
          a.href = url;
          a.download = 'form_data.csv';
          a.click();
        });
    });
  }

  downloadData(e, entityName) {
		this.requestURL = serverAddress + "/report/" + entityName + ".csv";
		fetch(this.requestURL, { 'headers': {
            'Authorization': sessionStorage.getItem('auth_header'),
            }} )
			.then(response => {
				response.blob().then(blob => {
					let url = window.URL.createObjectURL(blob);
					let a = document.createElement('a');
					a.href = url;
					a.download = entityName + '.csv';
					a.click();
				});
		});
  }

  onChange = (date) => {
    console.log(date);
  }

  async handleCheckboxChange(e, reportName) {

    this.setState({
      firstFilterName: '',
      secondFilterName: '',
      firstFilterOptionSelected: '',
      secondFilterOptionSelected: '',
      firstFilterOptions: [],
      secondFilterOptions: []
    })
		
		let reportArray = getReportByName(reportName);
		let report = reportArray[0];
    console.log(report);
    
    if(report.filters.length == 0) {
      this.hasFirstFilter = false;
      this.hasSecondFilter = false;
      this.setState({
        noFilter: true
      })
    }
    else {
      this.hasFirstFilter = report.filters.length > 0 ? true : false;
      this.hasSecondFilter = report.filters.length > 1 ? true : false;
      this.setState({
        noFilter: false
      })
    }

    if(this.hasFirstFilter) {
      let firstOptions = await getDefinitionsByDefinitionType(report.filters[0]);
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>> Printing first filter options");
      console.log(firstOptions);
      this.setState({
        firstFilterName: this.capitalize(report.filters[0]),
        firstFilterOptions: firstOptions
      })
    }

    if(this.hasSecondFilter) {
      let secondOptions = await getDefinitionsByDefinitionType(report.filters[1]);
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>> Printing second filter options");
      console.log(secondOptions);
      this.setState({
        secondFilterName: this.capitalize(report.filters[1]),
        secondFilterOptions: secondOptions
      })
    }
	}

	capitalize(filterName) {
		var words = filterName.split('_');
		for (let i=0; i < words.length; i++) {
			words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
		}
		return words.join(' ');
	}

  render() {

    const cautionDivStyle =  this.state.isDumps ? {display: 'block'} : { display: 'none'};
    const secondCautionDivStyle =  this.state.isDumps || this.state.noFilter ? {display: 'block'} : { display: 'none'};
    const firstFilterDisplay = this.hasFirstFilter &&  !this.state.isDumps ? {display: 'block'} : { display: 'none'};
    const filterDivStyle =  !this.state.isDumps ? {display: 'block'} : { display: 'none'};
    const secondFilterDisplay = this.hasSecondFilter ? "block" : "none";
    
    const overlay = (
      <div
        id="sidenav-overlay"
        style={{ backgroundColor: "transparent" }}
        onClick={this.handleTogglerClick}
      />
    );
      return (
        <MemoryRouter>
        <div id="apppage">
        <MDBView>
        <MDBMask className="gradient">
          <div>
        <MDBNavbar style={{backgroundColor: "#522A71"}} dark expand="md">
          <MDBNavbarBrand>
            <strong className="white-text">Aahung - Reports Dashboard</strong>
          </MDBNavbarBrand>
          <MDBBtn size="md" style={{backgroundColor: "#ef6c00", marginLeft: "63%"}} >Home<MDBIcon icon="home" className="ml-2" /></MDBBtn>
        </MDBNavbar>
        <MDBContainer id="containerID">
          <MDBRow>
            <MDBCol md="4">
              <MDBCard style={{ width: "23rem", marginTop: "1rem", overflow: "auto", maxHeight: "450px", height:"700px" }}>
                <MDBCardHeader style={{backgroundColor: "#522A71", color: "white"}}>Filters</MDBCardHeader>
                  <MDBCardBody>
                  <div id="topFilterDiv" style={filterDivStyle}>
                    <div >
                    <div class="md-form">
                    
                    {/* <RangeDatePicker startPlaceholder="Start Date" endPlaceholder="End Date"  onChange={this.onChange}/> */}
                    </div>

                      Province
                      <ReactMultiSelectCheckboxes id="province" name="province" value={this.state.province} onChange={(e) => this.valueChangeMulti(e, "province")} options={location.provinces} required/>
                    </div>

                    <div style={{marginTop: "1rem"}}>
                      District
                      <ReactMultiSelectCheckboxes id="district" name="district" value={this.state.district} onChange={(e) => this.valueChangeMulti(e, "district")} options={this.state.districtArray} required/>
                    </div>

                  </div>

                    <div style={cautionDivStyle}>
                      <i class="icon fa fa-exclamation-triangle" style={{fontSize: "80px", color: "grey", marginLeft: "35%"}}/>
                      <label>Filters are not applicable for this selection</label>
                    </div>
                  </MDBCardBody>

                  <MDBCardHeader style={{backgroundColor: "#522A71", color: "white"}}>Advanced Filters</MDBCardHeader>
                  <MDBCardBody>
                    <div id="topAdvancedFilterDiv" style={filterDivStyle}>
                      <div id="firstFilterDiv" style={firstFilterDisplay}>
                      <Label className="dumpLabel">Filter 1: {this.state.firstFilterName}</Label>
                      <ReactMultiSelectCheckboxes id="firstFilterOptionSelected" name="filter" value={this.state.firstFilterOptionSelected} styles={{fontWeight: '600', width: '20px !important'}} onChange={(e) => this.handleChange(e, "firstFilterOptionSelected")} options={this.state.firstFilterOptions} required/>
                      </div>

                      <div id="secondFilterDiv" style={{marginTop: "1rem", display: secondFilterDisplay }}>
                      <Label className="dumpLabel">Filter 2: {this.state.secondFilterName}</Label>
                      <ReactMultiSelectCheckboxes id="secondFilterOptionSelected" name="filter" value={this.state.secondFilterOptionSelected} styles={{fontWeight: '600'}} onChange={(e) => this.handleChange(e, "secondFilterOptionSelected")} options={this.state.secondFilterOptions} required/>
                      </div>
                    </div>

                    <div style={secondCautionDivStyle}>
                      <i class="icon fa fa-exclamation-triangle" style={{fontSize: "80px", color: "grey", marginLeft: "35%"}}/>
                      <label>Advanced Filters are not applicable for this selection</label>
                    </div>
                  </MDBCardBody>

              </MDBCard>
              </MDBCol>

              <MDBCol md="8" >

                <MDBTable>
                  <MDBTableBody>
                    <tr>
                    <td><select id="viewAs" style={ {width: "18rem", marginLeft: "27rem"} } className="form-control" disabled={this.state.isDumps}>
                    <option>-- View Reports As --</option>
                    <option value="1">HTML</option>
                    <option value="2">CSV</option>
                    <option value="3">PDF</option>  
                  </select></td></tr>
                  </MDBTableBody>
                </MDBTable>
              <MDBCard style={{marginTop: "0.2rem", height: "50px;"}}>
              <MDBNav tabs className="nav-pills nav-justified">
            
            <MDBNavItem >
              <MDBNavLink className={"nav-link Ripple-parent " + classnames({active2: this.state.activeItemJustified === '1'})} to="#" onClick={this.toggleJustified("1")} role="tab" >
                LSE
              </MDBNavLink>
            </MDBNavItem>
            <MDBNavItem>
              <MDBNavLink className={"nav-link Ripple-parent " + classnames({active2: this.state.activeItemJustified === '2'})} to="#" onClick={this.toggleJustified("2")} role="tab" >
              SRHM
              </MDBNavLink>
            </MDBNavItem>
            <MDBNavItem>
              <MDBNavLink className={"nav-link Ripple-parent " + classnames({active2: this.state.activeItemJustified === '3'})} to="#" onClick={this.toggleJustified("3")} role="tab" >
                COMMS
              </MDBNavLink>
            </MDBNavItem>
            <MDBNavItem>
              <MDBNavLink className={"nav-link Ripple-parent " + classnames({active2: this.state.activeItemJustified === '4'})} to="#" onClick={this.toggleJustified("4")} role="tab" >
                Data Dumps
              </MDBNavLink>
            </MDBNavItem>
          </MDBNav>
          </MDBCard>

          <MDBTabContent style={{ marginTop: "1rem", overflow: "auto", maxHeight: "300px" }}  className="card" activeItem={this.state.activeItemJustified}>
            {/* LSE */}
            <MDBTabPane tabId="1" role="tabpanel">
            <MDBTable bordered table-fixed className="reportTable">
              <MDBTableHead style={{backgroundColor: "rgb(228, 228, 228)", color: "black", fontWeight: "600"}}>
                <tr className="textWeight">
                  <th style={{width: "2rem"}}></th>
                  <th style={{width: "10rem"}}>LSE Report Name</th>
                  <th>Report Description</th>
                </tr>
              </MDBTableHead>
              <MDBTableBody>
                <tr className="textWeight">
                    <td>
                      <div class="pretty p-icon p-curve p-pulse">
                        <input type="radio" id="schoolsEligibleRunningTier" value={this.state.schoolsEligibleRunningTier} name="lseReports" defaultChecked= { false}  onChange={(e) => this.handleCheckboxChange(e, "Schools Eligible For Running Tier")} ></input>
                          <div class="state p-info-o">
                            <i class="icon fa fa-check"></i>
                              <label></label>
                          </div>
                      </div>
                    </td>
                    <td>Schools Eligible For Running Tier</td>
                    <td>Provide information on which schools are eligible to move from the new to the running tier		</td>
                </tr>
                <tr className="textWeight">
                    <td><div class="pretty p-icon p-curve p-pulse">
                        <input type="radio" id="schoolsEligibleExitTier" value={this.state.schoolsEligibleExitTier} name="lseReports" defaultChecked= { false}  onChange={(e) => this.handleCheckboxChange(e, "Schools Eligible For Exit Tier")} ></input>
                          <div class="state p-info-o">
                            <i class="icon fa fa-check"></i>
                              <label></label>
                          </div>
                      </div></td>
                    <td>Schools Eligible For Exit Tier</td>
                    <td>Concerning the Institution Details in SRHM</td>
                </tr>
                <tr className="textWeight">
                    <td><div class="pretty p-icon p-curve p-pulse">
                        <input type="radio" id="communicationsTrainingSummary" value={this.state.communicationsTrainingSummary} name="lseReports" defaultChecked= { false}  onChange={(e) => this.handleCheckboxChange(e, "Communications Training Summary")} ></input>
                          <div class="state p-info-o">
                            <i class="icon fa fa-check"></i>
                              <label></label>
                          </div>
                      </div></td>
                    <td>Communications Training Summary</td>
                    <td>This report will provide information on trainings conducted by Communications		</td>
                </tr>
              </MDBTableBody>
            </MDBTable>
            </MDBTabPane>

            {/* SRHM */}
            <MDBTabPane tabId="2" role="tabpanel">
            <MDBTable bordered table-fixed className="reportTable">
              <MDBTableHead style={{backgroundColor: "rgb(228, 228, 228)", color: "black", fontWeight: "600"}}>
                <tr className="textWeight">
                  <th style={{width: "2rem"}}></th>
                  <th style={{width: "10rem"}}>LSE Report Name</th>
                  <th>Report Description</th>
                </tr>
              </MDBTableHead>
              <MDBTableBody>
                <tr className="textWeight">
                    <td><div class="pretty p-icon p-curve p-pulse">
                        <input type="radio" name="radio66"></input>
                          <div class="state p-info-o">
                            <i class="icon fa fa-check"></i>
                              <label></label>
                          </div>
                      </div></td>
                    <td>SRHM Report Name</td>
                    <td>SRHM ki koi bht bari si report ka naam</td>
                </tr>
                <tr className="textWeight">
                    <td><div class="pretty p-icon p-curve p-pulse">
                        <input type="radio" name="radio66"></input>
                          <div class="state p-info-o">
                            <i class="icon fa fa-check"></i>
                              <label></label>
                          </div>
                      </div></td>
                    <td>SRHM Report 2</td>
                    <td>SOme random Description of the report</td>
                </tr>
                <tr>
                    <td><div class="pretty p-icon p-curve p-pulse">
                        <input type="radio" name="radio66"></input>
                          <div class="state p-info-o">
                            <i class="icon fa fa-check"></i>
                              <label></label>
                          </div>
                      </div></td>
                    <td>SRHM Report 3 3 3</td>
                    <td>RAndom Description</td>
                </tr>
              </MDBTableBody>
            </MDBTable>
            </MDBTabPane>

          {/* COMMS */}
          <MDBTabPane tabId="3" role="tabpanel">
            <MDBTable bordered table-fixed className="reportTable">
              <MDBTableHead style={{backgroundColor: "rgb(228, 228, 228)", color: "black", fontWeight: "600"}}>
                <tr className="textWeight">
                  <th style={{width: "2rem"}}></th>
                  <th style={{width: "10rem"}}>LSE Report Name</th>
                  <th>Report Description</th>
                </tr>
              </MDBTableHead>
              <MDBTableBody>
              <tr className="textWeight">
                    <td><div class="pretty p-icon p-curve p-pulse">
                        <input type="radio" name="radio66"></input>
                          <div class="state p-info-o">
                            <i class="icon fa fa-check"></i>
                              <label></label>
                          </div>
                      </div></td>
                    <td>Report Name 1 2 </td>
                    <td>Report ka bara sa name about something and asomethingReport ka bara sa name about something and asomething</td>
                </tr>
                <tr className="textWeight">
                    <td><div class="pretty p-icon p-curve p-pulse">
                        <input type="radio" name="radio66"></input>
                          <div class="state p-info-o">
                            <i class="icon fa fa-check"></i>
                              <label></label>
                          </div>
                      </div></td>
                    <td>Report 3 4</td>
                    <td>Dosri report ka bohat bara sa name</td>
                </tr>
                <tr className="textWeight">
                    <td><div class="pretty p-icon p-curve p-pulse">
                        <input type="radio" name="radio66"></input>
                          <div class="state p-info-o">
                            <i class="icon fa fa-check"></i>
                              <label></label>
                          </div>
                      </div></td>
                    <td>Report 4 5 6</td>
                    <td>Report ka bara sa name about something and asomething</td>
                </tr>
              </MDBTableBody>
            </MDBTable>
            </MDBTabPane>

            {/* Dumps */}
            <MDBTabPane tabId="4" role="tabpanel">
            <MDBTable bordered table-fixed className="reportTable">
              <MDBTableHead style={{backgroundColor: "rgb(228, 228, 228)", color: "black", fontWeight: "600"}}>
                <tr className="textWeight">
                  <th style={{width: "15rem"}}>Data</th>
                  <th style={{width: "10rem"}}>Download Dump</th>
                </tr>
              </MDBTableHead>
              <MDBTableBody>
                <tr className="textWeight">
                    <td>Form Data: 
                    <Select id="form_type" name="form_type" value={this.state.form_type} styles={{fontWeight: '600'}} onChange={(e) => this.handleChange(e, "form_type")} options={this.state.formTypes} required/>
                    </td>
                    
                    <td><br/><MDBBtn size="sm" color="orange" rounded="true" outline="true" onClick={this.downloadFormData}>Download<MDBIcon icon="download" className="ml-2" /></MDBBtn></td>
                </tr>
                <tr className="textWeight">
                    <td>Users</td>
                    <td><MDBBtn size="sm" color="orange" rounded="true" outline="true" onClick={(e) => this.downloadData(e, "users")}>Download<MDBIcon icon="download" className="ml-2" /></MDBBtn></td>
                </tr>
                <tr className="textWeight">
                    <td>Locations</td>
                    <td><MDBBtn size="sm" color="orange" rounded="true" outline="true" onClick={(e) => this.downloadData(e, "locations")}>Download<MDBIcon icon="download" className="ml-2" /></MDBBtn></td>
                </tr>
                <tr className="textWeight">
                    <td>Projects</td>
                    <td><MDBBtn size="sm" color="orange" rounded="true" outline="true" onClick={(e) => this.downloadData(e, "projects")}>Download<MDBIcon icon="download" className="ml-2" /></MDBBtn></td>
                </tr>
                <tr className="textWeight">
                    <td>Donors: </td>
                    <td><MDBBtn size="sm" color="orange" rounded="true" outline="true" onClick={(e) => this.downloadData(e, "donors")}>Download<MDBIcon icon="download" className="ml-2" /></MDBBtn></td>
                </tr>
                <tr className="textWeight">
                    <td>Definitions: </td>
                    <td><MDBBtn size="sm" color="orange" rounded="true" outline="true" onClick={(e) => this.downloadData(e, "definitions")}>Download<MDBIcon icon="download" className="ml-2" /></MDBBtn></td>
                </tr>
                <tr className="textWeight">
                    <td>Elements </td>
                    <td><MDBBtn size="sm" color="orange" rounded="true" outline="true" onClick={(e) => this.downloadData(e, "elements")}>Download<MDBIcon icon="download" className="ml-2" /></MDBBtn></td>
                    {/* <td></td> */}
                </tr>
                
                
              </MDBTableBody>
            </MDBTable>
            </MDBTabPane>

          </MDBTabContent>
          <MDBBtn size="md" style={{backgroundColor: "#ef6c00", marginLeft: "80%"}} disabled={this.state.isDumps}>Download<MDBIcon icon="download" className="ml-2" /></MDBBtn>
              </MDBCol>
          </MDBRow>

            
          </MDBContainer>
          </div>
        </MDBMask>
        </MDBView>
        </div>
        </MemoryRouter>
      );
    }
  }

export default ReportsNav;