const { google } = require("googleapis");
const auth = require("../gapi-credentials-load");

// async function run() {
//   const drive = google.drive({ version: 'v3', auth });

//   const res = await drive.files.list({
//     pageSize: 10,
//     fields: 'nextPageToken, files(id, name)',
//   });
//   const files = res.data.files;
//   if (files.length === 0) {
//     console.log('No files found.');
//     return;
//   }

//   console.log('Files:');
//   files.map((file) => {
//     console.log(`${file.name} (${file.id})`);
//   });
// }

async function run() {
  const drive = google.drive({ version: 'v3', auth });

  const res = await drive.files.get({ fileId:'1mqIUCYhmr1RkdndzKpFx1HhNLmPCjEsV' });

  console.log(JSON.stringify(res.data, null, 2));
}

run().catch(err => console.error("ERR", err));
