const { google } = require("googleapis");
const auth = require("./gapi-credentials-load");

const date = new Date();
const dd = String(date.getDate());
const mm = String(date.getMonth() + 1).padStart(2, '0'); 
const yy = date.getFullYear() - 2000;
const today = mm + '/' + dd + '/' + yy;

const sheets = google.sheets({ version: "v4", auth });
const spreadsheetId = { 
    "3d" : "1kN0h_cIYD3hXVbjN25dAvLbQDkcgIuIlHprRTBHEENg", 
    "laser" : "1fYLIYfgpsMatdU_0Yx0asM3B81-JFWs2cqIsEzxJ8f0", 
    "poster" : "1g28e9iiXov1PLNtYomn2iKmvVLlHT75G7eV-bFDHG_c"
}

const drive = google.drive({ version: 'v3', auth });

async function getEmptyRow(sheetId) {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "In Queue!F3:F"
    });

    // const data = JSON.stringify(res.data, null, 2);
    // console.log(data)

    var emptyRow = 0;
    res.data.values.some(element => {
        if (element[0] != "") {
            emptyRow++;
        } else {
            return true;
        }
    });

    return emptyRow + 3;
}

async function updateRow(sheetId, row, values) {
    let res = await sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: `In Queue!A${row}`,
        valueInputOption: "RAW",
        resource: {
          values: [values]
        }
    });

    return res;
}

async function getFileName(fileId) {  
    let res = await drive.files.get({ 
        fileId: fileId
    });
  
    return res.data.name;
}
  
async function handler(data) {
    let values = [];
    let fileNames = "";
    let sheetId;

    console.log(data);

    if (data["Files"].length !== 0) {
        data["Files"].forEach(id => {
            getFileName(id).then(fn => fileNames += fn + ', ');
        });
        fileNames = fileNames.substring(0, fileNames.length - 2);
    }

    if (data["Service"] == "3D Print") {
        sheetId = spreadsheetId["3d"];
        values = [null, null, null, null, today, "In Queue", data["Type"], null, data["Material"], null, data["First Name"] + ' ' + data["Last Name"], data["Email"], fileNames, data["Files"].length, "link", null, data["Specific Requests"]];
        getEmptyRow(sheetId).then(r => updateRow(sheetId, r, values));

    } else if (data["Service"] == "Laser Cut") {

    } else if (data["Service"] == "Poster") {

    } else {
        throw new Error("Unknown service");
    }
}

async function updateSheets(data) {
    await handler(data);
}

module.exports = { updateSheets: updateSheets };