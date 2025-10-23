const multer = require('multer');
const path = require('path');
const fs = require('fs');

// create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
// Set up storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// check file type
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Error: File upload only supports the following filetypes - ' + allowedTypes);
    }
};

// Initialize upload middleware
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // 5 MB limit
    fileFilter: function (req, file, cb) {
        fileFilter(req, file, cb);
    }
}).single('coverImage'); // Field name in the form-data

module.exports = upload;
