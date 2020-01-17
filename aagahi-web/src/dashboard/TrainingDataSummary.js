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
import { trainingData } from '../service/ReportService';

class TrainingDataSummary extends React.Component {

    constructor(props) {
        super(props);
        this.data = trainingData;
        console.log(this.data); // TODO: replace with the correct resource
    }

    state = {
        seriesVisible: [true, true, true,true]
    }

    render() {
        const seriesVisible = this.state.seriesVisible;
        let trainingType = ['Initial Training', 'MT Training', 'Refresher Training', 'Roll Out Step Down'];


        let initialTraining = [
            { name: 'Punjab', data: filterData(this.data, 'INITIAL_TRAINING', 'Punjab') },
            { name: 'Balochistan', data: filterData(this.data, 'INITIAL_TRAINING', 'Balochistan') },
            { name: 'KP', data: filterData(this.data, 'INITIAL_TRAINING', 'KP') },
            { name: 'Sindh', data: filterData(this.data, 'INITIAL_TRAINING', 'Sindh') },
            
        ];
        let refresherTraining = [
            { name: 'Punjab', data: filterData(this.data, 'REFRESHER_TRAINING', 'Punjab') },
            { name: 'Balochistan', data: filterData(this.data, 'REFRESHER_TRAINING', 'Balochistan') },
            { name: 'KP', data: filterData(this.data, 'REFRESHER_TRAINING', 'KP') },
            { name: 'Sindh', data: filterData(this.data, 'REFRESHER_TRAINING', 'Sindh') },
            
        ];
        let mtTraining = [
            { name: 'Punjab', data: filterData(this.data, 'MT_TRAINING', 'Punjab') },
            { name: 'Balochistan', data: filterData(this.data, 'MT_TRAINING', 'Balochistan') },
            { name: 'KP', data: filterData(this.data, 'MT_TRAINING', 'KP') },
            { name: 'Sindh', data: filterData(this.data, 'MT_TRAINING', 'Sindh') },
            
        ];
        let rollOutStepDown = [
            { name: 'Punjab', data: filterData(this.data, 'ROLL_OUT_STEP_DOWN', 'Punjab') },
            { name: 'Balochistan', data: filterData(this.data, 'ROLL_OUT_STEP_DOWN', 'Balochistan') },
            { name: 'KP', data: filterData(this.data, 'ROLL_OUT_STEP_DOWN', 'KP') },
            { name: 'Sindh', data: filterData(this.data, 'ROLL_OUT_STEP_DOWN', 'Sindh') },
            
        ];


        const colors = ['#DC143C', '#FFA500', '#32CD32', '#008080'];

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
                <ChartTitle text="Training Data Summary" color="black" font="19pt sans-serif" />
                <ChartLegend position="bottom" />
                <ChartCategoryAxis>
                    <ChartCategoryAxisItem categories={trainingType} startAngle={45}>
                        <ChartCategoryAxisCrosshair>
                            <ChartCategoryAxisCrosshairTooltip />
                        </ChartCategoryAxisCrosshair>
                    </ChartCategoryAxisItem>
                </ChartCategoryAxis>
                <ChartSeries>
                    {initialTraining.map((item, index) => (
                        <ChartSeriesItem type="column" 
                            data={item.data} visible={seriesVisible[index]} name={item.name}>
                        </ChartSeriesItem>
                    ))}
                
                    {mtTraining.map((item, index) => (
                        <ChartSeriesItem type="column" 
                            data={item.data} visible={seriesVisible[index]} >
                        </ChartSeriesItem>
                    ))}

                    {refresherTraining.map((item, index) => (
                        <ChartSeriesItem type="column"
                            data={item.data} visible={seriesVisible[index]}>
                        </ChartSeriesItem>
                    ))}
                    
                    {rollOutStepDown.map((item, index) => (
                        <ChartSeriesItem type="column" 
                            data={item.data} visible={seriesVisible[index]}>
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

function filterData(data, trainingType, location) {
    // For each tier, attach tier as name and data as the sums for each province
    var trainingTypes = getUniqueValues(data, 'training_type');

    var filtered = data.filter(element => element.training_type === trainingType && element.state_province === location);
    var sums = [];

    trainingTypes.forEach(trainingType => {
        var sum = 0;
        for (var i = 0; i < filtered.length; i++) {
            if (filtered[i].training_type == trainingType) {
                sum += filtered[i].total;
            }
        }
        sums.push(sum);
    });

    return sums;
}

export default TrainingDataSummary;
