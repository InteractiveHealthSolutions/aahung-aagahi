import React from 'react';
// import './download.css';
import { Button, CardHeader, ButtonGroup } from 'reactstrap';

class DownloadFile extends React.Component {

	constructor(props) {
		super(props);
		this.rest_header = sessionStorage.getItem('auth_header');
	}

	downloadDonorData = () => {
		fetch('http://ihs.ihsinformatics.com:9990/aahung-aagahi/api/report/donors.csv', {
			'headers': {
				'Authorization': sessionStorage.getItem('auth_header'),
			}
		})
			.then(response => {
				response.blob().then(blob => {
					let url = window.URL.createObjectURL(blob);
					let a = document.createElement('a');
					a.href = url;
					a.download = 'donors.csv';
					a.click();
				});
				//window.location.href = response.url;
			});
	}

	downloadDefinitionData = () => {
		fetch('http://ihs.ihsinformatics.com:9990/aahung-aagahi/api/report/definitions.csv', {
			'headers': {
				'Authorization': sessionStorage.getItem('auth_header'),
			}
		})
			.then(response => {
				response.blob().then(blob => {
					let url = window.URL.createObjectURL(blob);
					let a = document.createElement('a');
					a.href = url;
					a.download = 'definitions.csv';
					a.click();
				});
				//window.location.href = response.url;
			});
	}

	downloadElementTypeData = () => {
		fetch('http://ihs.ihsinformatics.com:9990/aahung-aagahi/api/report/elements.csv', {
			'headers': {
				'Authorization': sessionStorage.getItem('auth_header'),
			}
		})
			.then(response => {
				response.blob().then(blob => {
					let url = window.URL.createObjectURL(blob);
					let a = document.createElement('a');
					a.href = url;
					a.download = 'elements.csv';
					a.click();
				});
				//window.location.href = response.url;
			});
	}

	downloadLocationData = () => {
		fetch('http://ihs.ihsinformatics.com:9990/aahung-aagahi/api/report/locations.csv', {
			'headers': {
				'Authorization': sessionStorage.getItem('auth_header'),
			}
		})
			.then(response => {
				response.blob().then(blob => {
					let url = window.URL.createObjectURL(blob);
					let a = document.createElement('a');
					a.href = url;
					a.download = 'locations.csv';
					a.click();
				});
				//window.location.href = response.url;
			});
	}

	downloadProjectData = () => {
		fetch('http://ihs.ihsinformatics.com:9990/aahung-aagahi/api/report/projects.csv', {
			'headers': {
				'Authorization': sessionStorage.getItem('auth_header'),
			}
		})
			.then(response => {
				response.blob().then(blob => {
					let url = window.URL.createObjectURL(blob);
					let a = document.createElement('a');
					a.href = url;
					a.download = 'projects.csv';
					a.click();
				});
				//window.location.href = response.url;
			});
	}

	downloadUserData = () => {
		fetch('http://ihs.ihsinformatics.com:9990/aahung-aagahi/api/report/users.csv', {
			'headers': {
				'Authorization': sessionStorage.getItem('auth_header'),
			}
		})
			.then(response => {

				response.blob().then(blob => {
					let url = window.URL.createObjectURL(blob);
					let a = document.createElement('a');
					a.href = url;
					a.download = 'users.csv';
					a.click();
				});
				//window.location.href = response.url;
			});
	}

	render() {
		return (
			<div id="container">

				<h3><b>Download Data Dumps</b></h3>

				<br />
				{/* <button onClick={this.downloadDonorData}>Download Donors</button> <br/> */}
				<Button className="mb-2 mr-2" color="info" size="sm" onClick={this.downloadDonorData} ><b>Download Donors</b></Button> <br />
				<br />
				<Button className="mb-2 mr-2" color="info" size="sm" onClick={this.downloadDefinitionData}><b>Download Definitions</b></Button> <br />
				<br />
				<Button className="mb-2 mr-2" color="info" size="sm" onClick={this.downloadElementTypeData}><b>Download Elements</b></Button> <br />
				<br />
				<Button className="mb-2 mr-2" color="info" size="sm" onClick={this.downloadLocationData}><b>Download Locations</b></Button> <br />
				<br />
				<Button className="mb-2 mr-2" color="info" size="sm" onClick={this.downloadUserData}><b>Download Users</b></Button> <br />
				<br />
				<p />
				{/* <h3>Download Employee Data using Link</h3> */}
				{/* <a href="#" onClick={this.downloadEmployeeData}>Download</a> */}
			</div>
		)
	}

}

export default DownloadFile;
