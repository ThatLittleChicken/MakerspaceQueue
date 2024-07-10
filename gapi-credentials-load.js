const { google } = require("googleapis");
const fs = require("fs");

//load credentials some how...
let creds = null;
try {
  creds = require("./gapi-credentials.json");
} catch (err) {
  throw `Failed to load credentials.json: ${err}`;
}
if (creds.refresh_token === "...") {
  throw `Please run 'node gapi-credentials-fill.js'`;
}

//prepare oauth2 client
const auth = new google.auth.OAuth2(
  creds.client_id,
  creds.client_secret,
  "urn:ietf:wg:oauth:2.0:oob"
);

auth.on('tokens', (tokens) => {
  if (tokens.refresh_token) {
    // store the refresh_token in your secure persistent database
    const creds = {
      client_id: creds.clientId,
      client_secret: creds.clientSecret,
      refresh_token: tokens.refresh_token,
    };
    const str = JSON.stringify(creds, true, 2);
    console.log(`Your 'gapi-credentials.json' has been set to: ${str}`);
    fs.writeFileSync("./gapi-credentials.json", str);

    console.log(tokens.refresh_token);
  }
  console.log(tokens.access_token);
});

auth.setCredentials({
  access_token: "DUMMY",
  expiry_date: 1,
  refresh_token: creds.refresh_token,
  token_type: "Bearer"
});

module.exports = auth;
