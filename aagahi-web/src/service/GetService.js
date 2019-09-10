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
const DEFINITION = "definition";
const DEFINITION_TYPE = "definition";
const LOCATION = "location";
const LOCATION_ATTRIBUTE = "location";
const LOCATION_BY_CATEGORY= "locations/category";



function getLocationBySingleContent(content) {

}

function getDefinitionBySingleContent(content) {
    
}

/**
 * content can be shortname of uuid
 */
function getDefinitionsByDefinitionType(content) {
    
}


export const getAllDonors = async function() {

    try {
        let result = await getArray(DONORS_LIST);
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

export const getAllUsers = async function() {

    try {
        
        let result = await getArray(USER_LIST);
        console.log(result);
        console.log(result.length);
        let array = [];
        result.forEach(function(obj) {
            array.push({ "id" : obj.userId, "username" : obj.username, "uuid" : obj.uuid, "fullName" : obj.fullName, "label" : obj.fullName, "value" : obj.userId});
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
        let result = await getArray(LOCATION_BY_CATEGORY, content);
        let array = [];
        result.forEach(function(obj) {

            console.log("value: " + obj.locationId, "uuid: " + obj.uuid, "shortName: " + obj.shortName, "label: " + obj.locationName);
            array.push({ "value" : obj.locationId, "uuid" : obj.uuid, "shortName" : obj.shortName, "label" : obj.locationName});
        })
        console.log(array);
        return array;
    }
    catch(error) {
        return error;
    }
}

var getArray = async function(resourceName, content) {

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