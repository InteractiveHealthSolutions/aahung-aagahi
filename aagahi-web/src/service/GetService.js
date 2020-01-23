/**
 * @author Tahira Niazi
 * @email tahira.niazi@ihsinformatics.com
 * @create date 2019-09-07 23:30:00
 * @modify date 2019-09-07 23:30:00
 * @desc [description]
 */

import moment from 'moment';
import { apiUrl, capitalize, matchPattern } from "../util/AahungUtil.js";
import * as Constants from "../util/Constants";

var serverAddress = apiUrl;
let axios = require('axios');
var rest_header = sessionStorage.getItem('auth_header');
// resources
const DONOR = "donor";
const DONORS_LIST = "donors";
const DONORS_LIST_BY_NAME = "donors/name";
const USER = "user";
const USER_BY_USERNAME = "/username";
const USER_BY_ID = "/id";
const USERS_LIST_BY_NAME = "users/name";
const USER_LIST = "users";
const ROLE = "role";
const ROLE_By_NAME = "role/name";
const ROLE_LIST = "roles";
const USERS_BY_ROLE = "users/role";
const DEFINITION = "definition";
const DEFINITION_BY_ID = "definition/id";
const DEFINITION_BY_SHORT_NAME = "definition/shortname";
const DEFINITION_TYPE = "definition";
const LOCATION = "location";
const LOCATION_LIGHTWEIGHT_LIST = "location/list";
const LOCATION_LIST_BY_CATEGORY = "locations/category";
const LOCATION_LIST_BY_PARENT = "locations/parent";
const LOCATION_LIST_BY_NAME = "locations/name";
const LOCATION_ATTRIBUTE_TYPE = "locationattributetype";
const DEFINITION_LIST_BY_DEFNINITION_TYPE = "definitions/definitiontype";
const PROJECT = "project";
const PROJECT_LIST = "projects";
const PROJECT_LIST_BY_DONOR = "projects/donor";
const PROJECT_LIST_BY_NAME = "projects/name";
const LOCATION_ATTRIBUTE_TYPE_LIST_BY_LOCATION = "locationattributes/location";
const PERSON_ATTRIBUTE_TYPE_LIST_BY_PERSON = "personattributes/person";
const FORM_TYPE = "formtype";
const FORM_SEARCH_LIST = "formdata/list/search";
const FORM_DATA_CUSTOM = "formdata/full";
const PARTICIPANT = "participant";
const PARTICIPANT_LIST_BY_NAME = "participant/name";
const PARTICIPANT_LIST_BY_LOCATION = "participants/location";
const PERSON_ATTRIBUTE_TYPE = "personattributetype";
const FORM_TYPE_LIST = "formtypes";

/**
 * content can be shortname of uuid
 */
export const getDefinitionsByDefinitionType = async function (content) {

    console.log("GetService > calling getDefinitionByDefinitionType()");
    try {
        let result = await getData(DEFINITION_LIST_BY_DEFNINITION_TYPE, content);
        let array = [];
        result.forEach(function (obj) {
            array.push({ "id": obj.definitionId, "value": obj.definitionId, "uuid": obj.uuid, "shortName": obj.shortName, "label": obj.definitionName, "definitionName": obj.definitionName });
        })
        return array;
    }
    catch (error) {
        return error;
    }
}

/**
 * content can be shortname or uuid
 */
export const getDefinitionByDefinitionId = async function (content) {

    console.log("GetService > calling getDefinitionsByDefinitionType()");

    try {
        let result = await getData(DEFINITION_BY_ID, content);
        return result;
    }
    catch (error) {
        return error;
    }
}

/**
 * content can be shortname or uuid
 */
export const getDefinitionByDefinitionShortName = async function (content) {

    console.log("GetService > calling getDefinitionByDefinitionShortName()");
    try {
        let result = await getData(DEFINITION_BY_SHORT_NAME, content);
        return result;
    }
    catch (error) {
        return error;
    }
}

/**
 * definitionType > definitionType.shortname
 * shortName > definition.shortName
 * return id of definition
 */
