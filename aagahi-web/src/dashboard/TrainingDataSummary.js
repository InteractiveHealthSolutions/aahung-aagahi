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


import { Chart, ChartCategoryAxis, ChartCategoryAxisCrosshair, ChartCategoryAxisCrosshairTooltip, ChartCategoryAxisItem, ChartLegend, ChartSeries, ChartSeriesItem, ChartSeriesItemTooltip, ChartTitle, ChartTooltip, ChartValueAxis, ChartValueAxisItem } from '@progress/kendo-react-charts';
import 'hammerjs';
import React from "react";
import { getGraphData } from "../service/GetService";
import { getUniqueValues } from '../util/AahungUtil';
import { apiUrl } from "../util/AahungUtil.js";
var serverAddress = apiUrl;

class TrainingDataSummary extends React.Component {

    constructor(props) {
        super(props);
        // this.state.data = trainingData; // TODO: replace with the correct resource
        this.getData = this.getData.bind(this);
    }

    state = {
        seriesVisible: [true, true, true,true],
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
            var params = "from=" + this.state.startDate + "&to=" + this.state.endDate + "&state_province=" + this.state.provincesString + "&city_village=" + this.state.citiesString;
            var resourceUrl = serverAddress + "/report/trainingdata?" + params;
            var resultSet = await getGraphData(resourceUrl);
            if(resultSet != null && resultSet !== undefined) {
                this.setState({
                    data: resultSet
                })
            }
        }
    }

    render() {

        const punjabTooltip = ({ point }) => (`Punjab: ${point.value}`);
        const sindhTooltip = ({ point }) => (`Sindh: ${point.value}`);
        const balochistanTooltip = ({ point }) => (`Balochistan: ${point.value}`);
        const kpTooltip = ({ point }) => (`KP: ${point.value}`);
        
        const seriesVisible = this.state.seriesVisible;
        let trainingType = ['Initial Training', 'MT Training', 'Refresher Training', 'Roll Out Step Down'];


        let initialTraining = [
            { name: 'Punjab', data: filterData(this.state.data, 'INITIAL_TRAINING', 'Punjab') },
            { name: 'Balochistan', data: filterData(this.state.data, 'INITIAL_TRAINING', 'Balochistan') },
            { name: 'KP', data: filterData(this.state.data, 'INITIAL_TRAINING', 'KP') },
            { name: 'Sindh', data: filterData(this.state.data, 'INITIAL_TRAINING', 'Sindh') },
            
        ];
        let refresherTraining = [
            { name: 'Punjab', data: filterData(this.state.data, 'REFRESHER_TRAINING', 'Punjab') },
            { name: 'Balochistan', data: filterData(this.state.data, 'REFRESHER_TRAINING', 'Balochistan') },
            { name: 'KP', data: filterData(this.state.data, 'REFRESHER_TRAINING', 'KP') },
            { name: 'Sindh', data: filterData(this.state.data, 'REFRESHER_TRAINING', 'Sindh') },
            
        ];
        let mtTraining = [
            { name: 'Punjab', data: filterData(this.state.data, 'MT_TRAINING', 'Punjab') },
            { name: 'Balochistan', data: filterData(this.state.data, 'MT_TRAINING', 'Balochistan') },
            { name: 'KP', data: filterData(this.state.data, 'MT_TRAINING', 'KP') },
            { name: 'Sindh', data: filterData(this.state.data, 'MT_TRAINING', 'Sindh') },
            
        ];
        let rollOutStepDown = [
            { name: 'Punjab', data: filterData(this.state.data, 'ROLL_OUT_STEP_DOWN', 'Punjab') },
            { name: 'Balochistan', data: filterData(this.state.data, 'ROLL_OUT_STEP_DOWN', 'Balochistan') },
            { name: 'KP', data: filterData(this.state.data, 'ROLL_OUT_STEP_DOWN', 'KP') },
            { name: 'Sindh', data: filterData(this.state.data, 'ROLL_OUT_STEP_DOWN', 'Sindh') },
            
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
                <ChartTitle text="Training Data Summary" color="black" font="19pt sans-serif" />
                <ChartLegend position="bottom" />
                <ChartCategoryAxis>
                    <ChartCategoryAxisItem categories={trainingType} startAngle={45}>
                        <ChartCategoryAxisCrosshair>
                            <ChartCategoryAxisCrosshairTooltip />
                        </ChartCategoryAxisCrosshair>
                    </ChartCategoryAxisItem>
                </ChartCategoryAxis>
                <ChartTooltip render={punjabTooltip} />
                <ChartSeries>
                    {initialTraining.map((item, index) => (
                        <ChartSeriesItem type="column" 
                            data={item.data} visible={seriesVisible[index]} name={item.name}>
                        </ChartSeriesItem>
                    ))}
                
                    {mtTraining.map((item, index) => (
                        <ChartSeriesItem type="column" 
                            data={item.data} visible={seriesVisible[index]} >
                            <ChartSeriesItemTooltip render={sindhTooltip} />
                        </ChartSeriesItem>
                    ))}

                    {refresherTraining.map((item, index) => (
                        <ChartSeriesItem type="column"
                            data={item.data} visible={seriesVisible[index]}>
                            <ChartSeriesItemTooltip render={balochistanTooltip} />
                        </ChartSeriesItem>
                    ))}
                    
                    {rollOutStepDown.map((item, index) => (
                        <ChartSeriesItem type="column" 
                            data={item.data} visible={seriesVisible[index]}>
                            <ChartSeriesItemTooltip render={kpTooltip} />
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

function filterData(data, trainingType, location) {
    // For each tier, attach tier as name and data as the sums for each province
    var trainingTypes = getUniqueValues(data, 'training_type');
    var filtered = [];
    if (data !== null && data !== undefined && data.length > 0)
        filtered = data.filter(element => element.training_type === trainingType && element.state_province === location);
    var sums = [];

    trainingTypes.forEach(trainingType => {
        var sum = 0;
        for (var i = 0; i < filtered.length; i++) {
            if (filtered[i].training_type == trainingType) {
                sum += parseInt(filtered[i].total);
            }
        }
        sums.push(sum);
    });

    return sums;
}

export default TrainingDataSummary;
