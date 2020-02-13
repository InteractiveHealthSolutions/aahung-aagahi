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

import { Chart, ChartCategoryAxis, ChartCategoryAxisCrosshair, ChartCategoryAxisCrosshairTooltip, ChartCategoryAxisItem, ChartLegend, ChartSeries, ChartSeriesItem, ChartTitle, ChartTooltip, ChartValueAxis, ChartValueAxisItem } from '@progress/kendo-react-charts';
import 'hammerjs';
import React from "react";
import { getGraphData } from "../service/GetService";
import { getUniqueValues } from '../util/AahungUtil';
import { apiUrl } from "../util/AahungUtil.js";
var serverAddress = apiUrl;

class SocialMediaTraffic extends React.Component {

    constructor(props) {
        super(props);
        this.getData = this.getData.bind(this);
    }

    state = {
        seriesVisible: [true, true, true, true, true],
        name: ['Facebook', 'Twitter', 'Other', 'Instagram', 'Web Portal'],
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
        if (this.state.component === "comms") {
            var params = "from=" + this.state.startDate + "&to=" + this.state.endDate + "&state_province=" + this.state.provincesString + "&city_village=" + this.state.citiesString;
            var resourceUrl = serverAddress + "/report/socialmediatraffic?" + params;
            var resultSet = await getGraphData(resourceUrl);
            if (resultSet != null && resultSet != undefined) {
                this.setState({
                    data: resultSet
                })
            }
        }
    }

    render() {

        const defaultTooltip = ({ point }) => (`${point.value}`);
        const seriesVisible = this.state.seriesVisible;
        const names = this.state.name;
        let dayName = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

        let mondayData = [
            { data: filterData(this.state.data, 'facebook'.toUpperCase(), 'MONDAY') },
            { data: filterData(this.state.data, 'twitter'.toUpperCase(), 'MONDAY') },
            { data: filterData(this.state.data, 'other'.toUpperCase(), 'MONDAY') },
            { data: filterData(this.state.data, 'Instagram'.toUpperCase(), 'MONDAY') },
            { data: filterData(this.state.data, 'web_portal'.toUpperCase(), 'MONDAY') }
        ];
        let tuesdayData = [
            { data: filterData(this.state.data, 'facebook'.toUpperCase(), 'TUESDAY') },
            { data: filterData(this.state.data, 'twitter'.toUpperCase(), 'TUESDAY') },
            { data: filterData(this.state.data, 'other'.toUpperCase(), 'TUESDAY') },
            { data: filterData(this.state.data, 'Instagram'.toUpperCase(), 'TUESDAY') },
            { data: filterData(this.state.data, 'web_portal'.toUpperCase(), 'TUESDAY') }
        ];
        let wednesdayData = [
            { data: filterData(this.state.data, 'facebook'.toUpperCase(), 'WEDNESDAY') },
            { data: filterData(this.state.data, 'twitter'.toUpperCase(), 'WEDNESDAY') },
            { data: filterData(this.state.data, 'other'.toUpperCase(), 'WEDNESDAY') },
            { data: filterData(this.state.data, 'Instagram'.toUpperCase(), 'WEDNESDAY') },
            { data: filterData(this.state.data, 'web_portal'.toUpperCase(), 'WEDNESDAY') }
        ];
        let thursdayData = [
            { data: filterData(this.state.data, 'facebook'.toUpperCase(), 'THURSDAY') },
            { data: filterData(this.state.data, 'twitter'.toUpperCase(), 'THURSDAY') },
            { data: filterData(this.state.data, 'other'.toUpperCase(), 'THURSDAY') },
            { data: filterData(this.state.data, 'Instagram'.toUpperCase(), 'THURSDAY') },
            { data: filterData(this.state.data, 'web_portal'.toUpperCase(), 'THURSDAY') }
        ];
        let fridayData = [
            { data: filterData(this.state.data, 'facebook'.toUpperCase(), 'FRIDAY') },
            { data: filterData(this.state.data, 'twitter'.toUpperCase(), 'FRIDAY') },
            { data: filterData(this.state.data, 'other'.toUpperCase(), 'FRIDAY') },
            { data: filterData(this.state.data, 'Instagram'.toUpperCase(), 'FRIDAY') },
            { data: filterData(this.state.data, 'web_portal'.toUpperCase(), 'FRIDAY') }
        ];
        let saturdayData = [
            { data: filterData(this.state.data, 'facebook'.toUpperCase(), 'SATURDAY') },
            { data: filterData(this.state.data, 'twitter'.toUpperCase(), 'SATURDAY') },
            { data: filterData(this.state.data, 'other'.toUpperCase(), 'SATURDAY') },
            { data: filterData(this.state.data, 'Instagram'.toUpperCase(), 'SATURDAY') },
            { data: filterData(this.state.data, 'web_portal'.toUpperCase(), 'SATURDAY') }
        ];
        let sundayData = [
            { data: filterData(this.state.data, 'facebook'.toUpperCase(), 'SUNDAY') },
            { data: filterData(this.state.data, 'twitter'.toUpperCase(), 'SUNDAY') },
            { data: filterData(this.state.data, 'other'.toUpperCase(), 'SUNDAY') },
            { data: filterData(this.state.data, 'Instagram'.toUpperCase(), 'SUNDAY') },
            { data: filterData(this.state.data, 'web_portal'.toUpperCase(), 'SUNDAY') }
        ];

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
                <ChartTitle text="Daily Social Media Traffic" color="black" font="19pt sans-serif" />
                <ChartLegend position="bottom" />
                <ChartCategoryAxis>
                    <ChartCategoryAxisItem categories={dayName} startAngle={45}>
                        <ChartCategoryAxisCrosshair>
                            <ChartCategoryAxisCrosshairTooltip />
                        </ChartCategoryAxisCrosshair>
                    </ChartCategoryAxisItem>
                </ChartCategoryAxis>
                <ChartTooltip render={defaultTooltip} />
                <ChartSeries>
                    {mondayData.map((item, index) => (
                        <ChartSeriesItem type="column" stack={true}
                            data={item.data} visible={seriesVisible[index]} name={names[index]}>
                        </ChartSeriesItem>
                    ))}

                    {tuesdayData.map((item, index) => (
                        <ChartSeriesItem type="column" stack={true}
                            data={item.data} visible={seriesVisible[index]}>
                        </ChartSeriesItem>
                    ))}

                    {wednesdayData.map((item, index) => (
                        <ChartSeriesItem type="column" stack={true}
                            data={item.data} visible={seriesVisible[index]}>
                        </ChartSeriesItem>
                    ))}

                    {thursdayData.map((item, index) => (
                        <ChartSeriesItem type="column" stack={true}
                            data={item.data} visible={seriesVisible[index]}>
                        </ChartSeriesItem>
                    ))}

                    {fridayData.map((item, index) => (
                        <ChartSeriesItem type="column" stack={true}
                            data={item.data} visible={seriesVisible[index]}>
                        </ChartSeriesItem>
                    ))}
                    {saturdayData.map((item, index) => (
                        <ChartSeriesItem type="column" stack={true}
                            data={item.data} visible={seriesVisible[index]}>
                        </ChartSeriesItem>
                    ))}

                    {sundayData.map((item, index) => (
                        <ChartSeriesItem type="column" stack={true}
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

function filterData(data, platforms, day) {
    // For each tier, attach tier as name and data as the sums for each province
    // var days = getUniqueValues(data, 'day_name');
    var days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    var filtered = [];
    if (data !== null && data !== undefined && data.length > 0)
        filtered = data.filter(element => element.platform.toUpperCase() === platforms && element.day_name.toUpperCase() === day);
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