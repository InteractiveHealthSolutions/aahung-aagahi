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
 * @create date 2019-12-23
 * @desc [description]
 */


import React from "react";
import {
    Chart,
    ChartLegend,
    ChartSeries,
    ChartTooltip,
    ChartTitle,
    ChartSeriesItem,
    ChartCategoryAxis,
    ChartCategoryAxisItem,
    ChartSeriesItemTooltip,
    ChartValueAxis,
    ChartValueAxisItem,
    ChartCategoryAxisCrosshair,
    ChartCategoryAxisCrosshairTooltip
} from '@progress/kendo-react-charts';
import { getUniqueValues } from '../util/AahungUtil';
import { partnerSchoolData } from '../service/ReportService';
import { getGraphData } from "../service/GetService";
import { apiUrl } from "../util/AahungUtil.js";
var serverAddress = apiUrl;

class PartnerSchoolsChart extends React.Component {

    constructor(props) {
        super(props);
        this.getData = this.getData.bind(this);
        // this.data = partnerSchoolData; // TODO: replace with the correct resource
    }

    state = {
        seriesVisible: [true, true, true],
        paramFilter: this.props.paramFilter,
        component: this.props.component,
        data: [],
    }

    async componentWillReceiveProps(nextProps) {
        await this.setState({ data: nextProps.data });

        await this.setState({
            paramFilter: nextProps.paramFilter,
            component: nextProps.component
        })

        await this.getData();
    }

    async getData() {
        // calling the appropriate resource with url params
        if(this.state.component === "lse") {
            var resourceUrl = serverAddress + "/report/partnerschooldata?" + this.state.paramFilter;
            var resultSet = await getGraphData(resourceUrl);
            if(resultSet != null && resultSet !== undefined) {
                this.setState({
                    data: resultSet,
                    // uniqueProvinces: getUniqueValues(resultSet, 'state_province'),
                    // priNewData: filterData(resultSet, 'Primary', 'New'),
                    // priRunningData: filterData(resultSet, 'Primary', 'Running'),
                    // priExitData: filterData(resultSet, 'Primary', 'Exit'),
                    // secNewData: filterData(resultSet, 'Secondary', 'New'),
                    // secRunningData: filterData(resultSet, 'Secondary', 'Running'),
                    // secExitData: filterData(resultSet, 'Secondary', 'Exit')
                })
            }
        }
    }

    render() {
        const primaryToolTipRender = ({ point }) => (`Primary - ${point.value}`);
        const secondaryToolTipRender = ({ point }) => (`Secondary - ${point.value}`);
        const seriesVisible = this.state.seriesVisible;
        let provinces = getUniqueValues(this.data, 'state_province');
        let primary = [
            { name: 'New', data: filterData(this.state.data, 'Primary', 'New') },
            { name: 'Running', data: filterData(this.state.data, 'Primary', 'Running') },
            { name: 'Exit', data: filterData(this.state.data, 'Primary', 'Exit') }
        ];
        let secondary = [
            { name: 'New', data: filterData(this.state.data, 'Secondary', 'New') },
            { name: 'Running', data: filterData(this.state.data, 'Secondary', 'Running') },
            { name: 'Exit', data: filterData(this.state.data, 'Secondary', 'Exit') }
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
            <Chart seriesColors={colors} style={{ height: 340 }} pannable={{ lock: 'y' }} zoomable={{ mousewheel: { lock: 'y' } }} onLegendItemClick={this.onLegendItemClick} >
                <ChartTitle text="Partner Schools Geographic Summary" color="black" font="19pt sans-serif" />
                <ChartLegend position="bottom" orientation="horizontal" />
                <ChartCategoryAxis>
                    <ChartCategoryAxisItem categories={provinces} startAngle={45}>
                        <ChartCategoryAxisCrosshair>
                            <ChartCategoryAxisCrosshairTooltip />
                        </ChartCategoryAxisCrosshair>
                    </ChartCategoryAxisItem>
                </ChartCategoryAxis>
                <ChartTooltip />
                <ChartSeries>
                    {primary.map((item, index) => (
                        <ChartSeriesItem type="column"
                            data={item.data} visible={seriesVisible[index]} spacing={0.5} name={item.name} gap={2}>
                            <ChartSeriesItemTooltip render={primaryToolTipRender} />
                        </ChartSeriesItem>
                    ))}
                    {secondary.map((item, index) => (
                        <ChartSeriesItem type="column"
                            data={item.data} visible={seriesVisible[index]} spacing={0.5} gap={2}>
                            <ChartSeriesItemTooltip render={secondaryToolTipRender} />
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

function filterData(data, level, tier) {
    var provinces = getUniqueValues(data, 'state_province');
    var filtered = [];
    if (data !== null && data !== undefined && data.length > 0) {
        // var filtered = data.filter(element => element.school_level === level && element.school_tier === tier);
        var filtered = data.filter(element => element.school_level === level);
    }
    var sums = [];
    provinces.forEach(province => {
        var sum = 0;
        for (var i = 0; i < filtered.length; i++) {
            if (filtered[i].state_province == province) {
                sum += filtered[i].total;
            }
        }
        sums.push(sum);
    });
    return sums;
}

export default PartnerSchoolsChart;
