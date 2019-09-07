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
const DEFINITION = "definition";
const DEFINITION_TYPE = "definition";
const LOCATION = "location";
const LOCATION_ATTRIBUTE = "location";
const LOCATION_BY_CATEGORY= "locations/category"


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
 * returns array of locations holding id, uuid, identifier, name
 * content can be either short_name or uuid
 */
export const getLocationsByCategory = function(content) {

    let result = getArray(LOCATION_BY_CATEGORY, content);
    var array = [];
    
    // result.forEach(function(obj) {

    //     // console.log("value: " + obj.locationId, "uuid: " + obj.uuid, "shortName: " + obj.shortName, "label: " + obj.locationName);
    //     array.push({ "value" : obj.locationId, "uuid" : obj.uuid, "shortName" : obj.shortName, "label" : obj.locationName});
    // })
    
    
}

function getArray(resource, content) {

    var requestURL = serverAddress + "/" + resource + "/" + content;
    let result = get(requestURL);

    sleeper(10000);
    alert(result.length);

    return result;
}

function get(requestURL) {

    return axios.get(requestURL, { 'headers': {
        'Authorization': rest_header,
        } 
    })
    .then(response => {
        
        let data = response.data;
        console.log(data[0].locationId); // works
        
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