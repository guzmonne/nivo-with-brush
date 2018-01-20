import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import withStateHandlers from 'recompose/withStateHandlers';
import withHandlers from 'recompose/withHandlers.js';
import toClass from 'recompose/toClass.js';
import { PADDING } from '../constants.js';
import { scaleQuantize } from 'd3-scale';

//     ref={c => (this.svg = c)}

var Brush = ({ width, height, minEdge, maxEdge, onMouseDown, onMouseMove }) => {
  return (
    <svg
      ref={c => (this.svg = c)}
      width={width}
      height={height}
      onMouseMove={onMouseMove}
    >
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        style={{
          opacity: 0.2,
          fill: 'red'
        }}
        onMouseDown={onMouseDown('new')}
      />
      <rect
        x={minEdge}
        y={0}
        width={maxEdge - minEdge}
        height={height}
        style={{
          opacity: 0.3,
          fill: 'black'
        }}
        onMouseDown={onMouseDown('both')}
      />
    </svg>
  );
};

var enhance = compose(
  withStateHandlers(
    ({ xScale }) => {
      var range = xScale.range();

      return {
        minEdge: range[0],
        maxEdge: range[1] / 2,
        dragging: undefined,
        difference: 0
      };
    },
    {
      setDifference: () => difference => ({ difference }),
      setDragging: () => dragging => ({ dragging }),
      setEdges: ({ minEdge, maxEdge }, { xScale }) => (
        newMinEdge,
        newMaxEdge
      ) => {
        var state = {
          minEdge: newMinEdge >= 0 ? newMinEdge : minEdge,
          maxEdge: newMaxEdge <= xScale.range()[1] ? newMinEdge : maxEdge
        };

        if (state.minEdge > state.maxEdge)
          state = {
            minEdge: state.maxEdge,
            maxEdge: state.minEdge
          };

        return state;
      }
    }
  ),
  withHandlers({
    cursorPoint: () => (svg, clientX, clientY) => {
      var pt = svg.createSVGPoint();
      pt.x = clientX;
      pt.y = clientY;
      var result = pt.matrixTransform(svg.getScreenCTM().inverse());
      console.log(result);
      return result;
    }
  }),
  withHandlers({
    onMouseDown: ({ cursorPoint, setDragging, setEdges }) => side => e => {
      var { x } = cursorPoint(this.svg, e.clientX, e.clientY);

      setDragging(side === 'min' || side === 'max' ? side : x);

      if (side === 'new') setEdges(x, x);
    },
    onMouseMove: ({ dragging }) => e => {
      // Do nothing if not dragging.
      if (dragging === undefined) return;
    }
  }),
  toClass,
  pure
);

var EnhancedBrush = enhance(Brush);
EnhancedBrush.displayName = 'enhance(Brush)';

export default EnhancedBrush;

class BrushOld extends React.Component {
  state = {
    min: 0,
    max: 0,
    dragging: undefined,
    difference: 0
  };

  cursorPoint = (clientX, clientY) => {
    this.pt || (this.pt = this.pt = this.svg.createSVGPoint());
    this.pt.x = clientX;
    this.pt.y = clientY;
    return this.pt.matrixTransform(this.svg.getScreenCTM().inverse());
  };

  handleOnMouseDown = side => e => {
    // Moving the entire selection
    if (side === 'both')
      this.setState({ dragging: this.cursorPoint(e.clientX, e.clientY).x });
    else if (side === 'new') {
      // Creating a new selection
      var x = this.cursorPoint(e.clientX, e.clientY).x;
      this.setState({ dragging: 'min', min: x, max: x });
      // Moving a side of the selection
    } else this.setState({ dragging: side });
  };

  handleOnMouseMove = e => {
    var { dragging } = this.state;
    // Do nothing if not dragging.
    if (dragging === undefined) return;

    var { max, min, difference } = this.state;
    var { width } = this.props;
    var { x } = this.cursorPoint(e.clientX, e.clientY);

    var result = {};

    if (typeof dragging === 'number') {
      // We need to store the difference to substract it on further calls.
      result.difference = dragging - x;
      result.min = min - (result.difference - difference);
      result.max = max - (result.difference - difference);
    } else {
      // Store the new dragging value
      result[dragging] = x;

      if (dragging === 'max' && x <= min) {
        result.min = max;
        result.max = min;
        result.dragging = 'min';
      }
      if (dragging === 'min' && x >= max) {
        result.min = max;
        result.max = min;
        result.dragging = 'max';
      }
    }
    // Flip max and min if their difference is smaller than zero.
    if (result.min > result.max) {
      result.max = result.min;
      result.min = result.max;
    }
    // Fix the selection in place if the min value is lower than zero.
    if (result.min < 0) {
      result.min = 0;
      result.max = max;
    }
    // Fix the selection in place if the max value is higher than the width.
    if (result.max > width) {
      result.min = min;
      result.max = width;
    }

    return this.setState(result, () => {
      if (typeof this.props.onBrush === 'function') {
        this.props.onBrush(this.state.min, this.state.max);
      }
    });
  };

  handleOnMouseUp = e => {
    this.setState({ dragging: undefined, difference: 0 });
  };

  render() {
    var { min, max } = this.state;
    var { width, height } = this.props;

    return (
      <svg
        ref={c => (this.svg = c)}
        width={width}
        height={height}
        onMouseMove={this.handleOnMouseMove}
        onMouseUp={this.handleOnMouseUp}
        onMouseLeave={this.handleOnMouseUp}
      >
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          style={{
            fill: 'transparent'
          }}
          onMouseDown={this.handleOnMouseDown('new')}
        />
        <rect
          x={min}
          y={0}
          width={max - min}
          height={height}
          style={{
            fill: 'black',
            opacity: 0.3,
            cursor: 'col-resize'
          }}
          onMouseDown={this.handleOnMouseDown('both')}
        />
        <rect
          x={min}
          y={0}
          width={PADDING}
          height={height}
          style={{
            fill: 'transparent',
            cursor: 'w-resize'
          }}
          onMouseDown={this.handleOnMouseDown('min')}
        />
        <rect
          x={max - PADDING}
          y={0}
          width={PADDING}
          height={height}
          style={{
            fill: 'transparent',
            cursor: 'e-resize'
          }}
          onMouseDown={this.handleOnMouseDown('max')}
        />
      </svg>
    );
  }
}
