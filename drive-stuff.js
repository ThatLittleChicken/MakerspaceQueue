const { google } = require("googleapis");
const { getGapiClient } = require("./gapi-credentials-load");
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');
const { get } = require("http");

let drive;

setInterval(() => { 
    initClient();
}, 1000 * 60 * 30);

async function initClient() {
    return new Promise((resolve, reject) => {
        getGapiClient().then(auth => {
            drive = google.drive({ version: 'v3', auth });
            resolve();
        });
    });
}

async function getFileName(fileId) {
    let res = await drive.files.get({ 
        fileId: fileId
    });
    return res.data.name;
}

async function downloadFile(fileId, fileName, folderId) {
    return new Promise((resolve, reject) => {
        drive.files.get({ 
            fileId: fileId,
            alt: 'media'
        }, { responseType: 'stream' }, (err, res) => {
            if (err) {
                console.error('Error downloading file');
                reject(err);
            }
            const dest = fs.createWriteStream(`./temp-files/${folderId}/${fileName}`);
            res.data
                .on('end', () => {
                    console.log('Done downloading file');
                    resolve();
                })
                .on('error', err => {
                    console.error('Error downloading file');
                    reject(err);
                })
                .pipe(dest);
        });
    })
}

async function deleteFiles(fileIds, filePaths) {
    initClient();
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
    await initClient();
    createFolder("./temp-files/" + tempid);
    for (let i = 0; i < fileIds.length; i++) {
        let fileName = await getFileName(fileIds[i]);
        await downloadFile(fileIds[i], fileName, tempid);
        await filePaths.push(`./temp-files/${tempid}/${fileName}`);
    }
    return filePaths;
}

module.exports = { downloadFiles, deleteFiles }