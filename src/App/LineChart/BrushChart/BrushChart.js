import React from 'react';
import ResponsiveLine from './ResponsiveLine.js';

class BrushChart extends React.Component {
  render() {
    return <ResponsiveLine {...this.props} />;
  }
}

export default BrushChart;
