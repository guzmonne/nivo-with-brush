/*
 * This file is part of the nivo project.
 *
 * Copyright 2016-present, Raphaël Benitte.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import { range, min, max, sumBy, uniq } from 'lodash';
import { scalePoint, scaleLinear } from 'd3-scale';

/**
 * Generates X scale.
 *
 * @param {Array.<Object>} data
 * @param {number}         width
 * @returns {Function}
 */
export const getXScale = (data, width) => {
  const xLengths = uniq(data.map(({ data }) => data.length));
  if (xLengths.length > 1) {
    throw new Error(
      [
        `Found inconsitent data for x,`,
        `expecting all series to have same length`,
        `but found: ${xLengths.join(', ')}`
      ].join(' ')
    );
  }

  return scalePoint()
    .range([0, width])
    .domain(data[0].data.map(({ x }) => x));
};

/**
 * Generates Y scale for line chart.
 *
 * @param {Array.<Object>} data
 * @param {number}         height
 * @param {number|string}  minValue
 * @param {number|string}  maxValue
 * @returns {Function}
 */
export const getYScale = (data, height, minValue, maxValue) => {
  let minY = minValue;
  if (minValue === 'auto') {
    minY = min(data.map(serie => min(serie.data.map(d => d.y))));
  }

  let maxY = maxValue;
  if (maxValue === 'auto') {
    maxY = max(data.map(serie => max(serie.data.map(d => d.y))));
  }

  return scaleLinear()
    .rangeRound([height, 0])
    .domain([minY, maxY]);
};

/**
 * Generates Y scale for stacked line chart.
 *
 * @param {Array.<Object>} data
 * @param {Object}         xScale
 * @param {number}         height
 * @param {number|string}  minValue
 * @param {number|string}  maxValue
 * @returns {Function}
 */
export const getStackedYScale = (data, xScale, height, minValue, maxValue) => {
  let minY = minValue;
  if (minValue === 'auto') {
    minY = min(data.map(serie => min(serie.data.map(d => d.y))));
  }

  let maxY = maxValue;
  if (maxValue === 'auto') {
    maxY = max(
      range(xScale.domain().length).map(i =>
        sumBy(data, serie => serie.data[i].y)
      )
    );
  }

  return scaleLinear()
    .rangeRound([height, 0])
    .domain([minY, maxY]);
};
