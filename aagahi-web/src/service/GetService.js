/**
 * @author Tahira Niazi
 * @email tahira.niazi@ihsinformatics.com
 * @create date 2019-09-07 23:30:00
 * @modify date 2019-09-07 23:30:00
 * @desc [description]
 */

import { apiUrl } from "../util/AahungUtil.js";

var serverAddress = apiUrl;
let axios = require('axios');
var rest_header = localStorage.getItem('auth_header'); 
// resources
const DONOR = "donor";
const DONORS_LIST = "donors";
const USER = "user";
const USER_LIST = "users";
const ROLE = "role";
const ROLE_By_NAME = "role/name";
const ROLE_LIST = "roles";
const USERS_BY_ROLE = "users/role";
const DEFINITION = "definition";
const DEFINITION_BY_ID = "definition/id";
const DEFINITION_TYPE = "definition";
const LOCATION = "location";
const LOCATION_ATTRIBUTE_TYPE = "locationattributetype";
const LOCATION_BY_CATEGORY = "locations/category";
const DEFINITION_BY_DEFNINITION_TYPE = "definitions/definitiontype";
const PROJECT_LIST = "projects";
const LOCATION_ATTRIBUTE_TYPE_BY_LOCATION = "locationattributes/location";
const FORM_TYPE = "formtype";
const PARTICIPANT_BY_LOCATION = "participants/location";

function getLocationBySingleContent(content) {

}

function getDefinitionBySingleContent(content) {
    
}

/**
 * content can be shortname of uuid
 */
export const getDefinitionsByDefinitionType = async function(content) {
    
    console.log("GetService > calling getDefinitionByDefinitionType()");

    try {
        let result = await getData(DEFINITION_BY_DEFNINITION_TYPE, content);
        let array = [];
        result.forEach(function(obj) {

            console.log("id" + obj.definitionId, "value: " + obj.definitionId, "uuid: " + obj.uuid, "shortName: " + obj.shortName, "label: " + obj.definitionName);
            array.push({ "id" : obj.definitionId, "value" : obj.definitionId, "uuid" : obj.uuid, "shortName" : obj.shortName, "label" : obj.definitionName, "definitionName" : obj.definitionName});
        })
        console.log(array);
        return array;
    }
    catch(error) {
        return error;
    }
}


/**
 * content can be shortname of uuid
 */
export const getDefinitionsByDefinitionId = async function(content) {
    
    console.log("GetService > calling getDefinitionsByDefinitionType()");

    try {
        let result = await getData(DEFINITION_BY_ID, content);
        console.log(result);
        return result;
    }
    catch(error) {
        return error;
    }
}

/**
 * definitionType > definitionType.shortname
 * shortName > definition.shortName
 * return id of definition
 */
export const getDefinitionId = async function(definitionType, shortName) {

    console.log("GetService > getDefinitioId()");

    try {
        let definitions = await getDefinitionsByDefinitionType(definitionType);
        // alert(definitions.length);
        let definitionId = definitions.find(def => def.shortName === shortName).id;
        // alert(definitionId);
        return definitionId;
    }
    catch(error) {
        return error;
    }
}


export const getAllDonors = async function() {

    try {
        let result = await getData(DONORS_LIST);
        console.log(result);
        let array = [];
        result.forEach(function(obj) {

            console.log("id: " + obj.donorId, "uuid: " + obj.uuid, "shortName: " + obj.shortName, "name: " + obj.donorName, "label: " + obj.shortName + "value: " + obj.donorId);
            array.push({ "id" : obj.donorId, "uuid" : obj.uuid, "shortName" : obj.shortName, "name" : obj.donorName, "label" : obj.shortName, "value" : obj.donorId});
        })
        console.log(array);
        return array;
    }
    catch(error) {   
        return error;
    }
}


export const getAllProjects = async function() {

    try {
        let result = await getData(PROJECT_LIST);
        console.log(result);
        let array = [];
        result.forEach(function(obj) {

            console.log("id: " + obj.projectId, "uuid: " + obj.uuid, "shortName: " + obj.shortName, "name: " + obj.projectName, "label: " + obj.shortName + "value: " + obj.donorId);
            array.push({ "id" : obj.projectId, "uuid" : obj.uuid, "shortName" : obj.shortName, "name" : obj.projectName, "label" : obj.shortName, "value" : obj.shortName, "donorName" : obj.donor.donorName, "donorId" : obj.donor.donorId});
        })
        console.log(array);
        return array;
    }
    catch(error) {   
        return error;
    }
}

export const getAllUsers = async function() {

    try {
        let result = await getData(USER_LIST);
        console.log(result);
        console.log(result.length);
        let array = [];
        result.forEach(function(obj) {
            array.push({ "id" : obj.userId, "uuid" : obj.uuid, "username" : obj.username, "fullName" : obj.fullName, "voided" : obj.isVoided, "label" : obj.fullName, "value" : obj.userId});
        })
        console.log(array);
        return array;
    }
    catch(error) {
        return error;
    }
    
}

/**
 * returns array of users holding id, uuid, identifier, name
 * content is role uuid
 */
