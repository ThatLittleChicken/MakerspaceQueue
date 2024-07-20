const { BoxOAuth, OAuthConfig, } = require('box-typescript-sdk-gen/lib/box/oauth.generated.js');
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
  const config = new OAuthConfig({
    clientId: clientId,
    clientSecret: clientSecret,
  });

  const oauth = new BoxOAuth({ config: config });

  console.log("test " + oauth.getAuthorizeUrl("http://localhost:8000"));

  // generate consent page url
  const url = `https://account.box.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=http://localhost:8000&response_type=code`;

  // url provides access, then returns a code
  console.log("Visit this url:\n%s", url);

  // paste in code
  const code = await question("Enter the code here: ");
  console.log("Converting to refresh token...");
  
  // convert into refresh token
  const resp = await oauth.getTokensAuthorizationCodeGrant(code);

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
