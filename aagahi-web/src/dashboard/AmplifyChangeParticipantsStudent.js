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

// Contributors: Owais Hussain, Tahira Niazi

/**
 * @author Owais Hussain, Tahira Niazi
 * @email owais.hussain@ihsinformatics.com, tahira.niazi@ihsinformatics.com
 * @create date 2019-12-18
 * @desc [description]
 */


import { Chart, ChartCategoryAxis, ChartTooltip, ChartCategoryAxisCrosshair, ChartCategoryAxisCrosshairTooltip, ChartCategoryAxisItem, ChartLegend, ChartSeries, ChartSeriesItem, ChartSeriesItemTooltip, ChartTitle, ChartValueAxis, ChartValueAxisItem } from '@progress/kendo-react-charts';
import 'hammerjs';
import React from "react";
import { getGraphData } from "../service/GetService";
import { apiUrl } from "../util/AahungUtil.js";
var serverAddress = apiUrl;

class AmplifyChangeParticipantsStudent extends React.Component {

    constructor(props) {
        super(props);
        this.getData = this.getData.bind(this);
    }

    state = {
        seriesVisible: [true, true, true, true, true, true, true],
        name: ['Male', 'Female', 'Other'],
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
        if(this.state.component === "srhm") {
            var params = "from=" + this.state.startDate + "&to=" + this.state.endDate + "&state_province=" + this.state.provincesString + "&city_village=" + this.state.citiesString;
            var resourceUrl = serverAddress + "/report/amplifychangeparticipantdata/students?" + params;
            var resultSet = await getGraphData(resourceUrl);
            if(resultSet != null && resultSet != undefined) {
                this.setState({
                    data: resultSet
                })
            }
        }
    }

    render() {

        const seriesVisible = this.state.seriesVisible;
        const toolTipRender = ({ point }) => (`${point.series.name}: ${point.value}`);
        let data = [
            { name: 'Medical', data: filterData(this.state.data, 'Medical') },
            { name: 'Nursing', data: filterData(this.state.data, 'Nursing') }
        ];
        const colors = ['#DC143C', '#FFA500', '#32CD32'];
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
                <ChartTitle text="AC Trained Students' Program" color="black" font="19pt sans-serif" />
                <ChartLegend position="bottom" />
                <ChartCategoryAxis>
                    <ChartCategoryAxisItem categories={['Male', 'Female', 'Other']} startAngle={45}>
                        <ChartCategoryAxisCrosshair>
                            <ChartCategoryAxisCrosshairTooltip />
                        </ChartCategoryAxisCrosshair>
                    </ChartCategoryAxisItem>
                </ChartCategoryAxis>
                <ChartTooltip render={toolTipRender} />
                <ChartSeries>
                {data.map((item, index) => (
                        <ChartSeriesItem type="column"
                            data={item.data} visible={seriesVisible[index]} spacing={0.5} name={item.name} gap={2}>
                            <ChartSeriesItemTooltip />
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

function filterData(data, educationLevel) {
    var sums = [];
    var maleArray = [];
    var femaleArray = [];
    var otherArray = [];
    if (educationLevel === "Medical") {
        if (data !== null && data !== undefined && data.length > 0) {
            maleArray = data.filter(element => element.education_level === "Medical" && element.gender === "Male");
            femaleArray = data.filter(element => element.education_level === "Medical" && element.gender === "Female");
            otherArray = data.filter(element => element.education_level === "Medical" && element.gender === "Other");
        }
        // male
        sums.push(maleArray.reduce(function (cnt, o) { return cnt + o.total; }, 0));
        // female
        sums.push(femaleArray.reduce(function (cnt, o) { return cnt + o.total; }, 0));
        // other
        sums.push(otherArray.reduce(function (cnt, o) { return cnt + o.total; }, 0));
        return sums;
    }
    else if(educationLevel === "Nursing") {
        if (data !== null && data !== undefined && data.length > 0) {
            maleArray = data.filter(element => element.education_level === "Nursing" && element.gender === "Male");
            femaleArray = data.filter(element => element.education_level === "Nursing" && element.gender === "Female");
            otherArray = data.filter(element => element.education_level === "Nursing" && element.gender === "Other");
        }
        // male
        sums.push(maleArray.reduce(function (cnt, o) { return cnt + o.total; }, 0));
        // female
        sums.push(femaleArray.reduce(function (cnt, o) { return cnt + o.total; }, 0));
        // other
        sums.push(otherArray.reduce(function (cnt, o) { return cnt + o.total; }, 0));
        return sums;
    }
}

export default AmplifyChangeParticipantsStudent;