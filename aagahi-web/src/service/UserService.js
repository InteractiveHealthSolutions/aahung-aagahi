import config from 'config';
// import { authHeader } from '../_helpers';

export const UserService = {
    login,
    logout
};

    let base64 = require('base-64');
    let axios = require('axios');

function login(username, password) {

    var basicAuth = 'Basic ' + btoa(username + ':' + password);
    var basicAuth2 = 'Basic ' + base64.encode(username + ":" + password);

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    };

    // let URL =  'http://199.172.1.76:8080/aahung-aagahi/api/users?search=admin';
    let URL =   `${config.apiUrl}/users?search=` + username;

        axios.get(URL, { 'headers': {
            'Authorization': basicAuth2,
            } 
        })
        .then(response => {
            console.log(URL);
            console.log(response.data[0]);
            console.log(" >>>>>>> authenticated");
            let user = response.data[0];
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('auth_header', basicAuth2);
            return user;
        })
        .catch((error) => {
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