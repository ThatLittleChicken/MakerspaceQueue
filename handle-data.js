const { downloadFiles, deleteFiles } = require("./drive-stuff");
const { updateSheets } = require("./sheets-stuff");
const { boxUpload } = require("./box-stuff");

async function handleData(data) {
    try {
        let filePaths = await downloadFiles(data["Files"]);
        let boxLink = await boxUpload(`${data["First Name"]} ${data["Last Name"]}`, data["Service"], filePaths);
        await updateSheets(data, boxLink);
        await deleteFiles(data["Files"], filePaths);
    } catch (err) {
        console.error(err);
    }
}

module.exports = { handleData }