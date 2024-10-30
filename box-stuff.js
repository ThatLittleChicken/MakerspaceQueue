var BoxSDK = require('box-node-sdk');
const fs = require("fs");
const { getBoxClient } = require("./box-credentials-load");

// let date = new Date();
// let dd = String(date.getDate());
// let mm = String(date.getMonth() + 1); 
// let yy = date.getFullYear() - 2000;
// let today = mm + '.' + dd + '.' + yy;

let today = getToday();

function getToday() {
    let date = new Date();
    let dd = String(date.getDate());
    let mm = String(date.getMonth() + 1);
    let yy = date.getFullYear() - 2000;
    return mm + '.' + dd + '.' + yy;
}

const parentFolderId = { 
    "3D Print" : "138623403868", 
    "Laser Cut" : "54496771414", 
    "Poster" : "137998902121"
}

let client;

setInterval(() => { 
    getBoxClient().then(c => { client = c; });
}, 1000 * 60 * 30);


async function getFolder(name, type) {
    let firstletterfolder = await client.search.query(`"${name.substring(0, 1)}"`, {
        type: 'folder',
        limit: 1,
        fields: 'name',
        ancestor_folder_ids: parentFolderId[type]
    });

    let folder = await client.search.query(`"${name}"`, {
        type: 'folder',
        limit: 1,
        fields: 'name',
        ancestor_folder_ids: firstletterfolder.entries[0].id
    })

    let myFolderId;
    if (folder.total_count == 0) {
        folder = await client.folders.create(firstletterfolder.entries[0].id, `${name}`);
        myFolderId = await folder.id;
    } else {
        myFolderId = folder.entries[0].id;
    }

    let todayFolder = await client.search.query(`"${today}"`, {
        type: 'folder',
        limit: 1,
        fields: 'name',
        ancestor_folder_ids: myFolderId
    })

    let myTodayFolderId;

    if (todayFolder.total_count == 0) {
        let i = 1;
        while (true) {
            try {
                if (i == 1) {
                    todayFolder = await client.folders.create(myFolderId, today);
                    myTodayFolderId = await todayFolder.id;
                } else {
                    console.log("trying " + i);
                    todayFolder = await client.folders.create(myFolderId, today +" #" + i);
                    myTodayFolderId = await todayFolder.id;
                }
            } catch (err) {
                i++;
                continue;
            }
            break;
        }
    } else {
        myTodayFolderId = todayFolder.entries[0].id;
    }

    return myTodayFolderId;
}

async function uploadFile(folderId, filePaths) {
    for (let i = 0; i < filePaths.length; i++) {
        let stream = fs.createReadStream(filePaths[i]);
        let fileSize = fs.statSync(filePaths[i]).size;
        if (fileSize > 100000000) {
            let file = await client.files.getChunkedUploader(folderId, fileSize, filePaths[i].substring(filePaths[i].lastIndexOf("/") + 1), stream);
            file.start();
        } else {
            let file = await client.files.uploadFile(folderId, filePaths[i].substring(filePaths[i].lastIndexOf("/") + 1), stream);
        }
    }
}

async function getFolderLink(folderId) {
    let url;
    await client.folders.update(folderId, { shared_link: { access: "open" } }).then(folder => {
        url = folder.shared_link.url;
    });
    return await url;
}

async function boxUpload(name, type, filePaths) {
    today = getToday();
    client = await getBoxClient();
    let folderId = await getFolder(name, type);
    let link = await getFolderLink(folderId);
    await uploadFile(folderId, filePaths);
    return link;
}

module.exports = { boxUpload }
