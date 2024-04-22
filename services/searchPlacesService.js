const googlePlaceModel = require("../src/models/googlePlacesModel");
const axios = require("axios");
const fetch = require("node-fetch");

class SearchPlacesService {
  static async getPlacesBySearch(req) {
    try {
      const search = req.query.search;
      const regexPattern = new RegExp(search.slice(1, -1), "i");
      let placeExists = await googlePlaceModel.find({
        $expr: { $regexMatch: { input: "name", regex: regexPattern } },
      });
      console.log("placeExists=", placeExists);
      return placeExists;
    } catch (error) {
      console.log("error--", error);
      throw error;
    }
  }
}

module.exports = SearchPlacesService;