export const getDefinitionId = async function (definitionType, shortName) {

    console.log("GetService > getDefinitioId()");
    try {
        let definitions = await getDefinitionsByDefinitionType(definitionType);
        let definitionId = definitions.find(def => def.shortName === shortName).id;
        return definitionId;
    }
    catch (error) {
        return error;
    }
}

export const getAllDonors = async function () {
    try {
        let result = await getData(DONORS_LIST);
        let array = [];
        result.forEach(function (obj) {
            if (!obj.isVoided) {
                array.push({ "id": obj.donorId, "uuid": obj.uuid, "shortName": obj.shortName, "name": obj.donorName, "label": obj.shortName, "value": obj.donorId });
            }
        })
        return array;
    }
    catch (error) {
        return error;
    }
}

/**
 * get donor by uuid, shortname or integer Id
 * 
 */
export const getDonorByRegexValue = async function (content, includeVoided) {

    console.log("GetService > calling getDonorByRegexValue()");
    try {
        var resourceName = DONOR;
        var regInteger = /^\d+$/;
        if (!matchPattern(Constants.UUID_REGEX, content)) {
            if (regInteger.test(content)) {    // integer id case
                resourceName = resourceName.concat("/" + "id");
            }
            else {
                resourceName = resourceName.concat("/" + "shortname");
            }
        }
        let result = await getData(resourceName, content);
        if(includeVoided) {
            return result;
        }
        else {
            if(result.isVoided) {
                return null;
            }
            else {
                return result;
            }
        }
    }
    catch (error) {
        return error;
    }
}

/**
 * get donor by uuid, shortname or integer Id
 * 
 */
export const getDonorByName = async function (content, includeVoided) {

    console.log("GetService > calling getDonorByName()");
    try {
        var resourceName = DONORS_LIST_BY_NAME;
        let result = await getData(resourceName, content);
        let array = [];
        result.forEach(function(obj) {
            if (!includeVoided) {
                if (!obj.isVoided)
                    array.push(obj);
            }
            else {
                array.push(obj);
            }
        })
        return array;
    }
    catch (error) {
        return error;
    }
}

export const getAllProjects = async function () {
    try {
        let result = await getData(PROJECT_LIST);
        let array = [];
        result.forEach(function (obj) {
            if (!obj.isVoided) {
                array.push({ "id": obj.projectId, "uuid": obj.uuid, "shortName": obj.shortName, "name": obj.projectName, "label": obj.projectName, "value": obj.shortName, "donorName": obj.donor.donorName, "donorId": obj.donor.donorId });
            }
        })
        return array;
    }
    catch (error) {
        return error;
    }
}

/**
 * content can be shortname or uuid
 */
export const getProjectByRegexValue = async function (content, includeVoided) {

    console.log("GetService > calling getProjectByRegexValue()");
    try {
        var resourceName = PROJECT;
        var regInteger = /^\d+$/;
        var regProjectId = /^\w+(\-\w+\-)[0-9]{4}$/;
        if (!matchPattern(Constants.UUID_REGEX, content)) {
            if (regProjectId.test(content)) {
                resourceName = resourceName.concat("/" + "shortname");
            }
            else if (regInteger.test(content)) {    // integer id case
                resourceName = resourceName.concat("/" + "id");
            }
        }
        let result = await getData(resourceName, content);
        if(includeVoided) {
            return result;
        }
        else {
            if(result.isVoided) {
                return null;
            }
            else {
                return result;
            }
        }
    }
    catch (error) {
        return error;
    }
}

/**
 * return projects array by name
 */
export const getProjectsByName = async function (content, includeVoided) {

    console.log("GetService > getProjectsByName()");
    try {
        var resourceName = PROJECT_LIST_BY_NAME;
        let result = await getData(resourceName, content);
        let array = [];
        result.forEach(function(obj) {
            if (!includeVoided) {
                if (!obj.isVoided)
                    array.push(obj);
            }
            else {
                array.push(obj);
            }
        })
        return array;
    }
    catch (error) {
        return error;
    }
}

/**
 * returns array of locations holding id, uuid, identifier, name
 * content can be either short_name or uuid
 */
