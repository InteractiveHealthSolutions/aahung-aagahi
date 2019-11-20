import { Link } from 'react-router-dom';
import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch, MemoryRouter, Redirect } from 'react-router-dom';
import { Label, Input} from 'reactstrap';
import { MDBInput, MDBBadge, MDBDataTable, MDBMask, MDBView, MDBNavbar, MDBNavbarBrand, MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBCardHeader, MDBBtn } from "mdbreact";
import { MDBListGroup, MDBListGroupItem, MDBTable, MDBTableBody, MDBTableHead, MDBContainer, MDBRow, MDBCol, MDBTabPane, MDBTabContent, MDBNav, MDBNavItem, MDBNavLink, MDBIcon, MDBDatePicker  } from
"mdbreact";
import  "../index.css";
import { getAllFormTypes, getDefinitionsByDefinitionType} from '../service/GetService';
import Select from 'react-select';
import classnames from 'classnames';
import { apiUrl } from "../util/AahungUtil.js";
import { getDistrictsByProvince, location, getDistrictsByMultipleProvinces } from "../util/LocationUtil.js";
import { getReportByName, getReportByComponent } from "../util/ReportsListUtil.js";
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';
import moment from 'moment';
import openIconic from "../img/open-iconic.svg";
import RequirePrivilege from '../access/RequirePrivilege';
import LocationSearch from "../admin/LocationSearch";
import {Animated} from "react-animated-css";
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
    alert("clicked!")
    this.props.history.push({
      pathname: '/schoolDetails',
      state: { edit: true, locationId: 54 }
    });
    // return <Redirect to={{ pathname: '/schoolDetails', state: { xyz: true, abc: false} }} />
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

    const data = {
      columns: [
        {
          label: 'Name',
          field: 'name',
          sort: 'asc',
          width: 150
        },
        {
          label: 'Position',
          field: 'position',
          sort: 'asc',
          width: 270
        },
        {
          label: 'Office',
          field: 'office',
          sort: 'asc',
          width: 200
        },
        {
          label: 'Age',
          field: 'age',
          sort: 'asc',
          width: 100
        },
        {
          label: 'Start date',
          field: 'date',
          sort: 'asc',
          width: 150
        },
        {
          label: 'Salary',
          field: 'salary',
          sort: 'asc',
          width: 100
        }
      ],
      rows: [
        {
          name: 'Tiger Nixon',
          position: 'System Architect',
          office: 'Edinburgh',
          age: '61',
          date: '2011/04/25',
          salary: '$320'
        },
        {
          name: 'Garrett Winters',
          position: 'Accountant',
          office: 'Tokyo',
          age: '63',
          date: '2011/07/25',
          salary: '$170'
        },
        {
          name: 'Ashton Cox',
          position: 'Junior Technical Author',
          office: 'San Francisco',
          age: '66',
          date: '2009/01/12',
          salary: '$86'
        },
        {
          name: 'Cedric Kelly',
          position: 'Senior Javascript Developer',
          office: 'Edinburgh',
          age: '22',
          date: '2012/03/29',
          salary: '$433'
        },
        {
          name: 'Airi Satou',
          position: 'Accountant',
          office: 'Tokyo',
          age: '33',
          date: '2008/11/28',
          salary: '$162'
        },
        {
          name: 'Brielle Williamson',
          position: 'Integration Specialist',
          office: 'New York',
          age: '61',
          date: '2012/12/02',
          salary: '$372'
        },
        {
          name: 'Herrod Chandler',
          position: 'Sales Assistant',
          office: 'San Francisco',
          age: '59',
          date: '2012/08/06',
          salary: '$137'
        },
        {
          name: 'Rhona Davidson',
          position: 'Integration Specialist',
          office: 'Tokyo',
          age: '55',
          date: '2010/10/14',
          salary: '$327'
        },
        {
          name: 'Colleen Hurst',
          position: 'Javascript Developer',
          office: 'San Francisco',
          age: '39',
          date: '2009/09/15',
          salary: '$205'
        },
        {
          name: 'Sonya Frost',
          position: 'Software Engineer',
          office: 'Edinburgh',
          age: '23',
          date: '2008/12/13',
          salary: '$103'
        },
        {
          name: 'Jena Gaines',
          position: 'Office Manager',
          office: 'London',
          age: '30',
          date: '2008/12/19',
          salary: '$90'
        },
        {
          name: 'Quinn Flynn',
          position: 'Support Lead',
          office: 'Edinburgh',
          age: '22',
          date: '2013/03/03',
          salary: '$342'
        },
        {
          name: 'Charde Marshall',
          position: 'Regional Director',
          office: 'San Francisco',
          age: '36',
          date: '2008/10/16',
          salary: '$470'
        },
        {
          name: 'Haley Kennedy',
          position: 'Senior Marketing Designer',
          office: 'London',
          age: '43',
          date: '2012/12/18',
          salary: '$313'
        },
        {
          name: 'Tatyana Fitzpatrick',
          position: 'Regional Director',
          office: 'London',
          age: '19',
          date: '2010/03/17',
          salary: '$385'
        },
        {
          name: 'Michael Silva',
          position: 'Marketing Designer',
          office: 'London',
          age: '66',
          date: '2012/11/27',
          salary: '$198'
        },
        {
          name: 'Paul Byrd',
          position: 'Chief Financial Officer (CFO)',
          office: 'New York',
          age: '64',
          date: '2010/06/09',
          salary: '$725'
        },
        {
          name: 'Gloria Little',
          position: 'Systems Administrator',
          office: 'New York',
          age: '59',
          date: '2009/04/10',
          salary: '$237'
        },
        {
          name: 'Bradley Greer',
          position: 'Software Engineer',
          office: 'London',
          age: '41',
          date: '2012/10/13',
          salary: '$132'
        },
        {
          name: 'Dai Rios',
          position: 'Personnel Lead',
          office: 'Edinburgh',
          age: '35',
          date: '2012/09/26',
          salary: '$217'
        },
        {
          name: 'Jenette Caldwell',
          position: 'Development Lead',
          office: 'New York',
          age: '30',
          date: '2011/09/03',
          salary: '$345'
        },
        {
          name: 'Yuri Berry',
          position: 'Chief Marketing Officer (CMO)',
          office: 'New York',
          age: '40',
          date: '2009/06/25',
          salary: '$675'
        },
        {
          name: 'Caesar Vance',
          position: 'Pre-Sales Support',
          office: 'New York',
          age: '21',
          date: '2011/12/12',
          salary: '$106'
        },
        {
          name: 'Doris Wilder',
          position: 'Sales Assistant',
          office: 'Sidney',
          age: '23',
          date: '2010/09/20',
          salary: '$85'
        },
        {
          name: 'Angelica Ramos',
          position: 'Chief Executive Officer (CEO)',
          office: 'London',
          age: '47',
          date: '2009/10/09',
          salary: '$1'
        },
        {
          name: 'Gavin Joyce',
          position: 'Developer',
          office: 'Edinburgh',
          age: '42',
          date: '2010/12/22',
          salary: '$92'
        },
        {
          name: 'Jennifer Chang',
          position: 'Regional Director',
          office: 'Singapore',
          age: '28',
          date: '2010/11/14',
          salary: '$357'
        },
        {
          name: 'Brenden Wagner',
          position: 'Software Engineer',
          office: 'San Francisco',
          age: '28',
          date: '2011/06/07',
          salary: '$206'
        },
        {
          name: 'Fiona Green',
          position: 'Chief Operating Officer (COO)',
          office: 'San Francisco',
          age: '48',
          date: '2010/03/11',
          salary: '$850'
        },
        {
          name: 'Shou Itou',
          position: 'Regional Marketing',
          office: 'Tokyo',
          age: '20',
          date: '2011/08/14',
          salary: '$163'
        },
        {
          name: 'Michelle House',
          position: 'Integration Specialist',
          office: 'Sidney',
          age: '37',
          date: '2011/06/02',
          salary: '$95'
        },
        {
          name: 'Suki Burks',
          position: 'Developer',
          office: 'London',
          age: '53',
          date: '2009/10/22',
          salary: '$114'
        },
        {
          name: 'Prescott Bartlett',
          position: 'Technical Author',
          office: 'London',
          age: '27',
          date: '2011/05/07',
          salary: '$145'
        },
        {
          name: 'Gavin Cortez',
          position: 'Team Leader',
          office: 'San Francisco',
          age: '22',
          date: '2008/10/26',
          salary: '$235'
        },
        {
          name: 'Martena Mccray',
          position: 'Post-Sales support',
          office: 'Edinburgh',
          age: '46',
          date: '2011/03/09',
          salary: '$324'
        },
        {
          name: 'Unity Butler',
          position: 'Marketing Designer',
          office: 'San Francisco',
          age: '47',
          date: '2009/12/09',
          salary: '$85'
        },
        {
          name: 'Howard Hatfield',
          position: 'Office Manager',
          office: 'San Francisco',
          age: '51',
          date: '2008/12/16',
          salary: '$164'
        },
        {
          name: 'Hope Fuentes',
          position: 'Secretary',
          office: 'San Francisco',
          age: '41',
          date: '2010/02/12',
          salary: '$109'
        },
        {
          name: 'Vivian Harrell',
          position: 'Financial Controller',
          office: 'San Francisco',
          age: '62',
          date: '2009/02/14',
          salary: '$452'
        },
        {
          name: 'Timothy Mooney',
          position: 'Office Manager',
          office: 'London',
          age: '37',
          date: '2008/12/11',
          salary: '$136'
        },
        {
          name: 'Jackson Bradshaw',
          position: 'Director',
          office: 'New York',
          age: '65',
          date: '2008/09/26',
          salary: '$645'
        },
        {
          name: 'Olivia Liang',
          position: 'Support Engineer',
          office: 'Singapore',
          age: '64',
          date: '2011/02/03',
          salary: '$234'
        },
        {
          name: 'Bruno Nash',
          position: 'Software Engineer',
          office: 'London',
          age: '38',
          date: '2011/05/03',
          salary: '$163'
        },
        {
          name: 'Sakura Yamamoto',
          position: 'Support Engineer',
          office: 'Tokyo',
          age: '37',
          date: '2009/08/19',
          salary: '$139'
        },
        {
          name: 'Thor Walton',
          position: 'Developer',
          office: 'New York',
          age: '61',
          date: '2013/08/11',
          salary: '$98'
        },
        {
          name: 'Finn Camacho',
          position: 'Support Engineer',
          office: 'San Francisco',
          age: '47',
          date: '2009/07/07',
          salary: '$87'
        },
        {
          name: 'Serge Baldwin',
          position: 'Data Coordinator',
          office: 'Singapore',
          age: '64',
          date: '2012/04/09',
          salary: '$138'
        },
        {
          name: 'Zenaida Frank',
          position: 'Software Engineer',
          office: 'New York',
          age: '63',
          date: '2010/01/04',
          salary: '$125'
        },
        {
          name: 'Zorita Serrano',
          position: 'Software Engineer',
          office: 'San Francisco',
          age: '56',
          date: '2012/06/01',
          salary: '$115'
        },
        {
          name: 'Jennifer Acosta',
          position: 'Junior Javascript Developer',
          office: 'Edinburgh',
          age: '43',
          date: '2013/02/01',
          salary: '$75'
        },
        {
          name: 'Cara Stevens',
          position: 'Sales Assistant',
          office: 'New York',
          age: '46',
          date: '2011/12/06',
          salary: '$145'
        },
        {
          name: 'Hermione Butler',
          position: 'Regional Director',
          office: 'London',
          age: '47',
          date: '2011/03/21',
          salary: '$356'
        },
        {
          name: 'Lael Greer',
          position: 'Systems Administrator',
          office: 'London',
          age: '21',
          date: '2009/02/27',
          salary: '$103'
        },
        {
          name: 'Jonas Alexander',
          position: 'Developer',
          office: 'San Francisco',
          age: '30',
          date: '2010/07/14',
          salary: '$86'
        },
        {
          name: 'Shad Decker',
          position: 'Regional Director',
          office: 'Edinburgh',
          age: '51',
          date: '2008/11/13',
          salary: '$183'
        },
        {
          name: 'Michael Bruce',
          position: 'Javascript Developer',
          office: 'Singapore',
          age: '29',
          date: '2011/06/27',
          salary: '$183'
        },
        {
          name: 'Donna Snider',
          position: 'Customer Support',
          office: 'New York',
          age: '27',
          date: '2011/01/25',
          salary: '$112'
        }
      ]
    };

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
          <MDBBtn size="md" onClick={this.onClick} style={{backgroundColor: "#ef6c00", marginLeft: "63%"}} >Home<MDBIcon icon="home" className="ml-2" /></MDBBtn>
        </MDBNavbar>
            <div id="search" className="search">
              <MDBCard style={{marginTop: "0.2rem"}}>
              <MDBNav tabs className="nav-pills nav-justified">
            
              <RequirePrivilege
                  privilegeName="View LSE Reports"
                  yes={() => (
                    <MDBNavItem >
                      <MDBNavLink className={"nav-link Ripple-parent " + classnames({active2: this.state.activeItemJustified === '1'})} to="#" onClick={this.toggleJustified("1")} role="tab" >
                        Location
                      </MDBNavLink>
                    </MDBNavItem>
                  )}
              />

              <RequirePrivilege
                  privilegeName="View SRHM Reports"
                  yes={() => (
                    <MDBNavItem>
                      <MDBNavLink className={"nav-link Ripple-parent " + classnames({active2: this.state.activeItemJustified === '2'})} to="#" onClick={this.toggleJustified("2")} role="tab" >
                      Participant
                      </MDBNavLink>
                    </MDBNavItem>
                  )}
              />
              <RequirePrivilege
                  privilegeName="View Comms Reports"
                  yes={() => (
                    <MDBNavItem>
                      <MDBNavLink className={"nav-link Ripple-parent " + classnames({active2: this.state.activeItemJustified === '3'})} to="#" onClick={this.toggleJustified("3")} role="tab" >
                        Form
                      </MDBNavLink>
                    </MDBNavItem>
                  )}
              />

              <RequirePrivilege
                  privilegeName="View Reports Section"
                  yes={() => (
                    <MDBNavItem>
                      <MDBNavLink className={"nav-link Ripple-parent " + classnames({active2: this.state.activeItemJustified === '4'})} to="#" onClick={this.toggleJustified("4")} role="tab" >
                        User
                      </MDBNavLink>
                    </MDBNavItem>
                  )}
              />
          </MDBNav>
          </MDBCard>

          <MDBTabContent style={{ marginTop: "0.5em", overflow: "auto" }} className="card" activeItem={this.state.activeItemJustified}>
            {/* Location */}
            <RequirePrivilege
                  privilegeName="View LSE Reports"
                  yes={() => (
                  <MDBTabPane tabId="1" role="tabpanel" style={{height: "43em"}}>
                  
                    <LocationSearch />
                  </MDBTabPane>

                )}
            />

            {/* Participant */}
            <RequirePrivilege
                  privilegeName="View SRHM Reports"
                  yes={() => (
                  <MDBTabPane tabId="2" role="tabpanel">
                  <Animated animationIn="bounceInLeft" animationOut="fadeOut" isVisible={true}>
                    <MDBTable bordered table-fixed className="reportTable">
                      <MDBTableHead style={{backgroundColor: "rgb(228, 228, 228)", color: "black", fontWeight: "600"}}>
                        <tr className="textWeight">
                          <th style={{width: "2rem"}}></th>
                          <th style={{width: "11rem"}}>SRHM Report Name</th>
                          <th>Report Description</th>
                        </tr>
                      </MDBTableHead>
                      <MDBTableBody>
                        {this.state.srhmReports.map((rpt, i) => {     
                          
                          return (<tr className="textWeight">
                              <td><div class="pretty p-icon p-curve p-pulse">
                                  <input type="radio" id={rpt.shortName} value={this.state.reportName} name={rpt.component} defaultChecked= { false}  onChange={(e) => this.handleCheckboxChange(e, rpt.shortName)} ></input>
                                    <div class="state p-info-o">
                                      <i class="icon fa fa-check"></i>
                                        <label></label>
                                    </div>
                                </div></td>
                              <td>{rpt.name}</td>
                              <td>{rpt.description}</td>
                          </tr>)
                        })}
                      </MDBTableBody>
                    </MDBTable>
                    </Animated>
                  </MDBTabPane>

                )}
            />

          {/* Forms */}
          <RequirePrivilege
                  privilegeName="View Comms Reports"
                  yes={() => (
                  <MDBTabPane tabId="3" role="tabpanel">
                    <Animated animationIn="bounceInLeft" animationOut="fadeOut" isVisible={true}>
                    <MDBTable bordered table-fixed className="reportTable">
                      <MDBTableHead style={{backgroundColor: "rgb(228, 228, 228)", color: "black", fontWeight: "500"}}>
                        <tr className="textWeight">
                          <th style={{width: "2rem"}}></th>
                          <th style={{width: "11rem"}}>COMMS Report Name</th>
                          <th>Report Description</th>
                        </tr>
                      </MDBTableHead>
                      <MDBTableBody>

                      {this.state.commsReports.map((rpt, i) => {     
                        
                        return (<tr className="textWeight">
                            <td><div class="pretty p-icon p-curve p-pulse">
                                <input type="radio" id={rpt.name} value={this.state.reportName} name={rpt.component} defaultChecked= { false}  onChange={(e) => this.handleCheckboxChange(e, rpt.name)} ></input>
                                  <div class="state p-info-o">
                                    <i class="icon fa fa-check"></i>
                                      <label></label>
                                  </div>
                              </div></td>
                            <td>{rpt.name}</td>
                            <td>{rpt.description}</td>
                        </tr>)
                      })}
                      </MDBTableBody>
                    </MDBTable>
                      </Animated>
                  </MDBTabPane>

                  )}
            />

            {/* Users */}
            <MDBTabPane tabId="4" role="tabpanel">
            <Animated animationIn="bounceInLeft" animationOut="fadeOut" isVisible={true}>
              <MDBDataTable
                striped
                bordered
                small
                data={data}
              />
              </Animated>
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