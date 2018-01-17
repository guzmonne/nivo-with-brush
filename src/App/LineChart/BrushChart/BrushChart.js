import React from 'react';
import { ResponsiveLine } from '@nivo/line';
import { ILineChart } from '../types.js';
import { MARGIN } from '../constants.js';

class BrushChart extends React.Component {
  render() {
    var { data, margin } = this.props;

    return (
      <ResponsiveLine
        data={data}
        margin={Object.assign({}, MARGIN, margin, { top: 10, bottom: 10 })}
        colors={['hsl(36, 100%, 50%)', 'hsl(217, 100%, 45%)']}
        colorBy={'id'}
        enableGridX={false}
        enableGridY={false}
        enableAxisBottom={false}
        minY="auto"
        stacked={false}
        axisBottom={{
          orient: 'bottom',
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          tickValues: []
        }}
        axisLeft={{
          orient: 'left',
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          tickValues: []
        }}
        lineWidth={1}
        animate={true}
        motionStiffness={90}
        motionDamping={15}
        isInteractive={false}
        enableStackTooltip={false}
      />
    );
  }
}

BrushChart.propTypes = ILineChart;

export default BrushChart;
