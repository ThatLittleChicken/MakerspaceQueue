const { BoxOAuth, OAuthConfig, } = require('box-typescript-sdk-gen/lib/box/oauth.generated.js');
const { BoxClient } = require('box-typescript-sdk-gen/lib/client.generated.js');
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
const config = new OAuthConfig({
  clientId: creds.clientId,
  clientSecret: creds.clientSecret,
});

const oauth = new BoxOAuth({ config: config });
const client = new BoxClient(oauth);

client.authorization.refreshAccessToken(creds).then(tokenInfo => {

  console.log(tokenInfo);
  const newCreds = {
    clientId: creds.clientId,
    clientSecret: creds.clientSecret,
    ...tokenInfo,
  };

  const str = JSON.stringify(newCreds, true, 2);
  console.log(`Your 'box-credentials.json' has been set to: ${str}`);
  fs.writeFileSync("./box-credentials.json", str);

  // client.users.getUserById(client.CURRENT_USER_ID, null, function(err, currentUser) {
  //   if(err) {
  //     console.log('Error!!!');
  //   }
  //   console.log('Hello, ' + currentUser.name + '!');
  // });
});

module.exports = client;