export const getProjectsByDonor = async function (content, includeVoided) {
    console.log("GetService > calling getProjectsByDonor()");
    try {
        let result = await getData(PROJECT_LIST_BY_DONOR, content);
        let array = [];
        result.forEach(function(obj) {
            if (!includeVoided) {
                if (!obj.isVoided)
                    array.push(obj);
            }
            else
                array.push(obj);
        })
        return array;
    }
    catch (error) {
        return error;
    }
}

export const getAllUsers = async function () {

    try {
        let result = await getData(USER_LIST);
        let array = [];
        result.forEach(function (obj) {
            if (!obj.isVoided) {
                array.push({ "id": obj.userId, "uuid": obj.uuid, "username": obj.username, "fullName": obj.fullName, "voided": obj.isVoided, "label": obj.fullName, "value": obj.userId });
            }
        })
        return array;
    }
    catch (error) {
        return error;
    }
}

/**
 * return users array by name
 */
export const getUsersByName = async function (content, includeVoided) {
    console.log("GetService > getUsersByName()");
    try {
        var resourceName = USERS_LIST_BY_NAME;
        let result = await getData(resourceName, content);
        let array = [];
        result.forEach(function (obj) {
            if (!includeVoided) {
                if (!obj.isVoided) {
                    array.push({ "id": obj.userId, "uuid": obj.uuid, "username": obj.username, "fullName": obj.fullName, "voided": obj.isVoided, "label": obj.username, "value": obj.userId, "roles": obj.userRoles, "dateCreated": moment(obj.dateCreated).format('ll'), "createdBy": obj.createdBy === null ? '' : obj.createdBy.fullName, "updatedBy": obj.updatedBy === null || obj.updatedBy === undefined ? '' : obj.updatedBy.fullName });
                }
            }
            else {
                array.push({ "id": obj.userId, "uuid": obj.uuid, "username": obj.username, "fullName": obj.fullName, "voided": obj.isVoided, "label": obj.username, "value": obj.userId, "roles": obj.userRoles, "dateCreated": moment(obj.dateCreated).format('ll'), "createdBy": obj.createdBy === null ? '' : obj.createdBy.fullName, "updatedBy": obj.updatedBy === null || obj.updatedBy === undefined ? '' : obj.updatedBy.fullName });
            }
        })
        return array;
    }
    catch (error) {
        return error;
    }
}

/**
 * returns array of users holding id, uuid, identifier, name
 * content is role uuid
 */
export const getUsersByRole = async function (content, includeVoided) {
    console.log("GetService > calling getUsersByRole()");
    try {
        let result = await getData(USERS_BY_ROLE, content);
        let array = [];
        result.forEach(function (obj) {
            if (!includeVoided) {
                if (!obj.isVoided) {
                    array.push({ "id": obj.userId, "uuid": obj.uuid, "username": obj.username, "fullName": obj.fullName, "voided": obj.isVoided, "label": obj.username, "value": obj.userId, "roles": obj.userRoles, "dateCreated": moment(obj.dateCreated).format('ll'), "createdBy": obj.createdBy === null ? '' : obj.createdBy.fullName, "updatedBy": obj.updatedBy === null || obj.updatedBy === undefined ? '' : obj.updatedBy.fullName });
                }
            }
            else {
                array.push({ "id": obj.userId, "uuid": obj.uuid, "username": obj.username, "fullName": obj.fullName, "voided": obj.isVoided, "label": obj.username, "value": obj.userId, "roles": obj.userRoles, "dateCreated": moment(obj.dateCreated).format('ll'), "createdBy": obj.createdBy === null ? '' : obj.createdBy.fullName, "updatedBy": obj.updatedBy === null || obj.updatedBy === undefined ? '' : obj.updatedBy.fullName });
            }
        })
        return array;
    }
    catch (error) {
        return error;
    }
}

/**
 * Returns user object by UUID, username or integer ID
 */
