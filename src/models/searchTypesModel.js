const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const searchTypes = new Schema({
  name: {
    type: String,
    required: [true, "name is required"],
  },
  type: {
    type: String,
    required: [true, "type is required"],
  },
  insertedAt: {
    type: Date,
    default: Date.now, // Set the default value to the current date and time
  },
});

const SearchTypesModel = mongoose.model("search_types", searchTypes);

module.exports = SearchTypesModel;
