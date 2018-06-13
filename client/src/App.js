import React, { Component } from 'react';
import './App.css';
import { Chart } from './chart';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      data : null
    };
  }

  componentDidMount() {
      this.fetchData();
  }

  fetchData(){
      fetch('http://localhost:8000/data')
          .then((response) => response.json())
          .then((responseJson) => {
            this.setState({ data : responseJson })
            console.log(this.state.data)
          })
          .catch((error) => {
            console.error(error);
          });
  }

  calculateMethodPercentages(data){
    const dataLength = data.length
    const distribution = data.reduce((acc, dataPoint) => {
      const requestMethod = dataPoint.request.method
      if(acc[requestMethod]) {
        acc[requestMethod]++
        return acc
      }
      acc[requestMethod] = 1
      return acc
    }, {})
   
    for (const key in distribution) {
        distribution[key] = parseFloat(((distribution[key] / dataLength) * 100).toFixed(2))
      }
      return distribution
  }


  calculateResCodePercentages(data){
    const dataLength = data.length
    const distribution = data.reduce((acc, dataPoint) => {
      const responseCode = dataPoint.response_code
      if(acc[responseCode]) {
        acc[responseCode]++
        return acc
      }
      acc[responseCode] = 1
      return acc
    }, {})

    for (const key in distribution) {
      distribution[key] = parseFloat(((distribution[key] / dataLength) * 100).toFixed(2))
    }
    return distribution
  }

  requestsPerMin(data){
    const methods = this.calculateMethodPercentages(data)
    const options = {
      chart: {
        type: 'bar'
      },
      title: {
          text: 'Distribution of HTTP Methods'
      },
      xAxis: {
          categories: ['GET POST HEAD OTHER']
      },
      yAxis: {
          title: {
              text: '% of Reqs'
          }
      },
      series: [{
          name: 'GET',
          data: [methods.GET]
      }, {
          name: 'POST',
          data: [methods.POST]
      }, {
          name: 'HEAD',
          data: [methods.HEAD]
      }, {
        name: 'OTHER',
        data: [methods.OTHER]
      }]
    }
    return options;
  }

  HTTPMethodDistribution(data){
    const methods = this.calculateMethodPercentages(data)
    //total requests/sets of data = 47748
    const options = {
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
        data: [{
            name: 'GET',
            y: methods.GET,
        }, {
            name: 'POST',
            y: methods.POST,
        }, {
            name: 'HEAD',
            y: methods.HEAD,
          }, {
            name: 'OTHER',
            y: methods.OTHER
        }]
      }]
    }
    return options;
  }

  HTTPCodeDistribution(data) {
  const responseCodes = this.calculateResCodePercentages(data)
  const options = {
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
      data: [{
          name: '200',
          y: responseCodes[200],
      }, {
          name: '302',
          y: responseCodes[302],
      }, {
          name: '304',
          y: responseCodes[304],
      }, {
          name: '403',
          y: responseCodes[403],
      }, {
          name: '404',
          y: responseCodes[404],
      }, {
          name: '500',
          y: responseCodes[500],
      }, {
          name: '501',
          y: responseCodes[501]
      }] 
    }]
  }
  return options;
  }
    

  answerSizeDistribution(data){
//pie chart
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
        <p>Charts go here:</p>
        <div>
          <Chart className="chart" options={this.requestsPerMin(data)} />
          <Chart className="chart" options={this.HTTPMethodDistribution(data)} />
          <Chart className="chart" options={this.HTTPCodeDistribution(data)} />
          <Chart className="chart" options={this.requestsPerMin(data)} />
        </div>
      </div>
    );
  }
}

export default App;
