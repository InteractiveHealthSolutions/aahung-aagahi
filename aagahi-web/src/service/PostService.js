/*
 * @Author: tahira.niazi@ihsinformatics.com 
 * @Date: 2019-09-08 19:49:34 
 * @Last Modified by: tahira.niazi@ihsinformatics.com
 * @Last Modified time: 2019-09-17 21:24:36
 */


import { apiUrl } from "../util/AahungUtil.js";
let axios = require('axios');
var rest_header = localStorage.getItem('auth_header'); 
// resources
const USER = "user";
const DEFINITION = "definition";
const DEFINITION_TYPE = "definition";
const LOCATION = "location";
const LOCATION_ATTRIBUTE_LIST = "locationattributes";
const LOCATION_BY_CATEGORY = "locations/category";
const DONOR = "donor";
const PROJECT = "project";
const FORM_DATA = "formdatastream";
const PARTICIPANT = "participant";


/**
 * saves user object
 */
export const saveUser = async function(jsonData) {

    var requestURL = apiUrl + "/" + USER;   
    let result = await post(requestURL, jsonData);
    return result;
}

/**
 * saves donor object
 */
export const saveDonor = async function(jsonData) {

    var requestURL = apiUrl + "/" + DONOR;   
    let result = await post(requestURL, jsonData);
    return result;
}

/**
 * saves project object
 */
export const saveProject = async function(jsonData) {

    var requestURL = apiUrl + "/" + PROJECT;   
    let result = await post(requestURL, jsonData);
    console.log("in saveProject method");
    console.log(requestURL);
    return result;
}

export const saveLocation = async function(jsonData) {

    var requestURL = apiUrl + "/" + LOCATION;   
    console.log("POST: in saveLocation() method");
    let result = await post(requestURL, jsonData);
    return result;
}


export const saveParticipant = async function(jsonData) {

    var requestURL = apiUrl + "/" + PARTICIPANT;   
    console.log("POST: in saveLocation() method");
    let result = await post(requestURL, jsonData);
    return result;
}

export const saveFormData = async function(jsonData) {

    console.log("POST: in saveFormData() method");
    var requestURL = apiUrl + "/" + FORM_DATA;
    console.log(requestURL);
    console.log(jsonData);   
    let result = await post(requestURL, jsonData);
    console.log(requestURL);
    return result;
}

export const saveLocationAttributes = async function(jsonData) {

    console.log("POST: in saveLocationAttributes() method");
    var requestURL = apiUrl + "/" + LOCATION_ATTRIBUTE_LIST;
    alert(requestURL);
    console.log(jsonData);
    let result = await post(requestURL, jsonData);
    console.log(requestURL);
    return result;
}

function post(requestURL, jsonData) {
    console.log("in post method");
    console.log(requestURL);
    return axios.post(requestURL, jsonData, { 'headers': {
            'Authorization': localStorage.getItem('auth_header'),
            } 
        })
        .then(resonse => {
            console.log(resonse);
            return resonse;
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