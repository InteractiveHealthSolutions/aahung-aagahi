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
import { individualReachData } from '../service/ReportService';

class IndividualsReached extends React.Component {

    constructor(props) {
        super(props);
        this.data = individualReachData; // TODO: replace with the correct resource
    }

    state = {
        seriesVisible: [true, true, true]
    }

    render() {
        const seriesVisible = this.state.seriesVisible;
        const activityType = ['Health Care Provider Reach','General Step Down Training','Amplify Change Step Down'];
       
        let HCPTrained = [
            { name: 'Male', data: filterData(this.data, 'health_care_provider_reach','Sindh', 'male_count')},
            { name: 'Female', data: filterData(this.data, 'health_care_provider_reach', 'Punjab', 'female_count') },
            { name: 'Other', data: filterData(this.data,'health_care_provider_reach', 'Balochistan', 'other_sex_count') },
   
        ];
        let GeneralStepDown = [
            { name: 'Male', data: filterData(this.data, 'general_step_down_training_details','Sindh', 'male_count')},
            { name: 'Female', data: filterData(this.data, 'general_step_down_training_details', 'Punjab', 'female_count') },
            { name: 'Other', data: filterData(this.data,'general_step_down_training_details', 'Balochistan', 'other_sex_count') },
   
        ];
        let AmplifyChange = [
            { name: 'Male', data: filterData(this.data, 'amplify_change_step_down_training_details','Sindh', 'male_count')},
            { name: 'Female', data: filterData(this.data, 'amplify_change_step_down_training_details', 'Punjab', 'female_count') },
            { name: 'Other', data: filterData(this.data,'amplify_change_step_down_training_details', 'Balochistan', 'other_sex_count') },
   
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
                <ChartTitle text="Individuals Reached" color="black" font="19pt sans-serif" />
                <ChartLegend position="bottom" />
                <ChartCategoryAxis>
                    <ChartCategoryAxisItem categories={activityType} startAngle={45}>
                        <ChartCategoryAxisCrosshair>
                            <ChartCategoryAxisCrosshairTooltip />
                        </ChartCategoryAxisCrosshair>
                    </ChartCategoryAxisItem>
                </ChartCategoryAxis>
                <ChartSeries>
                    {HCPTrained.map((item, index) => (
                        <ChartSeriesItem type="column"
                            data={item.data} visible={seriesVisible[index]} name={item.name} gap={2}>
                        </ChartSeriesItem>
                    ))}
                
                    {GeneralStepDown.map((item, index) => (
                        <ChartSeriesItem type="column"
                            data={item.data} visible={seriesVisible[index]} gap={2}>
                        </ChartSeriesItem>
                    ))}
                     {AmplifyChange.map((item, index) => (
                        <ChartSeriesItem type="column"
                            data={item.data} visible={seriesVisible[index]} gap={2}>
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

function filterData(data, activitytype, location, gender) {
    // For each tier, attach tier as name and data as the sums for each province
    var activitytypes = getUniqueValues(data, 'activity_type');
    var filtered;
    var sums = [];

    if (gender === 'male_count'){
        filtered = data.filter(element => element.activity_type === activitytype && element.state_province === location);
        
        activitytypes.forEach(activitytype => {
            var sumMale = 0;
            for (var i = 0; i < filtered.length; i++) {
                if (filtered[i].activity_type == activitytype) {
                    sumMale += filtered[i].male_count;
                }
            }
            sums.push(sumMale);
        });

        return sums;
    
    }else if(gender === 'female_count'){
        filtered = data.filter(element => element.activity_type === activitytype && element.state_province === location);
    
        activitytypes.forEach(activitytype => {
            var sumFemale = 0;
            for (var i = 0; i < filtered.length; i++) {
                if (filtered[i].activity_type == activitytype) {
                    sumFemale += filtered[i].female_count;
                }
            }
            sums.push(sumFemale);
        });

        return sums;


    }else{  
        filtered = data.filter(element => element.activity_type === activitytype && element.state_province === location);
        
        activitytypes.forEach(activitytype => {
            var sumOthers = 0;
            for (var i = 0; i < filtered.length; i++) {
                if (filtered[i].activity_type == activitytype) {
                    sumOthers += filtered[i].other_sex_count;
                }
            }
            sums.push(sumOthers);
        });

        return sums;


    }
    
}

export default IndividualsReached;