export const getUsersByRole = async function(content) {
    console.log("GetService > calling getUsersByRole()");

    try {
        let result = await getData(USERS_BY_ROLE, content);
        let array = [];
        result.forEach(function(obj) {

            array.push({ "id" : obj.userId, "uuid" : obj.uuid, "username" : obj.username, "fullName" : obj.fullName, "voided" : obj.isVoided, "label" : obj.username, "value" : obj.userId});
        })
        console.log(array);
        return array;
    }
    catch(error) {
        return error;
    }
}

export const getAllRoles = async function() {

    try {
        let result = await getData(ROLE_LIST);
        console.log(result);
        console.log(result.length);
        let array = [];
        result.forEach(function(obj) {
            array.push({ "id" : obj.roleId, "uuid" : obj.uuid, "roleName" : obj.roleName, "isRetired" : obj.isRetired});
        })
        console.log(array);
        return array;
    }
    catch(error) {
        return error;
    }
}



/**
 * returns array of locations holding id, uuid, identifier, name
 * content can be either short_name or uuid
 */
export const getLocationsByCategory = async function(content) {
    console.log("GetService > calling getLocationsByCategory()");

    try {
        let result = await getData(LOCATION_BY_CATEGORY, content);
        let array = [];
        result.forEach(function(obj) {

            console.log("id" + obj.locationId, "value: " + obj.locationId, "uuid: " + obj.uuid, "shortName: " + obj.shortName, "label: " + obj.locationName);
            array.push({ "id" : obj.locationId, "value" : obj.locationName, "uuid" : obj.uuid, "shortName" : obj.shortName, "label" : obj.shortName, "locationName" : obj.locationName});
        })
        console.log(array);
        return array;
    }
    catch(error) {
        return error;
    }
}

/**
 * Gets location by location shortname
 */
export const getLocationByShortname = async function(content) {

    console.log("GetService > getLocationByShortname()");

    try {
        var resourceName = LOCATION + "/" + "shortname";
        let result = await getData(resourceName, content);
        console.log(result);
        return result;
    }
    catch(error) {
        return error;
    }
}

/**
 * Gets role by role name
 */
export const getRoleByName = async function(content) {

    console.log("GetService > getRoleByName()");

    try {
        var resourceName = ROLE_By_NAME;
        let result = await getData(resourceName, content);
        console.log(result);
        return result;
    }
    catch(error) {
        return error;
    }
}

/**
 * return list of participant > content can be either lcoation uuid or shortname
 */
export const getParticipantsByLocation = async function(content) {
    console.log("GetService > calling getLocationsByCategory()");

    try {
        let result = await getData(PARTICIPANT_BY_LOCATION, content);
        let array = [];
        result.forEach(function(obj) {

            array.push({ "id" : obj.participantId, "value" : obj.identifier, "uuid" : obj.uuid, "fullName" : obj.person.firstName , "label" : obj.person.firstName, "personId" : obj.person.personId, "gender" : obj.person.gender, "identifier" : obj.identifier });
        })
        console.log(array);
        return array;
    }
    catch(error) {
        return error;
    }
}

/**
 * 
 */
export const getFormTypeByUuid = async function(content) {

    console.log("GetService > getFormTypeByUuid()");

    try {
        var resourceName = FORM_TYPE ;
        let result = await getData(resourceName, content);
        console.log(result);
        return result;
    }
    catch(error) {
        return error;
    }
}


/**
 * returns array of locations holding id, uuid, identifier, name
 * content can be either short_name or uuid
 */
export const getLocationAttributesByLocation = async function(content) {
    console.log("GetService > calling getLocationAttributesByLocation()");

    try {
        let result = await getData(LOCATION_ATTRIBUTE_TYPE_BY_LOCATION, content);
        console.log(result);
        return result;
    }
    catch(error) {
        return error;
    }
}


/**
 * returns array of locations holding id, uuid, identifier, name
 * content can be either short_name or uuid
 */
export const getLocationAttributeTypeByShortName = async function(content) {
    console.log("GetService > calling getLocationAttributeTypeByShortName()");

    try {
        var resourceName = LOCATION_ATTRIBUTE_TYPE + "/" + "shortname";
        let result = await getData(resourceName, content);
        console.log(result);
        return result;
    }
    catch(error) {
        return error;
    }
}

var getData = async function(resourceName, content) {

    if(content != null) {
    
        console.log("Printing content sent in request: ");
        console.log(content);
    }

    var requestURL = '';
    requestURL = serverAddress + "/" + resourceName;
    if(content != null)
        requestURL = requestURL.concat("/" + content);
    
    let result = await get(requestURL);
    console.log(result);
    return result;
}

function get(requestURL) {
    console.log("GetService > in get() method");
    console.log(requestURL);
    return axios.get(requestURL, { 'headers': {
        'Authorization': rest_header,
        } 
    })
    .then(response => {
        
        let data = response.data;
        console.log("printing response below:");
        console.log(data); // works       
        return data;
    })
    .catch((error) => {
        console.log(typeof error);
        console.log('error ' + error);
        return error;
    });

}

function sleeper(ms) {
    return function(x) {
      return new Promise(resolve => setTimeout(() => resolve(x), ms));
    };
  }