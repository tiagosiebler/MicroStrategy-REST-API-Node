const request = require('request-promise');
const env = require('node-env-file');
env(__dirname + '/../config.ini');

const loginAPI = require('./login');

const postReportInstance = (reportId, sessionHeaders) => {
  const req = {
    method: "POST",
    uri: `${process.env.apiUri}/reports/${reportId}/instances`,
    json: true,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...sessionHeaders
    }
  };

  return request(req);
}

const getElementsForReportAttribute = (reportId, reportInstanceId, attributeId, sessionHeaders) => {
  const req = {
    method: "GET",
    uri: `${process.env.apiUri}/reports/${reportId}/instances/${reportInstanceId}/attributes/${attributeId}/elements`,
    json: true,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...sessionHeaders
    }
  };
  console.log(`get attribute elements request: `, JSON.stringify(req, null, 2));

  return request(req);
}

// returns first attribute found in a report instance result
const getAttributeForInstance = instanceResult => {
  const attributes = instanceResult.result.definition.attributes;
  // console.log(`attributes: `, JSON.stringify(attributes, null, 2));
  return attributes.length ? attributes[0] : undefined;
}

// executes a report to get the instance ID, then returns a list of elements in an attribute in this instance
const reportTests = async () => {
  const reportId = process.env.reportID;

  const sessionHeaders = await loginAPI();
  console.log(sessionHeaders);

  const reportInstance = await postReportInstance(reportId, sessionHeaders);
  // console.log(`reportInstance: `, JSON.stringify(reportInstance, null, 2));

  const reportInstanceId = reportInstance.instanceId;
  console.log(`reportInstanceId: `, reportInstanceId);

  const attribute = getAttributeForInstance(reportInstance);
  console.log(`attribute: `, JSON.stringify(attribute, null, 2));

  const elements = await getElementsForReportAttribute(reportId, reportInstanceId, attribute.id, sessionHeaders);
  console.log(`elements: `, JSON.stringify(elements, null, 2));
}

reportTests();