const path = require('path');
const fs = require('fs');
const multer = require('multer');

const uploadDir = path.join(__dirname, '../public/image');

if (!fs.existsSync(uploadDir)) {
  console.log(`Directory ${uploadDir} does not exist. Creating...`);
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`Directory ${uploadDir} created successfully.`);
} else {
  console.log(`Directory ${uploadDir} already exists.`);
}

// Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(`Saving file to ${uploadDir}`);
    cb(null, uploadDir); // Save files to the 'public/image' folder
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + path.extname(file.originalname);
    console.log(`Saving file as ${uniqueName}`);
    cb(null, uniqueName); // Save files with unique names
  }
});


  const upload = multer({ 
    storage: storage,
  });

module.exports = upload;
 

 