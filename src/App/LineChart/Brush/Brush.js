import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import withStateHandlers from 'recompose/withStateHandlers';
import withHandlers from 'recompose/withHandlers.js';
import { PADDING } from '../constants.js';

var Brush = ({
  width,
  height,
  margin,
  minEdge,
  maxEdge,
  onMouseDown,
  onMouseMove,
  onMouseUp
}) => {
  return (
    <g onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}>
      <rect
        x={-1 * margin.left}
        y={0}
        width={width + margin.left + margin.right}
        height={height}
        style={{
          opacity: 0.2,
          fill: 'transparent'
        }}
        onMouseDown={onMouseDown('new')}
      />
      <rect
        x={minEdge - 2 * PADDING}
        y={0}
        width={2 * PADDING}
        height={height}
        style={{
          opacity: 0,
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
          cursor: 'ew-resize'
        }}
        onMouseDown={onMouseDown('maxEdge')}
      />
      <rect
        x={minEdge}
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
        { width, onBrush }
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

        if (state.maxEdge > width) {
          state.maxEdge = width;
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
    cursorPoint: ({ getSvgRef, margin }) => (clientX, clientY) => {
      var svg = getSvgRef();
      var pt = svg.createSVGPoint();
      pt.x = clientX - margin.left;
      pt.y = clientY;
      var result = pt.matrixTransform(svg.getScreenCTM().inverse());
      return result;
    }
  }),
  withHandlers({
    onMouseDown: ({
      cursorPoint,
      setState,
      minEdge,
      maxEdge,
      width
    }) => side => e => {
      var { x } = cursorPoint(e.clientX, e.clientY);

      var state = {
        dragging: true
      };

      if (side === 'both') {
        state.dragType = 'both';
        this.center = maxEdge - minEdge;
        this.delta = Math.round(Math.abs(x - this.center));
      }

      if (side === 'minEdge' || side === 'maxEdge') {
        state.dragType = side;
        this.delta = Math.round(side === 'minEdge' ? x - minEdge : x - maxEdge);
      }

      if (side === 'new') {
        if (x < 0) return;
        if (x > width) return;
        state.minEdge = x;
        state.maxEdge = x;
        state.dragType = 'minEdge';
        this.delta = 0;
      }

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

      var { x } = cursorPoint(e.clientX, e.clientY);

      var state = {
        minEdge,
        maxEdge,
        difference,
        dragType,
        dragging
      };

      if (dragType === 'both') {
        // We need to store the difference to substract it on further calls.
        state.difference = this.center - Math.round(x - this.delta);
        state.minEdge = minEdge - (state.difference - difference);
        state.maxEdge = maxEdge - (state.difference - difference);
      } else {
        var newEdge = Math.round(x - this.delta);

        if (dragType === 'maxEdge' && newEdge <= minEdge) {
          state.minEdge = newEdge;
          state.maxEdge = minEdge;
          state.dragType = 'minEdge';
        } else if (dragType === 'minEdge' && newEdge >= maxEdge) {
          state.minEdge = maxEdge;
          state.maxEdge = newEdge;
          state.dragType = 'maxEdge';
        } else {
          // Store the new dragType value
          state[dragType] = newEdge;
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
  pure
);

var EnhancedBrush = enhance(Brush);
EnhancedBrush.displayName = 'enhance(Brush)';

export default EnhancedBrush;
