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


import { Chart, ChartCategoryAxis, ChartCategoryAxisCrosshair, ChartCategoryAxisCrosshairTooltip, ChartCategoryAxisItem, ChartLegend, ChartSeries, ChartSeriesItem, ChartTitle, ChartTooltip, ChartValueAxis, ChartValueAxisItem } from '@progress/kendo-react-charts';
import 'hammerjs';
import React from "react";
import { getGraphData } from "../service/GetService";
import { getUniqueValues } from '../util/AahungUtil';
import { apiUrl } from "../util/AahungUtil.js";
var serverAddress = apiUrl;

class PartnerInstitutions extends React.Component {

    constructor(props) {
        super(props);
        this.getData = this.getData.bind(this);
    }

    state = {
        seriesVisible: [true, true,true,true],
        name: ['Medical', 'Nursing', 'Midwifery', 'Other'],
        component: this.props.component,
        startDate: this.props.startDate,
        endDate: this.props.endDate,
        provincesString: this.props.provincesString,
        citiesString: this.props.citiesString,
        data: []
    }

    async componentWillReceiveProps(nextProps) {
        await this.setState({ data: nextProps.data });

        await this.setState({
            component: nextProps.component,
            startDate: nextProps.startDate,
            endDate: nextProps.endDate,
            provincesString: nextProps.provincesString,
            citiesString: nextProps.citiesString
        })

        await this.getData();
    }

    async getData() {
        // calling the appropriate resource with url params
        if(this.state.component === "srhm") {
            var params = "from=" + this.state.startDate + "&to=" + this.state.endDate + "&state_province=" + this.state.provincesString + "&city_village=" + this.state.citiesString;
            var resourceUrl = serverAddress + "/report/partnerinstitutiondata?" + params;
            var resultSet = await getGraphData(resourceUrl);
            if(resultSet != null && resultSet != undefined) {
                console.log(resultSet);
                this.setState({
                    data: resultSet
                })
            }
        }
    }

    render() {

        // TODO: fix tooltips
        const defaultTooltip = ({ point }) => (`${point.series.name}: ${(point.percentage)*100}%`);
        const seriesVisible = this.state.seriesVisible;
        const names = this.state.name;
        const locations = getUniqueValues(this.state.data, 'state_province');

        let sindhData = [
            { data: filterData(this.state.data, 'total_medical', 'Sindh') },
            { data: filterData(this.state.data, 'total_nursing', 'Sindh') },
            { data: filterData(this.state.data, 'total_midwifery', 'Sindh') },
            { data: filterData(this.state.data, 'total_other', 'Sindh') }         
        ];
        let punjabData = [
            { data: filterData(this.state.data, 'total_medical', 'Punjab') },
            { data: filterData(this.state.data, 'total_nursing', 'Punjab') },
            { data: filterData(this.state.data, 'total_midwifery', 'Punjab') },
            { data: filterData(this.state.data, 'total_other', 'Punjab') }         
        ];
        let balochistanData = [
            { data: filterData(this.state.data, 'total_medical', 'Balochistan') },
            { data: filterData(this.state.data, 'total_nursing', 'Balochistan') },
            { data: filterData(this.state.data, 'total_midwifery', 'Balochistan') },
            { data: filterData(this.state.data, 'total_other', 'Balochistan') }         
        ];
        let gilgitBaltistanData = [
            { data: filterData(this.state.data, 'total_medical', 'Gilgit-Baltistan') },
            { data: filterData(this.state.data, 'total_nursing', 'Gilgit-Baltistan') },
            { data: filterData(this.state.data, 'total_midwifery', 'Gilgit-Baltistan') },
            { data: filterData(this.state.data, 'total_other', 'Gilgit-Baltistan') }         
        ];
        let kpData = [
            { data: filterData(this.state.data, 'total_medical', 'KP') },
            { data: filterData(this.state.data, 'total_nursing', 'KP') },
            { data: filterData(this.state.data, 'total_midwifery', 'KP') },
            { data: filterData(this.state.data, 'total_other', 'KP') }         
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
                <ChartTitle text="Partner Institutions by District" color="black" font="19pt sans-serif" />
                <ChartLegend position="bottom" />
                <ChartCategoryAxis>
                    <ChartCategoryAxisItem categories={locations} startAngle={45}>
                        <ChartCategoryAxisCrosshair>
                            <ChartCategoryAxisCrosshairTooltip />
                        </ChartCategoryAxisCrosshair>
                    </ChartCategoryAxisItem>
                </ChartCategoryAxis>
                <ChartTooltip render={defaultTooltip} />
                <ChartSeries>
                    {sindhData.map((item, index) => (
                        <ChartSeriesItem type="column" stack={{ type: '100%', group: 'Sindh'}}
                            data={item.data} visible={seriesVisible[index]} name={names[index]}>
                        </ChartSeriesItem>
                    ))}
                    {punjabData.map((item, index) => (
                        <ChartSeriesItem type="column" stack={{type: '100%', group: 'Punjab'}}
                            data={item.data} visible={seriesVisible[index]}>
                        </ChartSeriesItem>
                    ))}
                    {balochistanData.map((item, index) => (
                        <ChartSeriesItem type="column" stack={{type: '100%', group: 'Balochistan'}}
                            data={item.data} visible={seriesVisible[index]}>
                        </ChartSeriesItem>
                    ))}
                    {gilgitBaltistanData.map((item, index) => (
                        <ChartSeriesItem type="column" stack={{type: '100%', group: 'Gilgit-Baltistan'}}
                            data={item.data} visible={seriesVisible[index]}>
                        </ChartSeriesItem>
                    ))}
                    {kpData.map((item, index) => (
                        <ChartSeriesItem type="column" stack={{type: '100%', group: 'KP'}}
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

function filterData(data, dataType, location) {
    // For each tier, attach tier as name and data as the sums for each province
    var provinces = getUniqueValues(data, 'state_province');

    var filtered = [];
    if (data !== null && data !== undefined && data.length > 0)
        filtered = data.filter(element => element.state_province === location);
    var sums = [];

    if(dataType === 'total_medical'){
        provinces.forEach(province => {
            var sumMedical = 0;
            for (var i = 0; i < filtered.length; i++) {
                if (filtered[i].state_province == province) {
                    sumMedical += parseInt(filtered[i].total_medical);
                }
            }
            sums.push(sumMedical);
        });
    
        return sums;
    }else if(dataType === 'total_nursing'){
        provinces.forEach(province => {
            var sumNursing = 0;
            for (var i = 0; i < filtered.length; i++) {
                if (filtered[i].state_province == province) {
                    sumNursing += parseInt(filtered[i].total_nursing);
                }
            }
            sums.push(sumNursing);
        });
        return sums;
    }else if(dataType === 'total_midwifery'){
        provinces.forEach(province => {
            var sumMidwifery = 0;
            for (var i = 0; i < filtered.length; i++) {
                if (filtered[i].state_province == province) {
                    sumMidwifery += parseInt(filtered[i].total_midwifery);
                }
            }
            sums.push(sumMidwifery);
        });
        return sums;
    }else{
        provinces.forEach(province => {
            var sumOther = 0;
            for (var i = 0; i < filtered.length; i++) {
                if (filtered[i].state_province == province) {
                    sumOther += parseInt(filtered[i].total_other);
                }
            }
            sums.push(sumOther);
        });
        return sums;
    }
}

export default PartnerInstitutions;
