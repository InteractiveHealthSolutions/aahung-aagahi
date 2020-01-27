import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { SessionRoute } from './access/SessionRoute';
import AddUser from './admin/AddUser';
import DonorRegistration from './common/DonorRegistration';
import ProjectDetails from './common/ProjectDetails';
import CommsTrainingDetails from './comms/CommsTrainingDetails';
import DistributionCommunicationMaterial from './comms/DistributionCommunicationMaterial';
import MobileCinemaDetails from './comms/MobileCinemaDetails';
import RadioAppearance from './comms/RadioAppearance';
import SocialMediaDetail from './comms/SocialMediaDetail';
import LoginPage from './login/LoginPage';
import MasterTrainerEligibilityCriteria from './lse/MasterTrainerEligibilityCriteria';
import MasterTrainerMockSessionEvaluation from './lse/MasterTrainerMockSessionEvaluation';
import OneTouchSessionDetail from './lse/OneTouchSessionDetail';
import ParentOrganizationRegistration from './lse/ParentOrganizationRegistration';
import ParentSessions from './lse/ParentSessions';
import ParticipantDetail from './lse/ParticipantDetail';
import SchoolDetails from './lse/SchoolDetails';
import SrhrPolicy from './lse/SrhrPolicy';
import StakeholderMeeting from './lse/StakeholderMeeting';
import StepDownTraining from './lse/StepDownTraining';
import TrainingDetails from './lse/TrainingDetails';
import SecondaryMonitoring from './lse/SecondaryMonitoring';
import PrimaryMonitoring from './lse/PrimaryMonitoring';
import AdminPage from './navigation/AdminPage';
import CommsMainPage from './navigation/CommsMainPage';
import LseMainPage from './navigation/LseMainPage';
import MainMenu from './navigation/MainMenu';
import ReportsNav from './navigation/ReportsNav';
import SrhmMainPage from './navigation/SrhmMainPage';
import AmplifyChangeParticipantDetail from './shrm/AmplifyChangeParticipantDetail';
import AmplifyChangeStepDownTrainingDetails from './shrm/AmplifyChangeStepDownTrainingDetails';
import AmplifyChangeTrainingDetails from './shrm/AmplifyChangeTrainingDetails';
import GeneralTrainingDetails from './shrm/GeneralTrainingDetails';
import GeneralParticipantDetail from './shrm/GeneralParticipantDetail';
import GeneralStepDownTrainingDetails from './shrm/GeneralStepDownTrainingDetails';
import DashboardMain from './dashboard/DashboardMain';
import HealthCareProviderReach from './shrm/HealthCareProviderReach';
import InstitutionDetail from './shrm/InstitutionDetail';
import NayaQadamStepDownTraining from './shrm/NayaQadamStepDownTraining';
import OneTouchSensitizationDetails from './shrm/OneTouchSensitizationDetails';

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
          <SessionRoute path='/dashboard' component={DashboardMain}/>
          <SessionRoute path='/masterTrainerEligibilityCriteria' component={MasterTrainerEligibilityCriteria} />
          <SessionRoute path='/mtMockSessionEvaluation' component={MasterTrainerMockSessionEvaluation} />
          <SessionRoute path='/parentSessionsForm' component={ParentSessions} />
          <SessionRoute path='/oneTouchSessionDetail' component={OneTouchSessionDetail} />
          <SessionRoute path='/stepDownTrainingMonitoring' component={StepDownTraining} />
          <SessionRoute path='/trainingDetailForm' component={TrainingDetails} />
          <SessionRoute path='/amplifyChangeTrainingDetails' component={AmplifyChangeTrainingDetails} />
          <SessionRoute path='/generalTrainingDetails' component={GeneralTrainingDetails} />
          <SessionRoute path='/secondaryMonitoring' component={SecondaryMonitoring} />
          <SessionRoute path='/primaryMonitoring' component={PrimaryMonitoring} />
        </Switch>
      </Router>
    );
  }
}

export default App;