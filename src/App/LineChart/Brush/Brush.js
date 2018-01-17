import React from 'react';
import T from 'prop-types';
import { SvgWrapper } from '@nivo/core';
import ResponsiveWrapper from '../ResponsiveWrapper/';
import { IMargin } from '../types.js';
import { PADDING, MAX_ITEMS, INDEX_OFFSET } from '../constants.js';
import { getXScale } from './compute.js';

class Brush extends React.Component {
  state = {
    min: undefined,
    max: undefined
  };

  cursorPoint = (clientX, clientY) => {
    this.pt || (this.pt = this.pt = this.svg.createSVGPoint());
    this.pt.x = clientX;
    this.pt.y = clientY;
    return this.pt.matrixTransform(this.svg.getScreenCTM().inverse());
  };

  handleClick = e => {
    var { x } = this.cursorPoint(e.clientX, e.clientY);
    this.setState({ min: x });
  };

  render() {
    var { min, max } = this.state;
    var { data, margin } = this.props;
    var scale;

    return (
      <ResponsiveWrapper className="Brush">
        {({ width, height }) => {
          scale = getXScale(data, width);

          if (min === undefined) min = scale(data[0].data[0].x);
          if (max === undefined)
            max = scale(data[0].data[INDEX_OFFSET + MAX_ITEMS + 10].x);

          return (
            <svg ref={c => (this.svg = c)} width={width} height={height}>
              <rect
                x={min}
                y={0}
                width={max - min}
                height={height}
                style={{
                  fill: 'black',
                  opacity: 0.3,
                  stroke: 1,
                  strokeFill: '#FFF',
                  cursor: 'col-resize'
                }}
              />
              <rect
                x={min}
                y={0}
                width={PADDING}
                height={height}
                style={{
                  fill: 'black',
                  opacity: 0.3,
                  stroke: 1,
                  strokeFill: '#FFF',
                  cursor: 'w-resize'
                }}
                onClick={this.handleClick}
              />
              <rect
                x={max - min - PADDING}
                y={0}
                width={PADDING}
                height={height}
                style={{
                  fill: 'black',
                  opacity: 0.3,
                  stroke: 1,
                  strokeFill: '#FFF',
                  cursor: 'e-resize'
                }}
              />
            </svg>
          );
        }}
      </ResponsiveWrapper>
    );
  }
}

Brush.propTypes = {
  margin: T.shape(IMargin)
};

export default Brush;
