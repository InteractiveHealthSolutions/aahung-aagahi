import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';
import classnames from 'classnames';
import { MDBBtn, MDBCard, MDBIcon, MDBMask, MDBNav, MDBNavbar, MDBNavbarBrand, MDBNavItem, MDBNavLink, MDBTabContent, MDBTabPane, MDBView } from "mdbreact";
import moment from 'moment';
import React, { Component } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { MemoryRouter } from 'react-router-dom';
import DonorSearch from "../admin/DonorSearch";
import FormSearch from "../admin/FormSearch";
import LocationSearch from "../admin/LocationSearch";
import ParticipantSearch from "../admin/ParticipantSearch";
import ProjectSearch from "../admin/ProjectSearch";
import UserSearch from "../admin/UserSearch";
import "../index.css";
import { getDefinitionsByDefinitionType } from '../service/GetService';
import { apiUrl } from "../util/AahungUtil.js";
import { getDistrictsByMultipleProvinces, getDistrictsByProvince, location } from "../util/LocationUtil.js";
import { getReportByName } from "../util/ReportsListUtil.js";
var serverAddress = apiUrl;

class AdminPage extends Component {

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
      if(e !== null && e.length > 0) {
        let districts = getDistrictsByMultipleProvinces(e);
        console.log(districts);
        this.setState({
            districtArray : districts,
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

  generateProvinceFilter() {
    var concatenatedProvinces= "";
    // generating province filter
    if(this.state.province === null || this.state.province === undefined || this.state.province.length == 0) {
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
    var concatenatedDistricts= "";
    // generating district filter
    if(this.state.district === null || this.state.district === undefined || this.state.district.length == 0) {

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
      if(selectedFirstFilters.length > 0) {
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
    if(selectedSecondFilters.length > 0) {
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

    if(report.filters.length != 0 && this.state.firstFilterOptions.length > 0) {
      alertify.set('notifier','position', 'bottom-left');
      alertify.set('notifier','delay', 5);
      alertify.set('notifier','position', 'bottom-left');
      alertify.success('<p><b>Filters are updated. Apply filters to download report.</b></p>');
    }
	}

	capitalize(filterName) {
		var words = filterName.split('_');
		for (let i=0; i < words.length; i++) {
			words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
		}
		return words.join(' ');
  }
  
  /**
   * Downloads selected report with the applicable filters. If no filters are applied, all filters are selected by default. 
   */
  downloadReport() {
    
    if(this.handleValidation()) {
      var viewAsType = this.state.view_as;
      var reportName = this.state.reportName;
      var startDate = moment(this.state.start_date).format('YYYY-MM-DD');
      var endDate = moment(this.state.end_date).format('YYYY-MM-DD');
      var concatenatedProvinces= this.generateProvinceFilter();
      var concatenatedDistricts= this.generateDistrictFilter();

      // attaching the static filters for generating url
      var urlWithParams = "?start_date=" + startDate + "&end_date=" + endDate + "&province=" + concatenatedProvinces + "&city=" + concatenatedDistricts + "&";
      var currentReport = getReportByName(this.state.reportName)[0];

      // generating the dynamic filters (first and second if applicable)
      // -- generating first filter --
      if(currentReport.filters.length != 0) {
        if(this.hasFirstFilter) {
          var optionsFirst = this.generateFirstFilter();
          // attaching first filter to url
          urlWithParams = urlWithParams.concat(currentReport.filters[0] + "=" + optionsFirst + "&");
        }

        // -- generating second filter --
        if(this.hasSecondFilter) {
          var optionsSecond = this.generateSecondFilter();
          // attaching second filter to url
          urlWithParams = urlWithParams.concat(currentReport.filters[1] + "=" + optionsSecond);
        }
        else {
          urlWithParams = urlWithParams.substring(0, urlWithParams.length - 1);
        }

        // final report url
        this.requestURL = serverAddress + "/report/" + viewAsType + "/" + reportName ;
        urlWithParams = this.requestURL.concat(urlWithParams);
        console.log(urlWithParams);
      }

      fetch(urlWithParams, { 'headers': {
              'Authorization': sessionStorage.getItem('auth_header'),
              }} )
        .then(response => {
          response.blob().then(blob => {
            
            try {
              // downloading file
              let url = window.URL.createObjectURL(blob);
              let a = document.createElement('a');
              a.href = url;
              a.download = reportName + '.' + viewAsType;
              a.click();
    
              if(viewAsType === 'html') {
                // extracting stream from blob object and showing as html file in new tab
                var reader = new FileReader();
                reader.onload = function() {
                    console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Printing blob Stream");
                    console.log(reader.result);
                    var newWindow = window.open();
                    if(newWindow != null) {
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

  handleValidation(){

    let formIsValid = true;
    let errorText = '';
    if(this.state.view_as === '' ) {
      errorText = errorText.concat("Select the 'View As' to download report in particular format.");
      formIsValid = false;
    }

    if(this.state.reportName === null || this.state.reportName === undefined || this.state.reportName === '') {
      errorText = errorText.concat(" Select the type of report to download.");
      formIsValid = false;
    }

    if(!formIsValid) {
      alertify.set('notifier','position', 'top-center');
      alertify.set('notifier','delay', 10);
      alertify.error('<p><b>' + errorText + '</b></p>');
    }
    return formIsValid;
  }

  onClick = () =>  {
    // this.props.history.push({
    //   pathname: '/schoolDetails',
    //   state: { edit: true, locationId: 54 }
    // });

    this.props.history.push('/mainMenu');
  }

  render() {
    
    const ExampleCustomInput = ({ value, onClick }) => (
      <button className="example-custom-input" onClick={onClick}>
        {value}
      </button>
    );

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
            <strong className="white-text">Aahung - Search</strong>
          </MDBNavbarBrand>
          <MDBBtn size="md" onClick={this.onClick} style={{backgroundColor: "#ef6c00", marginLeft: "75%"}} >Home<MDBIcon icon="home" className="ml-2" /></MDBBtn>
        </MDBNavbar>
            <div id="search" className="search">
              <MDBCard style={{marginTop: "0.2rem"}}>
              <MDBNav tabs className="nav-pills nav-justified">
            
                  <MDBNavItem>
                    <MDBNavLink className={"nav-link Ripple-parent " + classnames({active2: this.state.activeItemJustified === '1'})} to="#" onClick={this.toggleJustified("1")} role="tab" >
                      User
                    </MDBNavLink>
                  </MDBNavItem>

                  <MDBNavItem>
                    <MDBNavLink className={"nav-link Ripple-parent " + classnames({active2: this.state.activeItemJustified === '2'})} to="#" onClick={this.toggleJustified("2")} role="tab" >
                    Participant
                    </MDBNavLink>
                  </MDBNavItem>

                  {/* <MDBNavItem>
                    <MDBNavLink className={"nav-link Ripple-parent " + classnames({active2: this.state.activeItemJustified === '3'})} to="#" onClick={this.toggleJustified("3")} role="tab" >
                      Form
                    </MDBNavLink>
                  </MDBNavItem> */}

                  <MDBNavItem >
                    <MDBNavLink className={"nav-link Ripple-parent " + classnames({active2: this.state.activeItemJustified === '4'})} to="#" onClick={this.toggleJustified("4")} role="tab" >
                      Location
                    </MDBNavLink>
                  </MDBNavItem>

                  <MDBNavItem>
                    <MDBNavLink className={"nav-link Ripple-parent " + classnames({active2: this.state.activeItemJustified === '5'})} to="#" onClick={this.toggleJustified("5")} role="tab" >
                      Project
                    </MDBNavLink>
                  </MDBNavItem>

                  <MDBNavItem>
                    <MDBNavLink className={"nav-link Ripple-parent " + classnames({active2: this.state.activeItemJustified === '6'})} to="#" onClick={this.toggleJustified("6")} role="tab" >
                      Donor
                    </MDBNavLink>
                  </MDBNavItem>
          </MDBNav>
          </MDBCard>

          <MDBTabContent style={{ marginTop: "0.5em", overflow: "auto" }} className="card" activeItem={this.state.activeItemJustified}>
              
          {/* Users */}
          <MDBTabPane tabId="1" role="tabpanel" style={{height: "43em"}}>
            <UserSearch {...this.props} />
          </MDBTabPane>

          {/* Participant */}
          <MDBTabPane tabId="2" role="tabpanel" style={{height: "43em"}}>
            <ParticipantSearch />
          </MDBTabPane>

          {/* Forms */}
          {/* <MDBTabPane tabId="3" role="tabpanel" style={{height: "43em"}}>
            <FormSearch />
          </MDBTabPane> */}

          {/* Location */}
          <MDBTabPane tabId="4" role="tabpanel" style={{height: "43em"}}>
                <LocationSearch />
          </MDBTabPane>

          {/* Projects */}
          <MDBTabPane tabId="5" role="tabpanel" style={{height: "43em"}}>
            <ProjectSearch />
          </MDBTabPane>

          {/* Donors */}
          <MDBTabPane tabId="6" role="tabpanel" style={{height: "43em"}}>
            <DonorSearch />
          </MDBTabPane>

          </MDBTabContent>
          
          </div>
          </div>
        </MDBMask>
        </MDBView>
        </div>
        </MemoryRouter>
      );
    }
  }

export default AdminPage;