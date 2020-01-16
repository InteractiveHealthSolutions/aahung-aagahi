import React from 'react';
import 'hammerjs';
import {
    Chart,
    ChartLegend,
    ChartSeries,
    ChartSeriesItem,
    ChartSeriesLabels,
    ChartCategoryAxis,
    ChartCategoryAxisItem,
    ChartValueAxis,
    ChartValueAxisItem,
} from '@progress/kendo-react-charts';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';

const chartData = [
    { 'foodType': 'Beverages', 'percentSold': 16.5 },
    { 'foodType': 'Condiments', 'percentSold': 24 },
    { 'foodType': 'Produce', 'percentSold': 13 },
    { 'foodType': 'Meat/Poultry', 'percentSold': 16.5 },
    { 'foodType': 'Seafood', 'percentSold': 20 },
    { 'foodType': 'Other', 'percentSold': 10 }
];
const barChartQ4Months = ['October', 'November', 'December'];
const barChartMonthlyPercentages = [
    { name: 'Beverages', data: [14, 16, 19.5] },
    { name: 'Condiments', data: [24, 23.5, 24.5] },
    { name: 'Produce', data: [12.5, 12.5, 14] },
    { name: 'Meat/Poultry', data: [16, 18, 17] },
    { name: 'Seafood', data: [21.5, 20, 17] },
    { name: 'Other', data: [7, 12, 11] },
];

const gridData = [
    {
        "ProductID": 1,
        "ProductName": "Chai",
        "SupplierID": 1,
        "CategoryID": 1,
        "QuantityPerUnit": "10 boxes x 20 bags",
        "UnitPrice": 18,
        "UnitsInStock": 39,
        "UnitsOnOrder": 0,
        "ReorderLevel": 10,
        "Discontinued": false,
        "Category": {
            "CategoryID": 1,
            "CategoryName": "Beverages",
            "Description": "Soft drinks, coffees, teas, beers, and ales"
        },
        "FirstOrderedOn": new Date(1996, 8, 20)
    },
    {
        "ProductID": 2,
        "ProductName": "Chang",
        "SupplierID": 1,
        "CategoryID": 1,
        "QuantityPerUnit": "24 - 12 oz bottles",
        "UnitPrice": 19,
        "UnitsInStock": 17,
        "UnitsOnOrder": 40,
        "ReorderLevel": 25,
        "Discontinued": false,
        "Category": {
            "CategoryID": 1,
            "CategoryName": "Beverages",
            "Description": "Soft drinks, coffees, teas, beers, and ales"
        },
        "FirstOrderedOn": new Date(1996, 7, 12)
    },
    {
        "ProductID": 3,
        "ProductName": "Aniseed Syrup",
        "SupplierID": 1,
        "CategoryID": 2,
        "QuantityPerUnit": "12 - 550 ml bottles",
        "UnitPrice": 10,
        "UnitsInStock": 13,
        "UnitsOnOrder": 70,
        "ReorderLevel": 25,
        "Discontinued": false,
        "Category": {
            "CategoryID": 2,
            "CategoryName": "Condiments",
            "Description": "Sweet and savory sauces, relishes, spreads, and seasonings"
        },
        "FirstOrderedOn": new Date(1996, 8, 26)
    },
    {
        "ProductID": 4,
        "ProductName": "Chef Anton's Cajun Seasoning",
        "SupplierID": 2,
        "CategoryID": 2,
        "QuantityPerUnit": "48 - 6 oz jars",
        "UnitPrice": 22,
        "UnitsInStock": 53,
        "UnitsOnOrder": 0,
        "ReorderLevel": 0,
        "Discontinued": false,
        "Category": {
            "CategoryID": 2,
            "CategoryName": "Condiments",
            "Description": "Sweet and savory sauces, relishes, spreads, and seasonings"
        },
        "FirstOrderedOn": new Date(1996, 9, 19)
    },
    {
        "ProductID": 5,
        "ProductName": "Chef Anton's Gumbo Mix",
        "SupplierID": 2,
        "CategoryID": 2,
        "QuantityPerUnit": "36 boxes",
        "UnitPrice": 21.35,
        "UnitsInStock": 0,
        "UnitsOnOrder": 0,
        "ReorderLevel": 0,
        "Discontinued": true,
        "Category": {
            "CategoryID": 2,
            "CategoryName": "Condiments",
            "Description": "Sweet and savory sauces, relishes, spreads, and seasonings"
        },
        "FirstOrderedOn": new Date(1996, 7, 17)
    },
    {
        "ProductID": 6,
        "ProductName": "Grandma's Boysenberry Spread",
        "SupplierID": 3,
        "CategoryID": 2,
        "QuantityPerUnit": "12 - 8 oz jars",
        "UnitPrice": 25,
        "UnitsInStock": 120,
        "UnitsOnOrder": 0,
        "ReorderLevel": 25,
        "Discontinued": false,
        "Category": {
            "CategoryID": 2,
            "CategoryName": "Condiments",
            "Description": "Sweet and savory sauces, relishes, spreads, and seasonings"
        },
        "FirstOrderedOn": new Date(1996, 9, 19)
    },
    {
        "ProductID": 7,
        "ProductName": "Uncle Bob's Organic Dried Pears",
        "SupplierID": 3,
        "CategoryID": 7,
        "QuantityPerUnit": "12 - 1 lb pkgs.",
        "UnitPrice": 30,
        "UnitsInStock": 15,
        "UnitsOnOrder": 0,
        "ReorderLevel": 10,
        "Discontinued": false,
        "Category": {
            "CategoryID": 7,
            "CategoryName": "Produce",
            "Description": "Dried fruit and bean curd"
        },
        "FirstOrderedOn": new Date(1996, 7, 22)
    },
    {
        "ProductID": 8,
        "ProductName": "Northwoods Cranberry Sauce",
        "SupplierID": 3,
        "CategoryID": 2,
        "QuantityPerUnit": "12 - 12 oz jars",
        "UnitPrice": 40,
        "UnitsInStock": 6,
        "UnitsOnOrder": 0,
        "ReorderLevel": 0,
        "Discontinued": false,
        "Category": {
            "CategoryID": 2,
            "CategoryName": "Condiments",
            "Description": "Sweet and savory sauces, relishes, spreads, and seasonings"
        },
        "FirstOrderedOn": new Date(1996, 11, 1)
    },
    {
        "ProductID": 9,
        "ProductName": "Mishi Kobe Niku",
        "SupplierID": 4,
        "CategoryID": 6,
        "QuantityPerUnit": "18 - 500 g pkgs.",
        "UnitPrice": 97,
        "UnitsInStock": 29,
        "UnitsOnOrder": 0,
        "ReorderLevel": 0,
        "Discontinued": true,
        "Category": {
            "CategoryID": 6,
            "CategoryName": "Meat/Poultry",
            "Description": "Prepared meats"
        },
        "FirstOrderedOn": new Date(1997, 1, 21)
    },
    {
        "ProductID": 10,
        "ProductName": "Ikura",
        "SupplierID": 4,
        "CategoryID": 8,
        "QuantityPerUnit": "12 - 200 ml jars",
        "UnitPrice": 31,
        "UnitsInStock": 31,
        "UnitsOnOrder": 0,
        "ReorderLevel": 0,
        "Discontinued": false,
        "Category": {
            "CategoryID": 8,
            "CategoryName": "Seafood",
            "Description": "Seaweed and fish"
        },
        "FirstOrderedOn": new Date(1996, 8, 5)
    }
];

