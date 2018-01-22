import React from 'react';
import uniq from 'lodash/uniq.js';
import indexOf from 'lodash/indexOf.js';
import { Line } from '@nivo/line';
import LineWithBrush from './LineWithBrush.js';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import withHandlers from 'recompose/withHandlers';
import withStateHandlers from 'recompose/withStateHandlers';
import withPropsOnChange from 'recompose/withPropsOnChange';
import { scaleQuantize } from 'd3-scale';
import { TICK_WIDTH, POINTS_PER_WIDTH } from './constants.js';

var LineChart = ({
  axisBottom = {},
  brushData,
  brushOverrides,
  visibleData,
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
      data={visibleData}
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
  withPropsOnChange(
    ['initialMin', 'initialMax'],
    ({ initialMin, initialMax, invertScale, xRange }) => {
      var result = {
        initialMinEdge: invertScale.invertExtent(xRange[initialMin])[0],
        initialMaxEdge: invertScale.invertExtent(xRange[initialMax])[1]
      };

      return result;
    }
  ),
  withHandlers({
    update: ({ updateValidRange }) => () => {
      updateValidRange(this.minEdge, this.maxEdge);
    }
  }),
  withHandlers({
    onBrush: ({ update, invertScale, xRange, data }) => (minEdge, maxEdge) => {
      this.minEdge = indexOf(xRange, invertScale(minEdge));
      this.maxEdge = indexOf(xRange, invertScale(maxEdge));
      requestAnimationFrame(update);
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
  withPropsOnChange(['visibleData'], ({ visibleData, maxPoints }) => ({
    drawData: visibleData.map(d => {
      if (d.data.length < maxPoints) return d;

      var filterEvery = Math.ceil(d.data.length / maxPoints);

      return {
        ...d,
        ...{ data: d.data.filter((_, i) => i % filterEvery === 0) }
      };
    })
  })),
  withPropsOnChange(['data'], ({ data, maxPoints }) => ({
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
        .map(d => d.data.map(({ x }) => x))
        .reduce((acc, data) => acc.concat(data), [])
    );

    var gridWidth = Math.ceil(innerWidth / xValues.length);
    var tickDistance = Math.floor(TICK_WIDTH / gridWidth);

    return {
      tickValues:
        tickDistance === 0
          ? xValues
          : xValues.filter((_, i) => i % tickDistance === 0)
    };
  }),
  pure
);

var EnhancedLineChart = enhance(LineChart);
EnhancedLineChart.displayName = 'enhanced(LineChart)';

export default EnhancedLineChart;
