import React from 'react';
import { ResponsiveWrapper } from '@nivo/core';
import BrushChart from './BrushChart.js';

var ResponsiveBrushChart = props => (
  <ResponsiveWrapper>
    {({ width, height }) => (
      <BrushChart width={width} height={height} {...props} />
    )}
  </ResponsiveWrapper>
);

export default ResponsiveBrushChart;
