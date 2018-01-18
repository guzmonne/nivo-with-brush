import React from 'react';
import ResponsiveLine from './ResponsiveLine.js';

class BrushChart extends React.Component {
  render() {
    console.log(this.props.data[0].data.length);

    return <ResponsiveLine {...this.props} />;
  }
}

export default BrushChart;
