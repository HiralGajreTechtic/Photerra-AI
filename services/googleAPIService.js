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

      let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?key=${apiKey}`;

      if (query) {
        url = url + `&query=${encodeURIComponent(query)}`;
      }
      if (req.query.pagetoken) {
        url = url + `&pagetoken=${req.query.pagetoken}`;
      }
      console.log("url=", url);
      let response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  static async insertUpdateData(payload) {
    try {
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
          let place_id = placeExists[0]._id;
          await googlePlaceModel.updateOne(
            { _id: place_id },
            {
              $set: {
                formatted_address: payload[i].formatted_address,
                icon: payload[i].icon,
                photos: payload[i].photos,
                place_id: payload[i].place_id,
                plus_code: payload[i].plus_code,
                rating: payload[i].rating,
                types: payload[i].types,
                user_ratings_total: payload[i].user_ratings_total,
                updatedAt: new Date(),
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
      throw new Error(error);
    }
  }
}

module.exports = GoogleAPIService;
