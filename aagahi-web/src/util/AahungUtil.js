import { getProvinceByValue, getDistrictByValue } from "../util/LocationUtil.js";
import moment from 'moment';
export const apiUrl = 'http://ihs.ihsinformatics.com:9990/aahung-aagahi/api'; // for test server
// export const apiUrl = 'https://api.aahung.org/aahung-aagahi/api'; //for live server
export const parentLocationDefinitionUuid = 'cce863e8-d09b-11e9-b422-0242ac130002';
export const schoolDefinitionUuid = 'cce57479-d09b-11e9-b422-0242ac130002';
export const institutionDefinitionUuid = 'cce6ea85-d09b-11e9-b422-0242ac130002';

export const entityUrl = [
    { id: 1, name: 'school', url: "/schoolDetails" },
    { id: 2, name: 'institution', url: "/institutionDetails" },
    { id: 3, name: 'parent organization', url: "/parentOrganizationRegistration" },
    { id: 4, name: 'lse teacher participant', url: "/lseTeacherParticipant" },
    { id: 5, name: 'srhm general participant', url: "/srhmGeneralParticipant" },
    { id: 6, name: 'srhm ac participant', url: "/srhmAcParticipant" },
    { id: 8, name: 'user', url: "/addUser" },
    { id: 9, name: 'project', url: "/project" },
    { id: 10, name: 'donor', url: "/donor" },
    { id: 11, name: 'stakeholder meetings', url: "/stakeholderMeetings" },
    { id: 12, name: 'radio appearance form', url: "/radioAppearanceForm" },
    { id: 13, name: 'social media details', url: "/socialMediaDetails" },
    { id: 14, name: 'distribution of communication material', url: "/distributionCommunicationMaterial" },
    { id: 15, name: 'training details form - communications', url: "/trainingDetailsCommunications" },
    { id: 16, name: 'mobile cinema / theatre details form', url: "/mobileCinemaTheatreDetails" },
    { id: 17, name: 'one-touch sensitization session details form', url: "/oneTouchSensitizationSessionDetails" },
    { id: 18, name: 'naya qadam step down training details form', url: "/nayaQadamStepDownTraining" },
    { id: 19, name: 'health care provider reach form', url: "/healthCareProviderReach" },
    { id: 20, name: 'srhr policy form', url: "/srhrPolicy" },
    { id: 21, name: 'amplify change step down training details form', url: "/amplifyChangeStepDownTrainingDetails" },
    { id: 22, name: 'general step down training details form', url: "/generalStepDownTrainingDetails" },
    { id: 23, name: 'master trainer eligibility criteria assessment', url: "/masterTrainerEligibilityCriteria" },
    { id: 24, name: 'master trainer mock session evaluation form', url: "/mtMockSessionEvaluation" },
    

    
    
  ];

/**
 * returns entityUrl by name; this is needed to navigate to a particular url (after search) for edit feature
 */
export const getEntityUrlByName = function(entityName) {
    return entityUrl.filter(entity =>  entity.name === entityName )
};

export const checkValid = function(fields) {

    let isOk = true;
    this.errors = {};
    for(let j=0; j < fields.length; j++) {
        let stateName = fields[j];
        if(this.state[stateName] === "" || this.state[stateName] == undefined) {
            isOk = false;
            this.errors[fields[j]] = "Required!";
        }
    }
    return isOk;
};

/**
 * setting autocomplete single select tag when receiving value from server
 * value is the short_name (value) or id, arr is the options array (in case of onchangeMulti its the selected array), 
 * prop either label/value
 */
export const getObject = function(value, arr, prop) {
    if(arr != null) {
        for(var i = 0; i < arr.length; i++) {
            if(arr[i][prop] === value) {
                return arr[i];
            }
        }
    }
    return -1; //to handle the case where the value doesn't exist
};

/**
 * fetches resource integer id, shortname/identifier and uuid 
 */
export const getEntry = function(value, arr, prop) {
    for(var i = 0; i < arr.length; i++) {
        if(arr[i][prop] === value) {
            return arr[i];
        }
    }
    return -1; //to handle the case where the value doesn't exist
};

export const getHandler = function(resourceName, subResource, parameter) {

    let axios = require('axios');
    var categoryUuid = 'cce863e8-d09b-11e9-b422-0242ac130002'; 
    let URL =  'http://199.172.1.76:8080/aahung-aagahi/api/locations/category/' + categoryUuid;

    console.log(sessionStorage.getItem('auth_header'));
    axios.get(URL, { 'headers': {
        'Authorization': sessionStorage.getItem('auth_header'),
        } 
        }
    )
    .then(response => {
        console.log(response.data);
        
    })
    .catch((error) => {
        console.log(error); 
    });
}

export const matchPattern = function (pattern, value) {
    return value.match(pattern) != value ? false : true; 
}

