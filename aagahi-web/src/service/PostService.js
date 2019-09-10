/**
 * @author Tahira Niazi
 * @email tahira.niazi@ihsinformatics.com
 * @create date 2019-09-08 19:49:34
 * @modify date 2019-09-08 19:49:34
 * @desc [description]
 */

import { apiUrl } from "../util/AahungUtil.js";

let axios = require('axios');
var rest_header = localStorage.getItem('auth_header'); 
// resources
const DEFINITION = "definition";
const DEFINITION_TYPE = "definition";
const LOCATION = "location";
const LOCATION_ATTRIBUTE = "location";
const LOCATION_BY_CATEGORY = "locations/category";
const DONOR = "donor";
const PROJECT = "project";
const FORM_DATA = "formdata";


function getLocationBySingleContent(content) {

}

function getDefinitionBySingleContent(content) {
    
}

/**
 * content can be shortname of uuid
 */
function getDefinitionsByDefinitionType(content) {
    
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

export const saveFormData = async function(jsonData) {

    var requestURL = apiUrl + "/" + FORM_DATA;
    alert(requestURL);
    console.log(jsonData);   
    let result = await post(requestURL, jsonData);
    console.log("POST: in saveFormData() method");
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