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
    { id: 8, name: 'user', url: "/user" },
    { id: 8, name: 'project', url: "/project" },
    { id: 9, name: 'donor', url: "/donor" },
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
 * 
 */
export const getObject = function(value, arr, prop) {
        for(var i = 0; i < arr.length; i++) {
            if(arr[i][prop] === value) {
                return arr[i];
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

export const testingState = function (stateObj) {
    console.log("printing state...........................................");
    console.log(stateObj);
    // alert(stateObj.partnership_years);
}