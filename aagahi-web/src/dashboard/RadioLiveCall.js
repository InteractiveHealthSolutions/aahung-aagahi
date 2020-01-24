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
    ChartCategoryAxisCrosshairTooltip,
    ChartTooltip
} from '@progress/kendo-react-charts';
import { getUniqueValues } from '../util/AahungUtil';
import { radioLiveCallData } from '../service/ReportService';

class RadioLiveCall extends React.Component {

    constructor(props) {
        super(props);
        this.data = radioLiveCallData;
        console.log(this.data); // TODO: replace with the correct resource
    }

    state = {
        seriesVisible: [true, true],
        name : ['Listener', 'Live']
    }

    render() {
        const defaultToolTip = ({ point }) => (`${point.series.name}: ${point.value}`);
        
        const seriesVisible = this.state.seriesVisible;
        const names = this.state.name;
        const dayName = getUniqueValues(this.data,'day_name');
        
        let monday = [
            {data: filterData(this.data,'Monday','listener_count')},
            {data: filterData(this.data,'Monday','live_call_data')},
        ];
        let tuesday = [
            {data: filterData(this.data,'Tuesday','listener_count')},
            {data: filterData(this.data,'Tuesday','live_call_data')},
        ];
        let wednesday = [
            {data: filterData(this.data,'Wednesday','listener_count')},
            {data: filterData(this.data,'Wednesday','live_call_data')},
        ];
        let thursday = [
            {data: filterData(this.data,'Thursday','listener_count')},
            {data: filterData(this.data,'Thursday','live_call_data')},
        ];

        let friday = [
            {data: filterData(this.data,'Friday','listener_count')},
            {data: filterData(this.data,'Friday','live_call_data')},
        ];
        let saturday = [
            {data: filterData(this.data,'Saturday','listener_count')},
            {data: filterData(this.data,'Saturday','live_call_data')},
        ];
        let sunday = [
            {data: filterData(this.data,'Sunday','listener_count')},
            {data: filterData(this.data,'Sunday','live_call_data')},
        ];


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
                <ChartTitle text="Radio Live Call" color="black" font="19pt sans-serif" />
                <ChartLegend position="bottom" />
                <ChartCategoryAxis>
                    <ChartCategoryAxisItem categories={dayName} startAngle={45}>
                        <ChartCategoryAxisCrosshair>
                            <ChartCategoryAxisCrosshairTooltip />
                        </ChartCategoryAxisCrosshair>
                    </ChartCategoryAxisItem>
                </ChartCategoryAxis>
                <ChartTooltip/>
                <ChartSeries render={defaultToolTip}>
                    {monday.map((item, index) => (
                        <ChartSeriesItem type="column" 
                            data={item.data} visible={seriesVisible[index]} name={names[index]}>
                        </ChartSeriesItem>
                    ))}
                    {tuesday.map((item, index) => (
                        <ChartSeriesItem type="column" 
                            data={item.data} visible={seriesVisible[index]}>
                        </ChartSeriesItem>
                    ))}
                    {wednesday.map((item, index) => (
                        <ChartSeriesItem type="column" 
                            data={item.data} visible={seriesVisible[index]}>
                        </ChartSeriesItem>
                    ))}
                    {thursday.map((item, index) => (
                        <ChartSeriesItem type="column" 
                            data={item.data} visible={seriesVisible[index]}>
                        </ChartSeriesItem>
                    ))}
                    {friday.map((item, index) => (
                        <ChartSeriesItem type="column" 
                            data={item.data} visible={seriesVisible[index]} >
                        </ChartSeriesItem>
                    ))}
                    {saturday.map((item, index) => (
                        <ChartSeriesItem type="column" 
                            data={item.data} visible={seriesVisible[index]}>
                        </ChartSeriesItem>
                    ))}
                    {sunday.map((item, index) => (
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

function filterData(data, day, program) {
    // For each tier, attach tier as name and data as the sums for each province
    var days = getUniqueValues(data, 'day_name');
    var filtered;
    var sums = [];


    if (program === 'listener_count'){
        filtered =data.filter(element => element.day_name === day);
        
        days.forEach(day => {
            var sumListener = 0;
            for (var i = 0; i < filtered.length; i++) {
                if (filtered[i].day_name == day) {
                    sumListener += filtered[i].listener_count;
                }
            }
            sums.push(sumListener);
        });

        return sums;
    
    }else{
        filtered = data.filter(element => element.day_name === day);
        
        days.forEach(day => {
            var sumLive = 0;
            for (var i = 0; i < filtered.length; i++) {
                if (filtered[i].day_name == day) {
                    sumLive += filtered[i].live_call_count;
                }
            }
            sums.push(sumLive);
        });

        return sums;
    }
}

export default RadioLiveCall;
