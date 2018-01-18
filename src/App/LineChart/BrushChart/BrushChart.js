import React from 'react';
import ResponsiveLine from './ResponsiveLine.js';

var brushChartProps = {
  margin: { top: 0, left: 0, right: 0, bottom: 0 },
  colors: ['hsl(36, 100%, 50%)', 'hsl(217, 100%, 45%)'],
  colorBy: 'id',
  enableGridX: false,
  enableGridY: false,
  enableAxisBottom: false,
  minY: 'auto',
  stacked: false,
  axisBottom: {
    orient: 'bottom',
    tickSize: 5,
    tickPadding: 5,
    tickRotation: 0,
    tickValues: []
  },
  axisLeft: {
    orient: 'left',
    tickSize: 5,
    tickPadding: 5,
    tickRotation: 0,
    tickValues: []
  },
  dotSize: 0.5,
  dotColor: 'inherit:darker(0.3)',
  dotBorderWidth: 0,
  lineWidth: 1,
  animate: true,
  motionStiffness: 90,
  motionDamping: 15,
  isInteractive: false,
  enableStackTooltip: false
};

class BrushChart extends React.Component {
  render() {
    console.log(this.props.data[0].data.length);

    return <ResponsiveLine {...this.props} />;
  }
}

export default BrushChart;
