var BoxSDK = require('box-node-sdk');
const fs = require("fs");

async function boxCredsFill(code) {
  let creds = null;
  try {
    creds = require("./box-credentials.json");
  } catch (err) {
    throw `Failed to load credentials.json: ${err}`;
  }

  const sdk = new BoxSDK({
    clientID: creds.clientId,
    clientSecret: creds.clientSecret,
  });
  
  // convert into refresh token
  const resp = await sdk.getTokensAuthorizationCodeGrant(code, null, function (err, tokenInfo) {
    var client = sdk.getPersistentClient(tokenInfo);
  });

  const credsNew = {
    clientId: creds.clientId,
    clientSecret: creds.clientSecret,
    ...resp,
  };

  const str = JSON.stringify(credsNew, true, 2);
  console.log(`Your 'box-credentials.json' has been set to: ${str}`);
  fs.writeFileSync("./box-credentials.json", str);
}

module.exports = { boxCredsFill };