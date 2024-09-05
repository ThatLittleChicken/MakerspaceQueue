const { google } = require("googleapis");
const fs = require("fs");
const dotenv = require('dotenv');
dotenv.config();

//load credentials
function getStoredCreds() {
  let creds = null;

  creds = JSON.parse(fs.readFileSync('./gapi-credentials.json', 'utf8'));
  if (creds.refresh_token === "...") {
    throw `Please run 'node gapi-credentials-fill.js'`;
  }
  return creds;
}

//prepare oauth2 client
const auth = new google.auth.OAuth2(
  process.env.GAPI_CLIENT_ID,
  process.env.GAPI_CLIENT_SECRET,
  "urn:ietf:wg:oauth:2.0:oob"
);

async function getGapiClient() {
  let renewed = false;
  let creds = getStoredCreds();

  await auth.on('tokens', (tokens) => {
    if (tokens.refresh_token) {
      // store the refresh_token in your secure persistent database
      const creds = {
        client_id: process.env.GAPI_CLIENT_ID,
        client_secret: process.env.GAPI_CLIENT_SECRET,
        refresh_token: tokens.refresh_token,
      };
      const str = JSON.stringify(creds, true, 2);
      console.log(`Gapi refresh token renewed`);
      fs.writeFileSync("./gapi-credentials.json", str);

      renewed = true;
      auth.setCredentials({
        refresh_token: tokens.refresh_token,
        token_type: "Bearer"
      });

      //console.log(tokens.refresh_token);
    }
    //console.log(tokens.access_token);
  });

  if (!renewed) {
    await auth.setCredentials({
      refresh_token: creds.refresh_token,
      token_type: "Bearer"
    });
  }

  return await auth;
}

module.exports = { getGapiClient };
