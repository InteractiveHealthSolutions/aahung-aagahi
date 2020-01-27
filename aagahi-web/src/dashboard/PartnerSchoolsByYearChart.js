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
    ChartTooltip,
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
import { partnerSchoolDataByFiscalYear } from '../service/ReportService';

class PartnerSchoolsByYearChart extends React.Component {

    constructor(props) {
        super(props);
        this.data = partnerSchoolDataByFiscalYear; // TODO: replace with the correct resource
    }

    state = {
        seriesVisible: [true, true]
    }

    render() {
        const primaryToolTipRender = ({ point }) => (`${point.series.name}: ${point.value}`);
        const seriesVisible = this.state.seriesVisible;
        let years = getUniqueValues(this.data, 'fiscal_year');
        let min = Math.min(...years);
        let max = Math.max(...years);
        // We need to create a series from minimum year to maximum year
        years = Array.from({ length: max - min }, (el, index) => (min + index + 1));
        
        let primary = [
            { name: 'Primary', data: filterData(this.data, 'Primary')},
            { name: 'Secondary', data: filterData(this.data, 'Secondary')}
            
        ];

        const colors = ['#32CD32', '#008080'];

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
                <ChartTitle text="Partner Schools by Fiscal Year" color="black" font="19pt sans-serif" />
                <ChartLegend position="bottom" />
                <ChartCategoryAxis>
                    <ChartCategoryAxisItem categories={years} startAngle={45}>
                        <ChartCategoryAxisCrosshair>
                            <ChartCategoryAxisCrosshairTooltip />
                        </ChartCategoryAxisCrosshair>
                    </ChartCategoryAxisItem>
                </ChartCategoryAxis>
                <ChartTooltip render={primaryToolTipRender} />
                <ChartSeries>
                    {primary.map((item, index) => (
                        <ChartSeriesItem type="column"
                            data={item.data} visible={seriesVisible[index]} name={item.name} gap={2}>
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

function filterData(data, level) {
    // For each tier, attach tier as name and data as the sums for each province
    var years = getUniqueValues(data, 'fiscal_year');

    var filtered = data.filter(element => element.school_level === level);
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

export default PartnerSchoolsByYearChart;
