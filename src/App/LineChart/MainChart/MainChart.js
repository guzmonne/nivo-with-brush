import React from 'react';
import { Line } from '@nivo/line';
import uniq from 'lodash/uniq.js';
import ResponsiveWrapper from '../ResponsiveWrapper/';
import { ILineChart } from '../types.js';
import {
  MARGIN,
  OFFSET,
  FONT_SIZE,
  MAX_ITEMS,
  TICK_WIDTH,
  INDEX_OFFSET
} from '../constants.js';

class MainChart extends React.Component {
  render() {
    var { data, enableDotLabel } = this.props;

    var margin = Object.assign({}, MARGIN, this.props.margin);

    var brushedData = data.map(d =>
      Object.assign({}, d, {
        data: d.data.slice(INDEX_OFFSET, INDEX_OFFSET + MAX_ITEMS)
      })
    );

    return (
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
                  margin && margin.bottom ? margin.bottom - FONT_SIZE : OFFSET,
                legendPosition: 'center',
                tickValues: dataPoints.filter((_, i) => i % tickDistance === 0)
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
              enableDotLabel={enableDotLabel}
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
    );
  }
}

MainChart.propTypes = ILineChart;

MainChart.defaultProps = {
  tickRotation: 0
};

export default MainChart;
