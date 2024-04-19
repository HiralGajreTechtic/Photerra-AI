const database = require("../src/config/db");
const googlePlaceModel = require("../src/models/googlePlacesModel");
const axios = require("axios");
const fetch = require("node-fetch");
class GoogleAPIService {
  static async getData(place) {
    try {
      const apiKey = process.env.GOOGLE_API_KEY;
      const location = place;
      const query = "tourist attractions in " + location;

      const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?key=${apiKey}&query=${encodeURIComponent(
        query
      )}`;

      axios
        .get(url)
        .then(async (response) => {
          if (response?.data?.results?.length > 0) {
            // const data = await googlePlaceModel.find();
            return response.data.results;
          } else {
            return response;
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } catch (error) {
      console.log("error--", error);
      throw error;
    }
  }
}

module.exports = GoogleAPIService;
