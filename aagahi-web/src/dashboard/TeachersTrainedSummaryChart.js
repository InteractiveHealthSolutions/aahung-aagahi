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
import {
    Chart,
    ChartLegend,
    ChartSeries,
    ChartTitle,
    ChartTooltip,
    ChartSeriesItemTooltip,
    ChartSeriesItem,
    ChartCategoryAxis,
    ChartCategoryAxisItem,
    ChartValueAxis,
    ChartValueAxisItem,
    ChartCategoryAxisCrosshair,
    ChartCategoryAxisCrosshairTooltip
} from '@progress/kendo-react-charts';
import { getUniqueValues } from '../util/AahungUtil';
import { teachersTrainingData } from '../service/ReportService';

class TeachersTrainedSummaryChart extends React.Component {

    // state = {
    //     seriesVisible: true
    // }

    // secondState = {
    //     seriesVisible2: true
    // }

    constructor(props) {
        super(props);
        this.data = addAggregateRecord(teachersTrainingData); // TODO: replace with the correct resource
        console.debug(this.data);
    }

    state = {
        seriesVisible: [true, true, true, true]
    }

    render() {
        const primaryToolTipRender = ({ point }) => (`Primary: ${point.value}`);
        const secondaryToolTipRender = ({ point }) => (`Secondary: ${point.value}`);
        const seriesVisible = this.state.seriesVisible;
        let programs = getUniqueValues(this.data, 'program');

        let primary = [
            { name: 'New', data: filterData(this.data, 'Primary', 'New') },
            { name: 'Running', data: filterData(this.data, 'Primary', 'Running') },
            { name: 'Exit', data: filterData(this.data, 'Primary', 'Exit') },
        ];
        let secondary = [
            { name: 'New', data: filterData(this.data, 'Secondary', 'New') },
            { name: 'Running', data: filterData(this.data, 'Secondary', 'Running') },
            { name: 'Exit', data: filterData(this.data, 'Secondary', 'Exit') },
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
            <Chart /*onLegendItemClick={this.onLegendItemClick}*/ seriesColors={colors} style={{ height: 340 }} pannable={{ lock: 'y' }} zoomable={{ mousewheel: { lock: 'y' } }} onLegendItemClick={this.onLegendItemClick} >
                <ChartTitle text="Summary of Teachers Trained" color="black" font="19pt sans-serif" />
                <ChartLegend position="bottom" />
                <ChartCategoryAxis>
                    <ChartCategoryAxisItem categories={programs} startAngle={45}>
                        <ChartCategoryAxisCrosshair>
                            <ChartCategoryAxisCrosshairTooltip />
                        </ChartCategoryAxisCrosshair>
                    </ChartCategoryAxisItem>
                </ChartCategoryAxis>
                <ChartTooltip render={primaryToolTipRender} />
                <ChartSeries>
                {primary.map((item, index) => (
                        <ChartSeriesItem type="column" stack={{ group: 'Primary' }}
                            data={item.data} visible={seriesVisible[index]} name={item.name} gap={2}>
                        </ChartSeriesItem>
                    ))}
                    {secondary.map((item, index) => (
                        <ChartSeriesItem type="column" stack={{ group: 'Secondary' }}
                            data={item.data} visible={seriesVisible[index]} gap={2}>
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

function addAggregateRecord(data) {
    var clone = JSON.parse(JSON.stringify(data));
    for (var i = 0; i < clone.length; i++) {
        clone[i].program = 'Overall';
    }
    return data.concat(clone);
}

function filterData(data, level, tier) {
    var programs = getUniqueValues(data, 'program');
    // var levels = getUniqueValues(data, 'school_level');
    var filtered = data.filter(element => element.school_level === level && element.school_tier === tier);
    var sums = [];
        programs.forEach(program => {
            var sum = 0;
            for (var i = 0; i < filtered.length; i++) {
                if (filtered[i].program == program) {
                    sum += filtered[i].total;
                }
            }
            sums.push(sum);
        });
    
    return sums;
}

// function getTotals(data, level) {
//     // For each tier, attach tier as name and data as the sums for each province
//     var transformedData = []
//     var tiers = getUniqueValues(data, 'school_tier');
//     var programs = getUniqueValues(data, 'program');
//     tiers.forEach(tier => {
//         transformedData.push({ name: tier });
//         var tierData = []
//         // Sum for each province
//         programs.forEach(program => {
//             var sum = 0;
//             for (var i = 0; i < data.length; i++) {
//                 if (data[i].program === program && data[i].school_tier === tier && data[i].school_level === level) {
//                     sum += data[i].total;
//                 }
//             }
//             tierData.push(sum);
//         });
//         transformedData.push({ data: tierData });
//     });
//     console.log(transformedData);
//     return transformedData;    
// }

export default TeachersTrainedSummaryChart;
