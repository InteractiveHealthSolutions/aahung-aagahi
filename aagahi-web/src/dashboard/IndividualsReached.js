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


import { Chart, ChartCategoryAxis, ChartCategoryAxisCrosshair, ChartCategoryAxisCrosshairTooltip, ChartCategoryAxisItem, ChartLegend, ChartSeries, ChartSeriesItem, ChartTitle, ChartTooltip, ChartValueAxis, ChartValueAxisItem } from '@progress/kendo-react-charts';
import 'hammerjs';
import React from "react";
import { getGraphData } from "../service/GetService";
import { getUniqueValues } from '../util/AahungUtil';
import { apiUrl } from "../util/AahungUtil.js";
var serverAddress = apiUrl;

class IndividualsReached extends React.Component {

    constructor(props) {
        super(props);
        this.getData = this.getData.bind(this);
    }

    state = {
        seriesVisible: [true, true, true],
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
        if (this.state.component === "srhm") {
            var params = "from=" + this.state.startDate + "&to=" + this.state.endDate + "&state_province=" + this.state.provincesString + "&city_village=" + this.state.citiesString;
            var resourceUrl = serverAddress + "/report/individualreachdata?" + params;
            var resultSet = await getGraphData(resourceUrl);
            if (resultSet != null && resultSet != undefined) {
                this.setState({
                    data: resultSet
                })
            }
        }
    }

    render() {

        const defaultTooptip = ({ point }) => (`${point.series.name}: ${point.value}`);
        let genders = ['male_count', 'female_count', 'other_sex_count'];
        const seriesVisible = this.state.seriesVisible;
        const activityTypes = ['HCP', 'Step Down', 'AC - Students', 'AC - Teachers'];
        let graphData = [];
        for(let i=0; i< genders.length; i++) {
            graphData.push({ name: genders[i] === "male_count" ? "Male" : genders[i] === "female_count" ? "Female" : "Other", data: filterData(this.state.data, genders[i]) });
        }
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
                <ChartTitle text="Individuals Reached Through SRHM Activities" color="black" font="19pt sans-serif" />
                <ChartLegend position="bottom" />
                <ChartCategoryAxis>
                    <ChartCategoryAxisItem categories={activityTypes} startAngle={45}>
                        <ChartCategoryAxisCrosshair>
                            <ChartCategoryAxisCrosshairTooltip />
                        </ChartCategoryAxisCrosshair>
                    </ChartCategoryAxisItem>
                </ChartCategoryAxis>
                <ChartTooltip render={defaultTooptip} />
                <ChartSeries>
                {graphData.map((item, index) => (
                        <ChartSeriesItem type="column"
                            data={item.data} visible={seriesVisible[index]} name={item.name} gap={3}>
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

function filterData(data, gender) {
    
    const activityTypes = ['HCP', 'Step Down', 'AC - Students', 'AC - Teachers'];
    var filtered = [];
    if (data !== null && data !== undefined && data.length > 0)
        filtered = data.filter(element => parseInt(element[gender]) !== 0);

    var sums = [];
    activityTypes.forEach(activityType => {
        var sum = 0;
        for (var i = 0; i < filtered.length; i++) {
            if (filtered[i].activity_type === activityType) {
                sum += parseInt(filtered[i][gender]);
            }
        }
        sums.push(sum);
    });

    return sums;
}

export default IndividualsReached;