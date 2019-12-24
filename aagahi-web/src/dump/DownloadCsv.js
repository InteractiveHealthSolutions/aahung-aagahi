import React from 'react';
// import './download.css';
import { Button, Label, FormGroup, Row, Col, Container, Table } from 'reactstrap';
import { getAllFormTypes, getDefinitionsByDefinitionType } from '../service/GetService';
import Select from 'react-select';
import { apiUrl } from "../util/AahungUtil.js";
import { getReportByName } from "../util/ReportsListUtil.js";
var serverAddress = apiUrl;

class DownloadFile extends React.Component {

	constructor(props) {
		super(props);

		this.rest_header = localStorage.getItem('auth_header');

		this.state = {
			formTypes: [],
			errors: {},
			firstFilterName: '',
			secondFilterName: '',
			firstFilterOptionSelected: '',
			secondFilterOptionSelected: '',
			firstFilterOptions: [],
			secondFilterOptions: []
		}

		this.formTypeUuid = '';
		this.requestURL = '';
		this.errors = {};
		// this.firstFilterOptions = [];
		// this.secondFilterOptions = [];
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

	handleChange(e, name) {

		if (name === "form_type") {
			this.formTypeUuid = e.uuid;
		}
	};

	async handleCheckboxChange(e, reportName) {

		let reportArray = getReportByName(reportName);
		let report = reportArray[0];
		console.log(report);
		let firstOptions = await getDefinitionsByDefinitionType(report.filters[0]);
		let secondOptions = await getDefinitionsByDefinitionType(report.filters[1]);

		console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>> Printing first filter options");
		console.log(firstOptions);
		console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>> Printing second filter options");
		console.log(secondOptions);
		this.setState({
			firstFilterName: this.capitalize(report.filters[0]),
			secondFilterName: this.capitalize(report.filters[1]),
			firstFilterOptions: firstOptions,
			secondFilterOptions: secondOptions
		})
	}

	capitalize(filterName) {
		var words = filterName.split('_');
		for (let i = 0; i < words.length; i++) {
			words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
		}
		return words.join(' ');
	}

	downloadDonorData = () => {
		this.requestURL = serverAddress + "/report/donors.csv";
		fetch(this.requestURL, {
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
		this.requestURL = serverAddress + "/report/definitions.csv";
		fetch(this.requestURL, {
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
		this.requestURL = serverAddress + "/report/elements.csv";
		fetch(this.requestURL, {
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
		this.requestURL = serverAddress + "/report/locations.csv";
		fetch(this.requestURL, {
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
		this.requestURL = serverAddress + "/report/projects.csv";
		fetch(this.requestURL, {
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
		this.requestURL = serverAddress + "/report/users.csv";
		fetch(this.requestURL, {
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

	downloadFormData = () => {
		this.requestURL = serverAddress + "/report/form/" + this.formTypeUuid;
		fetch(this.requestURL, {
			'headers': {
				'Authorization': sessionStorage.getItem('auth_header'),
			}
		})
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

	downloadReport = () => {
		// Aagahi Report will be parameter
		this.requestURL = serverAddress + "/report/html/" + "Aagahi Report";
		fetch(this.requestURL, {
			'headers': {
				'Authorization': sessionStorage.getItem('auth_header'),
			}
		})
			.then(response => {
				response.blob().then(blob => {

					try {
						// downloading file
						let url = window.URL.createObjectURL(blob);
						let a = document.createElement('a');
						a.href = url;
						a.download = 'report' + '.html';
						a.click();

						// extracting stream from blob object and showing as html file in new tab
						var reader = new FileReader();
						reader.onload = function () {
							console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Printing blob Stream");
							console.log(reader.result);
							var newWindow = window.open();
							newWindow.document.write(reader.result);
						}
						reader.readAsText(blob);
					} catch (err) {
						console.log(err)
					}
				});
			});
	}

	checkValid = () => {

		this.setState({
			errors: {}
		})

		let isOk = true;
		const errorText = "Required";
		if (this.formTypeUuid === '') {
			this.errors['form_type'] = errorText;
			isOk = false;
		}

		this.setState({
			errors: this.errors
		})

		return isOk;
	}

	render() {
		return (

			<Container id="table-wrapper">
				<h3><b>Download Data Dumps</b></h3>
				<Table>
					<tbody >
						<tr>
							<td>
								<div><Label className="dumpLabel" for="form_type" >Form Data:</Label> <span class="errorMessage">{this.state.errors["form_type"]}</span>
									<Select id="form_type" name="form_type" value={this.state.form_type} styles={{ fontWeight: '600' }} onChange={(e) => this.handleChange(e, "form_type")} options={this.state.formTypes} required /></div>
							</td>
							<td><Button outline className="mb-2 mr-2" color="orange" size="sm" onClick={this.downloadFormData}><b>Download</b></Button> <br /></td>
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

						<tr>
							<td>
								<div>
									<Label className="dumpLabel">School Detail Report: </Label> <input type="checkbox" id="School Detail Report" value={this.state.schoolDetailReport} name="report" defaultChecked={false} onChange={(e) => this.handleCheckboxChange(e, "School Detail Report")} /> <br />
									<Label className="dumpLabel">Institution Detail Report: </Label> <input type="checkbox" id="Institution Detail Report" value={this.state.institutionDetailReport} name="report" defaultChecked={false} onChange={(e) => this.handleCheckboxChange(e, "Institution Detail Report")} />

									<div style={{ width: '400px' }}>
										<Label className="dumpLabel">Filter 1: {this.state.firstFilterName}</Label>
										<Select id="firstFilterOptionSelected" name="filter" value={this.state.firstFilterOptionSelected} styles={{ fontWeight: '600', width: '20px !important' }} onChange={(e) => this.handleChange(e, "firstFilterOptionSelected")} options={this.state.firstFilterOptions} required />
										<Label className="dumpLabel">Filter 2: {this.state.secondFilterName}</Label>
										<Select id="secondFilterOptionSelected" name="filter" value={this.state.secondFilterOptionSelected} styles={{ fontWeight: '600' }} onChange={(e) => this.handleChange(e, "secondFilterOptionSelected")} options={this.state.secondFilterOptions} required />
									</div>
								</div>
							</td>

							<td><Button outline className="mb-2 mr-2" color="orange" size="sm" onClick={this.downloadReport}><b>Download</b></Button></td>
						</tr>


					</tbody>
				</Table>

			</Container>
		)
	}

}

export default DownloadFile;
