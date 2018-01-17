import React, { Component } from 'react';
import LineChart from './LineChart/';
import stocks from './stock.json';

stocks.forEach(stock => (stock.data = stock.data.reverse()));

class App extends Component {
  render() {
    return (
      <div className="App">
        <LineChart
          data={stocks}
          tickEvery={3}
          tickRotation={45}
          margin={{
            top: 10,
            right: 60,
            bottom: 90,
            left: 60
          }}
          xLegend="stock"
          yLegend="close"
        />
      </div>
    );
  }
}

export default App;
