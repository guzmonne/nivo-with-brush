import './LineChart.css';
import React from 'react';
import T from 'prop-types';
import { Line } from '@nivo/line';
import ResponsiveWrapper from './ResponsiveWrapper/';
import BrushChart from './BrushChart/';
import { ILineChart } from './types.js';
import uniq from 'lodash/uniq.js';
import {
  MARGIN,
  MAX_ITEMS,
  INDEX_OFFSET,
  MAX_BRUSH_ITEMS,
  TICK_WIDTH
} from './constants.js';

var brushChartProps = {
  margin: { top: 0, left: 0, right: 0, bottom: 0 },
  colors: ['hsl(36, 100%, 50%)', 'hsl(217, 100%, 45%)'],
  colorBy: 'id',
  enableGridX: false,
  enableGridY: false,
  enableAxisBottom: false,
  minY: 'auto',
  stacked: false,
  axisBottom: {
    orient: 'bottom',
    tickSize: 5,
    tickPadding: 5,
    tickRotation: 0,
    tickValues: []
  },
  axisLeft: {
    orient: 'left',
    tickSize: 5,
    tickPadding: 5,
    tickRotation: 0,
    tickValues: []
  },
  dotSize: 0.5,
  dotColor: 'inherit:darker(0.3)',
  dotBorderWidth: 0,
  lineWidth: 1,
  animate: true,
  motionStiffness: 90,
  motionDamping: 15,
  isInteractive: false,
  enableStackTooltip: false
};

class LineChart extends React.Component {
  calculateTickValues = (data, innerWidth) => {
    var xValues = uniq(
      data
        .map(stock => stock.data.map(value => value.x))
        .reduce((acc, array) => acc.concat(array), [])
    );

    var gridWidth = Math.ceil(innerWidth / xValues.length);
    var tickDistance = Math.floor(TICK_WIDTH / gridWidth);

    var result = xValues.filter((_, i) => i % tickDistance === 0);

    return result;
  };

  brushData = data => {
    return data.map(points => {
      if (points.data.length < MAX_BRUSH_ITEMS) return points;

      var every = Math.ceil(points.data.length / MAX_BRUSH_ITEMS);

      var result = Object.assign({}, points, {
        data: points.data.filter((_, i) => i % every === 0)
      });

      return result;
    });
  };

  visible = data => {
    return data.map(d =>
      Object.assign({}, d, {
        data: d.data.slice(INDEX_OFFSET, INDEX_OFFSET + MAX_ITEMS)
      })
    );
  };

  render() {
    var { data, axisBottom, withInnerDimensions, ...rest } = this.props;

    var visibleData = this.visible(data);

    var margin = Object.assign({}, MARGIN, this.props.margin);

    return (
      <div className="LineChart">
        <div className="MainChart">
          <ResponsiveWrapper>
            {({ width, height }) => {
              return (
                <Line
                  {...rest}
                  width={width}
                  height={height}
                  data={visibleData}
                  margin={margin}
                  axisBottom={{
                    ...axisBottom,
                    ...{
                      tickValues: this.calculateTickValues(
                        visibleData,
                        width - margin.left - margin.right
                      )
                    }
                  }}
                />
              );
            }}
          </ResponsiveWrapper>
        </div>
        <div className="BrushChart">
          <BrushChart data={this.brushData(data)} {...brushChartProps} />
        </div>
      </div>
    );
  }
}

LineChart.propTypes = Object.assign({}, ILineChart, {
  tickEvery: T.number
});

LineChart.defaultProps = {
  margin: MARGIN
};

export default LineChart;