export const getUserByRegexValue = async function (content, includeVoided) {
    // for some reason it is not working from the method 'matchPattern' in AahungUtil class
    var regexpUsername = /^\w+(\.\w+)$/;
    var regUserId = /^\d+$/;
    var resourceName = USER;
    try {
        if (regexpUsername.test(content)) {    // username case
            resourceName = resourceName.concat(USER_BY_USERNAME);
        }
        else if (regUserId.test(content)) {    // integer id case
            resourceName = resourceName.concat(USER_BY_ID);
        }
        let result = await getData(resourceName, content);
        var userObject = null;
        if (result != null) {

            if (!includeVoided) {
                if (!result.isVoided) {
                    userObject = { "id": result.userId, "uuid": result.uuid, "username": result.username, "fullName": result.fullName, "voided": result.isVoided, "label": result.username, "value": result.userId, "roles": result.userRoles, "dateCreated": result.dateCreated, "createdBy": result.createdBy === null ? '' : result.createdBy.fullName, "updatedBy": result.updatedBy === null || result.updatedBy === undefined ? '' : result.updatedBy.fullName };
                }
            }
            else {
                userObject = { "id": result.userId, "uuid": result.uuid, "username": result.username, "fullName": result.fullName, "voided": result.isVoided, "label": result.username, "value": result.userId, "roles": result.userRoles, "dateCreated": result.dateCreated, "createdBy": result.createdBy === null ? '' : result.createdBy.fullName, "updatedBy": result.updatedBy === null || result.updatedBy === undefined ? '' : result.updatedBy.fullName };
            }
        }
        return userObject;
    }
    catch (error) {
        return error;
    }
}

export const getAllRoles = async function () {

    try {
        let result = await getData(ROLE_LIST);
        let array = [];
        result.forEach(function (obj) {
            if (!obj.isVoided) {
                array.push({ "id": obj.roleId, "uuid": obj.uuid, "roleName": obj.roleName, "isRetired": obj.isRetired });
            }
        })
        return array;
    }
    catch (error) {
        return error;
    }
}

/**
 * Fetch all locations (light weight objects)
 * 
 */
export const getAllLightWeightLocations = async function (content) {

    try {
        let result = await getData(LOCATION_LIGHTWEIGHT_LIST, content);
        result = result.filter(location => location.isVoided === false);
        return result;
    }
    catch (error) {
        return error;
    }
}

/**
 * returns array of locations holding id, uuid, identifier, name
 * content can be either short_name or uuid
 */
export const getLocationsByCategory = async function (content) {
    console.log("GetService > calling getLocationsByCategory()");
    try {
        let result = await getData(LOCATION_LIST_BY_CATEGORY, content);
        let array = [];
        result.forEach(function (obj) {
            if (content != Constants.PARENT_ORG_DEFINITION_UUID) {
                if (!obj.isVoided) {
                    array.push({ "id": obj.locationId, "value": obj.locationName, "uuid": obj.uuid, "shortName": obj.shortName, "label": obj.shortName, "locationName": obj.locationName, "city": obj.cityVillage, "province": obj.stateProvince, "cateogry": obj.category.definitionName, "dateCreated": moment(obj.dateCreated).format('ll'), "createdBy": obj.createdBy.username });
                }
            }
            else {
                if (!obj.isVoided) {
                    array.push({ "id": obj.locationId, "value": obj.locationName, "uuid": obj.uuid, "shortName": obj.shortName, "label": obj.shortName, "locationName": obj.locationName });
                }
            }
        })
        return array;
    }
    catch (error) {
        return error;
    }
}

/**
 * Fetch child locations of a parent location by uuid
 * 
 */
export const getLocationsByParent = async function (content) {
    try {
        let result = await getData(LOCATION_LIST_BY_PARENT, content);
        return result;
    }
    catch (error) {
        return error;
    }
}

/**
 * Returns location list or object depending on content passed.
 * content can be location shortname, UUID or name
 */
export const getLocationByRegexValue = async function (content) {

    var resourceName = LOCATION;
    try {
        var regInteger = /^\d+$/;
        if (!matchPattern(Constants.UUID_REGEX, content)) {
            if (matchPattern(Constants.LOCATION_ID_REGEX, content)) { // shortname case
                resourceName = resourceName.concat("/" + "shortname");
            }
            else if (regInteger.test(content)) {    // integer id case
                resourceName = resourceName.concat("/" + "id");
            }
            else {
                resourceName = LOCATION_LIST_BY_NAME;
            }
        }
        let result = await getData(resourceName, content);
        return result;
    }
    catch (error) {
        return error;
    }
}

