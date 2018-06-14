const fs = require('fs');
const filePath = __dirname + '/epa-http.txt';

let skipCount = 0, processedCount = 0;
function processRawData(rawData) {
  const data = [];
  const textFileLines = rawData.split('\n');
  console.log('Processing all', textFileLines.length, 'lines of data...');

  for (let idx = 0; idx < textFileLines.length; idx++) {
    const line = textFileLines[idx]
    if(!line) {
      continue;
    }

    const dataPoints = line.replace(/"/g, '').split(' ');
    if (dataPoints.length !== 7) {
      console.log('Corrupt data found at line', idx + 1, 'skipping...');
      skipCount++;
      continue;
    }

    const [
      host,
      datetime,
      method,
      url,
      protocolData,
      response_code,
      document_size
    ] = dataPoints;
    const [day, hour, minute, second] = datetime.replace(/\[|\]/g, '').split(':')
    const [protocol, protocol_version] = protocolData.split('/')

    const dataObject = {
      host,
      datetime: { 
        day,
        hour,
        minute,
        second
      },
      request: { 
        method,
        url,
        protocol,
        protocol_version
       },
      response_code,
      document_size
    }
    
    processedCount++;
    data.push(dataObject)
  }
  return data
}

function saveDataToJSON(dataArray) {
  fs.writeFile(__dirname + '/data.json', JSON.stringify(dataArray), (err) => {
    if (err) {
      console.log('There was an error!', err);
    }
    process.exit();
  });
}

const rawData = fs.readFileSync(filePath, 'utf8');
const dataArray = processRawData(rawData);
saveDataToJSON(dataArray);
console.log(
  'Successfully processed the data\n',
  processedCount, 'lines processed.\n',
  skipCount, 'lines skipped due to incomplete data.'
);
