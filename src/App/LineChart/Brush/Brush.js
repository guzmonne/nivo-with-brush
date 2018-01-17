import React from 'react';
import T from 'prop-types';
import ResponsiveWrapper from '../ResponsiveWrapper/';
import { IMargin } from '../types.js';
import { MARGIN, PADDING, MAX_ITEMS } from '../constants.js';
import { getXScale } from './compute.js';

var Brush = ({ margin, data }) => {
  var scale;
  margin = Object.assign({}, MARGIN, margin, { top: 10, bottom: 10 });

  return (
    <ResponsiveWrapper className="Brush">
      {({ width, height }) => {
        scale = getXScale(
          data,
          width - margin.left - margin.right + 2 * PADDING
        );

        var max;
        var min;

        data.forEach(points => {
          var testMax = scale(points.data[MAX_ITEMS - 1].x);
          var testMin = scale(points.data[0].x);
          if (max < testMax || max === undefined) max = testMax;
          if (min > testMin || min === undefined) min = testMin;
        });

        return (
          <svg width={width} height={height}>
            <rect
              x={margin.left - PADDING}
              y={margin.top - PADDING}
              width={PADDING + min}
              height={height + 2 * PADDING - margin.top - margin.bottom}
              style={{ fill: 'black', opacity: 0.3 }}
            />
            <rect
              x={margin.left - PADDING + max}
              y={margin.top - PADDING}
              width={width - max + 2 * PADDING - margin.right - margin.left}
              height={height + 2 * PADDING - margin.top - margin.bottom}
              style={{ fill: 'black', opacity: 0.3 }}
            />
          </svg>
        );
      }}
    </ResponsiveWrapper>
  );
};

Brush.propTypes = {
  margin: T.shape(IMargin)
};

export default Brush;