const labelTemplate = (e) => (e.category + '\n' + e.value + '%');

export const PieChartContainer = () => (
    <Chart style={{ height: 300 }}>
        <ChartSeries>
            <ChartSeriesItem type="donut" data={chartData} categoryField="foodType" field="percentSold" padding={0}>
                <ChartSeriesLabels color="#fff" background="none" content={labelTemplate} />
            </ChartSeriesItem>
        </ChartSeries>
        <ChartLegend visible={false} />
    </Chart>
);

export const BarChartContainer = () => (
    <Chart style={{ height: 288 }}>
        <ChartLegend visible={false} />
        <ChartCategoryAxis>
            <ChartCategoryAxisItem categories={barChartQ4Months} startAngle={45} />
        </ChartCategoryAxis>
        <ChartSeries>
            {
                barChartMonthlyPercentages.map((item, idx) => (
                    <ChartSeriesItem key={idx} type="column" data={item.data} name={item.name} gap={2} />
                ))}
        </ChartSeries>
        <ChartValueAxis skip={4}>
            <ChartValueAxisItem color="#888" skip={2} />
        </ChartValueAxis>
    </Chart>
);

export const GridContainer = () => (
    <div>
        <Grid style={{ height: '300px' }} data={gridData}>
            <Column field="ProductID" title="ID" width="40px" />
            <Column field="ProductName" title="Name" width="160px" />
            <Column field="Category.CategoryName" title="Category Name" width="80px" />
            <Column field="UnitPrice" title="Price" width="80px" />
            <Column field="UnitsInStock" title="Stock" width="90px" />
            <Column field="Discontinued" width="130px"
                cell={(props) => (
                    <td>
                        <input className="k-checkbox" type="checkbox" disabled defaultChecked={props.dataItem[props.field]} />
                        <label className="k-checkbox-label"></label>
                    </td>
                )} />
        </Grid>
    </div>
);
