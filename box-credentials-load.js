var BoxSDK = require('box-node-sdk');
const fs = require("fs");

//load credentials some how...
let creds = null;
try {
  creds = require("./box-credentials.json");
} catch (err) {
  throw `Failed to load credentials.json: ${err}`;
}
if (creds.refreshToken === "...") {
  throw `Please run 'node box-credentials-fill.js'`;
}

// create new oauth client for the app
const sdk = new BoxSDK({
  clientID: creds.clientId,
  clientSecret: creds.clientSecret,
});

var client;

sdk.getTokensRefreshGrant(creds.refreshToken, function(err, tokenInfo) {

  const newCreds = {
    clientId: creds.clientId,
    clientSecret: creds.clientSecret,
    ...tokenInfo,
  };

  const str = JSON.stringify(newCreds, true, 2);
  console.log(`Your 'box-credentials.json' has been set to: ${str}`);
  fs.writeFileSync("./box-credentials.json", str);

  client = sdk.getPersistentClient(tokenInfo);
  client.users.get(client.CURRENT_USER_ID, null, function(err, currentUser) {
    if(err) {
      console.log('Error!!!');
    }
    console.log('Hello, ' + currentUser.name + '!');
  });
});

// client.folders.getItems(0,{
//   usemarker: 'false',
//   fields: 'name',
//   offset: 0,
//   limit: 25
// }).then(items => console.log(items));

module.exports = client;