import './LineChart.css';
import React from 'react';
import T from 'prop-types';
import uniq from 'lodash/uniq.js';
import { Line } from '@nivo/line';
import ResponsiveWrapper from './ResponsiveWrapper/';
import BrushChart from './BrushChart/';
import { ILineChart } from './types.js';
import {
  MARGIN,
  OFFSET,
  FONT_SIZE,
  MAX_ITEMS,
  TICK_WIDTH,
  INDEX_OFFSET,
  MAX_BRUSH_ITEMS
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

  brush = data => {
    return data.map(d =>
      Object.assign({}, d, {
        data: d.data.slice(INDEX_OFFSET, INDEX_OFFSET + MAX_ITEMS)
      })
    );
  };

  render() {
    var { data } = this.props;

    var brushedData = this.brush(data);

    var margin = Object.assign({}, MARGIN, this.props.margin);

    return (
      <div className="LineChart">
        <div className="MainChart">
          <ResponsiveWrapper>
            {({ width, height }) => {
              var chartWidth = width - margin.left - margin.right;

              var dataPoints = uniq(
                brushedData
                  .map(stock => stock.data.map(value => value.x))
                  .reduce((acc, array) => acc.concat(array), [])
              );

              var gridWidth = Math.floor(chartWidth / dataPoints.length);
              var tickDistance = Math.floor(TICK_WIDTH / gridWidth);

              return (
                <Line
                  width={width}
                  height={height}
                  data={brushedData}
                  colors={['hsl(36, 100%, 50%)', 'hsl(217, 100%, 45%)']}
                  colorBy={'id'}
                  margin={margin}
                  minY="auto"
                  stacked={false}
                  axisBottom={{
                    orient: 'bottom',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 45,
                    legend: 'date',
                    legendOffset:
                      margin && margin.bottom
                        ? margin.bottom - FONT_SIZE
                        : OFFSET,
                    legendPosition: 'center',
                    tickValues: dataPoints.filter(
                      (_, i) => i % tickDistance === 0
                    )
                  }}
                  axisLeft={{
                    orient: 'left',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'close',
                    legendOffset: -40,
                    legendPosition: 'center'
                  }}
                  dotSize={5}
                  dotColor="inherit:darker(0.3)"
                  dotBorderWidth={0.5}
                  dotBorderColor="#ffffff"
                  enableDotLabel={false}
                  dotLabel="y"
                  dotLabelYOffset={-12}
                  animate={true}
                  motionStiffness={90}
                  motionDamping={15}
                  legends={[
                    {
                      anchor: 'bottom-right',
                      direction: 'row',
                      itemWidth: 80,
                      itemHeight: 20,
                      symbolSize: 12,
                      symbolShape: 'circle',
                      translateY: 80
                    }
                  ]}
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
