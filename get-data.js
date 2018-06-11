const fs = require('fs');
const filePath = __dirname + '/epa-http.txt';

function processRawData(rawData) {
  const data = [];
  const textFileLines = rawData.split('\n');
  for (let idx = 0; idx < textFileLines.length; idx++) {
    const line = textFileLines[idx]
    if(!line) {
      continue
    }
    const [
      host,
      datetime,
      method,
      url,
      protocolData,
      response_code,
      document_size
    ] = line.replace(/"/g, '').split(' ')
    const [day, hour, minute, second] = datetime.replace(/\[|\]/g, '').split(':')
    const [protocol, protocol_version] = protocolData.split('/')
    console.log(url)
    
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
    
    data.push(dataObject)
  }
  return data
}

const rawData = fs.readFileSync(filePath, 'utf8');
const dataArray = processRawData(rawData);
saveDataToJSON(dataArray);

function saveDataToJSON(dataArray) {
  fs.writeFile('data.json', JSON.stringify(dataArray), (err) => {
    if (err) {
      console.log('There was an error!', err);
    }

    console.log('data saved');
  });
}


