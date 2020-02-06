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
    ChartSeriesLabels,
    ChartCategoryAxis,
    ChartValueAxis,
    ChartValueAxisItem,
    ChartCategoryAxisCrosshair,
    ChartCategoryAxisCrosshairTooltip
} from '@progress/kendo-react-charts';
import { getUniqueValues } from '../util/AahungUtil';
import { exitSchoolPlanningData } from '../service/ReportService';
import { getGraphData } from "../service/GetService";
import { apiUrl } from "../util/AahungUtil.js";
var serverAddress = apiUrl;

class ExitPlanning extends React.Component {

    constructor(props) {
        super(props);
        this.getData = this.getData.bind(this);
    }

    state = {
        seriesVisible: [true, true],
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
        if (this.state.component === "lse") {
            var params = "from=" + this.state.startDate + "&to=" + this.state.endDate;
            var resourceUrl = serverAddress + "/report/exitschoolplanningdata?" + params;
            var resultSet = await getGraphData(resourceUrl);
            if (resultSet != null && resultSet !== undefined) {
                console.log("printing result set >>>>>>>>>");
                console.log(resultSet.length);
                console.log(resultSet);
                this.setState({
                    data: resultSet
                })
            }
        }
    }

    render() {

        const labelContent = (e) => (e.value);
        const series = [
            { category: 'SRHR', value: filterData(this.state.data, 'srhr_policy_implemented') },
            { category: 'Parent Sessions', value: filterData(this.state.data, 'parent_session_conducted') },
            { category: 'Both', value: filterData(this.state.data, 'both') },
            { category: 'Neither', value: filterData(this.state.data, 'neither') }
        ];
        const seriesVisible = this.state.seriesVisible;

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
                <ChartTitle text="Exit Planning Graph" color="black" font="19pt sans-serif" />
                <ChartLegend position="bottom" visible={true} />
                <ChartSeries>
                    <ChartSeriesItem type="donut" data={series} field="value" categoryField="category">
                        <ChartSeriesLabels color="#fff" background="none" content={labelContent} />
                    </ChartSeriesItem>
                </ChartSeries>
            </Chart>
        )
    }

    onLegendItemClick = (e) => {
        var newState = this.state.seriesVisible;
        newState[e.seriesIndex] = !newState[e.seriesIndex];
        this.setState(newState);
    }
}

function filterData(data, type) {
    // For each tier, attach tier as name and data as the sums for each province

    var srhrData = [];
    var parentSessionData = [];
    var bothData = [];
    var neitherData = [];

    if (data !== null && data !== undefined && data.length > 0) {
        srhrData = data.filter(element => String(element.srhr_policy_implemented) === "1")[0];
        parentSessionData = data.filter(element => String(element.parent_session_conducted) === "1")[0];
        bothData = data.filter(element => String(element.srhr_policy_implemented) === "1" && String(element.parent_session_conducted) === "1")[0];
        neitherData = data.filter(element => String(element.srhr_policy_implemented) === "0" && String(element.parent_session_conducted) === "0")[0];
    }

    if (type === "srhr_policy_implemented") {
        return srhrData.length === 0 ? 0 : srhrData.total;
    }
    else if (type === "parent_session_conducted") {
        return parentSessionData.length === 0 ? 0 : parentSessionData.total;
    }
    else if (type === "both") {
        return bothData.length === 0 ? 0 : bothData.total;
    }
    else {
        return neitherData.length === 0 ? 0 : neitherData.total;
    }
}

export default ExitPlanning;