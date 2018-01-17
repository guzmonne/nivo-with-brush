import './LineChart.css';
import React from 'react';
import T from 'prop-types';
import union from 'lodash/union.js';
import MainChart from './MainChart/';
import BrushChart from './BrushChart/';
import Brush from './Brush/';
import { ILineChart } from './types.js';

var LineChart = props => {
  var { tickEvery, ...rest } = props;

  if (tickEvery > 0)
    rest.xAxisTickValues = props.data
      .map(stock => stock.data.map(value => value.x))
      .reduce(union, [])
      .filter((_, i) => i % tickEvery === 0);

  return (
    <div className="LineChart">
      <div className="MainChart">
        <MainChart {...rest} />
      </div>
      <div className="BrushChart">
        <BrushChart {...rest} />
        <Brush {...rest} />
      </div>
    </div>
  );
};

LineChart.propTypes = Object.assign({}, ILineChart, {
  tickEvery: T.number
});

export default LineChart;
