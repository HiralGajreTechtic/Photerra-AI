const googlePlaceModel = require("../src/models/googlePlacesModel");
const axios = require("axios");
const fetch = require("node-fetch");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

class GoogleAPIService {
  static async getData(req) {
    try {
      const apiKey = process.env.GOOGLE_API_KEY;
      const query = req.query.query;

      let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?key=${apiKey}&query=${encodeURIComponent(
        query
      )}`;
      if (req.pagetoken) {
        url = url + `&pagetoken=${req.pagetoken}`;
      }
      let response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async insertUpdateData(payload) {
    try {
      //store place name in each object from UI
      let insertionData = [];

      for (let i in payload) {
        let placeExists = await googlePlaceModel.find({
          "geometry.location.lng": payload[i].geometry.location.lng,
          "geometry.location.lat": payload[i].geometry.location.lat,
          name: payload[i].name,
        });
        if (placeExists.length <= 0) {
          insertionData.push(payload[i]);
        } else {
          let place_id = new ObjectId(placeExists[0]._id);
          delete placeExists[0]._id;
          let ans = await googlePlaceModel.updateOne(
            { _id: place_id },
            {
              $set: {
                formatted_address: placeExists[0].formatted_address,
                icon: placeExists[0].icon,
                photos: placeExists[0].photos,
                place_id: placeExists[0].place_id,
                plus_code: placeExists[0].plus_code,
                rating: placeExists[0].rating,
                types: placeExists[0].types,
                user_ratings_total: placeExists[0].user_ratings_total,
                updateAt: new Date(),
              },
            }
          );
        }
      }
      if (insertionData.length > 0) {
        return await googlePlaceModel.insertMany(insertionData);
      } else {
        return true;
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  static async getPlacesBySearch(req) {
    try {
      const search = req.query.search;
      const regexPattern = new RegExp(search.slice(1, -1), "i");
      let placeExists = await googlePlaceModel.find({
        $expr: { $regexMatch: { input: "name", regex: regexPattern } },
      });
      return placeExists;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = GoogleAPIService;
