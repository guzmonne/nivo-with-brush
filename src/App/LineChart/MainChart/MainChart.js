import React from 'react';
import { ResponsiveLine } from '@nivo/line';
import { ILineChart } from '../types.js';
import { MARGIN, OFFSET, FONT_SIZE } from '../constants.js';

class MainChart extends React.Component {
  render() {
    var {
      data,
      enableDotLabel,
      xAxisTickValues,
      tickRotation,
      margin,
      xLegend,
      yLegend
    } = this.props;

    return (
      <ResponsiveLine
        data={data}
        colors={['hsl(36, 100%, 50%)', 'hsl(217, 100%, 45%)']}
        colorBy={'id'}
        margin={Object.assign({}, MARGIN, margin)}
        minY="auto"
        stacked={false}
        axisBottom={{
          orient: 'bottom',
          tickSize: 5,
          tickPadding: 5,
          tickRotation: tickRotation,
          legend: xLegend,
          legendOffset:
            margin && margin.bottom ? margin.bottom - FONT_SIZE : OFFSET,
          legendPosition: 'center',
          tickValues: xAxisTickValues
        }}
        axisLeft={{
          orient: 'left',
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: yLegend,
          legendOffset: -40,
          legendPosition: 'center'
        }}
        dotSize={10}
        dotColor="inherit:darker(0.3)"
        dotBorderWidth={2}
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
            direction: 'column',
            translateX: 100,
            itemWidth: 80,
            itemHeight: 20,
            symbolSize: 12,
            symbolShape: 'circle'
          }
        ]}
      />
    );
  }
}

MainChart.propTypes = ILineChart;

MainChart.defaultProps = {
  tickRotation: 0
};

export default MainChart;
