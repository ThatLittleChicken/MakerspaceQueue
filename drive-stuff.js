const { google } = require("googleapis");
const auth = require("./gapi-credentials-load");
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');

const drive = google.drive({ version: 'v3', auth });

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

async function deleteFile(fileId) {
    await drive.files.delete({ 
        fileId: fileId
    });
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
        //await deleteFile(fileIds[i]);
        await filePaths.push(`./temp-files/${tempid}/${fileName}`);
    }
    return filePaths;
}


downloadFiles(["1x3dBFvY0DN73oWWOjopzR0PKxx2DAQkp"]).then(fp => console.log(fp));
//module.exports = { downloadFiles }