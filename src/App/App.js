import React, { Component } from 'react';
import { ResponsiveLineChart as LineChart } from './LineChart/';
import stocks from './stock.json';

stocks.forEach(stock => (stock.data = stock.data.reverse()));

class App extends Component {
  render() {
    return (
      <div className="App">
        <LineChart
          initialMin={0}
          initialMax={50}
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
          enableDots={false}
          animate={false}
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
          margin={{
            top: 10,
            right: 60,
            bottom: 80,
            left: 60
          }}
          brushOverrides={{
            axisLeft: {
              tickValues: []
            },
            axisBottom: {
              tickValues: []
            },
            enableGridX: false,
            enableGridY: false,
            margin: {
              top: 10,
              right: 60,
              bottom: 10,
              left: 60
            },
            dotSize: 0
          }}
        />
      </div>
    );
  }
}

export default App;
