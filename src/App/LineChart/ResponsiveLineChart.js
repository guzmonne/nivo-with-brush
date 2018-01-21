import React from 'react';
import { ResponsiveWrapper } from '@nivo/core';
import LineChart from './LineChart.js';

var ResponsiveLineChart = props => (
  <ResponsiveWrapper>
    {({ width, height }) => (
      <LineChart {...props} width={width} height={height} />
    )}
  </ResponsiveWrapper>
);

export default ResponsiveLineChart;
