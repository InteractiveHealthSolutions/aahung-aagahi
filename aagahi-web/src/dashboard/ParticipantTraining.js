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

class ParticipantTraining extends React.Component {

    constructor(props) {
        super(props);
        this.getData = this.getData.bind(this);
    }

    state = {
        seriesVisible: [true, true,true],
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
            var params = "from=" + this.state.startDate + "&to=" + this.state.endDate;
            var resourceUrl = serverAddress + "/report/participanttrainingdata?" + params;
            var resultSet = await getGraphData(resourceUrl);
            if(resultSet != null && resultSet !== undefined) {
                this.setState({
                    data: resultSet
                })
            }
        }
    }

    render() {

        // const defaultTooltip = ({ point }) => (`${point.series.name}: ${point.value}`);
        const defaultTooltip = ({ point }) => (`${point.series.name}: ${(point.percentage)*100}%`);
        const seriesVisible = this.state.seriesVisible;
        const participants = getUniqueValues(this.state.data, 'participant_type');
        const names = getUniqueValues(this.state.data, 'gender');

        let maleData = [
            { data: filterData(this.state.data, 'Male') }
        ];
        let femaleData = [
            { data: filterData(this.state.data, 'Female') }         
        ];
        let otherData = [
            { data: filterData(this.state.data, 'Other') }      
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
                    {maleData.map((item, index) => (
                        <ChartSeriesItem type="bar" stack={{ type:'100%', group: 'gender'}}
                            data={item.data} visible={seriesVisible[index]} name={names[0]}>
                        </ChartSeriesItem>
                    ))}
                    {femaleData.map((item, index) => (
                        <ChartSeriesItem type="bar" stack={{ type:'100%', group: 'gender'}}
                            data={item.data} visible={seriesVisible[index]} name={names[1]}>
                        </ChartSeriesItem>
                    ))}
                    {otherData.map((item, index) => (
                        <ChartSeriesItem type="bar" stack={{ type:'100%', group: 'gender'}}
                            data={item.data} visible={seriesVisible[index]} name={names[2]}>
                                {/* <ChartSeriesItemTooltip render={defaultTooltip} /> */}
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

function filterData(data, gender) {
    // For each tier, attach tier as name and data as the sums for each province
    var participantTypes = getUniqueValues(data, 'participant_type');

    var filtered = [];
    if (data !== null && data !== undefined && data.length > 0)
        filtered = data.filter(element => element.gender === gender);
    var sums = [];

    participantTypes.forEach(participanttype => {
        var sum = 0;
        for (var i = 0; i < filtered.length; i++) {
            if (filtered[i].participant_type == participanttype) {
                sum += parseInt(filtered[i].total);
            }
        }
        sums.push(sum);
    });

    return sums;
}

export default ParticipantTraining;
