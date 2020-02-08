// Copyright 2019 Interactive Health Solutions
//
// This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 3 of the License (GPLv3), or any later version.
//
// This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
// See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with this program; if not, write to the Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301  USA.
// You can also access the license on the internet at the address: http://www.gnu.org/licenses/gpl-3.0.html
//
// Interactive Health Solutions, hereby disclaims all copyright interest in the program `Aahung-Aagahi' written by the contributors.

// Contributors: Owais Hussain

/**
 * @author Owais Hussain
 * @email owais.hussain@ihsinformatics.com
 * @create date 2019-12-18
 * @desc [description]
 */


import { Chart, ChartCategoryAxis, ChartCategoryAxisCrosshair, ChartCategoryAxisCrosshairTooltip, ChartCategoryAxisItem, ChartLegend, ChartSeries, ChartSeriesItem, ChartSeriesItemTooltip, ChartTitle, ChartValueAxis, ChartValueAxisItem } from '@progress/kendo-react-charts';
import 'hammerjs';
import React from "react";
import { getGraphData } from "../service/GetService";
import { getUniqueValues } from '../util/AahungUtil';
import { apiUrl } from "../util/AahungUtil.js";
var serverAddress = apiUrl;

class CommunicationsTraining extends React.Component {

    constructor(props) {
        super(props);
        this.getData = this.getData.bind(this);
    }

    state = {
        seriesVisible: [true, true, true, true],
        component: this.props.component,
        startDate: this.props.startDate,
        endDate: this.props.endDate,
        provincesString: this.props.provincesString,
        citiesString: this.props.citiesString,
        data: []
    }

    async componentWillReceiveProps(nextProps) {
        await this.setState({ data: nextProps.data });

        await this.setState({
            component: nextProps.component,
            startDate: nextProps.startDate,
            endDate: nextProps.endDate,
            provincesString: nextProps.provincesString,
            citiesString: nextProps.citiesString
        })

        await this.getData();
    }

    async getData() {
        // calling the appropriate resource with url params
        if (this.state.component === "comms") {
            var params = "from=" + this.state.startDate + "&to=" + this.state.endDate;
            var resourceUrl = serverAddress + "/report/communicationstrainingdata?" + params;
            var resultSet = await getGraphData(resourceUrl);
            if (resultSet != null && resultSet != undefined) {
                this.setState({
                    data: resultSet
                })
            }
        }
    }

    render() {
        const seriesVisible = this.state.seriesVisible;
        const toolTipRender = ({ point }) => (`${point.value}`);
        let data = [
            { name: 'SRHR', data: filterData(this.state.data, 'covered_srhr') },
            { name: 'Agency and Choice', data: filterData(this.state.data, 'covered_agency_choice') },
            { name: 'Gender Sensitization', data: filterData(this.state.data, 'covered_gender_sensitization') },
            { name: 'Other', data: filterData(this.state.data, 'covered_other') }
        ];

        const colors = ['red', 'blue', 'green', 'purple'];
        const crosshair = {
            visible: true,
            tooltip: {
                visible: true,
                format: '##'
            }
        }

        return (
            <Chart seriesColors={colors} style={{ height: 340 }} pannable={{ lock: 'y' }} zoomable={{ mousewheel: { lock: 'y' } }}
                onLegendItemClick={this.onLegendItemClick} >
                <ChartTitle text="Communications Training" color="black" font="19pt sans-serif" />
                <ChartLegend position="bottom" />
                <ChartCategoryAxis>
                    <ChartCategoryAxisItem categories={['Journalists', 'Screenwriters', 'Bloggers', 'Media', 'Other']} startAngle={45}>
                        <ChartCategoryAxisCrosshair>
                            <ChartCategoryAxisCrosshairTooltip />
                        </ChartCategoryAxisCrosshair>
                    </ChartCategoryAxisItem>
                </ChartCategoryAxis>
                <ChartSeries>
                {data.map((item, index) => (
                        <ChartSeriesItem type="column"
                            data={item.data} visible={seriesVisible[index]} spacing={0.5} name={item.name} gap={2}>
                            <ChartSeriesItemTooltip render={toolTipRender} />
                        </ChartSeriesItem>
                    ))}
                </ChartSeries>
                <ChartValueAxis skip={4}>
                    <ChartValueAxisItem crosshair={crosshair} />
                </ChartValueAxis>
            </Chart>
        )
    }

