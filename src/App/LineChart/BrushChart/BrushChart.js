import React from 'react';
import { ResponsiveLine } from '@nivo/line';
import { ILineChart } from '../types.js';
import { MARGIN, MAX_BRUSH_ITEMS } from '../constants.js';

class BrushChart extends React.Component {
  render() {
    var { data, margin } = this.props;

    var brushData = data.map(points => {
      if (points.data.length < MAX_BRUSH_ITEMS) return points;

      var every = Math.ceil(points.data.length / MAX_BRUSH_ITEMS);

      var result = Object.assign({}, points, {
        data: points.data.filter((_, i) => i % every === 0)
      });

      return result;
    });

    return (
      <ResponsiveLine
        data={brushData}
        margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
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
        dotSize={0.5}
        dotColor="inherit:darker(0.3)"
        dotBorderWidth={0}
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
