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

  const creds = {
    clientId: clientId,
    clientSecret: clientSecret,
    ...resp,
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
