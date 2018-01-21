import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import withStateHandlers from 'recompose/withStateHandlers';
import withHandlers from 'recompose/withHandlers.js';
import toClass from 'recompose/toClass.js';
import { PADDING } from '../constants.js';

var Brush = ({
  width,
  height,
  minEdge,
  maxEdge,
  onMouseDown,
  onMouseMove,
  onMouseUp
}) => {
  return (
    <g transform={`translate(${-1 * PADDING})`}>
      <svg
        ref={c => (this.svg = c)}
        width={width + 4 * PADDING}
        height={height}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          style={{
            opacity: 0.2,
            fill: 'transparent'
          }}
          onMouseDown={onMouseDown('new')}
        />
        <rect
          x={PADDING + minEdge}
          y={0}
          width={maxEdge - minEdge}
          height={height}
          style={{
            opacity: 0.3,
            fill: 'black',
            cursor: 'col-resize'
          }}
          onMouseDown={onMouseDown('both')}
        />
        <rect
          x={minEdge}
          y={0}
          width={2 * PADDING}
          height={height}
          style={{
            opacity: 0,
            fill: 'black',
            cursor: 'ew-resize'
          }}
          onMouseDown={onMouseDown('minEdge')}
        />
        <rect
          x={maxEdge}
          y={0}
          width={2 * PADDING}
          height={height}
          style={{
            opacity: 0,
            fill: 'black',
            cursor: 'ew-resize'
          }}
          onMouseDown={onMouseDown('maxEdge')}
        />
      </svg>
    </g>
  );
};

var enhance = compose(
  withStateHandlers(
    ({ xScale }) => {
      var range = xScale.range();

      return {
        minEdge: range[0],
        maxEdge: range[1],
        dragging: false,
        difference: 0
      };
    },
    {
      setState: (
        { minEdge: _minEdge, maxEdge: _maxEdge, dragging },
        { xScale, onBrush }
      ) => ({ minEdge, maxEdge, difference = 0, dragging = false }) => {
        var state = {
          difference,
          dragging,
          minEdge: minEdge !== undefined ? minEdge : _minEdge,
          maxEdge: maxEdge !== undefined ? maxEdge : _maxEdge
        };

        if (state.maxEdge > xScale.range()[1]) {
          state.maxEdge = xScale.range()[1];
          state.minEdge = _minEdge;
        }

        if (state.minEdge < 0) {
          state.minEdge = 0;
          state.maxEdge = _maxEdge;
        }

        if (state.minEdge !== _minEdge || state.maxEdge !== _maxEdge)
          onBrush(state.minEdge, state.maxEdge);

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
      return result;
    }
  }),
  withHandlers({
    onMouseDown: ({ cursorPoint, setState }) => side => e => {
      var { x } = cursorPoint(this.svg, e.clientX, e.clientY);

      var state = {
        dragging: x
      };

      if (side === 'minEdge' || side === 'maxEdge') state.dragging = side;

      if (side === 'new') {
        state.minEdge = x - PADDING;
        state.maxEdge = x - PADDING;
        state.dragging = 'minEdge';
      }

      state.difference =
        side === 'both' || side === 'new' ? 0 : state[side] - x;

      return setState(state);
    },
    onMouseMove: ({
      minEdge,
      maxEdge,
      dragging,
      difference,
      cursorPoint,
      setState
    }) => e => {
      // Do nothing if not dragging.
      if (dragging === false) return;

      var { x } = cursorPoint(this.svg, e.clientX, e.clientY);

      var state = {
        minEdge,
        maxEdge,
        difference,
        dragging
      };

      if (typeof dragging === 'number') {
        // We need to store the difference to substract it on further calls.
        state.difference = dragging - x;
        state.minEdge = minEdge - (state.difference - difference);
        state.maxEdge = maxEdge - (state.difference - difference);
      } else {
        // Store the new dragging value
        state[dragging] = x;

        if (dragging === 'maxEdge' && x <= minEdge) {
          state.minEdge = maxEdge;
          state.maxEdge = minEdge;
          state.dragging = 'minEdge';
        }
        if (dragging === 'minEdge' && x >= maxEdge) {
          state.minEdge = maxEdge;
          state.maxEdge = minEdge;
          state.dragging = 'maxEdge';
        }
      }
      // Flip max and min if their difference is smaller than zero.
      if (state.minEdge > state.maxEdge) {
        let tmp = state.maxEdge;
        state.maxEdge = state.minEdge;
        state.minEdge = tmp;
      }

      setState(state);
    },
    onMouseUp: ({ setState }) => setState
  }),
  toClass,
  pure
);

var EnhancedBrush = enhance(Brush);
EnhancedBrush.displayName = 'enhance(Brush)';

export default EnhancedBrush;
