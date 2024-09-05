const { google } = require("googleapis");
const { getGapiClient } = require("./gapi-credentials-load");
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');
const { get } = require("http");

let drive;
getGapiClient().then(auth => {
    drive = google.drive({ version: 'v3', auth });
});

setInterval(() => { 
    getGapiClient().then(auth => {
        drive = google.drive({ version: 'v3', auth });
    });
}, 1000 * 60 * 30);

async function getFileName(fileId) {
    let res = await drive.files.get({ 
        fileId: fileId
    });
    return res.data.name;
}

async function downloadFile(fileId, fileName, folderId) {
    let dest = fs.createWriteStream(`./temp-files/${folderId}/${fileName}`);
    let res = await drive.files.get({ 
        fileId: fileId,
        alt: 'media'
    }, { responseType: 'stream' });

    res.data
        .on('end', () => {
            console.log('Done downloading file');
        })
        .on('error', err => {
            console.error('Error downloading file');
        })
        .pipe(dest);
}

async function deleteFiles(fileIds, filePaths) {
    for (let i = 0; i < fileIds.length; i++) {
        await drive.files.delete({ 
            fileId: fileIds[i]
        });
    }
    for (let i = 0; i < filePaths.length; i++) {
        await fs.unlinkSync(filePaths[i]);
    }
    fs.rmSync(filePaths[0].substring(0, filePaths[0].lastIndexOf("/")), { recursive: true });
}

function createFolder(name) {
    fs.mkdirSync(name, { recursive: true });
}

async function downloadFiles(fileIds) {
    let filePaths = [];
    let tempid = uuidv4();
    createFolder("./temp-files/" + tempid);
    for (let i = 0; i < fileIds.length; i++) {
        let fileName = await getFileName(fileIds[i]);
        await downloadFile(fileIds[i], fileName, tempid);
        await filePaths.push(`./temp-files/${tempid}/${fileName}`);
    }
    return filePaths;
}

module.exports = { downloadFiles, deleteFiles }