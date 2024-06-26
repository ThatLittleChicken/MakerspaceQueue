const { google } = require("googleapis");
const auth = require("./gapi-credentials-load");

const sheets = google.sheets({ version: "v4", auth });
const spreadsheetId = { 
    "3d" : "1kN0h_cIYD3hXVbjN25dAvLbQDkcgIuIlHprRTBHEENg", 
    "laser" : "1fYLIYfgpsMatdU_0Yx0asM3B81-JFWs2cqIsEzxJ8f0", 
    "poster" : "1g28e9iiXov1PLNtYomn2iKmvVLlHT75G7eV-bFDHG_c"
}

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
  
async function update(body) {
    if (body["Services"] == "3D Print") {
        
    } else if (body["Services"] == "Laser Cut") {

    } else if (body["Services"] == "Poster") {

    } else {
        throw new Error("Unknown service");
    }
}

module.exports = update(body)