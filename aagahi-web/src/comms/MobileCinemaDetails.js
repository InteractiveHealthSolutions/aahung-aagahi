/**
 * @author Tahira Niazi
 * @email tahira.niazi@ihsinformatics.com
 * @create date 2019-08-28 15:41:38
 * @modify date 2019-08-28 15:41:38
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
import CustomModal from "../alerts/CustomModal";
import { useBeforeunload } from 'react-beforeunload';
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
import {RadioGroup, Radio} from 'react-radio-group';
import { getObject} from "../util/AahungUtil.js";
import TimePicker from 'react-time-picker';
import TimeField from 'react-simple-timefield';

const options = [
    { value: 'b37b9390-f14f-41da-893f-604def748fea', label: 'Sindh' },
    { value: 'b37b9390-f14f-41da-893f-604def748fea', label: 'Punjab' },
    { value: 'b37b9390-f14f-41da-893f-604def748fea', label: 'Balochistan' },
    { value: 'b37b9390-f14f-41da-893f-604def748fea', label: 'Khyber Pakhtunkhwa' },
];

const programsImplemented = [
    { label: 'CSA', value: 'csa'},
    { label: 'Gender', value: 'gender'},
    { label: 'LSBE', value: 'lsbe'},
];

// const options = [
//     { label: 'Math', value: 'math'},
//     { label: 'Science', value: 'science'},
//     { label: 'English', value: 'def'},
//     { label: 'Urdu', value: 'urdu', },
//     { label: 'Social Studies', value: 'social_studies'},
//     { label: 'Islamiat', value: 'islamiat'},
//     { label: 'Art', value: 'art', },
//     { label: 'Music', value: 'music'},
//     { label: 'Other', value: 'other', },
// ];

const schools = [
    { value: 'sindh', label: 'Sindh' },
    { value: 'punjab', label: 'Punjab' },
    { value: 'balochistan', label: 'Balochistan' },
    { value: 'khyber_pakhtunkhwa', label: 'Khyber Pakhtunkhwa' },
];


const coveredTopics = [
    { value: 'csa', label: 'CSA' },
    { value: 'gender_discrimination', label: 'Gender Discrimination' },
    { value: 'puberty', label: 'Puberty' },
    { value: 'sexual_harassment', label: 'Sexual Harassment' },
    { value: 'early_age_marriage', label: 'Early Age Marriage' },
    { value: 'family_planning', label: 'Family Planning' },
    { value: 'other', label: 'Other' }
];

const audienceSex = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' }
];

const audienceAge = [
    { value: '5_10', label: '5-10' },
    { value: '11_15', label: '11-15' },
    { value: '16_20', label: '16-20' },
    { value: '21_49', label: '21-49' },
    { value: '50+', label: '50+' }
];

const users = [
    { value: 'uuid1', label: 'Harry Potter' },
    { value: 'uuid2', label: 'Ron Weasley' },
    { value: 'uuid3', label: 'Hermione Granger' },
    { value: 'uuid4', label: 'Albus Dumbledore' },
];

const data = {
    provinces: [
      { id: 1, name: 'Sindh' },
      { id: 2, name: 'Punjab' },
      { id: 3, name: 'Balochistan' },
      { id: 4, name: 'KP' },
      { id: 5, name: 'Gilgit-Baltistan' },
      
    ],
    districts: [
      { id: 1, fullName: 'Badin', shortName: 'BDN', provinceId: 1 },
      { id: 2, fullName: 'Dadu', shortName: 'DAD', provinceId: 1 },
      { id: 3, fullName: 'Ghotki', shortName: 'GTK', provinceId: 1 },
      { id: 4, fullName: 'Hyderabad', shortName: 'HDD', provinceId: 1 },
      { id: 5, fullName: 'Jacobabad', shortName: 'JAG', provinceId: 1 },
      { id: 6, fullName: 'Jamshoro', shortName: 'JMS', provinceId: 1 },
      { id: 7, fullName: 'Karachi', shortName: 'KHI', provinceId: 1 },
      { id: 8, fullName: 'Kashmore', shortName: 'KSM', provinceId: 1 },
      { id: 9, fullName: 'Khairpur', shortName: 'KHP', provinceId: 1 },
      { id: 10, fullName: 'Korangi', shortName: 'KOR', provinceId: 1 },
      { id: 11, fullName: 'Larkana', shortName: 'LKN', provinceId: 1 },
      { id: 12, fullName: 'Malir', shortName: 'MLR', provinceId: 1 },
      { id: 13, fullName: 'Matiari', shortName: 'MTR', provinceId: 1 },
      { id: 14, fullName: 'Mirpur Khas', shortName: 'MPK', provinceId: 1 },
      { id: 15, fullName: 'Naushahro Feroze', shortName: 'NHF', provinceId: 1 },
      { id: 16, fullName: 'Qambar Shahdadkot', shortName: 'QMB', provinceId: 1 },
      { id: 17, fullName: 'Sanghar', shortName: 'SGR', provinceId: 1 },
      { id: 18, fullName: 'SBA', shortName: 'SBA', provinceId: 1 },
      { id: 19, fullName: 'Shikarpur', shortName: 'SKP', provinceId: 1 },
      { id: 20, fullName: 'Sujawal', shortName: 'SJW', provinceId: 1 },
      { id: 21, fullName: 'Sukkur', shortName: 'SKR', provinceId: 1 },
      { id: 22, fullName: 'Tando Allahyar', shortName: 'TNA', provinceId: 1 },
      { id: 23, fullName: 'Tando Muhammad Khan', shortName: 'TMK', provinceId: 1 },
      { id: 24, fullName: 'Tharparkar', shortName: 'TPK', provinceId: 1 },
      { id: 25, fullName: 'Thatta', shortName: 'THA', provinceId: 1 },
      { id: 26, fullName: 'Umerkot', shortName: 'UMK', provinceId: 1 },
      { id: 27, fullName: 'Islamabad', shortName: 'ISB', provinceId: 2 },
      { id: 28, fullName: 'Attock', shortName: 'ATK', provinceId: 2 },
      { id: 29, fullName: 'Bahawalnagar', shortName: 'BWN', provinceId: 2 },
      { id: 30, fullName: 'Bahawalpur', shortName: 'BWP', provinceId: 2 },
      { id: 31, fullName: 'Bhakkar', shortName: 'BKR', provinceId: 2 },
      { id: 32, fullName: 'Chakwal', shortName: 'CKW', provinceId: 2 },
      { id: 33, fullName: 'Chiniot', shortName: 'CNT', provinceId: 2 },
      { id: 34, fullName: 'Dera Ghazi Khan', shortName: 'DGK', provinceId: 2 },
      { id: 35, fullName: 'Faisalabad', shortName: 'FSB', provinceId: 2 },
      { id: 36, fullName: 'Gujranwala', shortName: 'GJW', provinceId: 2 },
      { id: 37, fullName: 'Gujrat', shortName: 'GJT', provinceId: 2 },
      { id: 38, fullName: 'Hafizabad', shortName: 'HFB', provinceId: 2 },
      { id: 39, fullName: 'Jhang', shortName: 'JNG', provinceId: 2 },
      { id: 40, fullName: 'Jhelum', shortName: 'JLM', provinceId: 2 },
      { id: 41, fullName: 'Kasur', shortName: 'KSR', provinceId: 2 },
      { id: 42, fullName: 'Khanewal', shortName: 'KNW', provinceId: 2 },
      { id: 43, fullName: 'Khushab', shortName: 'KSB', provinceId: 2 },
      { id: 44, fullName: 'Lahore', shortName: 'LHE', provinceId: 2 },
      { id: 45, fullName: 'Layyah', shortName: 'LYH', provinceId: 2 },
      { id: 46, fullName: 'Lodhran', shortName: 'LDN', provinceId: 2 },
      { id: 47, fullName: 'Mandi Bahauddin', shortName: 'MDB', provinceId: 2 },
      { id: 48, fullName: 'Mianwali', shortName: 'MNW', provinceId: 2 },
      { id: 49, fullName: 'Multan', shortName: 'MUL', provinceId: 2 },
      { id: 50, fullName: 'Muzaffargarh', shortName: 'MZG', provinceId: 2 },
      { id: 51, fullName: 'Narowal', shortName: 'NRW', provinceId: 2 },
      { id: 52, fullName: 'Nankana Sahib', shortName: 'NNS', provinceId: 2 },
      { id: 53, fullName: 'Okara', shortName: 'OKR', provinceId: 2 },
      { id: 54, fullName: 'Pakpattan', shortName: 'PKP', provinceId: 2 },
      { id: 55, fullName: 'Rahim Yar Khan', shortName: 'RYK', provinceId: 2 },
      { id: 56, fullName: 'Rajanpur', shortName: 'RJP', provinceId: 2 },
      { id: 57, fullName: 'Rawalpindi', shortName: 'RWP', provinceId: 2 },
      { id: 58, fullName: 'Sahiwal', shortName: 'SHW', provinceId: 2 },
      { id: 59, fullName: 'Sargodha', shortName: 'SGH', provinceId: 2 },
      { id: 60, fullName: 'Sheikhupura', shortName: 'SUP', provinceId: 2 },
      { id: 61, fullName: 'Sialkot', shortName: 'SLT', provinceId: 2 },
      { id: 62, fullName: 'Toba Tek Singh', shortName: 'TTS', provinceId: 2 },
      { id: 63, fullName: 'Vehari', shortName: 'VHR', provinceId: 2 },
      { id: 64, fullName: 'Awaran', shortName: 'AWR', provinceId: 3 },
      { id: 65, fullName: 'Barkhan', shortName: 'BRK', provinceId: 3 },
      { id: 66, fullName: 'Chagai', shortName: 'CGI', provinceId: 3 },
      { id: 67, fullName: 'Dera Bugti', shortName: 'DRB', provinceId: 3 },
      { id: 68, fullName: 'Gwadar', shortName: 'GWD', provinceId: 3 },
      { id: 69, fullName: 'Harnai', shortName: 'HRN', provinceId: 3 },
      { id: 70, fullName: 'Jafarabad', shortName: 'JFB', provinceId: 3 },
      { id: 71, fullName: 'Jhal Magsi', shortName: 'JMG', provinceId: 3 },
      { id: 72, fullName: 'Kachhi', shortName: 'KCH', provinceId: 3 },
      { id: 73, fullName: 'Kalat', shortName: 'KLT', provinceId: 3 },
      { id: 74, fullName: 'Kech', shortName: 'KEH', provinceId: 3 },
      { id: 75, fullName: 'Kharan', shortName: 'KRN', provinceId: 3 },
      { id: 76, fullName: 'Khuzdar', shortName: 'KZD', provinceId: 3 },
      { id: 77, fullName: 'Killa Abdullah', shortName: 'KAB', provinceId: 3 },
      { id: 78, fullName: 'Killa Saifullah', shortName: 'KSA', provinceId: 3 },
      { id: 79, fullName: 'Kohlu', shortName: 'KHL', provinceId: 3 },
      { id: 80, fullName: 'Lasbela', shortName: 'LBL', provinceId: 3 },
      { id: 81, fullName: 'Lehri', shortName: 'LRI', provinceId: 3 },
      { id: 82, fullName: 'Loralai', shortName: 'LRL', provinceId: 3 },
      { id: 83, fullName: 'Mastung', shortName: 'MST', provinceId: 3 },
      { id: 84, fullName: 'Musakhel', shortName: 'MKL', provinceId: 3 },
      { id: 85, fullName: 'Nasirabad', shortName: 'NSB', provinceId: 3 },
      { id: 86, fullName: 'Nushki', shortName: 'NSK', provinceId: 3 },
      { id: 87, fullName: 'Panjgur', shortName: 'PJG', provinceId: 3 },
      { id: 88, fullName: 'Pishin', shortName: 'PSN', provinceId: 3 },
      { id: 89, fullName: 'Quetta', shortName: 'QET', provinceId: 3 },
      { id: 90, fullName: 'Sherani', shortName: 'SRN', provinceId: 3 },
      { id: 91, fullName: 'Sibi', shortName: 'SBI', provinceId: 3 },
      { id: 92, fullName: 'Sohbatpur', shortName: 'SBP', provinceId: 3 },
      { id: 93, fullName: 'Washuk', shortName: 'WSK', provinceId: 3 },
      { id: 94, fullName: 'Zhob', shortName: 'ZHB', provinceId: 3 },
      { id: 95, fullName: 'Ziarat', shortName: 'ZRT', provinceId: 3 },
      { id: 96, fullName: 'Abbottabad', shortName: 'ABB', provinceId: 4 },
      { id: 97, fullName: 'Bajaur', shortName: 'BJR', provinceId: 4 },
      { id: 98, fullName: 'Bannu', shortName: 'BNU', provinceId: 4 },
      { id: 99, fullName: 'Battagram', shortName: 'BTG', provinceId: 4 },
      { id: 100, fullName: 'Buner', shortName: 'BNR', provinceId: 4 },
      { id: 101, fullName: 'Charsadda', shortName: 'CRD', provinceId: 4 },
      { id: 102, fullName: 'Chitral', shortName: 'CRL', provinceId: 4 },
      { id: 103, fullName: 'Dera Ismail Khan', shortName: 'DIK', provinceId: 4 },
      { id: 104, fullName: 'Hangu', shortName: 'HNG', provinceId: 4 },
      { id: 105, fullName: 'Haripur', shortName: 'HRP', provinceId: 4 },
      { id: 106, fullName: 'Karak', shortName: 'KRK', provinceId: 4 },
      { id: 107, fullName: 'Khyber', shortName: 'KBR', provinceId: 4 },
      { id: 108, fullName: 'Kohat', shortName: 'KOT', provinceId: 4 },
      { id: 109, fullName: 'Kurram', shortName: 'KRM', provinceId: 4 },
      { id: 110, fullName: 'Kolai Pallas', shortName: 'KLP', provinceId: 4 },
      { id: 111, fullName: 'Lakki Marwat', shortName: 'LKM', provinceId: 4 },
      { id: 112, fullName: 'Lower Dir', shortName: 'LDR', provinceId: 4 },
      { id: 113, fullName: 'Lower Kohistan', shortName: 'LKT', provinceId: 4 },
      { id: 114, fullName: 'Malakand', shortName: 'MLK', provinceId: 4 },
      { id: 115, fullName: 'Mansehra', shortName: 'MSR', provinceId: 4 },
      { id: 116, fullName: 'Mardan', shortName: 'MRD', provinceId: 4 },
      { id: 117, fullName: 'Mohmand', shortName: 'MMN', provinceId: 4 },
      { id: 118, fullName: 'North Waziristan', shortName: 'NWZ', provinceId: 4 },
      { id: 119, fullName: 'Nowshera', shortName: 'NSR', provinceId: 4 },
      { id: 120, fullName: 'Orakzai', shortName: 'OKZ', provinceId: 4 },
      { id: 121, fullName: 'Peshawar', shortName: 'PEW', provinceId: 4 },
      { id: 122, fullName: 'Shangla', shortName: 'SNL', provinceId: 4 },
      { id: 123, fullName: 'South Waziristan', shortName: 'SWZ', provinceId: 4 },
      { id: 124, fullName: 'Swabi', shortName: 'SWB', provinceId: 4 },
      { id: 125, fullName: 'Swat', shortName: 'SWT', provinceId: 4 },
      { id: 126, fullName: 'Tank', shortName: 'TNK', provinceId: 4 },
      { id: 127, fullName: 'Torghar', shortName: 'TGR', provinceId: 4 },
      { id: 128, fullName: 'Upper Dir', shortName: 'UPD', provinceId: 4 },
      { id: 129, fullName: 'Upper Kohistan', shortName: 'UPK', provinceId: 4 },
      { id: 128, fullName: 'Ghanche', shortName: 'GNC', provinceId: 5 },
      { id: 129, fullName: 'Skardu', shortName: 'SDU', provinceId: 5 },
      { id: 130, fullName: 'Astore', shortName: 'AST', provinceId: 5 },
      { id: 131, fullName: 'Diamer', shortName: 'DAM', provinceId: 5 },
      { id: 132, fullName: 'Ghizer', shortName: 'GZR', provinceId: 5 },
      { id: 133, fullName: 'Gilgit', shortName: 'GIL', provinceId: 5 },
      { id: 134, fullName: 'Hunza', shortName: 'HUN', provinceId: 5 },
      { id: 135, fullName: 'Kharmang', shortName: 'KMG', provinceId: 5 },
      { id: 136, fullName: 'Shigar', shortName: 'SHI', provinceId: 5 },
      { id: 137, fullName: 'Nagar', shortName: 'NAG', provinceId: 5 },
    ]
  };
    

class MobileCinemaDetails extends React.Component {

    modal = false;

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);

        this.state = {
            // TODO: fill UUIDs everywhere where required
            // options : [{value: 'math'},
            // {value: 'science'}],
            elements: ['program_implemented', 'school_level','donor_name'],
            date_start: '',
            participant_id : '',
            participant_name: '',
            dob: '',
            sex : '',
            school_id: [],
            csa_prompts: '',
            subject_taught : [], // all the form elements states are in underscore notation i.e variable names in codebook
            subject_taught_other: '',
            teaching_years: '',
            education_level: 'no_edu',
            donor_name: '',
            activeTab: '1',
            page2Show: true,
            viewMode: false,
            editMode: false,
            errors: {},
            isCsa: true,
            isGender: false,
            hasError: false,
            provinces: data.provinces,
            provinceId: null,
            districts: data.districts,
            districtId: null
        };

        this.cancelCheck = this.cancelCheck.bind(this);
        this.callModal = this.callModal.bind(this);
        this.valueChangeMulti = this.valueChangeMulti.bind(this);
        this.valueChange = this.valueChange.bind(this);
        this.calculateScore = this.calculateScore.bind(this);
        this.inputChange = this.inputChange.bind(this);

        this.isTopicOther = false;
       
        this.isOtherTopic = false;
        this.isOtherSex = false; 
        this.isFemale = false;
        this.isMale = false;
        this.isFive = false;
        this.isEleven = false;
        this.isSixteen = false;
        this.isTwentyOne = false;
        this.isFiftyPlus = false;

        this.isRemoveInfo = false;

        this.distributionTopics = [
            { value: 'aahung_information', label: 'Aahung Information' },
            { value: 'aahung_mugs', label: 'Aahung Mugs' },
            { value: 'aahung_folders', label: 'Aahung Folders' },
            { value: 'aahung_notebooks', label: 'Aahung Notebooks' },
            { value: 'nikah_nama', label: 'Nikah Nama' },
            { value: 'puberty', label: 'puberty' },
            { value: 'rtis', label: 'RTIs' },
            { value: 'ungei', label: 'UNGEI' },
            { value: 'stis', label: 'STIs' },
            { value: 'sexual_health', label: 'Sexual Health' },
            { value: 'pre_marital_information', label: 'Pre-marital Information' },
            { value: 'pac', label: 'PAC' },
            { value: 'maternal_health', label: 'Maternal Health' },
            { value: 'other', label: 'Other' }
        
        ];

    }

    componentDidMount() {

        // TODO: checking view mode, view mode will become active after the form is populated
        // this.setState({
            // school_id : getObject('khyber_pakhtunkhwa', schools, 'value'), // autopopulate in view: for single select autocomplete
            // monitor: [{value: 'sindh'}, {value: 'punjab'}], // // autopopulate in view: for multi-select autocomplete
            // viewMode : true,    
        // })

        window.addEventListener('beforeunload', this.beforeunload.bind(this));



    }

    componentWillUnmount() {

        window.removeEventListener('beforeunload', this.beforeunload.bind(this));
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    beforeunload(e) {
          e.preventDefault();
          e.returnValue = true;
      }


    cancelCheck = () => {

        let errors = {};

        console.log(" ============================================================= ")
        // alert(this.state.program_implemented + " ----- " + this.state.school_level + "-----" + this.state.sex);
        console.log("program_implemented below:");
        console.log(this.state.program_implemented);
        console.log("school_level below:");
        console.log(this.state.school_level);
        console.log("school_id below:");
        console.log(this.state.school_id);
        console.log(getObject('khyber_pakhtunkhwa', schools, 'value'));
        console.log(this.state.donor_name);
        console.log(this.state.date_start);
        this.handleValidation();

        this.setState({
            hasError : true
        })

        // receiving value directly from widget but it still requires widget to have on change methods to set it's value
        // alert(document.getElementById("date_start").value);
    }

    // for text and numeric questions
    inputChange(e, name) {

        console.log(e);
        this.setState({
            [name]: e.target.value
        });
        
        if(name === "date_start") {
            this.setState({ date_start: e.target.value});
        }
    }

    // for single select
    valueChange = (e, name) => {
        this.setState ({sex : e.target.value });
        this.setState ({sex : e.target.value });

        this.setState({
            [name]: e.target.value
        });

        if(e.target.id === "city") {
            this.isCityOther = e.target.value === "other" ? true : false;
        }
    }

    // only for time widget <TimeField>
    getTime = (e, name) => {
        this.setState({
            [name]: e
        });
    }

    // calculate score from scoring questions (radiobuttons)
    calculateScore = (e, name) => {
        this.setState({
            [name]: e.target.value
        });
    }

    // for multi select
    valueChangeMulti(e, name) {
        console.log(e);

        this.setState({
            [name]: e
        });

        if (name === "screening_topic") {
            if (getObject('other', e, 'value') != -1) {
                this.isOtherTopic = true;
            }
            if (getObject('other', e, 'value') == -1) {
                this.isOtherTopic = false
            }
        }

        if (name === "audience_sex") {
            if (getObject('other', e, 'value') != -1) {
                this.isOtherSex = true;
            }
            if (getObject('other', e, 'value') == -1) {
                this.isOtherSex = false;
            }

            if (getObject('female', e, 'value') != -1) {
                this.isFemale = true;
            }
            if (getObject('female', e, 'value') == -1) {
                this.isFemale = false;
            }

            if (getObject('male', e, 'value') != -1) {
                this.isMale = true;
            }
            if (getObject('male', e, 'value') == -1) {
                this.isMale = false;
            }

        }

        if (name === "audience_age") {
            if (getObject('5_10', e, 'value') != -1) {
                this.isFive = true;
            }
            if (getObject('5_10', e, 'value') == -1) {
                this.isFive = false;
            }

            if (getObject('11_15', e, 'value') != -1) {
                this.isEleven = true;
            }
            if (getObject('11_15', e, 'value') == -1) {
                this.isEleven = false;
            }

            if (getObject('16_20', e, 'value') != -1) {
                this.isSixteen = true;
            }
            if (getObject('16_20', e, 'value') == -1) {
                this.isSixteen = false;
            }

            if (getObject('21_49', e, 'value') != -1) {
                this.isTwentyOne = true;
            }
            if (getObject('21_49', e, 'value') == -1) {
                this.isTwentyOne = false;
            }

            if (getObject('50+', e, 'value') != -1) {
                this.isFiftyPlus = true;
            }
            if (getObject('50+', e, 'value') == -1) {
                this.isFiftyPlus = false;
            }
        }
    }

    callModal = () => {
        this.setState({ modal : !this.state.modal });
    }

    // for autocomplete single select
    handleChange(e, name) {
        // alert(e.label); // label: Punjab
        this.setState({
            [name]: e
        });

        console.log(this.state.selectedOption)
        console.log("=============")
        // console.log(`Option selected:`, school_id);
        console.log(this.state.school_id);
        // console.log(this.state.school_id.value);
    };
    

    // handleOnSubmit = e => {
    //     e.preventDefault();
    //     // pass form data
    //     // get it from state
    //     const formData = {};
    //     this.finallySubmit(formData);
    //   };

    finallySubmit = formData => {
    };


    handleValidation(){
        // check each required state
        let errors = {};
        let formIsValid = true;
        console.log("showing csa_prompts")
        console.log(this.state.csa_prompts);
        if(this.state.csa_prompts === '') {
            formIsValid = false;
            errors["csa_prompts"] = "Cannot be empty";
            // alert(errors["csa_prompts"]);
        }

        // //Name
        // if(!fields["name"]){
        //   formIsValid = false;
        //   errors["name"] = "Cannot be empty";
        // }
    
        this.setState({errors: errors});
        return formIsValid;
    }

    handleSubmit(event) {
        // event.preventDefault();
        // const data = new FormData(event.target);
        // console.log(data.get('participantScore'));

        fetch('/api/form-submit-url', {
            method: 'POST',
            // body: data,
        });
    }


    render() {

        const page2style = this.state.page2Show ? {} : { display: 'none' };

        // for view mode
        const setDisable = this.state.viewMode ? "disabled" : "";

        // skip logics
        const cityOtherStyle = this.isCityOther ? {} : { display: 'none' };
        
        const otherTopicStyle = this.isOtherTopic ? {} : { display: 'none' };
        const otherSexStyle = this.isOtherSex ? {} : { display: 'none' };
        const femaleStyle = this.isFemale ? {} : { display: 'none' };
        const maleStyle = this.isMale ? {} : { display: 'none' };
        const fiveTenStyle = this.isFive ? {} : { display: 'none' };
        const elevenStyle = this.isEleven ? {} : { display: 'none' };
        const sixteenStyle = this.isSixteen ? {} : { display: 'none' };
        const twentyOneStyle = this.isTwentyOne ? {} : { display: 'none' };
        const fiftyPlusStyle = this.isFiftyPlus ? {} : { display: 'none' };

        

        const { selectedOption } = this.state;
        // scoring labels
        
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
                                            <CardHeader>
                                                <i className="header-icon lnr-license icon-gradient bg-plum-plate"> </i>
                                                <b>Mobile Cinema/Theatre Details Form</b>
                                            </CardHeader>
                                        </Card>
                                    </Col>
                                </Row>

                                {/* <br/> */}

                                <Row>
                                    <Col md="12">
                                        <Card className="main-card mb-6 center-col">
                                            <CardBody>

                                                {/* error message div */}
                                                <div class="alert alert-danger" style={this.state.hasError ? {} : { display: 'none' }} >
                                                <span class="errorMessage"><u>Errors: <br/></u> Form has some errors. Please check for required and invalid fields.<br/></span>
                                                </div>

                                                <br/>
                                                <Form id="mobileForm">
                                                <fieldset >
                                                    <TabContent activeTab={this.state.activeTab}>
                                                        <TabPane tabId="1">
                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup inline>
                                                                    {/* TODO: autopopulate current date */}
                                                                        <Label for="date_start" >Form Date</Label> <span class="errorMessage">{this.state.errors["date_start"]}</span>
                                                                        <Input type="date" name="date_start" id="date_start" value={this.state.date_start} onChange={(e) => {this.inputChange(e, "date_start")}} />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup>
                                                                        <Label for="province" >Province</Label> <span class="errorMessage">{this.state.errors["province"]}</span>
                                                                        <Select id="province" name="province" value={this.state.province} onChange={(e) => this.handleChange(e, "province")} options={options} />
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6">
                                                                    <FormGroup> 
                                                                        <Label for="district" >District</Label> <span class="errorMessage">{this.state.errors["district"]}</span>
                                                                        <Select id="district"
                                                                            name="district"
                                                                            value={this.state.district}
                                                                            onChange={(e) => this.handleChange(e, "district")}
                                                                            options={options}
                                                                        />
                                                                    </FormGroup>
                                                                </Col>

                                                            </Row>

                                                            <Row>
                                                                <Col md="6">
                                                                    <FormGroup > 
                                                                            <Label for="screening_type" >Type of Screening</Label> <span class="errorMessage">{this.state.errors["screening_type"]}</span>
                                                                            <Input type="select" onChange={(e) => this.valueChange(e, "screening_type")} value={this.state.screening_type} name="screening_type" id="screening_type">
                                                                                <option value="cinema">Cinema</option>
                                                                                <option value="live_theatre">Live Theatre</option>
                                                                            </Input>
                                                                        </FormGroup>
                                                                        
                                                                </Col>
                                                                
                                                                <Col md="6" >
                                                                    <FormGroup >
                                                                        <Label for="screening_topic" >Topic Screened</Label> <span class="errorMessage">{this.state.errors["screening_topic"]}</span>
                                                                        <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e, "screening_topic")} value={this.state.screening_topic} id="screening_topic" options={coveredTopics} />  
                                                                    </FormGroup>
                                                                </Col>
                                                            

                                                                <Col md="6" style={otherTopicStyle}>
                                                                    <FormGroup >
                                                                        <Label for="screening_topic_other" >Specify Other Topic</Label> <span class="errorMessage">{this.state.errors["screening_topic_other"]}</span>
                                                                        <Input name="screening_topic_other" id="screening_topic_other" value={this.state.screening_topic_other} onChange={(e) => {this.inputChange(e, "screening_topic_other")}} maxLength="200" placeholder="Enter other"/>
                                                                    </FormGroup>
                                                                </Col>
                                                                
                                                                <Col md="6">
                                                                    <FormGroup >
                                                                        <Label for="performance_title">Name of Video or Performance</Label> <span class="errorMessage">{this.state.errors["performance_title"]}</span>
                                                                        <Input name="performance_title" id="performance_title" value={this.state.performance_title} onChange={(e) => {this.inputChange(e, "performance_title")}} maxLength="200" placeholder="Enter name"/>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" >
                                                                    <FormGroup >
                                                                        <Label for="audience_sex" >Sex of Audience</Label> <span class="errorMessage">{this.state.errors["audience_sex"]}</span>
                                                                        <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e, "audience_sex")} value={this.state.audience_sex} id="audience_sex" options={audienceSex} />  
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" style={maleStyle}>
                                                                    <FormGroup >
                                                                        <Label for="audience_female_num" >Number of Males</Label> <span class="errorMessage">{this.state.errors["audience_female_num"]}</span>
                                                                        <Input type="number" value={this.state.audience_female_num} name="audience_female_num" id="audience_female_num" onChange={(e) => { this.inputChange(e, "audience_female_num") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" style={femaleStyle}>
                                                                    <FormGroup >
                                                                        <Label for="audience_male_num" >Number of Females</Label> <span class="errorMessage">{this.state.errors["audience_male_num"]}</span>
                                                                        <Input type="number" value={this.state.audience_male_num} name="audience_male_num" id="audience_male_num" onChange={(e) => { this.inputChange(e, "audience_male_num") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" style={otherSexStyle}>
                                                                    <FormGroup >
                                                                        <Label for="audience_other_num" >Number of Other</Label> <span class="errorMessage">{this.state.errors["audience_other_num"]}</span>
                                                                        <Input type="number" value={this.state.audience_other_num} name="audience_other_num" id="audience_other_num" onChange={(e) => { this.inputChange(e, "audience_other_num") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                           

                                                                <Col md="6" >
                                                                    <FormGroup >
                                                                        <Label for="audience_age" >Age of Audience</Label> <span class="errorMessage">{this.state.errors["audience_age"]}</span>
                                                                        <ReactMultiSelectCheckboxes onChange={(e) => this.valueChangeMulti(e, "audience_age")} value={this.state.audience_age} id="audience_age" options={audienceAge} />  
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" style={fiveTenStyle}>
                                                                    <FormGroup >
                                                                        <Label for="audience_5to10_num" >Number of Audience Aged 5-10</Label> <span class="errorMessage">{this.state.errors["audience_5to10_num"]}</span>
                                                                        <Input type="number" value={this.state.audience_5to10_num} name="audience_5to10_num" id="audience_5to10_num" onChange={(e) => { this.inputChange(e, "audience_5to10_num") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" style={elevenStyle}>
                                                                    <FormGroup >
                                                                        <Label for="audience_11to15_num" >Number of Audience Aged 11-15</Label> <span class="errorMessage">{this.state.errors["audience_11to15_num"]}</span>
                                                                        <Input type="number" value={this.state.audience_11to15_num} name="audience_11to15_num" id="audience_11to15_num" onChange={(e) => { this.inputChange(e, "audience_11to15_num") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" style={sixteenStyle}>
                                                                    <FormGroup >
                                                                        <Label for="audience_16to20_num" >Number of Audience Aged 16-20</Label> <span class="errorMessage">{this.state.errors["audience_16to20_num"]}</span>
                                                                        <Input type="number" value={this.state.audience_16to20_num} name="audience_16to20_num" id="audience_16to20_num" onChange={(e) => { this.inputChange(e, "audience_16to20_num") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" style={twentyOneStyle}>
                                                                    <FormGroup >
                                                                        <Label for="audience_21to49_num" >Number of Audience Aged 21-49</Label> <span class="errorMessage">{this.state.errors["audience_21to49_num"]}</span>
                                                                        <Input type="number" value={this.state.audience_21to49_num} name="audience_21to49_num" id="audience_21to49_num" onChange={(e) => { this.inputChange(e, "audience_21to49_num") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col md="6" style={fiftyPlusStyle}>
                                                                    <FormGroup >
                                                                        <Label for="audience_50plus_num" >Number of Audience Aged 50+</Label> <span class="errorMessage">{this.state.errors["audience_50plus_num"]}</span>
                                                                        <Input type="number" value={this.state.audience_50plus_num} name="audience_50plus_num" id="audience_50plus_num" onChange={(e) => { this.inputChange(e, "audience_50plus_num") }} max="999" min="1" onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3) }} placeholder="Enter number"></Input>
                                                                    </FormGroup>
                                                                </Col>

                                                            </Row>

                                                            {/* please don't remove this div unless you are adding multiple questions here*/}
                                                            <div style={{height: '250px'}}><span>   </span></div>

                                                        </TabPane>
                                                    </TabContent>
                                                    </fieldset>
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
                                                        {/* <ButtonGroup size="sm">
                                                            <Button color="secondary" id="page1"
                                                                className={"btn-shadow " + classnames({ active: this.state.activeTab === '1' })}
                                                                onClick={() => {
                                                                    this.toggle('1');
                                                                }}
                                                            >Form</Button>  

                                                        </ButtonGroup> */}
                                                    </Col>
                                                    <Col md="3">
                                                    </Col>
                                                    <Col md="3">
                                                    </Col>
                                                    <Col md="3">
                                                        {/* <div className="btn-actions-pane-left"> */}
                                                        <Button className="mb-2 mr-2" color="success" size="sm" type="submit" onClick={this.handleSubmit} >Submit</Button>
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
                                <CustomModal
                                    modal={this.modal}
                                    // message="Some unsaved changes will be lost. Do you want to leave this page?"
                                    ModalHeader="Leave Page Confrimation!"
                                ></CustomModal>
                            </Container>

                        </div>
                    </ReactCSSTransitionGroup>
                </Fragment>

            </div>
        );
    }
}

export default MobileCinemaDetails;