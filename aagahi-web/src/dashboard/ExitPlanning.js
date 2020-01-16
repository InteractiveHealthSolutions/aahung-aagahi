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


import React from "react";
import 'hammerjs';
import {
    Chart,
    ChartLegend,
    ChartSeries,
    ChartTitle,
    ChartSeriesItem,
    ChartSeriesItemTooltip,
    ChartCategoryAxis,
    ChartCategoryAxisItem,
    ChartValueAxis,
    ChartValueAxisItem,
    ChartCategoryAxisCrosshair,
    ChartCategoryAxisCrosshairTooltip
} from '@progress/kendo-react-charts';
import { getUniqueValues } from '../util/AahungUtil';
import { exitSchoolPlanningData } from '../service/ReportService';

class ExitPlanning extends React.Component {

    constructor(props) {
        super(props);
        this.data = exitSchoolPlanningData;
        console.log(this.data); // TODO: replace with the correct resource
    }

    state = {
        seriesVisible: [true, true]
    }

    render() {

        const series =[
            {category:'SRHR Policy Implemented', value:filterData(this.data,'srhr_policy_implemented',this.province)},
            {category:'Parent Sessions Conducted', value:filterData(this.data,'parent_session_conducted',this.province)}
        ];
        const seriesVisible = this.state.seriesVisible;
    
        const colors = ['#DC143C', '#FFA500'];

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
                <ChartTitle text="Exit Planning Graph" color="black" font="19pt sans-serif" />
                <ChartLegend position="bottom" />
                <ChartCategoryAxis>
                        <ChartCategoryAxisCrosshair>
                            <ChartCategoryAxisCrosshairTooltip />
                        </ChartCategoryAxisCrosshair>
                </ChartCategoryAxis>
                <ChartSeries>
                   <ChartSeriesItem type="pie" data={series} field="value" categoryField="category" />
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

function filterData(data, category, location) {
    // For each tier, attach tier as name and data as the sums for each province
    var years = getUniqueValues(data, 'fiscal_year');
    location = getUniqueValues(data, 'state_province');

    var filtered = data.filter(element => element.state_province === location);
    var sums = [];

    years.forEach(year => {
        var sum = 0;
        for (var i = 0; i < filtered.length; i++) {
            if (filtered[i].fiscal_year == year) {
                sum += filtered[i].total;
            }
        }
        sums.push(sum);
    });

    return sums;
}

export default ExitPlanning;
