'use strict';

var csv = require('csvtojson');
var fs = require('fs');
var path = require('path');

var csvFilePath = path.resolve(__dirname, 'AAPL.US.csv');

var result = {
  id: 'AAPL',
  color: 'hsl(36, 100%, 50%)',
  data: []
};

var x, y;

csv()
  .fromFile(csvFilePath)
  .on('json', json => {
    x = json.Date;
    y = parseFloat(json.Close, 10);
    result.data.push({
      x,
      y
    });
  })
  .on('done', error => {
    result.data = result.data.slice(0, -1);
    var output = path.resolve(__dirname, '../src/App/stock.json');
    fs.writeFileSync(output, JSON.stringify([result], null, 2), 'utf8');
  });
