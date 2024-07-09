var BoxSDK = require('box-node-sdk');
const fs = require("fs");
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const question = async text =>
  new Promise((resolve, reject) => {
    rl.question(text, result =>
      result ? resolve(result) : reject("Nothing entered")
    );
  });

// Client ID and client secret are available at
// 1. Go to https://console.cloud.google.com/apis/dashboard
// 2. Click "Enable APIs and Services"
// 3. Search "Sheets"
// 4. Click "Enable"
// 5. Go to https://console.developers.google.com/apis/credentials/oauthclient
// 6. IMPORTANT: Choose "Desktop app" and choose a name
// 7. Should find a form with: Client ID, Client secret
// 8. Run this script

async function fill() {
  const clientId = await question("Enter the client ID here: ");
  const clientSecret = await question("Enter the client secret here: ");
  // create new oauth client for the app
  const sdk = new BoxSDK({
    clientID: clientId,
    clientSecret: clientSecret,
});
  // generate consent page url
  const url = `https://account.box.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=http://localhost:8000&response_type=code`;
  // url provides access, then returns a code
  console.log("Visit this url:\n%s", url);
  // paste in code
  const code = await question("Enter the code here: ");
  console.log("Converting to refresh token...");
  // convert into refresh token
  const resp = await sdk.getTokensAuthorizationCodeGrant(code, null, function (err, tokenInfo) {
    var client = sdk.getPersistentClient(tokenInfo);
  });
  console.log(resp);
  const creds = {
    client_id: clientId,
    client_secret: clientSecret,
    access_token: resp.accessToken,
    refresh_token: resp.refreshToken,
    acquired_time: resp.acquiredAtMS,
  };
  const str = JSON.stringify(creds, true, 2);
  console.log(`Your 'gapi-credentials.json' has been set to: ${str}`);
  fs.writeFileSync("./box-credentials.json", str);
}

fill().then(
  () => {
    console.log("done");
    rl.close();
  },
  err => {
    console.error("ERR", err);
    rl.close();
  }
);
