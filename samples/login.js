const env = require('node-env-file');
env(__dirname + '/../config.ini');

const request = require('request-promise');

const authTokenKey = 'x-mstr-authtoken';
const projectIdKey = 'X-MSTR-ProjectID';

const isSessionCookie = cookie => {
  return cookie.startsWith('JSESSIONID');
};

const login = async () => {
  const req = {
    method: "POST",
    uri: `${process.env.apiUri}/auth/login`,
    json: true,
    body: {
      username: process.env.username,
      password: process.env.password,
      loginMode: process.env.loginMode
    },
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    resolveWithFullResponse: true
  };

  const response = await request(req);

  // these are key:value headers we need to include with every request
  const sessionHeaders = {};

  // our auth token
  sessionHeaders[authTokenKey] = response.headers[authTokenKey];

  // the session cookie
  sessionHeaders['Cookie'] = response.headers['set-cookie'].filter(isSessionCookie).pop();
  sessionHeaders[projectIdKey] = process.env.projectID;

  // console.log(sessionHeaders);
  return sessionHeaders;
}

module.exports = login;
// login();