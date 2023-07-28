const multer = require("multer")
const path = require("path");
const fs = require('fs');

let upload = {}

var storageImage = multer.diskStorage({
    destination: function (req, file, cb) {
        const url = (req.body.path) ? `/uploads/${req.body.path}` : "/uploads";
        cb(null, path.join(process.cwd(), url));

    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname))
    }
});
var uploadImage = multer({
    storage: storageImage,
    limits: {
        fileSize: 10048576 // 10 MB
    },
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
            return callback(new Error('Only images are allowed'));
        }
        callback(null, true);
    },
});

upload.uploadImage = uploadImage

module.exports.upload = upload