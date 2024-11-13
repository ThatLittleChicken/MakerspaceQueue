const { google } = require("googleapis");
const { getGapiClient } = require("./gapi-credentials-load");

const spreadsheetId = { 
    "3D Print" : "1kN0h_cIYD3hXVbjN25dAvLbQDkcgIuIlHprRTBHEENg", 
    "Laser Cut" : "1fYLIYfgpsMatdU_0Yx0asM3B81-JFWs2cqIsEzxJ8f0", 
    "Poster" : "1g28e9iiXov1PLNtYomn2iKmvVLlHT75G7eV-bFDHG_c"
}

let drive;
let sheets;

let today = getToday();

async function initClient() {
    return new Promise((resolve, reject) => {
        getGapiClient().then(auth => {
            drive = google.drive({ version: 'v3', auth });
            sheets = google.sheets({ version: 'v4', auth });
            resolve();
        });
    });
}

function getToday() {
    let date = new Date();
    let dd = String(date.getDate());
    let mm = String(date.getMonth() + 1);
    let yy = date.getFullYear() - 2000;
    return mm + '/' + dd + '/' + yy;
}

async function getEmptyRow(sheetId) {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "In Queue!G3:G"
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

async function getFileNames(fileIds) {  
    let fileNames = [];
    
    for (let i = 0; i < fileIds.length; i++) {
        let res = await drive.files.get({ 
            fileId: fileIds[i]
        });
        fileNames.push(res.data.name);
    }
  
    return fileNames;
}
  
async function convertToCells(data, boxLink) {
    let fileNames = "";

    console.log(today);
    console.log(data);

    let academic = data["Academic"] == "Yes" ? "Y" : "";

    let values = await getFileNames(data["Files"]).then(fns => {
        fileNames = fns.join(", ");

        let values = [];
        if (data["Service"] == "3D Print") {
            values = [null, null, null, null, today, "Forms", "Pending", data["Type"], null, data["Material"], academic, data["First Name"] + ' ' + data["Last Name"], data["Email"], fileNames, data["Files"].length, boxLink, null, "Send confirmation email. " + data["Specific Requests"]];
        } else if (data["Service"] == "Laser Cut") {
            values = [null, null, null, null, today, "Forms", "Pending", academic, data["First Name"] + ' ' + data["Last Name"], data["Email"], fileNames, boxLink, data["Source"], data["Material"], "Send confirmation email. " + data["Specific Requests"]];
        } else if (data["Service"] == "Poster") {
            values = [null, null, null, null, today, "Forms", "Pending", data["Type"], academic, data["First Name"] + ' ' + data["Last Name"], data["Email"], fileNames, boxLink, "Send confirmation email. " + data["Specific Requests"], data["Width"], data["Height"], data["Files"].length];
        } else {
            throw new Error("Unknown service");
        }

        return values;
    });
    
    return values;
}

async function updateSheets(data, boxLink) {
    today = getToday();
    await initClient();
    let values = await convertToCells(data, boxLink);
    let sheetId = spreadsheetId[data["Service"]];
    getEmptyRow(sheetId).then(r => updateRow(sheetId, r, values));
}

module.exports = { updateSheets };