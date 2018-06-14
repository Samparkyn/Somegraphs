function getMinuteFromDatetime(datetime) {
  const dayToMinute = datetime.day * 24 * 60;
  const hoursToMinute = datetime.hour * 60;
  const minute = datetime.minute;
  return dayToMinute + hoursToMinute + minute;
}

// https://gist.github.com/jasonrhodes/2321581
function getNestedValue(obj, path) {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

export function getRequestsPerMin(data) {
  const minutesToRequestsMap = data.reduce((acc, dataPoint) => {
    const minute = getMinuteFromDatetime(dataPoint.datetime);
    if (acc[minute]) {
      acc[minute]++
      return acc;
    }
    acc[minute] = 1;
    return acc;
  }, {});

  return minutesToRequestsMap;
}

export function getPercentageMap(data, key) {
  const dataLength = data.length
  const percentageMap = data.reduce((acc, dataPoint) => {
    const value = getNestedValue(dataPoint, key);
    if(acc[value]) {
      acc[value]++;
      return acc;
    }
    acc[value] = 1;
    return acc;
  }, {})
 
  for (const key in percentageMap) {
    percentageMap[key] = parseFloat(((percentageMap[key] / dataLength) * 100).toFixed(2))
  }

  return percentageMap;
}

export function getSizeDistribution(data) {
  const filteredData = data.filter(dataPoint => {
    return parseInt(dataPoint.response_code, 10) === 200 
      && parseInt(dataPoint.document_size, 10) < 1000  
  })
  return filteredData.map(dataPoint => {
    return parseInt(dataPoint.document_size, 10)
  })
}