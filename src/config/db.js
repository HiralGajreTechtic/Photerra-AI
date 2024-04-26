const mongoose = require("mongoose");
const SearchTypesModel = require("../models/searchTypesModel");
const GooglePlacesModel = require("../models/googlePlacesModel");
require("dotenv").config();

mongoose.Promise = global.Promise;
const db = {};
db.mongoose = mongoose;
db.url = process.env.DB_URL;
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("Connected to the database!");
    try {
      await SearchTypesModel.ensureIndexes();
      await GooglePlacesModel.ensureIndexes();
      console.log("Collection created if it did not exist");
    } catch (error) {
      console.error("Error creating collection:", error);
    }
  })
  .catch((err) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

module.exports = db;
