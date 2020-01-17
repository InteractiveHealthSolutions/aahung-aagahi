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
import { mobileCinemaData } from '../service/ReportService';

class MobileCinema extends React.Component {

    constructor(props) {
        super(props);
        this.data = mobileCinemaData;
        console.log(this.data); // TODO: replace with the correct resource
    }

    state = {
        seriesVisible: [true, true,true,true,true,true,true],
    }

    render() {
        const seriesVisible = this.state.seriesVisible;
        const provinces = getUniqueValues(this.data, 'state_province');

        let cinemaData = [
            { name: 'Sindh', data: filterData(this.data, 'cinema', 'Sindh') },
            { name: 'Punjab', data: filterData(this.data, 'cinema', 'Punjab') },
            { name: 'Balochistan', data: filterData(this.data, 'cinema', 'Balochistan') },
            { name: 'Gilgit-Baltistan', data: filterData(this.data, 'cinema', 'Gilgit-Baltistan') },
            { name: 'KP', data: filterData(this.data, 'cinema', 'KP') },
            { name: 'Unkown', data: filterData(this.data, 'cinema', 'Unkown') },
            { name: 'GB', data: filterData(this.data, 'cinema', 'GB') }

            
        ];
        let liveData = [
            { name: 'Sindh', data: filterData(this.data, 'live_theatre', 'Sindh') },
            { name: 'Punjab', data: filterData(this.data, 'live_theatre', 'Punjab') },
            { name: 'Balochistan', data: filterData(this.data, 'live_theatre', 'Balochistan') },
            { name: 'Gilgit-Baltistan', data: filterData(this.data, 'live_theatre', 'Gilgit-Baltistan') },
            { name: 'KP', data: filterData(this.data, 'live_theatre', 'KP') },
            { name: 'Unkown', data: filterData(this.data, 'live_theatre', 'Unkown') },
            { name: 'GB', data: filterData(this.data, 'live_theatre', 'GB') }

            
        ];
        
        const colors = ['#DC143C', '#FFA500', '#32CD32', '#008080', '#8A2BE2', '#2F4F4F', '#d2d4d6'];


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
                <ChartTitle text="Mobile Cinema/Theatre by District" color="black" font="19pt sans-serif" />
                <ChartLegend position="bottom" />
                <ChartCategoryAxis>
                    <ChartCategoryAxisItem categories={provinces} startAngle={45}>
                        <ChartCategoryAxisCrosshair>
                            <ChartCategoryAxisCrosshairTooltip />
                        </ChartCategoryAxisCrosshair>
                    </ChartCategoryAxisItem>
                </ChartCategoryAxis>
                <ChartSeries>
                    {cinemaData.map((item, index) => (
                        <ChartSeriesItem type="column" stack={{ group: 'cinema'}}
                            data={item.data} visible={seriesVisible[index]} name={item.name}>
                        </ChartSeriesItem>
                    ))}
                    {liveData.map((item, index) => (
                        <ChartSeriesItem type="column" stack={{ group: 'live_theatre'}}
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

function filterData(data, screenType, location) {
    // For each tier, attach tier as name and data as the sums for each province
    var provinces = getUniqueValues(data, 'state_province');

    var filtered = data.filter(element => element.screening_type === screenType && element.state_province === location);
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

export default MobileCinema;
