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
  "https://queue.hbllmakerspace.click/gapi"
  //"http://localhost:3000/gapi"
);

auth.on('tokens', (tokens) => {
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

    auth.setCredentials({
      refresh_token: tokens.refresh_token,
      token_type: "Bearer"
    });

    //console.log(tokens.refresh_token);
  }
  //console.log(tokens.access_token);
});

async function getGapiClient() {
  let creds = getStoredCreds();

  auth.setCredentials({
    refresh_token: creds.refresh_token,
    forceRefreshOnFailure: true
  });

  return await auth;
}

module.exports = { getGapiClient };
