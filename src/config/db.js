const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const db = {};
db.mongoose = mongoose;
db.url = "mongodb://localhost:27017/photerra_ai";
// db.userModel = require("./UserModel")(mongoose);
module.exports = db;
