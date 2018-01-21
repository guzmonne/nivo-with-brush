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
          x={minEdge - PADDING}
          y={0}
          width={2 * PADDING}
          height={height}
          style={{
            opacity: 0.1,
            fill: 'black',
            cursor: 'ew-resize'
          }}
          onMouseDown={onMouseDown('minEdge')}
        />
        <rect
          x={maxEdge + PADDING}
          y={0}
          width={2 * PADDING}
          height={height}
          style={{
            opacity: 0.1,
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
    ({ xScale, initialMinEdge, initialMaxEdge }) => {
      var range = xScale.range();

      return {
        minEdge: initialMinEdge || range[0],
        maxEdge: initialMaxEdge || range[1],
        dragging: false,
        dragType: '',
        difference: 0
      };
    },
    {
      setState: (
        { minEdge: _minEdge, maxEdge: _maxEdge, dragType: _dragType, dragging },
        { xScale, onBrush }
      ) => (_state = {}) => {
        var {
          minEdge,
          maxEdge,
          difference = 0,
          dragging = false,
          dragType
        } = _state;

        var state = {
          difference,
          dragging,
          minEdge: minEdge !== undefined ? minEdge : _minEdge,
          maxEdge: maxEdge !== undefined ? maxEdge : _maxEdge,
          dragType: dragType !== undefined ? dragType : _dragType
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
        dragging: true,
        dragType: x
      };

      if (side === 'minEdge' || side === 'maxEdge') state.dragType = side;

      if (side === 'new') {
        state.minEdge = x;
        state.maxEdge = x;
        state.dragType = 'minEdge';
      }

      state.difference =
        side === 'both' || side === 'new' ? 0 : state[side] - x;

      return setState(state);
    },
    onMouseMove: ({
      minEdge,
      maxEdge,
      dragging,
      dragType,
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
        dragType,
        dragging
      };

      if (typeof dragType === 'number') {
        // We need to store the difference to substract it on further calls.
        state.difference = dragType - x;
        state.minEdge = minEdge - (state.difference - difference);
        state.maxEdge = maxEdge - (state.difference - difference);
      } else {
        // Store the new dragType value
        state[dragType] = x;

        if (dragType === 'maxEdge' && x <= minEdge) {
          state.minEdge = maxEdge;
          state.maxEdge = minEdge;
          state.dragType = 'minEdge';
        }
        if (dragType === 'minEdge' && x >= maxEdge) {
          state.minEdge = maxEdge;
          state.maxEdge = minEdge;
          state.dragType = 'maxEdge';
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
    onMouseUp: ({ setState }) => () => {
      setState({ dragging: false, difference: 0 });
    }
  }),
  toClass,
  pure
);

var EnhancedBrush = enhance(Brush);
EnhancedBrush.displayName = 'enhance(Brush)';

export default EnhancedBrush;
