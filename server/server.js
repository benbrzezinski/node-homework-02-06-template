import mongoose from "mongoose";
import app from "./app.js";
import {
  uploadDir,
  storeAvatars,
  createFolderIfNotExists,
} from "./utils/manageUploadFolders.js";

const PORT = 3000;
const SRV_DB = process.env.DB_HOST;

const connection = mongoose.connect(SRV_DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

connection
  .then(() => {
    app.listen(PORT, () => {
      createFolderIfNotExists(uploadDir);
      createFolderIfNotExists(storeAvatars);
      console.log(`Database connection successful on port ${PORT}`);
    });
  })
  .catch(err => {
    console.log(`Server not running. Error message: ${err.message}`);
    process.exit(1);
  });
