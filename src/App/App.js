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
          colors={['hsl(36, 100%, 50%)', 'hsl(217, 100%, 45%)']}
          colorBy={'id'}
          minY="auto"
          stacked={false}
          axisLeft={{
            orient: 'left',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'close',
            legendOffset: -40,
            legendPosition: 'center'
          }}
          dotSize={5}
          dotColor="inherit:darker(0.3)"
          dotBorderWidth={0.5}
          dotBorderColor="#ffffff"
          enableDotLabel={false}
          dotLabel="y"
          dotLabelYOffset={-12}
          animate={true}
          motionStiffness={90}
          motionDamping={15}
          axisBottom={{
            orient: 'bottom',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 45,
            legend: 'date',
            legendOffset: 70,
            legendPosition: 'center'
          }}
          legends={[
            {
              anchor: 'bottom-right',
              direction: 'row',
              itemWidth: 80,
              itemHeight: 20,
              symbolSize: 12,
              symbolShape: 'circle',
              translateY: 80
            }
          ]}
        />
      </div>
    );
  }
}

export default App;
