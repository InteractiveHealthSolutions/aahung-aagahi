import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import './App.css';
import LoginPage from './login/LoginPage';
import MainMenu from './navigation/MainMenu';
import SrhmMainPage from './navigation/SrhmMainPage';
import LseMainPage from './navigation/LseMainPage';
import CommsMainPage from './navigation/CommsMainPage';
import ReportMainPage from './navigation/ReportMainPage';
import AdminMainPage from './navigation/AdminMainPage';
import AdminPage from './navigation/AdminPage';
import { SessionRoute } from './access/SessionRoute';
import ReportsNav from './navigation/ReportsNav';
import AddUser from './admin/AddUser';
import ProjectDetails from './common/ProjectDetails';
import DonorRegistration from './common/DonorRegistration';
import SchoolDetails from './lse/SchoolDetails';
import InstitutionDetail from './shrm/InstitutionDetail';
import ParentOrganizationRegistration from './lse/ParentOrganizationRegistration';
import ParticipantDetail from './lse/ParticipantDetail';
import GeneralParticipantDetail from './shrm/GeneralParticipantDetail';
import AmplifyChangeParticipantDetail from './shrm/AmplifyChangeParticipantDetail';
import StakeholderMeeting from './lse/StakeholderMeeting';
import RadioAppearance from './comms/RadioAppearance';
import SocialMediaDetail from './comms/SocialMediaDetail';
import DistributionCommunicationMaterial  from './comms/DistributionCommunicationMaterial';
import CommsTrainingDetails  from './comms/CommsTrainingDetails';
import MobileCinemaDetails  from './comms/MobileCinemaDetails';
import OneTouchSensitizationDetails from './shrm/OneTouchSensitizationDetails';
import NayaQadamStepDownTraining from './shrm/NayaQadamStepDownTraining';
import HealthCareProviderReach from './shrm/HealthCareProviderReach';
import AmplifyChangeStepDownTrainingDetails from './shrm/AmplifyChangeStepDownTrainingDetails';
import GeneralStepDownTrainingDetails from './shrm/GeneralStepDownTrainingDetails';
import SrhrPolicy from './lse/SrhrPolicy';
import MasterTrainerEligibilityCriteria from './lse/MasterTrainerEligibilityCriteria';
import MasterTrainerMockSessionEvaluation from './lse/MasterTrainerMockSessionEvaluation';

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path='/' exact={true} component={LoginPage}/>
          <SessionRoute path='/mainMenu' exact={true} component={MainMenu}/>
          <SessionRoute path='/srhmPage' component={SrhmMainPage}/>
          <SessionRoute path='/lsePage' component={LseMainPage}/>
          <SessionRoute path='/commsPage' component={CommsMainPage}/>
          <SessionRoute path='/reportNavPage' component={ReportsNav}/>
          <SessionRoute path='/reportPage' component={ReportMainPage}/>
          <SessionRoute path='/adminPage' component={AdminMainPage}/>
          <SessionRoute path='/admin' component={AdminPage}/>
          <SessionRoute path='/addUser'  component={AddUser}/>
          <SessionRoute path='/project'  component={ProjectDetails}/>
          <SessionRoute path='/donor'  component={DonorRegistration}/>
          <SessionRoute path='/schoolDetails'  component={SchoolDetails}/>
          <SessionRoute path='/institutionDetails'  component={InstitutionDetail}/>
          <SessionRoute path='/parentOrganizationRegistration'  component={ParentOrganizationRegistration}/>
          <SessionRoute path='/lseTeacherParticipant'  component={ParticipantDetail}/>
          <SessionRoute path='/srhmGeneralParticipant'  component={GeneralParticipantDetail}/>
          <SessionRoute path='/srhmAcParticipant'  component={AmplifyChangeParticipantDetail}/>
          <SessionRoute path='/stakeholderMeetings'  component={StakeholderMeeting}/>
          <SessionRoute path='/radioAppearanceForm'  component={RadioAppearance}/>
          <SessionRoute path='/socialMediaDetails'  component={SocialMediaDetail}/>
          <SessionRoute path='/distributionCommunicationMaterial'  component={DistributionCommunicationMaterial}/>
          <SessionRoute path='/trainingDetailsCommunications'  component={CommsTrainingDetails}/>
          <SessionRoute path='/mobileCinemaTheatreDetails'  component={MobileCinemaDetails}/>
          <SessionRoute path='/oneTouchSensitizationSessionDetails'  component={OneTouchSensitizationDetails}/>
          <SessionRoute path='/nayaQadamStepDownTraining'  component={NayaQadamStepDownTraining}/>
          <SessionRoute path='/healthCareProviderReach'  component={HealthCareProviderReach}/>
          <SessionRoute path='/srhrPolicy' component={SrhrPolicy}/>
          <SessionRoute path='/amplifyChangeStepDownTrainingDetails' component={AmplifyChangeStepDownTrainingDetails}/>
          <SessionRoute path='/generalStepDownTrainingDetails' component={GeneralStepDownTrainingDetails}/>
          <SessionRoute path='/masterTrainerEligibilityCriteria' component={MasterTrainerEligibilityCriteria}/>
          <SessionRoute path='/mtMockSessionEvaluation' component={MasterTrainerMockSessionEvaluation}/>
          
          
        </Switch>
      </Router>
    );
  }
}

export default App;