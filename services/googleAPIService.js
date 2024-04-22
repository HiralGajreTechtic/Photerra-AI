const database = require("../src/config/db");
const googlePlaceModel = require("../src/models/googlePlacesModel");
const axios = require("axios");
const fetch = require("node-fetch");
class GoogleAPIService {
  static async getData(req) {
    try {
      const apiKey = process.env.GOOGLE_API_KEY;
      const query = req.query;

      let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?key=${apiKey}&query=${encodeURIComponent(
        query
      )}`;
      if (req.pagetoken) {
        url = url + `&pagetoken=${req.pagetoken}`;
      }
      let response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.log("error--", error);
      throw error;
    }
  }
  static async insertData(place) {
    try {
    } catch (error) {
      console.log("error--", error);
      throw error;
    }
  }
}

module.exports = GoogleAPIService;
