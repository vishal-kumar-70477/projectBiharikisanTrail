const config = require("../config/config")
const { ImageKit } = require("@imagekit/nodejs");
 
const imgkit = new ImageKit({
    privateKey:config.IMAGEKIT_PRIVATE_KEY
});
 
async function uploadFile(file){
    const result = await imgkit.files.upload({
        file:file.buffer.toString("base64"),
        fileName:"image.jpg"
    });
    return result;
}
 
async function deleteFile(fileId){
    await imgkit.files.delete(fileId)
}
 
module.exports = { uploadFile, deleteFile };