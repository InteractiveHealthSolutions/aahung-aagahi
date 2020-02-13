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
import { getUniqueValues, capitalize } from '../util/AahungUtil';
import { apiUrl } from "../util/AahungUtil.js";
var serverAddress = apiUrl;

class OneTouchSessions extends React.Component {

    constructor(props) {
        super(props);
        this.getData = this.getData.bind(this);
    }

    state = {
        seriesVisible: [true, true, true,true,true,true, true],
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
        if(this.state.component === "lse") {
            var params = "from=" + this.state.startDate + "&to=" + this.state.endDate;
            var resourceUrl = serverAddress + "/report/onetouchdata?" + params;
            var resultSet = await getGraphData(resourceUrl);
            if(resultSet != null && resultSet !== undefined) {
                this.setState({
                    data: resultSet
                })
            }
        }
    }

    render() {
        const defaultTooltip = ({ point }) => (`${point.series.name}: ${(point.percentage)*100}%`);
        const seriesVisible = this.state.seriesVisible;
        const sessionTopics = getUniqueValues(this.state.data, 'session_topic');
        const topics = [];
        sessionTopics.forEach(topic => {
            topics.push(capitalize(topic));
        })
        
        const names = ['Parents', 'Teachers', 'Students', 'School Staff', 'Call Agents', 'Other Professional', 'Other'];
        
        let parentsData = [
            { data: filterData(this.state.data, 'parents_attending') }
        ];
        let teachersData = [
            { data: filterData(this.state.data, 'teachers_attending') }         
        ];
        let studentsData = [
            { data: filterData(this.state.data, 'students_attending') }      
        ];
        let staffData = [
            { data: filterData(this.state.data, 'school_staff_attending') }
        ];
        let callAgentsData = [
            { data: filterData(this.state.data, 'call_agents_attending') }         
        ];
        let otherProfessionalData = [
            { data: filterData(this.state.data, 'other_professionals_attending') }      
        ];
        let otherData = [
            { data: filterData(this.state.data, 'others_attending') }         
        ];

        const colors = ['#DC143C', '#FFA500', '#32CD32', '#008080', '#8A2BE2', '#F48FB1'];

        const crosshair = {
            visible: true,
            tooltip: {
                visible: true,
                format: '##'
            }
        }

        return (
            <Chart seriesColors={colors} style={{ height: 340 }} pannable={{ lock: 'y' }} zoomable={{ mousewheel: { lock: 'y' } }}>
                <ChartTitle text="One Touch Sessions Summary" color="black" font="19pt sans-serif" />
                <ChartLegend position="bottom" />
                <ChartCategoryAxis>
                    <ChartCategoryAxisItem categories={topics} startAngle={45}>
                        <ChartCategoryAxisCrosshair>
                            <ChartCategoryAxisCrosshairTooltip />
                        </ChartCategoryAxisCrosshair>
                    </ChartCategoryAxisItem>
                </ChartCategoryAxis>
                <ChartTooltip render={defaultTooltip} />
                <ChartSeries>
                    {parentsData.map((item, index) => (
                        <ChartSeriesItem type="bar" stack={{ type:'100%', group: 'gender'}}
                            data={item.data} visible={seriesVisible[index]} name={names[0]}>
                        </ChartSeriesItem>
                    ))}
                    {teachersData.map((item, index) => (
                        <ChartSeriesItem type="bar" stack={{ type:'100%', group: 'gender'}}
                            data={item.data} visible={seriesVisible[index]} name={names[1]}>
                        </ChartSeriesItem>
                    ))}
                    {studentsData.map((item, index) => (
                        <ChartSeriesItem type="bar" stack={{ type:'100%', group: 'gender'}}
                            data={item.data} visible={seriesVisible[index]} name={names[2]}>
                        </ChartSeriesItem>
                    ))}
                    {staffData.map((item, index) => (
                        <ChartSeriesItem type="bar" stack={{ type:'100%', group: 'gender'}}
                            data={item.data} visible={seriesVisible[index]} name={names[3]}>
                        </ChartSeriesItem>
                    ))}
                    {callAgentsData.map((item, index) => (
                        <ChartSeriesItem type="bar" stack={{ type:'100%', group: 'gender'}}
                            data={item.data} visible={seriesVisible[index]} name={names[4]}>
                        </ChartSeriesItem>
                    ))}
                    {otherProfessionalData.map((item, index) => (
                        <ChartSeriesItem type="bar" stack={{ type:'100%', group: 'gender'}}
                            data={item.data} visible={seriesVisible[index]} name={names[5]}>
                        </ChartSeriesItem>
                    ))}
                    {otherData.map((item, index) => (
                        <ChartSeriesItem type="bar" stack={{ type:'100%', group: 'gender'}}
                            data={item.data} visible={seriesVisible[index]} name={names[6]}>
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

function filterData(data, parType) {
    // For each tier, attach tier as name and data as the sums for each province
    var sessionTopics = getUniqueValues(data, 'session_topic');

    var filtered = [];
    if (data !== null && data !== undefined && data.length > 0)
        filtered = data.filter(element => String(element[parType]) === "1");
    var sums = [];

    sessionTopics.forEach(sessionTopic => {
        var sum = 0;
        for (var i = 0; i < filtered.length; i++) {
            
            if (filtered[i].session_topic == sessionTopic) {
                sum += parseInt(filtered[i].total);
            }
        }
        sums.push(sum);
    });
    return sums;
}

export default OneTouchSessions;