/**
 * Gets role by role name
 */
export const getRoleByName = async function (content) {
    console.log("GetService > getRoleByName()");
    try {
        var resourceName = ROLE_By_NAME;
        let result = await getData(resourceName, content);
        return result;
    }
    catch (error) {
        return error;
    }
}

/**
 * return list of participant > content can be either lcoation uuid or shortname
 */
export const getParticipantsByLocation = async function (content, includeVoided) {
    console.log("GetService > calling getLocationsByCategory()");
    try {
        let result = await getData(PARTICIPANT_LIST_BY_LOCATION, content);
        let array = [];
        result.forEach(function (obj) {
            var participantType = '';
            var personAttrs = obj.person.attributes;
            personAttrs = personAttrs.filter(p => p.attributeType.shortName === 'lse_teacher_participant' || p.attributeType.shortName === 'srhm_general_participant' || p.attributeType.shortName === 'srhm_ac_participant');
            participantType = capitalize(personAttrs[0].attributeType.shortName);

            if (!includeVoided) {
                if (!obj.isVoided) {
                    array.push({ "id": obj.participantId, "value": obj.identifier, "uuid": obj.uuid, "fullName": obj.person.firstName, "label": obj.person.firstName, "personId": obj.person.personId, "personUuid": obj.person.uuid, "gender": obj.person.gender, "dob": moment(obj.person.dob).format('ll'), "identifier": obj.identifier, "locationName": obj.location.locationName, "locationId": obj.location.locationId, "dateCreated": moment(obj.dateCreated).format('ll'), "createdBy": obj.createdBy === null || obj.createdBy === undefined ? '' : obj.createdBy.fullName, "updatedBy": obj.updatedBy === null || obj.updatedBy === undefined ? '' : obj.updatedBy.fullName, "voided": obj.isVoided, "participantType": participantType });
                }
            }
            else {
                array.push({ "id": obj.participantId, "value": obj.identifier, "uuid": obj.uuid, "fullName": obj.person.firstName, "label": obj.person.firstName, "personId": obj.person.personId, "personUuid": obj.person.uuid, "gender": obj.person.gender, "dob": moment(obj.person.dob).format('ll'), "identifier": obj.identifier, "locationName": obj.location.locationName, "locationId": obj.location.locationId, "dateCreated": moment(obj.dateCreated).format('ll'), "createdBy": obj.createdBy === null || obj.createdBy === undefined ? '' : obj.createdBy.fullName, "updatedBy": obj.updatedBy === null || obj.updatedBy === undefined ? '' : obj.updatedBy.fullName, "voided": obj.isVoided, "participantType": participantType });
            }
        })
        return array;
    }
    catch (error) {
        return error;
    }
}

/**
 * Returns participant object by identifier or UUID [used for searching]
 */
