import React from 'react';
import uniq from 'lodash/uniq.js';
import indexOf from 'lodash/indexOf.js';
import { Line } from '@nivo/line';
import LineWithBrush from './LineWithBrush.js';
import lifecycle from 'recompose/lifecycle.js';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import withHandlers from 'recompose/withHandlers';
import withStateHandlers from 'recompose/withStateHandlers';
import withPropsOnChange from 'recompose/withPropsOnChange';
import { scaleQuantize } from 'd3-scale';
import { TICK_WIDTH, DEBOUNCE, POINTS_PER_WIDTH } from './constants.js';

var LineChart = ({
  axisBottom = {},
  brushData,
  brushOverrides,
  drawData,
  height,
  onBrush,
  tickValues,
  width,
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
      onBrush={onBrush}
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
      updateValidRange: () => (min, max) => ({ min, max })
    }
  ),
  withPropsOnChange(['data'], ({ data }) => ({
    xRange: uniq(
      data.reduce((acc, d) => acc.concat(d.data.map(({ x }) => x)), [])
    )
  })),
  withPropsOnChange(['width', 'margin'], ({ width, margin }) => ({
    innerWidth: width - (margin.left || 0) - (margin.right || 0)
  })),
  withPropsOnChange(['innerWidth', 'xRange'], ({ innerWidth, xRange }) => ({
    invertScale: scaleQuantize()
      .domain([0, innerWidth])
      .range(xRange)
  })),
  withHandlers({
    throttledUpdateValidRange: ({ updateValidRange }) => (min, max) => {
      if (this.timeout) clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        updateValidRange(min, max);
      }, DEBOUNCE);
    }
  }),
  withHandlers({
    onBrush: ({ throttledUpdateValidRange, invertScale, xRange, data }) => (
      minEdge,
      maxEdge
    ) => {
      throttledUpdateValidRange(
        indexOf(xRange, invertScale(minEdge)),
        indexOf(xRange, invertScale(maxEdge))
      );
    }
  }),
  withPropsOnChange(['innerWidth'], ({ innerWidth }) => ({
    maxPoints: Math.round(innerWidth / POINTS_PER_WIDTH)
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
  lifecycle({
    componentDidMount() {
      if (this.timeout) clearTimeout(this.timeout);
    }
  }),
  pure
);

var EnhancedLineChart = enhance(LineChart);
EnhancedLineChart.displayName = 'enhanced(LineChart)';

export default EnhancedLineChart;
