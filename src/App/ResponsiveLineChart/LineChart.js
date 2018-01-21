import React from 'react';
import { Line } from '@nivo/line';
import LineWithBrush from './LineWithBrush.js';
import uniq from 'lodash/uniq.js';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import withStateHandlers from 'recompose/withStateHandlers';
import withPropsOnChange from 'recompose/withPropsOnChange';
import { TICK_WIDTH } from './constants.js';

var LineChart = ({
  width,
  height,
  drawData,
  brushData,
  tickValues,
  axisBottom = {},
  brushOverrides,
  ...rest
}) => (
  <div className="LineChart">
    <Line
      {...rest}
      width={width}
      height={Math.round(height * 0.8)}
      data={drawData}
      axisBottom={{
        ...axisBottom,
        ...{ tickValues }
      }}
    />
    <LineWithBrush
      {...{ ...rest, ...brushOverrides }}
      width={width}
      height={Math.round(height * 0.2)}
      data={brushData}
    />
  </div>
);

var enhance = compose(
  withStateHandlers(
    ({ initialMin, initialMax, data }) => ({
      min: initialMin || 0,
      max: initialMax || Math.max(data.map(d => d.data.length)) - 1
    }),
    {
      updateValidRange: ({ min, max }) => (newMin, newMax) => ({
        min: newMin >= 0 ? newMin : min,
        max: newMax >= 0 ? newMax : max
      })
    }
  ),
  withPropsOnChange(['width', 'margin'], ({ width, margin }) => ({
    innerWidth: width - (margin.left || 0) - (margin.right || 0)
  })),
  withPropsOnChange(['innerWidth'], ({ innerWidth }) => ({
    maxPoints: Math.round(innerWidth / 2.5)
  })),
  withPropsOnChange(['data', 'min', 'max'], ({ data, min, max }) => ({
    visibleData: data.map(d => ({
      ...d,
      ...{ data: d.data.slice(min, max) }
    }))
  })),
  withPropsOnChange(
    ['visibleData', 'maxPoints'],
    ({ visibleData, maxPoints }) => ({
      drawData: visibleData.map(d => {
        if (d.data.length < maxPoints) return d;

        var filterEvery = Math.ceil(d.data.length / maxPoints);

        return {
          ...d,
          ...{ data: d.data.filter((_, i) => i % filterEvery === 0) }
        };
      })
    })
  ),
  withPropsOnChange(['data', 'maxPoints'], ({ data, maxPoints }) => ({
    brushData: data.map(d => {
      if (d.data.length < maxPoints) return d;

      var filterEvery = Math.ceil(d.data.length / maxPoints);

      return {
        ...d,
        ...{ data: d.data.filter((_, i) => i % filterEvery === 0) }
      };
    })
  })),
  withPropsOnChange(['drawData', 'innerWidth'], ({ drawData, innerWidth }) => {
    var xValues = uniq(
      drawData
        .map(d => d.data.map(value => value.x))
        .reduce((acc, data) => acc.concat(data), [])
    );

    var gridWidth = Math.ceil(innerWidth / xValues.length);
    var tickDistance = Math.floor(TICK_WIDTH / gridWidth);

    var result = xValues.filter((_, i) => i % tickDistance === 0);

    return { tickValues: result };
  }),
  pure
);

var EnhancedLineChart = enhance(LineChart);
EnhancedLineChart.displayName = 'enhanced(LineChart)';

export default EnhancedLineChart;
