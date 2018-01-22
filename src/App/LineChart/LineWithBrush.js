import React from 'react';
import { sortBy } from 'lodash';
import { area, line } from 'd3-shape';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import withPropsOnChange from 'recompose/withPropsOnChange';
import defaultProps from 'recompose/defaultProps';
import { curveFromProp } from '@nivo/core';
import { getInheritedColorGenerator } from '@nivo/core';
import { withTheme, withColors, withDimensions, withMotion } from '@nivo/core';
import { Container } from '@nivo/core';
import {
  getScales,
  getStackedScales,
  generateLines,
  generateStackedLines
} from '@nivo/line/lib/compute.js';
import { CartesianMarkers } from '@nivo/core';
import { Axes, Grid } from '@nivo/core';
import { BoxLegendSvg } from '@nivo/legends';
import LineAreas from '@nivo/line/lib/LineAreas';
import LineLines from '@nivo/line/lib/LineLines';
import LineSlices from '@nivo/line/lib/LineSlices';
import LineDots from '@nivo/line/lib/LineDots';
import { LinePropTypes, LineDefaultProps } from '@nivo/line/lib/props';
import Brush from './Brush/';
import SvgWrapper from './SvgWrapper.js';

const Line = ({
  // custom
  data,
  onBrush,
  initialMinEdge,
  initialMaxEdge,

  // lines and scales
  lines,
  lineGenerator,
  areaGenerator,
  xScale,
  yScale,
  slices,

  // dimensions
  margin,
  width,
  height,
  outerWidth,
  outerHeight,

  // axes & grid
  axisTop,
  axisRight,
  axisBottom,
  axisLeft,
  enableGridX,
  enableGridY,

  lineWidth,
  enableArea,
  areaOpacity,

  // dots
  enableDots,
  dotSymbol,
  dotSize,
  dotColor,
  dotBorderWidth,
  dotBorderColor,
  enableDotLabel,
  dotLabel,
  dotLabelFormat,
  dotLabelYOffset,

  // markers
  markers,

  // theming
  theme,

  // motion
  animate,
  motionStiffness,
  motionDamping,

  // interactivity
  isInteractive,
  tooltipFormat,

  // stackTooltip
  enableStackTooltip,

  legends
}) => {
  const motionProps = {
    animate,
    motionDamping,
    motionStiffness
  };

  return (
    <Container isInteractive={isInteractive} theme={theme}>
      {({ showTooltip, hideTooltip }) => (
        <SvgWrapper width={outerWidth} height={outerHeight} margin={margin}>
          <Grid
            theme={theme}
            width={width}
            height={height}
            xScale={enableGridX ? xScale : null}
            yScale={enableGridY ? yScale : null}
            {...motionProps}
          />
          <CartesianMarkers
            markers={markers}
            width={width}
            height={height}
            xScale={xScale}
            yScale={yScale}
            theme={theme}
          />
          <Axes
            xScale={xScale}
            yScale={yScale}
            width={width}
            height={height}
            theme={theme}
            top={axisTop}
            right={axisRight}
            bottom={axisBottom}
            left={axisLeft}
            {...motionProps}
          />
          {enableArea && (
            <LineAreas
              areaGenerator={areaGenerator}
              areaOpacity={areaOpacity}
              lines={lines}
              {...motionProps}
            />
          )}
          <LineLines
            lines={lines}
            lineGenerator={lineGenerator}
            lineWidth={lineWidth}
            {...motionProps}
          />
          {isInteractive &&
            enableStackTooltip && (
              <LineSlices
                slices={slices}
                height={height}
                showTooltip={showTooltip}
                hideTooltip={hideTooltip}
                theme={theme}
                tooltipFormat={tooltipFormat}
              />
            )}
          {enableDots && (
            <LineDots
              lines={lines}
              symbol={dotSymbol}
              size={dotSize}
              color={getInheritedColorGenerator(dotColor)}
              borderWidth={dotBorderWidth}
              borderColor={getInheritedColorGenerator(dotBorderColor)}
              enableLabel={enableDotLabel}
              label={dotLabel}
              labelFormat={dotLabelFormat}
              labelYOffset={dotLabelYOffset}
              theme={theme}
              {...motionProps}
            />
          )}
          {legends.map((legend, i) => {
            const legendData = lines
              .map(line => ({
                label: line.id,
                fill: line.color
              }))
              .reverse();

            return (
              <BoxLegendSvg
                key={i}
                {...legend}
                containerWidth={width}
                containerHeight={height}
                data={legendData}
              />
            );
          })}
          <Brush
            xScale={xScale}
            margin={margin}
            data={data}
            width={width}
            height={height}
            onBrush={onBrush}
            initialMinEdge={initialMinEdge}
            initialMaxEdge={initialMaxEdge}
          />
        </SvgWrapper>
      )}
    </Container>
  );
};

Line.propTypes = LinePropTypes;

const enhance = compose(
  defaultProps(LineDefaultProps),
  withTheme(),
  withColors(),
  withDimensions(),
  withMotion(),
  withPropsOnChange(['curve', 'height'], ({ curve, height }) => ({
    areaGenerator: area()
      .x(d => d.x)
      .y0(height)
      .y1(d => d.y)
      .curve(curveFromProp(curve)),
    lineGenerator: line()
      .defined(d => d.value !== null)
      .x(d => d.x)
      .y(d => d.y)
      .curve(curveFromProp(curve))
  })),
  withPropsOnChange(
    ['data', 'stacked', 'width', 'height', 'minY', 'maxY'],
    ({ data, stacked, width, height, margin, minY, maxY }) => {
      let scales;
      const args = { data, width, height, minY, maxY };
      if (stacked === true) {
        scales = getStackedScales(args);
      } else {
        scales = getScales(args);
      }

      return {
        margin,
        width,
        height,
        ...scales
      };
    }
  ),
  withPropsOnChange(
    ['getColor', 'xScale', 'yScale'],
    ({ data, stacked, xScale, yScale, getColor }) => {
      let lines;
      if (stacked === true) {
        lines = generateStackedLines(data, xScale, yScale, getColor);
      } else {
        lines = generateLines(data, xScale, yScale, getColor);
      }

      const slices = xScale.domain().map((id, i) => {
        let points = sortBy(
          lines.map(line => ({
            id: line.id,
            value: line.points[i].value,
            y: line.points[i].y,
            color: line.color
          })),
          'y'
        );

        return {
          id,
          x: xScale(id),
          points
        };
      });

      return { lines, slices };
    }
  ),
  pure
);

const EnhancedLine = enhance(Line);
EnhancedLine.displayName = 'enhance(Line)';

export default EnhancedLine;
