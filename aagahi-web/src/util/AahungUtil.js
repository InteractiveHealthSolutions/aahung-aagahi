export const apiUrl = 'http://199.172.1.76:8080/aahung-aagahi/api';

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


// setting autocomplete single select tag when receiving value from server
// value is the short_name (value) or id, arr is the options array (in case of onchangeMulti its the selected array), prop either label/value, mostly value because it is short_name
export const getObject = function(value, arr, prop) {
        for(var i = 0; i < arr.length; i++) {
            if(arr[i][prop] === value) {
                // alert(arr[i]);
                return arr[i];

            }
        }
        return -1; //to handle the case where the value doesn't exist
};