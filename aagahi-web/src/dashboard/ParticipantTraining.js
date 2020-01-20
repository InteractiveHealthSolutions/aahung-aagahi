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
    ChartTooltip,
    ChartSeriesItemTooltip,
    ChartCategoryAxis,
    ChartCategoryAxisItem,
    ChartValueAxis,
    ChartValueAxisItem,
    ChartCategoryAxisCrosshair,
    ChartCategoryAxisCrosshairTooltip
} from '@progress/kendo-react-charts';
import { getUniqueValues } from '../util/AahungUtil';
import { participantTrainingData } from '../service/ReportService';

class ParticipantTraining extends React.Component {

    constructor(props) {
        super(props);
        this.data = participantTrainingData;
        console.log(this.data); // TODO: replace with the correct resource
    }

    state = {
        seriesVisible: [true, true,true,true],
        name: ['Student','Teacher','Other', 'Pre-service providers']
    }

    render() {

        const defaultTooltip = ({ point }) => (`${point.series.name}: ${point.value}`);

        const seriesVisible = this.state.seriesVisible;
        const names = this.state.name;
        const participants = getUniqueValues(this.data, 'participant_type');

        let studentData = [
            { data: filterData(this.data, 'Student', 'Sindh') },
            { data: filterData(this.data, 'Student', 'Punjab') },
            { data: filterData(this.data, 'Student', 'Other') },
            { data: filterData(this.data, 'Student', 'Balochistan') },
            { data: filterData(this.data, 'Student', 'KP') },
            { data: filterData(this.data, 'Student', 'Gilgit-Baltistan') }              
        ];
        let teacherData = [
            { data: filterData(this.data, 'Teacher', 'Sindh') },
            { data: filterData(this.data, 'Teacher', 'Punjab') },
            { data: filterData(this.data, 'Teacher', 'Other') },
            { data: filterData(this.data, 'Teacher', 'Balochistan') },
            { data: filterData(this.data, 'Teacher', 'KP') },
            { data: filterData(this.data, 'Teacher', 'Gilgit-Baltistan') }              
        ];
        let otherData = [
            { data: filterData(this.data, 'Other', 'Sindh') },
            { data: filterData(this.data, 'Other', 'Punjab') },
            { data: filterData(this.data, 'Other', 'Other') },
            { data: filterData(this.data, 'Other', 'Balochistan') },
            { data: filterData(this.data, 'Other', 'KP') },
            { data: filterData(this.data, 'Other', 'Gilgit-Baltistan') }              
        ];
        let preserviceData = [
            { data: filterData(this.data, 'Pre-service providers', 'Sindh') },
            { data: filterData(this.data, 'Pre-service providers', 'Punjab') },
            { data: filterData(this.data, 'Pre-service providers', 'Other') },
            { data: filterData(this.data, 'Pre-service providers', 'Balochistan') },
            { data: filterData(this.data, 'Pre-service providers', 'KP') },
            { data: filterData(this.data, 'Pre-service providers', 'Gilgit-Baltistan') }              
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
                <ChartTitle text="Participant Training" color="black" font="19pt sans-serif" />
                <ChartLegend position="bottom" />
                <ChartCategoryAxis>
                    <ChartCategoryAxisItem categories={participants} startAngle={45}>
                        <ChartCategoryAxisCrosshair>
                            <ChartCategoryAxisCrosshairTooltip />
                        </ChartCategoryAxisCrosshair>
                    </ChartCategoryAxisItem>
                </ChartCategoryAxis>
                <ChartTooltip render={defaultTooltip} />
                <ChartSeries>
                    {studentData.map((item, index) => (
                        <ChartSeriesItem type="bar" stack={{ group: 'Student'}}
                            data={item.data} visible={seriesVisible[index]} name={names[index]}>
                        </ChartSeriesItem>
                    ))}
                    {teacherData.map((item, index) => (
                        <ChartSeriesItem type="bar" stack={{ group: 'Teacher'}}
                            data={item.data} visible={seriesVisible[index]}>
                        </ChartSeriesItem>
                    ))}
                    {otherData.map((item, index) => (
                        <ChartSeriesItem type="bar" stack={{ group: 'Other'}}
                            data={item.data} visible={seriesVisible[index]}>
                        </ChartSeriesItem>
                    ))}
                    {preserviceData.map((item, index) => (
                        <ChartSeriesItem type="bar" stack={{ group: 'Pre-service providers'}}
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

function filterData(data, parType, location) {
    // For each tier, attach tier as name and data as the sums for each province
    var participantTypes = getUniqueValues(data, 'participant_type');

    var filtered = data.filter(element => element.participant_type === parType && element.state_province === location);
    var sums = [];

    participantTypes.forEach(participanttype => {
        var sum = 0;
        for (var i = 0; i < filtered.length; i++) {
            if (filtered[i].participant_type == participanttype) {
                sum += filtered[i].total;
            }
        }
        sums.push(sum);
    });

    return sums;
}

export default ParticipantTraining;
