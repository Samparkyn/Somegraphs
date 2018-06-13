import React, { Component } from 'react';
import './App.css';
import { getPercentageMap, getRequestsPerMin, getSizeDistribution } from './process-data';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
require('highcharts/modules/histogram-bellcurve')(Highcharts)

class App extends Component {
  state = {
    data : null
  };

  componentDidMount() {
    this.fetchData();
  }

  fetchData(){
    fetch('http://localhost:8000/data')
      .then((response) => response.json())
      .then((data) => {
        this.setState({ data })
      })
      .catch((error) => {
        console.error(error);
      });
  }

  requestsPerMin(data){
    const series = []
    const requestsMap = getRequestsPerMin(data);
    for (const key in requestsMap) {
      series.push([key, requestsMap[key]]);
    }

    return {
      chart: {
        type: 'line'
      },
      title: {
        text: 'Requests per minute'
      },
      xAxis: {
        title: {
          text: 'Minutes elapsed'
        }
      },
      yAxis: {
        title: {
          text: 'No of Reqs'
        }
      },
      plotOptions: {
        series: {
            label: {
                connectorAllowed: false
            },
            pointStart: 0
        }
    },
      series: [{
        type: 'line',
        data: Object.values(requestsMap),
        lineWidth: 1
      }] 
    }
  }

  HTTPMethodDistribution(data){
    const graphData = [];
    const distributionMap = getPercentageMap(data, 'request.method');
    for (const key in distributionMap) {
      graphData.push({ name: key, y: distributionMap[key] });
    }

    return {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: {
        text: 'Distribution of HTTP methods'
      },
      series: [{
        name: 'Request',
        colorByPoint: true,
        data: graphData
      }]
    }
  }

  HTTPCodeDistribution(data) {
    const graphData = [];
    const distributionMap = getPercentageMap(data, 'response_code');
    for (const key in distributionMap) {
      graphData.push({ name: key, y: distributionMap[key] });
    }

    return {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: {
        text: 'Distribution of Response codes'
      },
      series: [{
        name: 'Response code',
        colorByPoint: true,
        data: graphData
      }]
    }
  }
    

  documentSizeDistribution(data){
    const graphData = getSizeDistribution(data)
    return {
      title: {
        text: 'Document size'
      },
      xAxis: [{
        title: { text: 'Document size (in Bytes)' },
        alignTicks: false
      }],

      yAxis: [{
        title: { text: 'Number of logs' }
      }],
      series: [{
        name: 'Histogram',
        type: 'histogram',
        binWidth: 100,
        xAxis: 0,
        yAxis: 0,
        baseSeries: 's1',
        zIndex: -1
      }, {
        name: 'Data',
        type: 'scatter',
        visible: false,
        data: graphData,
        id: 's1',
        marker: {
            radius: 1.5
        }
      }]
    }
  }

  render() {
    const { data } = this.state
    if (!data){
      return <div>Loading..</div>
    }
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <h1>EPA HTTP Data</h1>
        <div>
          <HighchartsReact
            highcharts={Highcharts}
            options={this.requestsPerMin(data)}
          />
          <HighchartsReact
            highcharts={Highcharts}
            options={this.HTTPMethodDistribution(data)}
          />
          <HighchartsReact
            highcharts={Highcharts}
            options={this.HTTPCodeDistribution(data)}
          />
          <HighchartsReact
            highcharts={Highcharts}
            options={this.documentSizeDistribution(data)}
          />
        </div>
      </div>
    );
  }
}

export default App;
