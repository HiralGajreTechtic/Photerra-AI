const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const googlePlaces = new Schema({
  name: {
    type: String,
    required: [true, "name is required"],
  },
  formatted_address: {
    type: Object,
    required: [true, "address is required"],
  },
  icon: {
    type: String,
  },
  photos: {
    type: Array,
  },
  place_id: {
    type: String,
  },
  plus_code: {
    type: Object,
  },
  geometry: {
    type: Object,
  },
  rating: {
    type: Number,
  },
  types: {
    type: Array,
  },
  user_ratings_total: {
    type: Number,
  },
  insertedAt: {
    type: Date,
    default: Date.now, // Set the default value to the current date and time
  },
  updatedAt: {
    type: Date,
    default: null,
  },
});

const GooglePlacesModel = mongoose.model("google_places", googlePlaces);

module.exports = GooglePlacesModel;
