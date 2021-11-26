const fs = require('fs');
const csv = require('@fast-csv/parse');

function readCsv(csvFile) {
  return new Promise((resolve, reject) => {
    var data = [];
    fs.createReadStream(csvFile)
    .pipe(csv.parse())
    .on('error', error => console.error(error))
    .on('data', row => data.push(row))
    .on('end', rowCount => resolve(data));
  })
}

async function awaitCsv() {
  var newData = await readCsv('features-copy.csv');
  var newObj = { features: null }
  newObj.features = newData;
  console.log(newObj);
}

awaitCsv();