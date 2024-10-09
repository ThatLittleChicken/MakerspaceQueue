const { google } = require("googleapis");
const fs = require("fs");
const dotenv = require('dotenv');

dotenv.config();

async function gapiCredsFill(code) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GAPI_CLIENT_ID,
    process.env.GAPI_CLIENT_SECRET,
    "https://queue.hbllmakerspace.click/gapi"
    //"http://localhost:3000/gapi"
  );

  /*
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/spreadsheets", "https://www.googleapis.com/auth/drive"],
  });
  console.log("Visit this url:\n%s", url);
  */

  const resp = await oauth2Client.getToken(code);
  const creds = {
    client_id: process.env.GAPI_CLIENT_ID,
    client_secret: process.env.GAPI_CLIENT_SECRET,
    refresh_token: resp.tokens.refresh_token,
  };
  
  const str = JSON.stringify(creds, true, 2);
  //console.log(`Your 'gapi-credentials.json' has been set to: ${str}`);
  console.log(`Gapi refresh token set`);
  fs.writeFileSync("./gapi-credentials.json", str);
}

module.exports = { gapiCredsFill };