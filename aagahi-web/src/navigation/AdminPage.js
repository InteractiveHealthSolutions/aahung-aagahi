import 'alertifyjs/build/css/alertify.css';
import classnames from 'classnames';
import { MDBBtn, MDBCard, MDBIcon, MDBMask, MDBNav, MDBNavbar, MDBNavbarBrand, MDBNavItem, MDBNavLink, MDBTabContent, MDBTabPane, MDBView } from "mdbreact";
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
import { apiUrl } from "../util/AahungUtil.js";
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

  };

  // for multi select
  valueChangeMulti(e, name) {
        
    console.log(e);
    this.setState({
        [name]: e
    });

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

  onChange = (date) => {
    console.log(date);
  }

  onClick = () =>  {
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

                  <MDBNavItem>
                    <MDBNavLink className={"nav-link Ripple-parent " + classnames({active2: this.state.activeItemJustified === '3'})} to="#" onClick={this.toggleJustified("3")} role="tab" >
                      Form
                    </MDBNavLink>
                  </MDBNavItem>

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
            <ParticipantSearch {...this.props} />
          </MDBTabPane>

          {/* Forms */}
          <MDBTabPane tabId="3" role="tabpanel" style={{height: "43em"}}>
            <FormSearch {...this.props}/>
          </MDBTabPane>

          {/* Location */}
          <MDBTabPane tabId="4" role="tabpanel" style={{height: "43em"}}>
                <LocationSearch {...this.props}/>
          </MDBTabPane>

          {/* Projects */}
          <MDBTabPane tabId="5" role="tabpanel" style={{height: "43em"}}>
            <ProjectSearch {...this.props}/>
          </MDBTabPane>

          {/* Donors */}
          <MDBTabPane tabId="6" role="tabpanel" style={{height: "43em"}}>
            <DonorSearch {...this.props}/>
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