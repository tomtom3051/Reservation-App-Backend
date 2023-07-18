const multer = require("multer");

/**
 * This function defines where the image is stored and what it is called.
 */
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './pictures');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().getTime() + path.extname(file.originalname));
    }
});

/**
 * This function ensures only jpeg and png images can be uploaded.
 * @param {*} req 
 * @param {*} file 
 * @param {*} cb 
 */
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Unsupported files'), false);
    }
}

/**
 * This function handles the actual upload to the server.
 */
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10
    },
    fileFilter: fileFilter
});

module.exports = {
    upload: upload
}