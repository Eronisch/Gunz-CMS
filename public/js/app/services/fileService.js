angular.module("revolutionApp").factory("fileService", [function () {
        
        var imageStatus = {
            NoImage : 0,
            TooLarge : 1,
            Error : 2,
            InvalidImage : 3,
            Success : 4
        }
        
        function getExtension(filename) {
            if (!filename) { return null; }
            return filename.split('.').pop().toLowerCase();
        }
        
        function isImage(filename) {
            var extension = getExtension(filename);
            return extension === "png" || extension === "gif" || extension === "jpg" || extension === "jpeg";
        }
        
        function isValidSize(maxSizeMb, file) {
            return (maxSizeMb * 1024 * 1024) >= file.size;
        }
        
        return {
            imageStatus : imageStatus,
            isImage  : isImage,
            isValidSize : isValidSize
        }
       
    }]);