import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';
import classnames from 'classnames';
import { MDBBtn, MDBCard, MDBCardBody, MDBCardHeader, MDBCol, MDBContainer, MDBIcon, MDBMask, MDBNav, MDBNavbar, MDBNavbarBrand, MDBNavItem, MDBNavLink, MDBRow, MDBTabContent, MDBTable, MDBTableBody, MDBTableHead, MDBTabPane, MDBView } from "mdbreact";
import moment from 'moment';
import React, { Component } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MemoryRouter } from 'react-router-dom';
import Select from 'react-select';
import { Input, Label } from 'reactstrap';
import RequirePrivilege from '../access/RequirePrivilege';
import openIconic from "../img/open-iconic.svg";
import "../index.css";
import { getAllFormTypes, getDefinitionsByDefinitionType } from '../service/GetService';
import { apiUrl, capitalize } from "../util/AahungUtil.js";
import { getDistrictsByMultipleProvinces, getDistrictsByProvince, location } from "../util/LocationUtil.js";
import { getReportByComponent, getReportByName } from "../util/ReportsListUtil.js";
var serverAddress = apiUrl;


class ReportsNav extends Component {

  constructor(props) {
    super(props);

    this.rest_header = localStorage.getItem('auth_header');

    this.state = {
      start_date: new Date(),
      end_date: new Date(),
      district: [], // for capturing the selected options for districts
      province: [], // for capturing the selected options for provinces
      view_as: '',
      formTypes: [],
      lseReports: [],
      srhmReports: [],
      commsReports: [],
      districtArray: [],
      firstFilterName: '',
      secondFilterName: '',
      firstFilterOptionSelected: [],
      secondFilterOptionSelected: [],
      firstFilterOptions: [],
      secondFilterOptions: [],
      activeItemJustified: "1",
      isDumps: false,
      noFilter: false
    }

    this.valueChangeMulti = this.valueChangeMulti.bind(this);
    this.valueChange = this.valueChange.bind(this);
    this.formTypeUuid = '';
    this.requestURL = '';
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
          formTypes: formTypeList,
          lseReports: getReportByComponent("lse"),
          srhmReports: getReportByComponent("srhm"),
          commsReports: getReportByComponent("comms")
        })
      }


      /**
       *  Toggling the tabs based on privileges e.g user with View LSE reports should see LSE tab and it shoud be highlighted by default
       */
      var user = JSON.parse(sessionStorage.getItem('user'));
      var userRoles = user.userRoles;
      // check the if the user has the required privilge
      for (let i = 0; i < userRoles.length; i++) {
        var rolePrivileges = userRoles[i].rolePrivileges;
        var lseReportPrivilege = rolePrivileges.filter(privilege => privilege.privilegeName === "View LSE Reports");
        var srhmReportPrivilege = rolePrivileges.filter(privilege => privilege.privilegeName === "View SRHM Reports");
        var commsReportPrivilege = rolePrivileges.filter(privilege => privilege.privilegeName === "View Comms Reports");

        if (lseReportPrivilege != null && lseReportPrivilege.length > 0) {
          this.setState({
            activeItemJustified: "1"
          })
        }

        if (srhmReportPrivilege != null && srhmReportPrivilege.length > 0) {
          this.setState({
            activeItemJustified: "2"
          })
        }

        if (commsReportPrivilege != null && commsReportPrivilege.length > 0) {
          this.setState({
            activeItemJustified: "3"
          })
        }
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

    if (name === "province") {
      let districts = getDistrictsByProvince(e.id); // sending province integer id
      console.log(districts);
      this.setState({
        districtArray: districts,
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
      if (e !== null && e.length > 0) {
        let districts = getDistrictsByMultipleProvinces(e);
        console.log(districts);
        this.setState({
          districtArray: districts,
          district: []
        })
      }
      else {
        this.setState({
          districtArray: [],
          district: []
        })
      }
    }
  }

  // for single select
  valueChange = (e, name) => {

    this.setState({
      [name]: e.target.value
    });
  }

  handleDate(date, name) {
    this.setState({
      [name]: date
    });
  };

  toggleJustified = tab => e => {
    if (this.state.activeItemJustified !== tab) {
      this.setState({
        className: { active: this.state.activeItemJustified === tab },
        activeItemJustified: tab
      });
    }

    this.setState({
      isDumps: tab === "4" ? true : false
    })
  };

  downloadFormData = () => {
    this.requestURL = serverAddress + "/report/form/" + this.formTypeUuid;
    fetch(this.requestURL, {
      'headers': {
        'Authorization': sessionStorage.getItem('auth_header'),
      }
    })
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
    fetch(this.requestURL, {
      'headers': {
        'Authorization': sessionStorage.getItem('auth_header'),
      }
    })
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

  generateProvinceFilter() {
    var concatenatedProvinces = "";
    // generating province filter
    if (this.state.province === null || this.state.province === undefined || this.state.province.length === 0) {
      location.provinces.forEach(function (province) {
        concatenatedProvinces = concatenatedProvinces.concat(province.name + ",");
      })
      concatenatedProvinces = concatenatedProvinces.substring(0, concatenatedProvinces.length - 1);
    }
    else {
      var provincesArray = this.state.province;
      provincesArray.forEach(function (province) {
        concatenatedProvinces = concatenatedProvinces.concat(province.name + ",");
      })
      concatenatedProvinces = concatenatedProvinces.substring(0, concatenatedProvinces.length - 1);
    }

    return concatenatedProvinces;
  }

  generateDistrictFilter() {
    var concatenatedDistricts = "";
    // generating district filter
    if (this.state.district === null || this.state.district === undefined || this.state.district.length === 0) {
      location.districts.forEach(function (city) {
        concatenatedDistricts = concatenatedDistricts.concat(city.label + ",");
      })
      concatenatedDistricts = concatenatedDistricts.substring(0, concatenatedDistricts.length - 1);
    }
    else {
      var districtsArray = this.state.district;
      districtsArray.forEach(function (city) {
        concatenatedDistricts = concatenatedDistricts.concat(city.label + ",");
      })
      concatenatedDistricts = concatenatedDistricts.substring(0, concatenatedDistricts.length - 1);
    }

    return concatenatedDistricts;
  }

  generateFirstFilter() {
    var optionsFirst = '';
    var selectedFirstFilters = this.state.firstFilterOptionSelected;

    if (selectedFirstFilters !== null && selectedFirstFilters.length > 0) {
      selectedFirstFilters.forEach(function (option) {
        optionsFirst = optionsFirst.concat(option.label + ",");
      })
      optionsFirst = optionsFirst.substring(0, optionsFirst.length - 1);
    }
    else {
      var allFirstFilters = this.state.firstFilterOptions;
      allFirstFilters.forEach(function (option) {
        optionsFirst = optionsFirst.concat(option.label + ",");
      })
      optionsFirst = optionsFirst.substring(0, optionsFirst.length - 1);
    }

    return optionsFirst;
  }

  generateSecondFilter() {
    var optionsSecond = '';
    var selectedSecondFilters = this.state.secondFilterOptionSelected;

    if (selectedSecondFilters !== null && selectedSecondFilters.length > 0) {
      selectedSecondFilters.forEach(function (option) {
        optionsSecond = optionsSecond.concat(option.label + ",");
      })
      optionsSecond = optionsSecond.substring(0, optionsSecond.length - 1);
    }
    else {
      var allSecondFilters = this.state.secondFilterOptions;
      allSecondFilters.forEach(function (option) {
        optionsSecond = optionsSecond.concat(option.label + ",");
      })
      optionsSecond = optionsSecond.substring(0, optionsSecond.length - 1);
    }


    return optionsSecond;
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
      secondFilterOptions: [],
      reportName: reportName
    })

    let reportArray = getReportByName(reportName);
    let report = reportArray[0];
    console.log(report);

    if (report.filters.length === 0) {
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

    if (this.hasFirstFilter) {
      let firstOptions = await getDefinitionsByDefinitionType(report.filters[0]);
      this.setState({
        firstFilterName: capitalize(report.filters[0]),
        firstFilterOptions: firstOptions
      })
    }

    if (this.hasSecondFilter) {
      let secondOptions = await getDefinitionsByDefinitionType(report.filters[1]);

      this.setState({
        secondFilterName: capitalize(report.filters[1]),
        secondFilterOptions: secondOptions
      })
    }

    if (report.filters.length !== 0 && this.state.firstFilterOptions.length > 0) {
      alertify.set('notifier', 'position', 'bottom-left');
      alertify.set('notifier', 'delay', 5);
      alertify.set('notifier', 'position', 'bottom-left');
      alertify.success('<p><b>Filters are updated. Apply filters to download report.</b></p>');
    }
  }

  /**
   * Downloads selected report with the applicable filters. If no filters are applied, all filters are selected by default. 
   */
  downloadReport() {

    if (this.handleValidation()) {
      var viewAsType = this.state.view_as;
      var reportName = this.state.reportName;
      var startDate = moment(this.state.start_date).format('YYYY-MM-DD');
      var endDate = moment(this.state.end_date).format('YYYY-MM-DD');
      var concatenatedProvinces = this.generateProvinceFilter();
      var concatenatedDistricts = this.generateDistrictFilter();

      // attaching the static filters for generating url
      var urlWithParams = "?start_date=" + startDate + "&end_date=" + endDate + "&province=" + concatenatedProvinces + "&city=" + concatenatedDistricts + "&";
      var currentReport = getReportByName(this.state.reportName)[0];

      // generating the dynamic filters (first and second if applicable)
      // -- generating first filter --
      if (currentReport.filters.length !== 0) {
        if (this.hasFirstFilter) {
          var optionsFirst = this.generateFirstFilter();
          // attaching first filter to url
          urlWithParams = urlWithParams.concat(currentReport.filters[0] + "=" + optionsFirst + "&");
        }

        // -- generating second filter --
        if (this.hasSecondFilter) {
          var optionsSecond = this.generateSecondFilter();
          // attaching second filter to url
          urlWithParams = urlWithParams.concat(currentReport.filters[1] + "=" + optionsSecond);
        }
        else {
          urlWithParams = urlWithParams.substring(0, urlWithParams.length - 1);
        }

        // final report url
        this.requestURL = serverAddress + "/report/" + viewAsType + "/" + reportName;
        urlWithParams = this.requestURL.concat(urlWithParams);
        console.log(urlWithParams);
      }
      else {
        this.requestURL = serverAddress + "/report/" + viewAsType + "/" + reportName;
        urlWithParams = this.requestURL.concat(urlWithParams);
      }


      fetch(urlWithParams, {
        'headers': {
          'Authorization': sessionStorage.getItem('auth_header'),
        }
      })
        .then(response => {
          response.blob().then(blob => {

            try {
              // downloading file
              let url = window.URL.createObjectURL(blob);
              let a = document.createElement('a');
              a.href = url;
              a.download = reportName + '.' + viewAsType;
              a.click();

              if (viewAsType === 'html') {
                // extracting stream from blob object and showing as html file in new tab
                var reader = new FileReader();
                reader.onload = function () {
                  console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Printing blob Stream");
                  console.log(reader.result);
                  var newWindow = window.open();
                  if (newWindow != null) {
                    newWindow.document.write(reader.result);
                  }
                }
                reader.readAsText(blob);
              }
            } catch (err) {
              console.log(err)
            }
          });
        });

    }
  }

  handleValidation() {

    let formIsValid = true;
    let errorText = '';
    if (this.state.view_as === '') {
      errorText = errorText.concat("Select the 'View As' to download report in particular format.");
      formIsValid = false;
    }

    if (this.state.reportName === null || this.state.reportName === undefined || this.state.reportName === '') {
      errorText = errorText.concat(" Select the type of report to download.");
      formIsValid = false;
    }

    if (!formIsValid) {
      alertify.set('notifier', 'position', 'top-center');
      alertify.set('notifier', 'delay', 10);
      alertify.error('<p><b>' + errorText + '</b></p>');
    }
    return formIsValid;
  }

  render() {


    const cautionDivStyle = this.state.isDumps ? { display: 'block' } : { display: 'none' };
    const secondCautionDivStyle = this.state.isDumps || this.state.noFilter ? { display: 'block' } : { display: 'none' };
    const firstFilterDisplay = this.hasFirstFilter && !this.state.isDumps ? { display: 'block' } : { display: 'none' };
    const filterDivStyle = !this.state.isDumps ? { display: 'block' } : { display: 'none' };
    const secondFilterDisplay = this.hasSecondFilter ? "block" : "none";

    return (
      <MemoryRouter>
        <div id="apppage">
          <MDBView>
            <MDBMask className="gradient">
              <div>
                <MDBNavbar style={{ backgroundColor: "#522A71" }} dark expand="md">
                  <MDBNavbarBrand>
                    <strong className="white-text">Aahung - Reports Dashboard</strong>
                  </MDBNavbarBrand>
                  <MDBBtn size="md" onClick={() => this.props.history.push('/mainMenu')} style={{ backgroundColor: "#ef6c00", marginLeft: "70%" }} >Home<MDBIcon icon="home" className="ml-2" /></MDBBtn>
                </MDBNavbar>
                <MDBContainer id="containerId">
                  <MDBRow>
                    <MDBCol md="4">
                      <MDBCard style={{ width: "23rem", marginTop: "1rem", overflow: "auto", maxHeight: "36rem", height: "700px" }}>
                        <MDBCardHeader style={{ backgroundColor: "#522A71", color: "white" }}>Filters</MDBCardHeader>
                        <MDBCardBody>
                          <div id="topFilterDiv" style={filterDivStyle}>
                            <div >

                              <div>
                                <Label>Start Date:    </Label>
                                <DatePicker className="dateBox"
                                  selected={this.state.start_date}
                                  onChange={(date) => this.handleDate(date, "start_date")}
                                  selectsStart
                                  startDate={this.state.start_date}
                                  endDate={this.state.end_date}
                                  placeholderText="Start Date"
                                />
                                <i class="far fa-calendar-alt"></i>
                              </div>
                              <br />
                              <div>
                                <Label>End Date:   </Label>
                                <DatePicker className="dateBox"
                                  selected={this.state.end_date}
                                  onChange={(date) => this.handleDate(date, "end_date")}
                                  selectsEnd
                                  endDate={this.state.end_date}
                                  minDate={this.state.start_date}
                                  placeholderText="End Date"
                                  maxDate={new Date()}
                                />
                                <i color="secondary" class="far fa-calendar-alt"></i>
                              </div>

                              <br />

                              Province:
                      <Select id="province" name="province" value={this.state.province} onChange={(e) => this.valueChangeMulti(e, "province")} options={location.provinces} isMulti required />

                              <br />

                              District/City:
                      <Select id="district" name="district" value={this.state.district} onChange={(e) => this.valueChangeMulti(e, "district")} options={this.state.districtArray} isMulti required />
                            </div>
                          </div>

                          <div style={cautionDivStyle}>
                            <i class="icon fa fa-exclamation-triangle" style={{ fontSize: "80px", color: "grey", marginLeft: "35%" }} />
                            <label>Filters are not applicable for this selection</label>
                          </div>
                        </MDBCardBody>

                        <MDBCardHeader style={{ backgroundColor: "#522A71", color: "white" }}>Advanced Filters</MDBCardHeader>
                        <MDBCardBody>
                          <div id="topAdvancedFilterDiv" style={filterDivStyle}>
                            <div id="firstFilterDiv" style={firstFilterDisplay}>
                              <Label className="dumpLabel">Filter 1: <u>{this.state.firstFilterName}</u></Label>
                              <Select id="firstFilterOptionSelected" name="filter" value={this.state.firstFilterOptionSelected} styles={{ fontWeight: '600', width: '20px !important' }} onChange={(e) => this.valueChangeMulti(e, "firstFilterOptionSelected")} options={this.state.firstFilterOptions} isMulti required />
                            </div>

                            <div id="secondFilterDiv" style={{ marginTop: "1rem", display: secondFilterDisplay }}>
                              <Label className="dumpLabel">Filter 2: <u>{this.state.secondFilterName}</u></Label>
                              <Select id="secondFilterOptionSelected" name="filter" value={this.state.secondFilterOptionSelected} styles={{ fontWeight: '600' }} onChange={(e) => this.valueChangeMulti(e, "secondFilterOptionSelected")} options={this.state.secondFilterOptions} isMulti required />
                            </div>
                          </div>

                          <div style={secondCautionDivStyle}>
                            <i class="icon fa fa-exclamation-triangle" style={{ fontSize: "80px", color: "grey", marginLeft: "35%" }} />
                            <label>Advanced Filters are not applicable for this selection</label>
                          </div>
                        </MDBCardBody>

                      </MDBCard>
                    </MDBCol>

                    <MDBCol md="8" >

                      <MDBTable style={{marginLeft: '15%'}}>
                        <MDBTableBody>
                          <tr>
                            <td><Input type="select" id="viewAs" style={{ width: "18rem", marginLeft: "27rem" }} value={this.state.view_as} onChange={(e) => this.valueChange(e, "view_as")} className="form-control" disabled={this.state.isDumps}>
                              <option value="">-- View Reports As --</option>
                              <option value="html">HTML</option>
                              <option value="csv">CSV</option>
                              <option value="pdf">PDF</option>
                            </Input></td></tr>
                        </MDBTableBody>
                      </MDBTable>
                      <MDBCard style={{ marginTop: "0.2rem", height: "50px;" }}>
                        <MDBNav tabs className="nav-pills nav-justified">

                          <RequirePrivilege
                            privilegeName="View LSE Reports"
                            yes={() => (
                              <MDBNavItem >
                                <MDBNavLink className={"nav-link Ripple-parent " + classnames({ active2: this.state.activeItemJustified === '1' })} to="#" onClick={this.toggleJustified("1")} role="tab" >
                                  LSE
                      </MDBNavLink>
                              </MDBNavItem>
                            )}
                          />

                          <RequirePrivilege
                            privilegeName="View SRHM Reports"
                            yes={() => (
                              <MDBNavItem>
                                <MDBNavLink className={"nav-link Ripple-parent " + classnames({ active2: this.state.activeItemJustified === '2' })} to="#" onClick={this.toggleJustified("2")} role="tab" >
                                  SRHM
                      </MDBNavLink>
                              </MDBNavItem>
                            )}
                          />
                          <RequirePrivilege
                            privilegeName="View Comms Reports"
                            yes={() => (
                              <MDBNavItem>
                                <MDBNavLink className={"nav-link Ripple-parent " + classnames({ active2: this.state.activeItemJustified === '3' })} to="#" onClick={this.toggleJustified("3")} role="tab" >
                                  COMMS
                      </MDBNavLink>
                              </MDBNavItem>
                            )}
                          />

                          <RequirePrivilege
                            privilegeName="View Data Dumps"
                            yes={() => (
                              <MDBNavItem>
                                <MDBNavLink className={"nav-link Ripple-parent " + classnames({ active2: this.state.activeItemJustified === '4' })} to="#" onClick={this.toggleJustified("4")} role="tab" >
                                  Data Dumps
                      </MDBNavLink>
                              </MDBNavItem>
                            )}
                          />
                        </MDBNav>
                      </MDBCard>

                      <MDBTabContent style={{ marginTop: "1rem", overflow: "auto", maxHeight: "26em" }} className="card" activeItem={this.state.activeItemJustified}>
                        {/* LSE */}
                        <RequirePrivilege
                          privilegeName="View LSE Reports"
                          yes={() => (
                            <MDBTabPane tabId="1" role="tabpanel">
                              <MDBTable bordered table-fixed className="reportTable">
                                <MDBTableHead style={{ backgroundColor: "rgb(228, 228, 228)", color: "black", fontWeight: "600" }}>
                                  <tr className="textWeight">
                                    <th style={{ width: "2rem" }}></th>
                                    <th style={{ width: "11rem" }}>LSE Report Name</th>
                                    <th>Report Description</th>
                                  </tr>
                                </MDBTableHead>
                                <MDBTableBody>
                                  {this.state.lseReports.map((rpt, i) => {

                                    return (<tr className="textWeight">
                                      <td>
                                        <div class="pretty p-svg p-toggle p-plain p-bigger p-round" >
                                          <input type="radio" id={rpt.name} value={this.state.reportName} name="report" defaultChecked={false} onChange={(e) => this.handleCheckboxChange(e, rpt.shortName)} ></input>
                                          <div class="state p-on" >
                                            <svg class="svg" viewBox="0 0 8 8" style={{ fill: "rgb(247, 144, 29)" }}><use xlinkHref={`${openIconic}#circle-check`} class="icon-lock-unlocked"></use></svg>
                                            <label></label>
                                          </div>
                                          <div class="state p-off" >
                                            <svg class="svg" viewBox="0 0 8 8" style={{ fill: "grey" }}><use xlinkHref={`${openIconic}#media-stop`} class="icon-lock-locked"></use></svg>
                                            <label></label>
                                          </div>
                                        </div></td>
                                      <td>{rpt.name}</td>
                                      <td>{rpt.description}</td>
                                    </tr>)
                                  })}
                                </MDBTableBody>
                              </MDBTable>
                            </MDBTabPane>
                          )}
                        />

                        {/* SRHM */}
                        <RequirePrivilege
                          privilegeName="View SRHM Reports"
                          yes={() => (
                            <MDBTabPane tabId="2" role="tabpanel">
                              <MDBTable bordered table-fixed className="reportTable">
                                <MDBTableHead style={{ backgroundColor: "rgb(228, 228, 228)", color: "black", fontWeight: "600" }}>
                                  <tr className="textWeight">
                                    <th style={{ width: "2rem" }}></th>
                                    <th style={{ width: "11rem" }}>SRHM Report Name</th>
                                    <th>Report Description</th>
                                  </tr>
                                </MDBTableHead>
                                <MDBTableBody>
                                  {this.state.srhmReports.map((rpt, i) => {

                                    return (<tr className="textWeight">
                                      <td><div class="pretty p-svg p-toggle p-plain p-bigger p-round" >
                                        <input type="radio" id={rpt.name} value={this.state.reportName} name="report" defaultChecked={false} onChange={(e) => this.handleCheckboxChange(e, rpt.shortName)} ></input>
                                        <div class="state p-on" >
                                          <svg class="svg" viewBox="0 0 8 8" style={{ fill: "rgb(247, 144, 29)" }}><use xlinkHref={`${openIconic}#circle-check`} class="icon-lock-unlocked"></use></svg>
                                          <label></label>
                                        </div>
                                        <div class="state p-off" >
                                          <svg class="svg" viewBox="0 0 8 8" style={{ fill: "grey" }}><use xlinkHref={`${openIconic}#media-stop`} class="icon-lock-locked"></use></svg>
                                          <label></label>
                                        </div>
                                      </div></td>
                                      <td>{rpt.name}</td>
                                      <td>{rpt.description}</td>
                                    </tr>)
                                  })}
                                </MDBTableBody>
                              </MDBTable>
                            </MDBTabPane>
                          )}
                        />

                        {/* COMMS */}
                        <RequirePrivilege
                          privilegeName="View Comms Reports"
                          yes={() => (
                            <MDBTabPane tabId="3" role="tabpanel">
                              <MDBTable bordered table-fixed className="reportTable">
                                <MDBTableHead style={{ backgroundColor: "rgb(228, 228, 228)", color: "black", fontWeight: "500" }}>
                                  <tr className="textWeight">
                                    <th style={{ width: "2rem" }}></th>
                                    <th style={{ width: "11rem" }}>COMMS Report Name</th>
                                    <th>Report Description</th>
                                  </tr>
                                </MDBTableHead>
                                <MDBTableBody>

                                  {this.state.commsReports.map((rpt, i) => {

                                    return (<tr className="textWeight">
                                      <td><div class="pretty p-svg p-toggle p-plain p-bigger p-round" >
                                        <input type="radio" id={rpt.name} value={this.state.reportName} name="report" defaultChecked={false} onChange={(e) => this.handleCheckboxChange(e, rpt.shortName)} ></input>
                                        <div class="state p-on" >
                                          <svg class="svg" viewBox="0 0 8 8" style={{ fill: "rgb(247, 144, 29)" }}><use xlinkHref={`${openIconic}#circle-check`} class="icon-lock-unlocked"></use></svg>
                                          <label></label>
                                        </div>
                                        <div class="state p-off" >
                                          <svg class="svg" viewBox="0 0 8 8" style={{ fill: "grey" }}><use xlinkHref={`${openIconic}#media-stop`} class="icon-lock-locked"></use></svg>
                                          <label></label>
                                        </div>
                                      </div></td>
                                      <td>{rpt.name}</td>
                                      <td>{rpt.description}</td>
                                    </tr>)
                                  })}
                                </MDBTableBody>
                              </MDBTable>
                            </MDBTabPane>

                          )}
                        />

                        {/* Dumps */}
                        <RequirePrivilege
                          privilegeName="View Data Dumps"
                          yes={() => (
                            <MDBTabPane tabId="4" role="tabpanel">
                              <MDBTable bordered table-fixed className="reportTable">
                                <MDBTableHead style={{ backgroundColor: "rgb(228, 228, 228)", color: "black", fontWeight: "600" }}>
                                  <tr className="textWeight">
                                    <th style={{ width: "15rem" }}>Data</th>
                                    <th style={{ width: "10rem" }}>Download Dump</th>
                                  </tr>
                                </MDBTableHead>
                                <MDBTableBody>
                                  <tr className="textWeight">
                                    <td>Form Data:
                        <Select id="form_type" name="form_type" value={this.state.form_type} styles={{ fontWeight: '600' }} onChange={(e) => this.handleChange(e, "form_type")} options={this.state.formTypes} required />
                                    </td>

                                    <td><br /><MDBBtn size="sm" color="orange" rounded="true" outline="true" onClick={this.downloadFormData} style={{marginLeft: '5%'}} >Download<MDBIcon icon="download" className="ml-2" /></MDBBtn></td>
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
                                  </tr>

                                </MDBTableBody>
                              </MDBTable>
                            </MDBTabPane>
                          )}
                        />

                      </MDBTabContent>
                      <MDBBtn size="md" style={{ backgroundColor: "#ef6c00", marginLeft: "80%" }} onClick={(e) => this.downloadReport()} disabled={this.state.isDumps}>Download<MDBIcon icon="download" className="ml-2" /></MDBBtn>
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