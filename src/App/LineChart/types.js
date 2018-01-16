import T from 'prop-types';

export var ILineChart = {
  data: T.arrayOf(T.object),
  enableDotLabels: T.bool,
  xAxisTickValues: T.array,
  tickRotation: T.number,
  margin: T.shape({
    top: T.number,
    right: T.number,
    bottom: T.number,
    left: T.number
  }),
  xLegend: T.string,
  yLegend: T.string
};
