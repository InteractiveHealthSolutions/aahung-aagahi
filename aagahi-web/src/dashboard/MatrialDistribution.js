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
import { materialDistributionData } from '../service/ReportService';

class MaterialDistribution extends React.Component {

    constructor(props) {
        super(props);
        this.data = materialDistributionData;
        console.log(this.data); // TODO: replace with the correct resource
    }

    state = {
        seriesVisible: [true, true,true],
    }

    render() {
        const defaultTooltip = ({ point }) => (`${point.series.name}: ${point.value}`);
        const seriesVisible = this.state.seriesVisible;
        const distributions = getUniqueValues(this.data, 'distribution_location');

        let chartData = [
            { name: 'Pamphlet', data: filterData(this.data, 'pamphlet_count') },
            { name: 'Brochure', data: filterData(this.data, 'booklet_count') },
            { name: 'Files', data: filterData(this.data, 'aahung_notebooks_count') }
            
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
                <ChartTitle text="IEC Material Distribution" color="black" font="19pt sans-serif" />
                <ChartLegend position="bottom" />
                <ChartCategoryAxis>
                    <ChartCategoryAxisItem categories={distributions} startAngle={45}>
                        <ChartCategoryAxisCrosshair>
                            <ChartCategoryAxisCrosshairTooltip />
                        </ChartCategoryAxisCrosshair>
                    </ChartCategoryAxisItem>
                </ChartCategoryAxis>
                <ChartTooltip render={defaultTooltip}/>
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

    if (materialType === 'pamphlet_count'){
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

    }else if(materialType === 'booklet_count'){

        locations.forEach(location => {
            var bookletSum = 0;
            for (var i = 0; i < data.length; i++) {
                if (data[i].distribution_location == location) {
                    bookletSum += data[i].booklet_count;
                }
            }
            sums.push(bookletSum);
        });

        return sums;

    }else{
        locations.forEach(location => {
            var notebookSum = 0;
            for (var i = 0; i < data.length; i++) {
                if (data[i].distribution_location == location) {
                    notebookSum += data[i].aahung_notebooks_count;
                }
            }
            sums.push(notebookSum);
        });

        return sums;
    }   
        
}

export default MaterialDistribution;
