const { google } = require("googleapis");
const auth = require("./gapi-credentials-load");

const sheets = google.sheets({ version: "v4", auth });
const spreadsheetId = { 
    "3D Print" : "1kN0h_cIYD3hXVbjN25dAvLbQDkcgIuIlHprRTBHEENg", 
    "Laser Cut" : "1fYLIYfgpsMatdU_0Yx0asM3B81-JFWs2cqIsEzxJ8f0", 
    "Poster" : "1g28e9iiXov1PLNtYomn2iKmvVLlHT75G7eV-bFDHG_c"
}

const drive = google.drive({ version: 'v3', auth });

const date = new Date();
const dd = String(date.getDate());
const mm = String(date.getMonth() + 1); 
const yy = date.getFullYear() - 2000;
const today = mm + '/' + dd + '/' + yy;

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
  
async function convertToCells(data) {
    let fileNames = "";

    console.log(data);

    let values = await getFileNames(data["Files"]).then(fns => {
        fileNames = fns.join(", ");

        let values = [];
        if (data["Service"] == "3D Print") {
            values = [null, null, null, null, today, "In Queue", data["Type"], null, data["Material"], null, data["First Name"] + ' ' + data["Last Name"], data["Email"], fileNames, data["Files"].length, "link", null, data["Specific Requests"]];
        } else if (data["Service"] == "Laser Cut") {
            values = [null, null, null, null, today, "In Queue", null, data["First Name"] + ' ' + data["Last Name"], data["Email"], fileNames, "link", data["Source"], data["Material"], data["Specific Requests"]];
        } else if (data["Service"] == "Poster") {
            values = [null, null, null, null, today, "In Queue", data["Type"], null, data["First Name"] + ' ' + data["Last Name"], fileNames, "link", data["Type"] + ' ' + data["Specific Requests"], data["Width"], data["Height"], data["Files"].length];
        } else {
            throw new Error("Unknown service");
        }

        return values;
    });
    
    return values;
}

async function updateSheets(data) {
    let values = await convertToCells(data);
    let sheetId = spreadsheetId[data["Service"]];
    getEmptyRow(sheetId).then(r => updateRow(sheetId, r, values));
}

module.exports = updateSheets;