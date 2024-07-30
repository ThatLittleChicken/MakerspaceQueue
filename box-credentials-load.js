var BoxSDK = require('box-node-sdk');
const fs = require("fs");

function getStoredCreds() {
  let creds = null;

  try {
    creds = require("./box-credentials.json");
  } catch (err) {
    throw `Failed to load credentials.json: ${err}`;
  }
  if (creds.refreshToken === "...") {
    throw `Please run 'node box-credentials-fill.js'`;
  }
  return creds;
}

async function getBoxClient() {
  //load credentials some how...
  let creds = getStoredCreds();

  // create new oauth client for the app
  const sdk = new BoxSDK({
    clientID: creds.clientId,
    clientSecret: creds.clientSecret,
  });

  var client;

  let tokenInfo = await sdk.getTokensRefreshGrant(creds.refreshToken);

  const newCreds = {
    clientId: creds.clientId,
    clientSecret: creds.clientSecret,
    ...tokenInfo,
  };

  const str = JSON.stringify(newCreds, true, 2);
  console.log(`Your 'box-credentials.json' has been set to: ${str}`);
  fs.writeFileSync("./box-credentials.json", str);

  client = await sdk.getPersistentClient(getStoredCreds());
  client.users.get(client.CURRENT_USER_ID, null, function(err, currentUser) {
    if(err) {
      console.log('Error!!!');
    }
    console.log('Hello, ' + currentUser.name + '!');
  });

  return await client;
}

module.exports = { getBoxClient };