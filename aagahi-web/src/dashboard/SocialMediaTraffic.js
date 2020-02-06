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

// Contributors: Owais Hussain, Tahira Niazi

/**
 * @author Owais Hussain, Tahira Niazi
 * @email owais.hussain@ihsinformatics.com, tahira.niazi@ihsinformatics.com
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
import { socialMediaTrafficData } from '../service/ReportService';
import { getGraphData } from "../service/GetService";
import { apiUrl } from "../util/AahungUtil.js";
var serverAddress = apiUrl;

class SocialMediaTraffic extends React.Component {

    constructor(props) {
        super(props);
        this.getData = this.getData.bind(this);
    }

    state = {
        seriesVisible: [true, true, true,true,true],
        name : ['Facebook', 'Twitter', 'Other', 'Instagram', 'Web Portal'],
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
        if(this.state.component === "comms") {
            var params = "from=" + this.state.startDate + "&to=" + this.state.endDate + "&state_province=" + this.state.provincesString + "&city_village=" + this.state.citiesString;
            var resourceUrl = serverAddress + "/report/socialmediatraffic?" + params;
            var resultSet = await getGraphData(resourceUrl);
            if(resultSet != null && resultSet !== undefined) {
                this.setState({
                    data: resultSet
                })
            }
        }
    }

    render() {

        // TODO: fix tooltips
        const defaultTooltip = ({ point }) => (`${point.series.name}: ${point.value}`);
        const seriesVisible = this.state.seriesVisible;
        const names = this.state.name;
        let dayName = getUniqueValues(this.state.data, 'day_name');
        const dayNameStr = JSON.parse(JSON.stringify(dayName));
        let myData = [];
        

        for (var i=0; i<dayNameStr.length; i++){
            myData.push(
                { data: filterData(this.state.data, 'facebook', dayNameStr[i]) },
                { data: filterData(this.state.data, 'twitter', dayNameStr[i]) },
                { data: filterData(this.state.data, 'other', dayNameStr[i]) },
                { data: filterData(this.state.data, 'Instagram', dayNameStr[i]) },
                { data: filterData(this.state.data, 'web_portal', dayNameStr[i]) }  
            );
        }

        const colors = ['#DC143C', '#FFA500', '#32CD32', '#008080', '#8A2BE2'];


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
                <ChartTitle text="Social Media Traffic" color="black" font="19pt sans-serif" />
                <ChartLegend position="bottom" />
                <ChartCategoryAxis>
                    <ChartCategoryAxisItem categories={dayName} startAngle={45}>
                        <ChartCategoryAxisCrosshair>
                            <ChartCategoryAxisCrosshairTooltip />
                        </ChartCategoryAxisCrosshair>
                    </ChartCategoryAxisItem>
                </ChartCategoryAxis>
                <ChartTooltip render={defaultTooltip}/>
                <ChartSeries>
                    {myData.map((item, index) => (
                        <ChartSeriesItem type="column" stack={{ group: dayNameStr}}
                            data={item.data} visible={seriesVisible[index]} name={names[index]}>
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

function filterData(data, platforms, day) {
    // For each tier, attach tier as name and data as the sums for each province
    var days = getUniqueValues(data, 'day_name');
    var filtered = [];
    if (data !== null && data !== undefined && data.length > 0)
        filtered = data.filter(element => element.platform === platforms && element.day_name === day);
    var sums = [];

    days.forEach(day => {
        var sum = 0;
        for (var i = 0; i < filtered.length; i++) {
            if (filtered[i].day_name == day) {
                sum += filtered[i].likes + filtered[i].shares + filtered[i].boosted_count;
            }
        }
        sums.push(sum);
    });

    return sums;
}

export default SocialMediaTraffic;
