const multer = require('multer');
const path = require('path');
const fs = require('fs');

const getDestination = (fieldname) => {
  const baseDir = path.join(__dirname, 'uploads');

  const folderMap = {
    profile: 'profile',
    gallery: 'gallery',
    documents: 'documents',
  };

  const folderName = folderMap[fieldname] || 'others';
  const fullPath = path.join(baseDir, folderName);

  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }

  return fullPath;
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dest = getDestination(file.fieldname);
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const filename = file.fieldname + '-' + uniqueSuffix + ext;
    cb(null, filename);
  }
});

const upload = multer({ storage });

module.exports = upload;
