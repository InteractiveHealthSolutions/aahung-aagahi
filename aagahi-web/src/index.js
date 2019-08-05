/**
 * @author Tahira Niazi
 * @email tahira.niazi@ihsinformatics.com
 * @create date 2019-07-30 12:09:52
 * @modify date 2019-07-30 12:09:52
 * @desc [description]
 */
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
// import * as serviceWorker from './serviceWorker';
// import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';

ReactDOM.render(

    <Router >
         <Route path="/" component={App}/>
    </Router>,
    document.getElementById('root')

    // <App />, document.getElementById('root')
);
registerServiceWorker();
// serviceWorker.unregister();
