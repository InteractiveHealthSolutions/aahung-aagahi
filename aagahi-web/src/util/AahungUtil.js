export const apiUrl = 'http://ihs.ihsinformatics.com:9990/aahung-aagahi/api'; // for test server
// export const apiUrl = 'https://api.aahung.org/aahung-aagahi/api'; //for live server
export const parentLocationDefinitionUuid = 'cce863e8-d09b-11e9-b422-0242ac130002';
export const schoolDefinitionUuid = 'cce57479-d09b-11e9-b422-0242ac130002';
export const institutionDefinitionUuid = 'cce6ea85-d09b-11e9-b422-0242ac130002';

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
                // alert(arr[i]);
                return arr[i];

            }
        }
        return -1; //to handle the case where the value doesn't exist
};

/**
 * fetches resource integer id, shortname/identifier and uuid 
 */
export const getEntiry = function(value, arr, prop) {
    for(var i = 0; i < arr.length; i++) {
        if(arr[i][prop] === value) {
            // alert(arr[i]);
            return arr[i];

        }
    }
    return -1; //to handle the case where the value doesn't exist
};

export const getHandler = function(resourceName, subResource, parameter) {

    let axios = require('axios');
        var categoryUuid = 'cce863e8-d09b-11e9-b422-0242ac130002'; 
        let URL =  'http://199.172.1.76:8080/aahung-aagahi/api/locations/category/' + categoryUuid;

        console.log(localStorage.getItem('auth_header'));
        axios.get(URL, { 'headers': {
            'Authorization': localStorage.getItem('auth_header'),
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
    let regexPattern = new RegExp(pattern);
    return regexPattern.test(value) ? true : false; 
}
