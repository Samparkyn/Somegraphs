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
    const getRequests = []
    const postRequests = []
    const headRequests = []
    const otherReqs = []
    const methods = data.map(dataObject => {
      const request = dataObject.request.method
      if (request === "GET") {
        getRequests.push(request)
      } else if (request === "POST") {
        postRequests.push(request)
      } else if (request === "HEAD") {
        headRequests.push(request)
      } else {
        otherReqs.push(request)
      }
    })
    const totalGETReqs = getRequests.length
    const totalPOSTReqs = postRequests.length
    const totalHEADReqs = headRequests.length
    const totalOtherReqs = otherReqs.length
    const totalReqs = (totalGETReqs + totalPOSTReqs + totalHEADReqs + otherReqs)
    const getReqPercent = ((totalGETReqs / 47748) * 100).toFixed(2)
    const postReqPercent = ((totalPOSTReqs / 47748) * 100).toFixed(2)
    const headReqPercent = ((totalHEADReqs / 47748) * 100).toFixed(2)
    const otherReqPercent = ((totalOtherReqs / 47748) * 100).toFixed(2)


    const totalRequestsObj = {
      'GET': parseFloat(getReqPercent),
      'POST': parseFloat(postReqPercent),
      'HEAD': parseFloat(headReqPercent),
      'OTHER': parseFloat(otherReqPercent)
    }

    return totalRequestsObj
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
        name: 'Brands',
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
    const distribution = data.reduce((acc, dataPoint) => {
      const responseCode = dataPoint.response_code
      if(acc[responseCode]) {
        acc[responseCode]++
        return acc
      }
      acc[responseCode] = 1
      return acc
    }, {})
    console.log(distribution)
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
