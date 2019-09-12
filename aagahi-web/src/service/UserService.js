// import config from 'config';
import { apiUrl } from "../util/AahungUtil.js";
// import { authHeader } from '../_helpers';

let base64 = require('base-64');
let axios = require('axios');

export const UserService = {
    login,
    logout
};

function login(username, password) {
    
    var basicAuth2 = 'Basic ' + base64.encode(username + ":" + password);
    let URL =   `${apiUrl}/user/username/` + username;
    console.log(URL);

    return axios.get(URL, { 'headers': {
            'Authorization': basicAuth2,
            } 
        })
        .then(response => {
            console.log(response.data);
            console.log(">>>> USERNAME");
            console.log(response.data.username);
            var user = response.data;
            
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('auth_header', basicAuth2);
            localStorage.setItem('username', user.username);
            return user;
        })
        .catch((error) => {
            console.log(typeof error);
            console.log('error ' + error);
            return error;
        });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}

// function handleResponse(response) {
//     return response.text().then(text => {
//         const data = text && JSON.parse(text);
//         if (!response.ok) {
//             if (response.status === 401) {
//                 // auto logout if 401 response returned from api
//                 logout();
//                 location.reload(true);
//             }

//             const error = (data && data.message) || response.statusText;
//             return Promise.reject(error);
//         }

//         return data;
//     });
// }