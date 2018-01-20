import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import withHandlers from 'recompose/withHandlers';
import withPropsOnChange from 'recompose/withPropsOnChange';
import ResponsiveLine from './ResponsiveLine.js';
import { INDEX_OFFSET, MAX_ITEMS } from '../constants.js';

var BrushChart = ({ brushData, ...rest }) => {
  delete rest.data;

  rest.onBrush = this.filterVisibleData;

  return <ResponsiveLine data={brushData} {...rest} />;
};

var enhance = compose(
  withHandlers(({ onBrush }) => ({
    filterVisibleData: () => (min, max) => onBrush(min, max)
  })),
  withPropsOnChange(['data', 'width'], ({ data, width }) => ({
    brushData: data.map(points => {
      if (points.data.length < width * 2) return points;

      var every = Math.ceil(points.data.length / width * 2);

      var result = Object.assign({}, points, {
        data: points.data.filter((_, i) => i % every === 0)
      });

      return result;
    })
  })),
  pure
);

var EnhancedBrushChart = enhance(BrushChart);
EnhancedBrushChart.displayName = 'EnhancedBrushChart';

export default EnhancedBrushChart;