export const getParticipantByRegexValue = async function (content, includeVoided) {

    var resourceName = PARTICIPANT;
    try {
        var regInteger = /^\d+$/;
        var result = null;

        if (regInteger.test(content)) {    // integer id case
            resourceName = resourceName.concat("/" + "id");
            result = await getData(resourceName, content);
            return result;
        }
        else if (!matchPattern(Constants.UUID_REGEX, content)) {
            resourceName = resourceName.concat("/" + "identifier");
        }
        result = await getData(resourceName, content);
        let array = [];

        if (result !== null && result !== []) {
            var participantType = '';
            var personAttrs = result.person.attributes;
            personAttrs = personAttrs.filter(p => p.attributeType.shortName === 'lse_teacher_participant' || p.attributeType.shortName === 'srhm_general_participant' || p.attributeType.shortName === 'srhm_ac_participant');
            participantType = capitalize(personAttrs[0].attributeType.shortName);

            if (!includeVoided) {
                if (!result.isVoided) {
                    array.push({ "id": result.participantId, "value": result.identifier, "uuid": result.uuid, "fullName": result.person.firstName, "label": result.person.firstName, "personId": result.person.personId, "personUuid": result.person.uuid, "gender": result.person.gender, "dob": result.person.dob, "identifier": result.identifier, "locationName": result.location.locationName, "locationId": result.location.locationId, "dateCreated": result.dateCreated, "createdBy": result.createdBy === null || result.createdBy === undefined ? '' : result.createdBy.fullName, "updatedBy": result.updatedBy === null || result.updatedBy === undefined ? '' : result.updatedBy.fullName, "voided": result.isVoided, "participantType": participantType });
                }
            }
            else {
                array.push({ "id": result.participantId, "value": result.identifier, "uuid": result.uuid, "fullName": result.person.firstName, "label": result.person.firstName, "personId": result.person.personId, "personUuid": result.person.uuid, "gender": result.person.gender, "dob": result.person.dob, "identifier": result.identifier, "locationName": result.location.locationName, "locationId": result.location.locationId, "dateCreated": result.dateCreated, "createdBy": result.createdBy === null || result.createdBy === undefined ? '' : result.createdBy.fullName, "updatedBy": result.updatedBy === null || result.updatedBy === undefined ? '' : result.updatedBy.fullName, "voided": result.isVoided, "participantType": participantType });
            }
        }
        return array;
    }
    catch (error) {
        return error;
    }
}

/**
 * Participant can't be search via integer person id
 * Return person by integer Id
 */
export const getPersonByIntegerId = async function (content) {

    var resourceName = PARTICIPANT;
    try {
        var regInteger = /^\d+$/;
        if (regInteger.test(content)) {    // integer id case
            resourceName = resourceName.concat("/" + "id");
        }
        let result = await getData(resourceName, content);
        return result;
    }
    catch (error) {
        return error;
    }
}



/**
 * REQUIRED MEHOD BECAUSE PARTICIPANT IDENTIFIER HAS NO DIFFERENT REGEX THAN PARTICIPANT NAME; would result in ambiguity if getParticipantByRegexValue used for searching by name (like in location case)
 * Returns list of locations by location name
 */
export const getParticipantsByName = async function (content, includeVoided) {

    var resourceName = PARTICIPANT_LIST_BY_NAME;
    try {
        let result = await getData(resourceName, content);
        let array = [];
        result.forEach(function (obj) {
            var participantType = '';
            var personAttrs = obj.person.attributes;
            personAttrs = personAttrs.filter(p => p.attributeType.shortName === 'lse_teacher_participant' || p.attributeType.shortName === 'srhm_general_participant' || p.attributeType.shortName === 'srhm_ac_participant');
            participantType = capitalize(personAttrs[0].attributeType.shortName);
            if (!includeVoided) {
                if (!obj.isVoided) {
                    array.push({ "id": obj.participantId, "value": obj.identifier, "uuid": obj.uuid, "fullName": obj.person.firstName, "label": obj.person.firstName, "personId": obj.person.personId, "personUuid": obj.person.uuid, "gender": obj.person.gender, "dob": moment(obj.person.dob).format('ll'), "identifier": obj.identifier, "locationName": obj.location.locationName, "locationId": obj.location.locationId, "dateCreated": moment(obj.dateCreated).format('ll'), "createdBy": obj.createdBy === null || obj.createdBy === undefined ? '' : obj.createdBy.fullName, "updatedBy": obj.updatedBy === null || obj.updatedBy === undefined ? '' : obj.updatedBy.fullName, "voided": obj.isVoided, "participantType": participantType });
                }
            }
            else {
                array.push({ "id": obj.participantId, "value": obj.identifier, "uuid": obj.uuid, "fullName": obj.person.firstName, "label": obj.person.firstName, "personId": obj.person.personId, "personUuid": obj.person.uuid, "gender": obj.person.gender, "dob": moment(obj.person.dob).format('ll'), "identifier": obj.identifier, "locationName": obj.location.locationName, "locationId": obj.location.locationId, "dateCreated": moment(obj.dateCreated).format('ll'), "createdBy": obj.createdBy === null || obj.createdBy === undefined ? '' : obj.createdBy.fullName, "updatedBy": obj.updatedBy === null || obj.updatedBy === undefined ? '' : obj.updatedBy.fullName, "voided": obj.isVoided, "participantType": participantType });
            }
        })
        return array;
    }
    catch (error) {
        return error;
    }
}

