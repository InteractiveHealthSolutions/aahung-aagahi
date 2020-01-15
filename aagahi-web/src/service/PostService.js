/*
 * @Author: tahira.niazi@ihsinformatics.com 
 * @Date: 2019-09-08 19:49:34 
 * @Last Modified by: tahira.niazi@ihsinformatics.com
 * @Last Modified time: 2020-01-15 15:00:29
 */

import { apiUrl } from "../util/AahungUtil.js";
let axios = require('axios');
var rest_header = sessionStorage.getItem('auth_header');
// resources
const USER = "user";
const DEFINITION = "definition";
const DEFINITION_TYPE = "definition";
const LOCATION = "location";
const LOCATION_ATTRIBUTE_LIST = "locationattributes";
const LOCATION_BY_CATEGORY = "locations/category";
const DONOR = "donor";
const PROJECT = "project";
const FORM_DATA = "formdata";
const FORM_DATA_STREAM = "formdatastream";
const PARTICIPANT = "participant";

/**
 * saves user object
 */
export const saveUser = async function (jsonData) {

    var requestUrl = apiUrl + "/" + USER;
    let result = await post(requestUrl, jsonData);
    return result;
}

export const updateUser = async function (jsonData, uuid) {
    var requestUrl = apiUrl + "/" + USER + "/" + uuid;
    console.log("POST: in updateUser() method");
    console.log(jsonData);
    let result = await put(requestUrl, jsonData);
    return result;
}

export const voidData = async function (objectType, uuid, reasonVoided) {

    var resourceName = objectType === "user" ? USER
        : objectType === "participant" ? PARTICIPANT
            : objectType === "location" ? LOCATION
                : objectType === "form" ? FORM_DATA
                    : objectType === "donor" ? DONOR
                        : objectType === "project" ? PROJECT
                            : "";
    var params = "?reasonVoided=" + reasonVoided;
    var requestUrl = apiUrl + "/" + resourceName + "/" + uuid;
    var completeUrl = requestUrl.concat(params);
    console.log("DELETE: in voidData() method");
    let result = await voidObject(completeUrl);
    return result;
}

export const unvoidData = function (objectType, uuid) {

    var resourceName = objectType === "user" ? USER
        : objectType === "participant" ? PARTICIPANT
            : objectType === "location" ? LOCATION
                : objectType === "form" ? FORM_DATA
                    : objectType === "donor" ? DONOR
                        : objectType === "project" ? PROJECT
                            : "";
    var requestUrl = apiUrl + "/" + resourceName + "/" + uuid;
    console.log("PATCH: in unvoidData() method");
    // let result = unvoidObject(requestUrl);
    unvoidObject(requestUrl)
    .then(function(result){
        console.log("printing result in unvoidData")
        console.log(result)
        return result;
    })
    .catch(function(error) {
        alert("error occured");
        return error;
    })
    // console.log("printing result in unvoidData")
    // console.log(result)
    // return result;
}

/**
 * saves donor object
 */
export const saveDonor = async function (jsonData) {

    var requestUrl = apiUrl + "/" + DONOR;
    let result = await post(requestUrl, jsonData);
    return result;
}

/**
 * saves project object
 */
export const saveProject = async function (jsonData) {

    var requestUrl = apiUrl + "/" + PROJECT;
    let result = await post(requestUrl, jsonData);
    console.log("in saveProject method");
    console.log(requestUrl);
    return result;
}

export const saveLocation = async function (jsonData) {

    var requestUrl = apiUrl + "/" + LOCATION;
    console.log("POST: in saveLocation() method");
    let result = await post(requestUrl, jsonData);
    return result;
}

export const updateLocation = async function (jsonData, uuid) {
    var requestUrl = apiUrl + "/" + LOCATION + "/" + uuid;
    console.log("POST: in updateLocation() method");
    let result = await put(requestUrl, jsonData);
    return result;
}

export const updateParticipant = async function (jsonData, uuid) {
    var requestUrl = apiUrl + "/" + PARTICIPANT + "/" + uuid;
    console.log("POST: in updateParticipant() method");
    console.log(jsonData);
    let result = await put(requestUrl, jsonData);
    return result;
}

export const saveParticipant = async function (jsonData) {

    var requestUrl = apiUrl + "/" + PARTICIPANT;
    console.log("POST: in saveLocation() method");
    let result = await post(requestUrl, jsonData);
    return result;
}

export const saveFormData = async function (jsonData) {

    console.log("POST: in saveFormData() method");
    var requestUrl = apiUrl + "/" + FORM_DATA_STREAM;
    console.log(requestUrl);
    console.log(jsonData);
    let result = await post(requestUrl, jsonData);
    console.log(requestUrl);
    return result;
}

export const updateFormData = async function (jsonData) {
    var requestUrl = apiUrl + "/" + FORM_DATA_STREAM;
    console.log("POST: in updateFormData() method");
    console.log(jsonData);
    let result = await put(requestUrl, jsonData);
    return result;
}

export const saveLocationAttributes = async function (jsonData) {

    console.log("POST: in saveLocationAttributes() method");
    var requestUrl = apiUrl + "/" + LOCATION_ATTRIBUTE_LIST;
    console.log(jsonData);
    let result = await post(requestUrl, jsonData);
    console.log(requestUrl);
    return result;
}

function post(requestUrl, jsonData) {
    console.log("in POST method");
    console.log(requestUrl);
    return axios.post(requestUrl, jsonData, {
        'headers': {
            'Authorization': sessionStorage.getItem('auth_header'),
        }
    })
        .then(resonse => {
            return resonse;
        })
        .catch((error) => {
            console.log(typeof error);
            console.log('error ' + error);
            return error;
        });
}

function voidObject(requestUrl) {
    console.log(requestUrl);
    return axios.delete(requestUrl, {
        'headers': {
            'Authorization': sessionStorage.getItem('auth_header'),
        }
    })
        .then(response => {
            return response;
        })
        .catch((error) => {
            console.log(typeof error);
            return error;
        });
}

// axios patch is not working
function unvoidObject(requestUrl) {
    console.log("in unvoidObject() method");
    console.log(requestUrl);
    fetch(requestUrl, {
        method: 'PATCH',
        headers: {
            'Authorization': sessionStorage.getItem('auth_header'),
        }
    })
        .then(function(response) {
            response.json().then(function(json) {
                // the status was ok and there is a json body
                return Promise.resolve({ json: json, response: response });
            }).catch(function(error) {
                // the status was ok but there is no json body
                console.log("printing error >>>>>>>")
                console.log(response.status);
                return Promise.resolve({ response: response });
            });
        });
}

function put(requestUrl, jsonData) {
    console.log("in PUT method");
    console.log(requestUrl);
    console.log("json data >>>>>>>>>");
    console.log(jsonData);
    return axios.put(requestUrl, jsonData, {
        'headers': {
            'Authorization': sessionStorage.getItem('auth_header'),
        }
    })
        .then(response => {
            console.log("response: ##############");
            console.log(response);
            return response;
        })
        .catch((error) => {
            console.log(typeof error);
            console.log('error ' + error);
            return error;
        });
}