    onLegendItemClick = (e) => {
        var newState = this.state.seriesVisible;
        newState[e.seriesIndex] = !newState[e.seriesIndex];
        this.setState(newState);
    }

}

function sum(key) {
    return this.reduce((a, b) => a + (b[key] || 0), 0);
}

function filterData(data, materialType) {
    // For each tier, attach tier as name and data as the sums for each province
    var locations = getUniqueValues(data, 'city_village');
    var sums = [];

    var coveredSrhr = [];
    var coveredAgencyChoice = [];
    var coveredGenderSensitization = [];
    var coveredOther = [];
    var parTypeSum = 0;
    var sums = [];
    if (data !== null && data !== undefined && data.length > 0) {
        coveredSrhr = data.filter(element => String(element.covered_srhr) === "1");
        coveredAgencyChoice = data.filter(element => String(element.covered_agency_choice) === "1");
        coveredGenderSensitization = data.filter(element => String(element.covered_gender_sensitization) === "1");
        coveredOther = data.filter(element => String(element.covered_other) === "1");
    }

    if (materialType === "covered_srhr") {
        sums.push(coveredSrhr.reduce(function (cnt, o) { return cnt + o.journalist_count; }, 0));
        sums.push(coveredSrhr.reduce(function (cnt, o) { return cnt + o.screenwriter_count; }, 0));
        sums.push(coveredSrhr.reduce(function (cnt, o) { return cnt + o.blogger_count; }, 0));
        sums.push(coveredSrhr.reduce(function (cnt, o) { return cnt + o.other_media_count; }, 0));
        sums.push(coveredSrhr.reduce(function (cnt, o) { return cnt + o.other_attendant_count; }, 0))

        console.log("covered_srhr: printing sums");
        console.log(sums);
        return sums;
    }
    else if(materialType === "covered_agency_choice") {
        sums.push(coveredAgencyChoice.reduce(function (cnt, o) { return cnt + o.journalist_count; }, 0));
        sums.push(coveredAgencyChoice.reduce(function (cnt, o) { return cnt + o.screenwriter_count; }, 0));
        sums.push(coveredAgencyChoice.reduce(function (cnt, o) { return cnt + o.blogger_count; }, 0));
        sums.push(coveredAgencyChoice.reduce(function (cnt, o) { return cnt + o.other_media_count; }, 0));
        sums.push(coveredAgencyChoice.reduce(function (cnt, o) { return cnt + o.other_attendant_count; }, 0))

        console.log("covered_agency_choice: printing sums");
        console.log(sums);
        return sums;
    }
    else if(materialType === "covered_gender_sensitization") {
        sums.push(coveredGenderSensitization.reduce(function (cnt, o) { return cnt + o.journalist_count; }, 0));
        sums.push(coveredGenderSensitization.reduce(function (cnt, o) { return cnt + o.screenwriter_count; }, 0));
        sums.push(coveredGenderSensitization.reduce(function (cnt, o) { return cnt + o.blogger_count; }, 0));
        sums.push(coveredGenderSensitization.reduce(function (cnt, o) { return cnt + o.other_media_count; }, 0));
        sums.push(coveredGenderSensitization.reduce(function (cnt, o) { return cnt + o.other_attendant_count; }, 0))

        console.log("covered_gender_sensitization: printing sums");
        console.log(sums);
        return sums;
    }
    else if(materialType === "covered_other") {
        sums.push(coveredOther.reduce(function (cnt, o) { return cnt + o.journalist_count; }, 0));
        sums.push(coveredOther.reduce(function (cnt, o) { return cnt + o.screenwriter_count; }, 0));
        sums.push(coveredOther.reduce(function (cnt, o) { return cnt + o.blogger_count; }, 0));
        sums.push(coveredOther.reduce(function (cnt, o) { return cnt + o.other_media_count; }, 0));
        sums.push(coveredOther.reduce(function (cnt, o) { return cnt + o.other_attendant_count; }, 0))

        console.log("covered_other: printing sums");
        console.log(sums);
        return sums;
    }
}

export default CommunicationsTraining;