/**
 * returns form type object by uuid
 */
export const getFormTypeByUuid = async function (content) {
    console.log("GetService > getFormTypeByUuid()");
    try {
        var resourceName = FORM_TYPE;
        let result = await getData(resourceName, content);
        return result;
    }
    catch (error) {
        return error;
    }
}

/**
 * returns form type object by uuid
 */
export const searchForms = async function (urlParams) {
    console.log("GetService > searchForms()");
    try {
        var resourceName = FORM_SEARCH_LIST;
        let result = await getData(resourceName, urlParams);
        return result;
    }
    catch (error) {
        return error;
    }
}

/**
 * returns custom form data DTO by id or uuid
 */
export const getFormDataById = async function (content) {
    console.log("GetService > searchForms()");
    try {
        var resourceName = FORM_DATA_CUSTOM;
        let result = await getData(resourceName, content);
        return result;
    }
    catch (error) {
        return error;
    }
}

/**
 * returns array of locations holding id, uuid, identifier, name
 * content can be either short_name or uuid
 */
export const getLocationAttributesByLocation = async function (content) {
    console.log("GetService > calling getLocationAttributesByLocation()");
    try {
        let result = await getData(LOCATION_ATTRIBUTE_TYPE_LIST_BY_LOCATION, content);
        return result;
    }
    catch (error) {
        return error;
    }
}

/**
 * returns array of locations holding id, uuid, identifier, name
 * content can be either short_name or uuid
 */
export const getPersonAttributesByPerson = async function (content) {
    console.log("GetService > calling getPersonAttributesByPerson()");
    try {
        let result = await getData(PERSON_ATTRIBUTE_TYPE_LIST_BY_PERSON, content);
        return result;
    }
    catch (error) {
        return error;
    }
}

/**
 * returns array of locations holding id, uuid, identifier, name
 * content can be either short_name or uuid
 */
export const getLocationAttributeTypeByShortName = async function (content) {
    console.log("GetService > calling getLocationAttributeTypeByShortName()");
    try {
        var resourceName = LOCATION_ATTRIBUTE_TYPE + "/" + "shortname";
        let result = await getData(resourceName, content);
        return result;
    }
    catch (error) {
        return error;
    }
}

/**
 * returns array of locations holding id, uuid, identifier, name
 * content can be either short_name or uuid
 */
export const getPersonAttributeTypeByShortName = async function (content) {
    console.log("GetService > calling getLocationAttributeTypeByShortName()");
    try {
        var resourceName = PERSON_ATTRIBUTE_TYPE + "/" + "shortname";
        let result = await getData(resourceName, content);
        return result;
    }
    catch (error) {
        return error;
    }
}

/**
 * return the list of all form types
 */
export const getAllFormTypes = async function () {

    try {
        let result = await getData(FORM_TYPE_LIST);
        let array = [];
        result.forEach(function (obj) {
            if (!obj.isVoided) {
                array.push({ "id": obj.formTypeId, "uuid": obj.uuid, "shortName": obj.shortName, "name": obj.formName, "retired": obj.isRetired, "label": obj.formName, "value": obj.uuid });
            }
        })
        return array;
    }
    catch (error) {
        return error;
    }
}

var getData = async function (resourceName, content) {

    var requestURL = '';
    requestURL = serverAddress + "/" + resourceName;
    if (content != null && content.indexOf("?") != -1) {
        requestURL = requestURL.concat(content);
    }
    else if (content != null)
        requestURL = requestURL.concat("/" + content);

    let result = await get(requestURL);
    if (String(result).includes("404")) {
        result = null;
    }
    return result;
}

function get(requestURL) {
    console.log(requestURL);
    return axios.get(requestURL, {
        'headers': {
            'Authorization': sessionStorage.getItem('auth_header'),
        }
    })
        .then(response => {
            let data = response.data;
            return data;
        })
        .catch((error) => {
            console.log(error);
            return null;
        });

}