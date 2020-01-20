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
import { amplifyChangeParticipantData } from '../service/ReportService';

class AmplifyChangeParticipant extends React.Component {

    constructor(props) {
        super(props);
        this.data = amplifyChangeParticipantData;
        console.log(this.data); // TODO: replace with the correct resource
    }

    state = {
        seriesVisible: [true, true, true,true,true,true,true],
        name : ['Male', 'Female', 'Other']
    }

    render() {

        const defaultTooltip = ({ point }) => (`${point.series.name}: ${point.value}`);
        const seriesVisible = this.state.seriesVisible;
        const names = this.state.name;

        const type =['Student','Faculty'];
       
        let studentData = [
            { data: filterData(this.data, 'male', 'Student') },
            { data: filterData(this.data, 'female', 'Student') },
            { data: filterData(this.data, 'othery', 'Student') }       
        ];
        let facultyData = [
            { data: filterData(this.data, 'male', 'Faculty') },
            { data: filterData(this.data, 'female', 'Faculty') },
            { data: filterData(this.data, 'other', 'Faculty') }     
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
                <ChartTitle text="AC Participant Summary" color="black" font="19pt sans-serif" />
                <ChartLegend position="bottom" />
                <ChartCategoryAxis>
                    <ChartCategoryAxisItem categories={type} startAngle={45}>
                        <ChartCategoryAxisCrosshair>
                            <ChartCategoryAxisCrosshairTooltip />
                        </ChartCategoryAxisCrosshair>
                    </ChartCategoryAxisItem>
                </ChartCategoryAxis>
                <ChartTooltip render={defaultTooltip} />
                <ChartSeries>
                    {studentData.map((item, index) => (
                        <ChartSeriesItem type="column" stack={{ group: 'Student'}}
                            data={item.data} visible={seriesVisible[index]} name={names[index]}>
                        </ChartSeriesItem>
                    ))}
                     {facultyData.map((item, index) => (
                        <ChartSeriesItem type="column" stack={{ group: 'Faculty'}}
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

function filterData(data, gender, type) {
    // For each tier, attach tier as name and data as the sums for each province
    var provinces = getUniqueValues(data, 'state_province');
    var filtered = data.filter(element => element.participant_type === type);
    var sums = [];

    if (gender === 'male'){
        provinces.forEach(province => {
            var sumMale = 0;
            for (var i = 0; i < filtered.length; i++) {
                if (filtered[i].state_province == province) {
                    sumMale += filtered[i].male;
                }
            }
            sums.push(sumMale);
        });
    
        return sums;
    }else if(gender === 'female'){
        provinces.forEach(province => {
            var sumFemale = 0;
            for (var i = 0; i < filtered.length; i++) {
                if (filtered[i].state_province == province) {
                    sumFemale += filtered[i].female;
                }
            }
            sums.push(sumFemale);
        });
    
        return sums;
    }else{
        provinces.forEach(province => {
            var sumOther = 0;
            for (var i = 0; i < filtered.length; i++) {
                if (filtered[i].state_province == province) {
                    sumOther += filtered[i].other;
                }
            }
            sums.push(sumOther);
        });
    
        return sums;
    }

    
}

export default AmplifyChangeParticipant;
