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

  requestsPerMin(data){
    const options = {
      chart: {
        type: 'bar'
      },
      title: {
          text: 'Fruit Consumption'
      },
      xAxis: {
          categories: ['Apples', 'Bananas', 'Oranges']
      },
      yAxis: {
          title: {
              text: 'Fruit eaten'
          }
      },
      series: [{
          name: 'Jane',
          data: [1, 0, 4]
      }, {
          name: 'John',
          data: [5, 7, 3]
      }]
    }
    return options;
  }

  HTTPMethodDistribution(data){

  }

  HTTPCodeDistribution(data){

  }

  answerSizeDistribution(data){

  }

  render() {
    const { data } = this.state

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p>Charts go here:</p>
        <div>
          <Chart options={this.requestsPerMin(data)} />
        </div>
      </div>
    );
  }
}

export default App;
