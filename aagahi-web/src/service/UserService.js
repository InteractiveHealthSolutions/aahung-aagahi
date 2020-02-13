// import config from 'config';
import { apiUrl } from "../util/AahungUtil.js";
// import { authHeader } from '../_helpers';

let base64 = require('base-64');
let axios = require('axios');

export const UserService = {
    login,
    logout,
    hasAccess
};

function login(username, password) {

    var basicAuth2 = 'Basic ' + base64.encode(username + ":" + password);
    let URL = `${apiUrl}/user/username/` + username;
    console.log(URL);

    return axios.get(URL, {
        'headers': {
            'Authorization': basicAuth2,
        }
    }).then(response => {
        console.log(response.data);
        console.log(">>>> USERNAME");
        console.log(response.data.username);
        var user = response.data;
        sessionStorage.setItem('user', JSON.stringify(user));
        sessionStorage.setItem('username', user.username);
        sessionStorage.setItem('auth_header', basicAuth2);
        return user;
    }).catch((error) => {
        console.log(typeof error);
        console.log('error ' + error);
        return error;
    });
}

function logout() {
    // remove user from local storage to log user out
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('auth_header');
}

function hasAccess(privilegeName) {

    try {
      var user = JSON.parse(sessionStorage.getItem('user'));
      var userRoles = user.userRoles;
      var isAllowed = false;
  
      // check the if the user has the required privilge
      if (userRoles != null && userRoles.length > 0) {
        for (let i = 0; i < userRoles.length; i++) {
  
          // return true if user has admin role
          if (userRoles[i].roleName === "Admin") {
            isAllowed = true;
            return isAllowed;
          }
  
          var rolePrivileges = userRoles[i].rolePrivileges;
          var hasPrivilege = rolePrivileges.filter(privilege => privilege.privilegeName === privilegeName);
          if (hasPrivilege != null && hasPrivilege.length > 0) {
            isAllowed = true;
            return isAllowed;
          }
        }
      }
    }
    catch (error) {
      console.log(error);
      return false;
    }
  
    return false;
  };