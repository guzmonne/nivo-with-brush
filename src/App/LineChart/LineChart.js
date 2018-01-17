import './LineChart.css';
import React from 'react';
import T from 'prop-types';
import MainChart from './MainChart/';
import BrushChart from './BrushChart/';
import Brush from './Brush/';
import { ILineChart } from './types.js';

var LineChart = props => {
  return (
    <div className="LineChart">
      <div className="MainChart">
        <MainChart {...props} />
      </div>
      <div className="BrushChart">
        <BrushChart {...props} />
        <Brush {...props} />
      </div>
    </div>
  );
};

LineChart.propTypes = Object.assign({}, ILineChart, {
  tickEvery: T.number
});

export default LineChart;
