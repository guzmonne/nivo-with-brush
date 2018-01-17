import React from 'react';
import ResponsiveWrapper from '../ResponsiveWrapper/';
import { IMargin } from '../types.js';
import { MARGIN, PADDING } from '../constants.js';

var Brush = props => {
  var margin = Object.assign({}, MARGIN, props.margin, { top: 10, bottom: 10 });

  return (
    <ResponsiveWrapper className="Brush">
      {({ width, height }) => (
        <svg width={width} height={height}>
          <rect
            x={margin.left - PADDING}
            y={margin.top - PADDING}
            width={width + 2 * PADDING - margin.right - margin.left}
            height={height + 2 * PADDING - margin.top - margin.bottom}
            style={{ fill: 'black', opacity: 0.3 }}
          />
        </svg>
      )}
    </ResponsiveWrapper>
  );
};

Brush.propTypes = {
  margin: IMargin
};

export default Brush;
