const multer = require("multer");
const path = require("path");

const { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } = require("../config");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const extname = path.extname(file.originalname);
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Eroor("Only image files are allowd"), false);
  }
  if (!file.size > MAX_FILE_SIZE) {
    return cb(new Eroor("File size exceeds the maxium limit"), false);
  }
  if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
    return cb(new Eroor("File type id not allowwd"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

module.exports = upload;
