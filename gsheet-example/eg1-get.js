const { google } = require("googleapis");
const auth = require("../gapi-credentials-load");

async function run() {
  //create sheets client
  const sheets = google.sheets({ version: "v4", auth });
  //get a range of values
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: "1kN0h_cIYD3hXVbjN25dAvLbQDkcgIuIlHprRTBHEENg",
    range: "In Queue!A1:P2"
  });
  //print results
  console.log(JSON.stringify(res.data, null, 2));
}

run().catch(err => console.error("ERR", err));
