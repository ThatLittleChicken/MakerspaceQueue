const { google } = require("googleapis");
const fs = require("fs");

//load credentials
let creds = null;

creds = JSON.parse(fs.readFileSync('./box-credentials.json', 'utf8'));
if (creds.refresh_token === "...") {
  throw `Please run 'node gapi-credentials-fill.js'`;
}

//prepare oauth2 client
const auth = new google.auth.OAuth2(
  creds.client_id,
  creds.client_secret,
  "urn:ietf:wg:oauth:2.0:oob"
);

let renewed = false;

auth.on('tokens', (tokens) => {
  if (tokens.refresh_token) {
    // store the refresh_token in your secure persistent database
    const creds = {
      client_id: creds.clientId,
      client_secret: creds.clientSecret,
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
  auth.setCredentials({
    refresh_token: creds.refresh_token,
    token_type: "Bearer"
  });
}

module.exports = auth;
