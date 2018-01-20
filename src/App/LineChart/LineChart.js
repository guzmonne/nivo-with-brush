import './LineChart.css';
import React from 'react';
import T from 'prop-types';
import { Line } from '@nivo/line';
import ResponsiveWrapper from './ResponsiveWrapper/';
import BrushChart from './BrushChart/';
import { ILineChart } from './types.js';
import uniq from 'lodash/uniq.js';
import { MARGIN, MAX_ITEMS, INDEX_OFFSET, TICK_WIDTH } from './constants.js';

class LineChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      min: INDEX_OFFSET,
      max: INDEX_OFFSET + MAX_ITEMS
    };
  }

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

  updateVisibleSelection = visibleData => {
    //console.log('something');
    //this.setState({ visibleData });
  };

  visible = data => {
    var { min, max } = this.state;
    return data.map(d =>
      Object.assign({}, d, {
        data: d.data.slice(min, max)
      })
    );
  };

  render() {
    var {
      data,
      axisBottom,
      withInnerDimensions,
      brushOverrides,
      ...rest
    } = this.props;

    var visibleData = this.visible(data);

    var margin = Object.assign({}, MARGIN, this.props.margin);

    var brushProps = { ...rest, ...brushOverrides };

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
          <BrushChart
            data={data}
            margin={margin}
            onBrush={this.updateVisibleSelection}
            {...brushProps}
          />
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
