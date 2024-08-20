var BoxSDK = require('box-node-sdk');
const fs = require("fs");
const dotenv = require('dotenv');
dotenv.config();

async function boxCredsFill(code) {
    const sdk = new BoxSDK({
    clientID: process.env.BOX_CLIENT_ID,
    clientSecret: process.env.BOX_CLIENT_SECRET,
  });
  
  // convert into refresh token
  const resp = await sdk.getTokensAuthorizationCodeGrant(code, null, function (err, tokenInfo) {
    var client = sdk.getPersistentClient(tokenInfo);
    
    client.users.get(client.CURRENT_USER_ID, null, function(err, currentUser) {
      try {
        console.log('Hello, ' + currentUser.name + '!');
      } catch (err) {
        console.log("Failed to get user info");
      }
    });
  });

  const credsNew = {
    clientId: process.env.BOX_CLIENT_ID,
    clientSecret: process.env.BOX_CLIENT_SECRET,
    ...resp,
  };

  const str = JSON.stringify(credsNew, true, 2);
  //console.log(`Your 'box-credentials.json' has been set to: ${str}`);
  fs.writeFileSync("./box-credentials.json", str);
}

module.exports = { boxCredsFill };