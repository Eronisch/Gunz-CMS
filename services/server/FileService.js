exports.getExtension = getExtension;
exports.isImage = isImage;

function getExtension(filename) {
    if (!filename) {
        return null;
    }

    return filename.split('.').pop();
}

function isImage(filename) {

    var extension = getExtension(filename);

    return extension == "png" || extension == "gif" || extension == "jpg" || extension == "jpeg";
}