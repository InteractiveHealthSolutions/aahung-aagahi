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

import { Chart, ChartCategoryAxis, ChartCategoryAxisCrosshair, ChartCategoryAxisCrosshairTooltip, ChartCategoryAxisItem, ChartLegend, ChartSeries, ChartSeriesItem, ChartTitle, ChartTooltip, ChartValueAxis, ChartValueAxisItem } from '@progress/kendo-react-charts';
import 'hammerjs';
import React from "react";
import { getGraphData } from "../service/GetService";
import { getUniqueValues } from '../util/AahungUtil';
import { apiUrl } from "../util/AahungUtil.js";
var serverAddress = apiUrl;

class MaterialDistribution extends React.Component {

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
        if (this.state.component === "comms") {
            var params = "from=" + this.state.startDate + "&to=" + this.state.endDate + "&state_province=" + this.state.provincesString + "&city_village=" + this.state.citiesString;
            var resourceUrl = serverAddress + "/report/materialdistributiondata?" + params;
            var resultSet = await getGraphData(resourceUrl);
            if (resultSet != null && resultSet !== undefined) {
                this.setState({
                    data: resultSet
                })
            }
        }
    }

    render() {
        const defaultTooltip = ({ point }) => (`${point.series.name}: ${point.value}`);
        const seriesVisible = this.state.seriesVisible;
        const distributions = ['Aahung Office', 'Conference', 'Other', 'School', 'Stakeholder Meeting', 'Festival Stall']
        let chartData = [
            { name: 'Pamphlet', data: filterData(this.state.data, 'pamphlet_count') },
            { name: 'Brochure', data: filterData(this.state.data, 'booklet_count') },
            { name: 'Files', data: filterData(this.state.data, 'aahung_notebooks_count') }

        ];
        const colors = ['green', 'red', 'blue'];
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
                <ChartTitle text="IEC Material Distribution" color="black" font="19pt sans-serif" />
                <ChartLegend position="bottom" />
                <ChartCategoryAxis>
                    <ChartCategoryAxisItem categories={distributions} startAngle={45}>
                        <ChartCategoryAxisCrosshair>
                            <ChartCategoryAxisCrosshairTooltip />
                        </ChartCategoryAxisCrosshair>
                    </ChartCategoryAxisItem>
                </ChartCategoryAxis>
                <ChartTooltip render={defaultTooltip} />
                <ChartSeries>
                    {chartData.map((item, index) => (
                        <ChartSeriesItem type="bar"
                            data={item.data} visible={seriesVisible[index]} name={item.name}>
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

function filterData(data, materialType) {
    // For each tier, attach tier as name and data as the sums for each province
    var locations = getUniqueValues(data, 'distribution_location');
    var filtered;
    var sums = [];

    if (materialType === 'pamphlet_count') {
        locations.forEach(location => {
            var pamphletSum = 0;
            for (var i = 0; i < data.length; i++) {
                if (data[i].distribution_location == location) {
                    pamphletSum += data[i].pamphlet_count;
                }
            }
            sums.push(pamphletSum);
        });

        return sums;

    } else if (materialType === 'booklet_count') {

        locations.forEach(location => {
            var bookletSum = 0;
            for (var i = 0; i < data.length; i++) {
                if (data[i].distribution_location == location) {
                    bookletSum += parseInt(data[i].booklet_count);
                }
            }
            sums.push(bookletSum);
        });

        return sums;

    } else {
        locations.forEach(location => {
            var notebookSum = 0;
            for (var i = 0; i < data.length; i++) {
                if (data[i].distribution_location == location) {
                    notebookSum += parseInt(data[i].aahung_notebooks_count);
                }
            }
            sums.push(notebookSum);
        });

        return sums;
    }
}

export default MaterialDistribution;
