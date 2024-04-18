/**
 * Models/cmspages.js
 *
 * Create mongoDB Schema for the CMS pages.
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const test = new Schema({
  name: {
    type: String,
    required: [true, "test is required"],
  },
});

const TestModel = mongoose.model("tests", test);

module.exports = TestModel;
