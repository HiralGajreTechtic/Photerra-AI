// index.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors());
app.use(express.json());
app.use(cookieParser());
const maxSizeInBytes = 5 * 1024 * 1024;
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ limit: maxSizeInBytes, extended: true }));
const db = require("./src/config/db"); //to make connection globally accessible

// Add your routes and other middleware here
app.use("/api/googleAPIData", require("./routes/googleAPIRoute"));
app.use("/api/places", require("./routes/searchPlacesRoute"));
app.use("/api/searchTypes", require("./routes/searchTypesRoute"));

const PORT = 3012;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
