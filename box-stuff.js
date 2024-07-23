var BoxSDK = require('box-node-sdk');
const fs = require("fs");
const client = require("./box-credentials-load");

const date = new Date();
const dd = String(date.getDate());
const mm = String(date.getMonth() + 1); 
const yy = date.getFullYear() - 2000;
const today = mm + '.' + dd + '.' + yy;

const parentFolderId = { 
    "3D Print" : "138623403868", 
    "Laser Cut" : "54496771414", 
    "Poster" : "137998902121"
}

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
    try {
        todayFolder = await client.folders.create(myFolderId, today);
        myTodayFolderId = await todayFolder.id;
    } catch (err) {
        myTodayFolderId = todayFolder.entries[0].id;
    }

    return myTodayFolderId;
}

async function uploadFile(folderId, filePaths) {
    for (let i = 0; i < filePaths.length; i++) {
        let stream = fs.createReadStream(filePaths[i]);
        let file = await client.files.uploadFile(folderId, filePaths[0].substring(filePaths[0].lastIndexOf("/") + 1), stream);
    }
}

async function getFolderLink(folderId) {
    let url;
    await client.folders.update(folderId, { shared_link: { access: "open" } }).then(folder => {
        url = folder.shared_link.url;
    });
    return await url;
}

async function boxStuff(name, type, filePaths) {
    let folderId = await getFolder(name, type);
    let link = await getFolderLink(folderId);
    await uploadFile(folderId, filePaths);
    return link;
}

module.exports = { boxStuff }
