import "dotenv/config";
import mongoose from "mongoose";
import app from "./app.js";

const SRV_DB = process.env.DB_HOST;

const connection = mongoose.connect(SRV_DB, {
  useUnifiedTopology: true,
});

connection
  .then(() => {
    app.listen(3000, () => console.log("Database connection successful"));
  })
  .catch(err => {
    console.log(`Server not running. Error message: ${err.message}`);
    process.exit(1);
  });
