import React from 'react';
// import './download.css';
import { Button, Label, FormGroup, Row, Col, Container, Table } from 'reactstrap';
import { getAllFormTypes } from '../service/GetService';
import Select from 'react-select';
import { apiUrl } from "../util/AahungUtil.js";
var serverAddress = apiUrl;

class DownloadFile extends React.Component {
	
	constructor(props) {
        super(props);
        
		this.rest_header = localStorage.getItem('auth_header'); 
		
		this.state = {
			formTypes: [],
			errors: {},
		}

		this.formTypeUuid = '';
		this.requestURL = '';
		this.errors = {};
	}
	
	componentDidMount() {
        this.loadData();
	}
	
	/**
     * Loads data when the component is mounted
     */
    loadData = async () => {
        try {
            
            let formTypeList = await getAllFormTypes();

            if (formTypeList != null && formTypeList.length > 0) {
                this.setState({
                    formTypes: formTypeList
                })
            }

        }
        catch (error) {
            console.log(error);
        }
	}

	// for autocomplete single select
    handleChange(e, name) {

		if (name === "form_type") {
			this.formTypeUuid = e.uuid;
		}
    };
	
	downloadDonorData = () => {
		this.requestURL = serverAddress + "/report/donors.csv";
		fetch(this.requestURL, { 'headers': {
            'Authorization': sessionStorage.getItem('auth_header'),
            }} )
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
		this.requestURL = serverAddress + "/report/definitions.csv";
		fetch(this.requestURL, { 'headers': {
            'Authorization': sessionStorage.getItem('auth_header'),
            }} )
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
		this.requestURL = serverAddress + "/report/elements.csv";
		fetch(this.requestURL, { 'headers': {
            'Authorization': sessionStorage.getItem('auth_header'),
            }} )
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
		this.requestURL = serverAddress + "/report/locations.csv";
		fetch(this.requestURL, { 'headers': {
            'Authorization': sessionStorage.getItem('auth_header'),
            }} )
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
		this.requestURL = serverAddress + "/report/projects.csv";
		fetch(this.requestURL, { 'headers': {
            'Authorization': sessionStorage.getItem('auth_header'),
            }} )
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
		this.requestURL = serverAddress + "/report/users.csv";
		fetch(this.requestURL, { 'headers': {
            'Authorization': sessionStorage.getItem('auth_header'),
            }} )
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

	downloadFormData = () => {
			this.requestURL = serverAddress + "/report/form/" + this.formTypeUuid;
			fetch(this.requestURL, { 'headers': {
				'Authorization': sessionStorage.getItem('auth_header'),
				}} )
				.then(response => {
					response.blob().then(blob => {
						let url = window.URL.createObjectURL(blob);
						let a = document.createElement('a');
						a.href = url;
						a.download = 'form_data.csv';
						a.click();
					});
					//window.location.href = response.url;
			});
	}

	checkValid = () => {

		this.setState({
			errors: {}
		})

		let isOk = true;
		const errorText = "Required";
        if(this.formTypeUuid === '') {
			this.errors['form_type'] = errorText;
			isOk = false;
		}

		this.setState({
			errors: this.errors
		})

		alert(isOk);
        return isOk;
    }
	
	render() {
		return (
				
				<Container>
					<h3><b>Download Data Dumps</b></h3>

					<Table>
						<tbody>
							<tr>
							<td>
								<div><Label className="dumpLabel" for="form_type" >Form Data:</Label> <span class="errorMessage">{this.state.errors["form_type"]}</span>
								<Select id="form_type" name="form_type" value={this.state.form_type} styles={{fontWeight: '600'}} onChange={(e) => this.handleChange(e, "form_type")} options={this.state.formTypes} required/></div>
							</td>
							<td><Button outline className="mb-2 mr-2" color="orange" size="sm" onClick={this.downloadFormData}><b>Download</b></Button> <br/></td>
							</tr>
							
							<tr>
							<td><Label className="dumpLabel">Donors: </Label></td>
							<td><Button outline className="mb-2 mr-2" color="orange" size="sm" onClick={this.downloadDonorData} ><b>Download</b></Button></td>
							</tr>
							<tr>
							<td><Label className="dumpLabel">Definitions: </Label></td>
							<td><Button outline className="mb-2 mr-2" color="orange" size="sm" onClick={this.downloadDefinitionData}><b>Download</b></Button></td>
							</tr>

							<tr>
							<td><Label className="dumpLabel">Elements: </Label></td>
							<td><Button outline className="mb-2 mr-2" color="orange" size="sm" onClick={this.downloadElementTypeData}><b>Download</b></Button></td>
							</tr>

							<tr>
							<td><Label className="dumpLabel">Locations: </Label></td>
							<td><Button outline className="mb-2 mr-2" color="orange" size="sm" onClick={this.downloadLocationData}><b>Download</b></Button></td>
							</tr>

							<tr>
							<td><Label className="dumpLabel">Users: </Label></td>
							<td><Button outline className="mb-2 mr-2" color="orange" size="sm" onClick={this.downloadUserData}><b>Download</b></Button></td>
							</tr>

							
						</tbody>
					</Table>

				</Container>
		)
	}

}

export default DownloadFile;