export const clearCheckedFields = function () {
    //  clear all radio and checkboxes
    var els = document.querySelectorAll('input:checked');
    for(var i = 0; i< els.length; i++){
        console.log(els[i].type, els[i].value);
        els[i].checked = false;
    }
}

export const capitalize = function (stringValue) {
    var words = stringValue.split('_');
    for (let i=0; i < words.length; i++) {
        words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
    }
    return words.join(' ');
}

export const hasPrivilege = function (privilegeName) {
    var user = JSON.parse(sessionStorage.getItem('user'));
    var userRoles = user.userRoles;
    var isAllowed = false;

    // check the if the user has the required privilge
    for (let i = 0; i < userRoles.length; i++) {
        // return true if user has admin role
        if (userRoles[i].roleName === "Admin") {
            isAllowed = true;
            return isAllowed;
        }
        var rolePrivileges = userRoles[i].rolePrivileges;
        var hasPrivilege = rolePrivileges.filter(privilege => privilege.privilegeName === privilegeName);
        if (hasPrivilege != null && hasPrivilege.length > 0) {
            isAllowed = true;
            return isAllowed;
        }
    }
    return false;
}

export const loadFormState = function (formDataObj, stateObj) {
    console.log("printing state...........................................");
    console.log(stateObj);

    let self = this;
    formDataObj.data.map(function(element, i) {
        switch((element.dataType).toLowerCase()) {
            
            case 'string':
                if(moment(element.value, 'LT', true).isValid()) {
                    var time = element.value;
                    var datetimeString = moment(time, 'HH:mm'); 
                    var dateObj = datetimeString.toDate();
                    stateObj.time_radio_show = dateObj;
                }
                else {
                    stateObj[element.key.shortName] = element.value;
                }
                break;
            
            case 'province':
                var province = element.value !== '' ? getProvinceByValue(element.value) : {};
                stateObj[element.key.shortName] = province;
                break;

            case 'district':
                var district = element.value !== undefined ? getDistrictByValue(element.value) : {};
                stateObj[element.key.shortName] = district;
                break;

            case 'date':
                stateObj[element.key.shortName] = moment(element.value).format('YYYY-MM-DD');
                break;

            case 'province':
                var provinceValue = self.fetchedForm.data.filter(element => element.key.shortName === "province")[0].value;
                var province = provinceValue !== undefined ? getProvinceByValue(provinceValue) : {};
                stateObj[element.key.shortName] = province;
                break;

            case 'district':
                var districtValue = self.fetchedForm.data.filter(element => element.key.shortName === "district")[0].value;
                var district = districtValue !== undefined ? getDistrictByValue(districtValue) : {};
                stateObj[element.key.shortName] = district;
                break;
            
            case 'int':
                stateObj[element.key.shortName] = element.value;
                break;
            
            case 'float':
                stateObj[element.key.shortName] = element.value;
                break;

            case 'definition':
                stateObj[element.key.shortName] = element.value.shortName;
                break;

            case 'user_array':
                var userList = [];
                var userObj = {};
                element.value.forEach( function (user) {
                    userObj = { label: user.fullName, value: user.userId, id: user.userId};
                    userList.push(userObj);
                })
                stateObj[element.key.shortName] = userList;
                break;

            case 'definition_array':
                var definitionList = [];
                var definitionObj = {};
                element.value.forEach( function (def) {
                    definitionObj = { label: def.definitionName, value: def.shortName };
                    definitionList.push(definitionObj);
                })
                stateObj[element.key.shortName] = definitionList;
                break;

            case 'donor_array':
                var donorList = [];
                var donorObj = {};
                element.value.forEach( function (donor) {
                    donorObj = { label: donor.shortName, value: donor.donorId, id: donor.donorId};
                    donorList.push(donorObj);
                })
                stateObj[element.key.shortName] = donorList;
                break;

            case 'participant':
                stateObj[element.key.shortName] = element.value.identifier;
                stateObj.participant_name = {"id" : element.value.participantId, "value" : element.value.identifier, "uuid" : element.value.uuid, "fullName" : element.value.person.firstName , "label" : element.value.person.firstName, "personId" : element.value.person.personId, "personUuid" : element.value.person.uuid, "gender" : element.value.person.gender,}
                break;
        }
    })

    return stateObj;
    
}

export const resetFormState = function (fields, stateObj) {
    
    for(let j=0; j < fields.length; j++) {
        let stateName = fields[j];
        // time field case
        if(typeof stateObj[stateName] === 'object' && moment(stateObj[stateName], 'LT', true).isValid()) {
            stateObj[stateName] = new Date();
        }

        // for array object
        else if(typeof stateObj[stateName] === 'object') {
            stateObj[stateName] = [];
        }

        // for text and others
        else if(typeof stateObj[stateName] != 'object') {
            stateObj[stateName] = ''; 
        }
    }

    return stateObj;
}