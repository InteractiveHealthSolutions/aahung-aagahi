import React from 'react';
import ReactDOM from 'react-dom';
import DownloadFile from './DownloadParticipant';
// import * as serviceWorker from './serviceWorker';


// ReactDOM.render(<DownloadFile />, document.getElementById('root'));


class Download extends React.Component {

    modal = false;

    constructor(props) {
        super(props);

    }

    
    render() {


        return (
            
            <DownloadFile />
        );
    }
}

export default Download;