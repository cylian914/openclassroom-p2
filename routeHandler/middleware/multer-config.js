const multer = require('multer');
const SharpMulter = require("sharp-multer");


const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};


const storage = SharpMulter({
    destination: (req, file, callback) => {
        callback(null, 'runtime/images');
    },
    filename: (file, option) => {
        const name = file.split(".").slice(0, -1).join(".").replaceAll(' ', '_');
        return name + "_" + Date.now() + '.' + option.fileFormat;
    },

    //SharpMutler
    imageOptions: {
        fileFormat: "webp",
        quality: 80,
        resize: {width: 404, height: 568}
    }
});

module.exports = multer({ storage: storage }).single('image');
