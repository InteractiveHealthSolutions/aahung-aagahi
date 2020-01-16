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
import { communicationsTrainingData } from '../service/ReportService';

class CommunicationsTraining extends React.Component {

    constructor(props) {
        super(props);
        this.data = communicationsTrainingData;
        console.log(this.data); // TODO: replace with the correct resource
    }

    state = {
        seriesVisible: [true, true,true,true],
    }

    render() {
        const seriesVisible = this.state.seriesVisible;

        let srhrData = [
            { name: 'SRHR', data: filterData(this.data, 'covered_srhr') }
        ];
        let agencyData = [
            { name: 'Agency and Choice', data: filterData(this.data, 'covered_agency_choice') }
        ];
        let genderData = [
            { name: 'Gender Sensitization', data: filterData(this.data, 'covered_gender_sensitization') }
        ];
        let otherData = [
            { name: 'Other', data: filterData(this.data, 'covered_other') }
        ];
        
        
        const colors = ['red', 'blue','greeb', 'purple'];


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
                <ChartTitle text="Communications Training" color="black" font="19pt sans-serif" />
                <ChartLegend position="bottom" />
                <ChartCategoryAxis>
                    <ChartCategoryAxisItem categories={['Journalists','Screenwriters','Media', 'Other']} startAngle={45}>
                        <ChartCategoryAxisCrosshair>
                            <ChartCategoryAxisCrosshairTooltip />
                        </ChartCategoryAxisCrosshair>
                    </ChartCategoryAxisItem>
                </ChartCategoryAxis>
                <ChartSeries>
                    {srhrData.map((item, index) => (
                        <ChartSeriesItem type="column" stack={{ group: 'karachi'}}
                            data={item.data} visible={seriesVisible[index]} name={item.name}>
                        </ChartSeriesItem>
                    ))}
                    {agencyData.map((item, index) => (
                        <ChartSeriesItem type="column" stack={{ group: 'hyderabad'}}
                            data={item.data} visible={seriesVisible[index]} name={item.name}>
                        </ChartSeriesItem>
                    ))}{genderData.map((item, index) => (
                        <ChartSeriesItem type="column" stack={{ group: 'Peshawar'}}
                            data={item.data} visible={seriesVisible[index]} name={item.name}>
                        </ChartSeriesItem>
                    ))}{otherData.map((item, index) => (
                        <ChartSeriesItem type="column" stack={{ group: 'Other'}}
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
    var locations = getUniqueValues(data, 'city_village');
    var sums = [];

    if (materialType === 'covered_srhr'){
        locations.forEach(location => {
            var srhrSum = 0;
            for (var i = 0; i < data.length; i++) {
                if (data[i].city_village == location) {
                    srhrSum += data[i].journalist_count;
                }
            }
            sums.push(srhrSum);
        });

        return sums;

    }else if(materialType === 'covered_agency_choice'){

        locations.forEach(location => {
            var agencySum = 0;
            for (var i = 0; i < data.length; i++) {
                if (data[i].city_village == location) {
                    agencySum += data[i].blogger_count;
                }
            }
            sums.push(agencySum);
        });

        return sums;

    }else if(materialType === 'covered_gender_sensitization'){

        locations.forEach(location => {
            var genderSum = 0;
            for (var i = 0; i < data.length; i++) {
                if (data[i].city_village == location) {
                    genderSum += data[i].screenwriter_count;
                }
            }
            sums.push(genderSum);
        });

        return sums;

    }else{
        locations.forEach(location => {
            var otherSum = 0;
            for (var i = 0; i < data.length; i++) {
                if (data[i].distribution_location == location) {
                    otherSum += data[i].other_media_count;
                }
            }
            sums.push(otherSum);
        });

        return sums;
    }   
        
}

export default CommunicationsTraining;
