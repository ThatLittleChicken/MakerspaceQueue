var BoxSDK = require('box-node-sdk');
const fs = require("fs");

function getStoredCreds() {
  let creds = null;

  creds = JSON.parse(fs.readFileSync('./box-credentials.json', 'utf8'));
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

  await sdk.getTokensRefreshGrant(creds.refreshToken).then(tokenInfo => {

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
      try {
        console.log('Hello, ' + currentUser.name + '!');
      } catch (err) {
        console.log("Failed to get user info");
      }
    });
  });

  client = await sdk.getPersistentClient(getStoredCreds());
  return await client;
}

module.exports = { getBoxClient };